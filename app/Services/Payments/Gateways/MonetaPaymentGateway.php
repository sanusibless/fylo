<?php

namespace App\Services\Payments\Gateways;

use App\Models\Payment;
use App\Services\Payments\Contracts\PaymentGatewayInterface;
use Illuminate\Http\Request;

class MonetaPaymentGateway implements PaymentGatewayInterface
{
    public function getIdentifier(): string
    {
        return 'moneta';
    }

    public function getDisplayName(): string
    {
        return 'Moneta';
    }

    public function isAvailable(): bool
    {
        $secretKey = config('services.moneta.secret_key') ?: config('fylo.payments.moneta.secret_key');
        $baseUrl = config('services.moneta.base_url') ?: config('fylo.payments.moneta.base_url');

        return ! empty($secretKey) && ! empty($baseUrl);
    }

    public function initializePayment(Payment $payment, array $options = []): array
    {
        return [
            'status' => false,
            'message' => 'Moneta payment collections are currently not configured. Please select Paystack to complete your subscription.',
            'authorization_url' => null,
            'access_code' => null,
            'reference' => $payment->reference,
            'raw' => [],
        ];
    }

    public function verifyPayment(string $reference): array
    {
        return [
            'status' => false,
            'payment_status' => 'unavailable',
            'message' => 'Moneta payment gateway verification is not yet configured.',
            'reference' => $reference,
            'amount' => 0.0,
            'currency' => 'NGN',
            'gateway_reference' => null,
            'paid_at' => null,
            'metadata' => [],
            'raw' => [],
        ];
    }

    public function parseAndValidateWebhook(Request $request): array
    {
        return [
            'valid' => false,
            'event' => null,
            'reference' => null,
            'payload' => [],
        ];
    }
}
