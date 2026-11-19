<?php

namespace App\Services\Payments\Gateways;

use App\Models\Payment;
use App\Services\Payments\Contracts\PaymentGatewayInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class PaystackPaymentGateway implements PaymentGatewayInterface
{
    public function getIdentifier(): string
    {
        return 'paystack';
    }

    public function getDisplayName(): string
    {
        return 'Paystack';
    }

    public function getEnvironment(): string
    {
        $env = strtolower((string) config('services.paystack.environment', config('fylo.payments.paystack.environment', 'test')));

        return in_array($env, ['live', 'production'], true) ? 'live' : 'test';
    }

    public function getSecretKey(): ?string
    {
        $env = $this->getEnvironment();

        if ($env === 'live') {
            return config('services.paystack.live_secret_key') ?: config('fylo.payments.paystack.live_secret_key');
        }

        return config('services.paystack.test_secret_key') ?: config('fylo.payments.paystack.test_secret_key');
    }

    public function getPublicKey(): ?string
    {
        $env = $this->getEnvironment();

        if ($env === 'live') {
            return config('services.paystack.live_public_key') ?: config('fylo.payments.paystack.live_public_key');
        }

        return config('services.paystack.test_public_key') ?: config('fylo.payments.paystack.test_public_key');
    }

    public function getWebhookSecret(): ?string
    {
        $explicitWebhookSecret = config('services.paystack.webhook_secret') ?: config('fylo.payments.paystack.webhook_secret');

        return ! empty($explicitWebhookSecret) ? $explicitWebhookSecret : $this->getSecretKey();
    }

    public function getBaseUrl(): string
    {
        return rtrim((string) (config('services.paystack.base_url') ?: config('fylo.payments.paystack.base_url', 'https://api.paystack.co')), '/');
    }

    public function getCallbackUrl(): string
    {
        $configured = config('services.paystack.callback_url') ?: config('fylo.payments.paystack.callback_url');
        if (! empty($configured)) {
            return (string) $configured;
        }

        return route('subscription.callback', ['gateway' => 'paystack']);
    }

    public function isAvailable(): bool
    {
        return ! empty($this->getSecretKey());
    }

    public function initializePayment(Payment $payment, array $options = []): array
    {
        $secretKey = $this->getSecretKey();
        if (empty($secretKey)) {
            return [
                'status' => false,
                'message' => 'Paystack payment gateway is not configured. Please provide the Paystack API credentials.',
                'authorization_url' => null,
                'access_code' => null,
                'reference' => $payment->reference,
                'raw' => [],
            ];
        }

        // Convert Naira amount to smallest currency unit (kobo)
        $amountInKobo = (int) round(((float) $payment->amount) * 100);
        $callbackUrl = $options['callback_url'] ?? $this->getCallbackUrl();

        $metadata = array_merge($payment->metadata ?? [], [
            'payment_id' => $payment->id,
            'reference' => $payment->reference,
            'merchant_id' => $payment->user_id,
            'storage_plan_id' => $payment->storage_plan_id,
            'billing_cycle' => $payment->billing_cycle,
            'environment' => $this->getEnvironment(),
        ]);

        try {
            $response = Http::withToken($secretKey)
                ->acceptJson()
                ->timeout(30)
                ->post($this->getBaseUrl().'/transaction/initialize', [
                    'email' => $payment->user?->email ?? ($metadata['user_email'] ?? ''),
                    'amount' => $amountInKobo,
                    'currency' => strtoupper($payment->currency ?: 'NGN'),
                    'reference' => $payment->reference,
                    'callback_url' => $callbackUrl,
                    'metadata' => $metadata,
                ]);

            $body = $response->json() ?? [];

            if ($response->successful() && ! empty($body['status']) && ! empty($body['data']['authorization_url'])) {
                return [
                    'status' => true,
                    'message' => $body['message'] ?? 'Authorization URL created',
                    'authorization_url' => (string) $body['data']['authorization_url'],
                    'access_code' => $body['data']['access_code'] ?? null,
                    'reference' => (string) ($body['data']['reference'] ?? $payment->reference),
                    'raw' => $body,
                ];
            }

            Log::warning('Paystack transaction initialization failed', [
                'reference' => $payment->reference,
                'status_code' => $response->status(),
                'message' => $body['message'] ?? 'Unknown error',
            ]);

            return [
                'status' => false,
                'message' => $body['message'] ?? 'Unable to initialize payment with Paystack.',
                'authorization_url' => null,
                'access_code' => null,
                'reference' => $payment->reference,
                'raw' => $body,
            ];
        } catch (\Throwable $e) {
            Log::error('Paystack initialization exception', [
                'reference' => $payment->reference,
                'error' => $e->getMessage(),
            ]);

            return [
                'status' => false,
                'message' => 'Could not connect to Paystack payment gateway. Please try again.',
                'authorization_url' => null,
                'access_code' => null,
                'reference' => $payment->reference,
                'raw' => [],
            ];
        }
    }

    public function verifyPayment(string $reference): array
    {
        $secretKey = $this->getSecretKey();
        if (empty($secretKey)) {
            throw new RuntimeException('Paystack secret key is not configured.');
        }

        try {
            $response = Http::withToken($secretKey)
                ->acceptJson()
                ->timeout(30)
                ->get($this->getBaseUrl().'/transaction/verify/'.rawurlencode($reference));

            $body = $response->json() ?? [];

            if (! $response->successful() || empty($body['status']) || empty($body['data'])) {
                return [
                    'status' => false,
                    'payment_status' => 'failed',
                    'message' => $body['message'] ?? 'Unable to verify transaction with Paystack.',
                    'reference' => $reference,
                    'amount' => 0.0,
                    'currency' => '',
                    'gateway_reference' => null,
                    'paid_at' => null,
                    'metadata' => [],
                    'raw' => $body,
                ];
            }

            $data = $body['data'];
            $gatewayStatus = strtolower((string) ($data['status'] ?? 'failed'));
            $amountInNaira = isset($data['amount']) ? round(((float) $data['amount']) / 100, 2) : 0.0;
            $currency = strtoupper((string) ($data['currency'] ?? ''));

            return [
                'status' => $gatewayStatus === 'success',
                'payment_status' => $gatewayStatus,
                'message' => $data['gateway_response'] ?? ($body['message'] ?? 'Verification completed'),
                'reference' => (string) ($data['reference'] ?? $reference),
                'amount' => $amountInNaira,
                'currency' => $currency,
                'gateway_reference' => isset($data['id']) ? (string) $data['id'] : null,
                'paid_at' => $data['paid_at'] ?? null,
                'metadata' => is_array($data['metadata'] ?? null) ? $data['metadata'] : [],
                'raw' => $body,
            ];
        } catch (\Throwable $e) {
            Log::error('Paystack verification exception', [
                'reference' => $reference,
                'error' => $e->getMessage(),
            ]);

            return [
                'status' => false,
                'payment_status' => 'error',
                'message' => 'Could not verify transaction with Paystack.',
                'reference' => $reference,
                'amount' => 0.0,
                'currency' => '',
                'gateway_reference' => null,
                'paid_at' => null,
                'metadata' => [],
                'raw' => [],
            ];
        }
    }

    public function parseAndValidateWebhook(Request $request): array
    {
        $signature = (string) $request->header('x-paystack-signature', '');
        $secret = $this->getWebhookSecret();
        $rawContent = $request->getContent();

        if (empty($signature) || empty($secret) || empty($rawContent)) {
            return [
                'valid' => false,
                'event' => null,
                'reference' => null,
                'payload' => [],
            ];
        }

        $computedSignature = hash_hmac('sha512', $rawContent, $secret);

        if (! hash_equals($computedSignature, $signature)) {
            return [
                'valid' => false,
                'event' => null,
                'reference' => null,
                'payload' => [],
            ];
        }

        $payload = json_decode($rawContent, true);
        if (! is_array($payload)) {
            return [
                'valid' => false,
                'event' => null,
                'reference' => null,
                'payload' => [],
            ];
        }

        $event = isset($payload['event']) ? (string) $payload['event'] : null;
        $reference = isset($payload['data']['reference']) ? (string) $payload['data']['reference'] : null;

        return [
            'valid' => true,
            'event' => $event,
            'reference' => $reference,
            'payload' => $payload,
        ];
    }
}
