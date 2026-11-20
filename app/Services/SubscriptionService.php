<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\StoragePlan;
use App\Models\User;
use App\Models\UserStoragePlan;
use App\Services\Payments\PaymentGatewayManager;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SubscriptionService extends GeneralService
{
    protected $name = 'SubscriptionService';

    public function __construct(protected PaymentGatewayManager $gatewayManager) {}

    public function ensurePlansSeeded(): void
    {
        $configuredPlans = config('fylo.plans', []);
        if (empty($configuredPlans)) {
            return;
        }

        // Check if our 4 canonical plans exist; if not, seed/sync them
        $existingSlugs = StoragePlan::pluck('slug')->toArray();
        $requiredSlugs = array_column($configuredPlans, 'slug');

        if (count(array_intersect($requiredSlugs, $existingSlugs)) < count($requiredSlugs)) {
            foreach ($configuredPlans as $plan) {
                StoragePlan::updateOrCreate(['slug' => $plan['slug']], $plan);
            }
        }
    }

    /**
     * Compute authoritative pricing breakdown on the backend.
     *
     * @return array{
     *     monthly_price: float,
     *     yearly_price: float,
     *     billing_cycle: string,
     *     subtotal: float,
     *     discount_percentage: int,
     *     discount_amount: float,
     *     total_payable: float,
     *     currency: string
     * }
     */
    public function calculatePricingBreakdown(StoragePlan $plan, string $billingCycle): array
    {
        $cycle = $billingCycle === 'yearly' ? 'yearly' : 'monthly';
        $monthlyPrice = round((float) $plan->price_monthly, 2);
        $yearlyPrice = StoragePlan::calculateYearlyPrice($monthlyPrice);
        $subtotal = $plan->getSubtotalForCycle($cycle);
        $discountAmount = $plan->getDiscountForCycle($cycle);
        $totalPayable = $plan->getAmountForCycle($cycle);

        return [
            'monthly_price' => $monthlyPrice,
            'yearly_price' => $yearlyPrice,
            'billing_cycle' => $cycle,
            'subtotal' => $subtotal,
            'discount_percentage' => $cycle === 'yearly' && $monthlyPrice > 0 ? 20 : 0,
            'discount_amount' => $discountAmount,
            'total_payable' => $totalPayable,
            'currency' => config('fylo.currency.code', 'NGN'),
        ];
    }

    /**
     * Generate a cryptographically unique payment reference.
     */
    public function generateUniqueReference(): string
    {
        do {
            $reference = 'FYLO_'.strtoupper(Str::random(16));
        } while (Payment::where('reference', $reference)->exists());

        return $reference;
    }

    /**
     * Initiate a subscription checkout for a merchant.
     *
     * @return array{
     *     status: bool,
     *     is_free: bool,
     *     message: string,
     *     authorization_url: string|null,
     *     reference: string|null,
     *     payment: Payment|null
     * }
     */
    public function initiateSubscriptionCheckout(
        User $user,
        StoragePlan $plan,
        string $billingCycle,
        string $provider
    ): array {
        $cycle = $billingCycle === 'yearly' ? 'yearly' : 'monthly';
        $pricing = $this->calculatePricingBreakdown($plan, $cycle);
        $amount = $pricing['total_payable'];
        $currency = $pricing['currency'];
        $providerKey = strtolower($provider);

        // If switching to the Free plan (amount == 0), activate directly without external gateway
        if ($amount <= 0) {
            $payment = DB::transaction(function () use ($user, $plan, $cycle, $currency) {
                // Supersede any existing pending payments for this user
                Payment::where('user_id', $user->id)
                    ->where('status', 'pending')
                    ->update(['status' => 'abandoned']);

                $payment = Payment::create([
                    'user_id' => $user->id,
                    'storage_plan_id' => $plan->id,
                    'reference' => $this->generateUniqueReference(),
                    'amount' => 0.00,
                    'currency' => $currency,
                    'billing_cycle' => $cycle,
                    'provider' => 'free',
                    'status' => 'successful',
                    'paid_at' => now(),
                    'metadata' => [
                        'plan_name' => $plan->name,
                        'plan_slug' => $plan->slug,
                        'user_email' => $user->email,
                        'billing_cycle' => $cycle,
                    ],
                ]);

                $this->activateSubscriptionForUser($user, $plan, $cycle);

                return $payment;
            });

            return [
                'status' => true,
                'is_free' => true,
                'message' => "Your subscription has been switched to the {$plan->name} plan.",
                'authorization_url' => null,
                'reference' => $payment->reference,
                'payment' => $payment,
            ];
        }

        // Resolve the requested payment gateway
        try {
            $gateway = $this->gatewayManager->resolve($providerKey);
        } catch (\Throwable $e) {
            return [
                'status' => false,
                'is_free' => false,
                'message' => 'The selected payment gateway is not supported.',
                'authorization_url' => null,
                'reference' => null,
                'payment' => null,
            ];
        }

        // Check if gateway is available/configured before creating pending transaction for unconfigured Moneta
        if (! $gateway->isAvailable()) {
            $gatewayName = $gateway->getDisplayName();
            $fallbackNote = $providerKey === 'moneta'
                ? 'Moneta payment collections are being finalized. Please select Paystack to complete your subscription payment.'
                : "{$gatewayName} payment gateway is not currently configured. Please check your payment gateway settings.";

            return [
                'status' => false,
                'is_free' => false,
                'message' => $fallbackNote,
                'authorization_url' => null,
                'reference' => null,
                'payment' => null,
            ];
        }

        // Mark any previous pending payments for this user as abandoned to avoid stale pending records
        Payment::where('user_id', $user->id)
            ->where('status', 'pending')
            ->update(['status' => 'abandoned']);

        $reference = $this->generateUniqueReference();

        $payment = Payment::create([
            'user_id' => $user->id,
            'storage_plan_id' => $plan->id,
            'reference' => $reference,
            'amount' => $amount,
            'currency' => $currency,
            'billing_cycle' => $cycle,
            'provider' => $gateway->getIdentifier(),
            'status' => 'pending',
            'metadata' => [
                'plan_id' => $plan->id,
                'plan_name' => $plan->name,
                'plan_slug' => $plan->slug,
                'capacity_gb' => $plan->capacity,
                'billing_cycle' => $cycle,
                'subtotal' => $pricing['subtotal'],
                'discount_amount' => $pricing['discount_amount'],
                'total_payable' => $amount,
                'user_id' => $user->id,
                'user_email' => $user->email,
            ],
        ]);

        $payment->setRelation('user', $user);
        $payment->setRelation('plan', $plan);

        $initResult = $gateway->initializePayment($payment);

        if (! $initResult['status'] || empty($initResult['authorization_url'])) {
            $payment->update([
                'status' => 'failed',
                'metadata' => array_merge($payment->metadata ?? [], [
                    'failure_reason' => $initResult['message'] ?? 'Gateway initialization failed',
                ]),
            ]);

            return [
                'status' => false,
                'is_free' => false,
                'message' => $initResult['message'] ?? 'Unable to initialize payment with the selected gateway.',
                'authorization_url' => null,
                'reference' => $reference,
                'payment' => $payment,
            ];
        }

        $payment->update([
            'metadata' => array_merge($payment->metadata ?? [], [
                'authorization_url' => $initResult['authorization_url'],
                'access_code' => $initResult['access_code'] ?? null,
            ]),
        ]);

        return [
            'status' => true,
            'is_free' => false,
            'message' => 'Payment initialized successfully.',
            'authorization_url' => $initResult['authorization_url'],
            'reference' => $reference,
            'payment' => $payment,
        ];
    }

    /**
     * Verify a transaction reference against its gateway and idempotently activate the subscription.
     *
     * @return array{
     *     status: bool,
     *     already_processed: bool,
     *     message: string,
     *     payment: Payment|null
     * }
     */
    public function verifyAndCompletePayment(string $reference, ?int $expectedUserId = null): array
    {
        $payment = Payment::with(['user', 'plan'])->where('reference', $reference)->first();

        if (! $payment) {
            return [
                'status' => false,
                'already_processed' => false,
                'message' => 'Invalid payment reference. Transaction record not found.',
                'payment' => null,
            ];
        }

        if ($expectedUserId !== null && (int) $payment->user_id !== $expectedUserId) {
            return [
                'status' => false,
                'already_processed' => false,
                'message' => 'You do not have permission to verify this payment transaction.',
                'payment' => null,
            ];
        }

        // Fast idempotency check before calling external API if already processed
        if ($payment->status === 'successful') {
            return [
                'status' => true,
                'already_processed' => true,
                'message' => "Your {$payment->plan?->name} subscription is active.",
                'payment' => $payment,
            ];
        }

        try {
            $gateway = $this->gatewayManager->resolve($payment->provider);
            $verification = $gateway->verifyPayment($reference);
        } catch (\Throwable $e) {
            Log::error('Payment verification error', [
                'reference' => $reference,
                'error' => $e->getMessage(),
            ]);

            return [
                'status' => false,
                'already_processed' => false,
                'message' => 'Unable to verify payment status with the payment gateway.',
                'payment' => $payment,
            ];
        }

        // Perform atomic database lock & validation
        return DB::transaction(function () use ($payment, $verification) {
            $lockedPayment = Payment::with(['user', 'plan'])
                ->lockForUpdate()
                ->find($payment->id);

            if (! $lockedPayment) {
                return [
                    'status' => false,
                    'already_processed' => false,
                    'message' => 'Payment record not found.',
                    'payment' => null,
                ];
            }

            // Second idempotency check inside row lock
            if ($lockedPayment->status === 'successful') {
                return [
                    'status' => true,
                    'already_processed' => true,
                    'message' => "Your {$lockedPayment->plan?->name} subscription is active.",
                    'payment' => $lockedPayment,
                ];
            }

            if (! $verification['status'] || $verification['payment_status'] !== 'success') {
                $newStatus = in_array($verification['payment_status'], ['abandoned', 'pending', 'ongoing'], true)
                    ? $verification['payment_status']
                    : 'failed';

                $lockedPayment->update([
                    'status' => $newStatus === 'ongoing' ? 'pending' : $newStatus,
                    'metadata' => array_merge($lockedPayment->metadata ?? [], [
                        'gateway_status' => $verification['payment_status'],
                        'gateway_message' => $verification['message'],
                        'verified_at' => now()->toIso8601String(),
                    ]),
                ]);

                return [
                    'status' => false,
                    'already_processed' => false,
                    'message' => 'Payment was not successful: '.($verification['message'] ?: 'Transaction failed or was cancelled.'),
                    'payment' => $lockedPayment,
                ];
            }

            // Validate reference matches
            if ($verification['reference'] !== $lockedPayment->reference) {
                $lockedPayment->update([
                    'status' => 'failed',
                    'metadata' => array_merge($lockedPayment->metadata ?? [], [
                        'failure_reason' => 'Reference mismatch during verification',
                    ]),
                ]);

                return [
                    'status' => false,
                    'already_processed' => false,
                    'message' => 'Payment verification failed due to a reference mismatch.',
                    'payment' => $lockedPayment,
                ];
            }

            // Validate currency
            $expectedCurrency = strtoupper($lockedPayment->currency ?: 'NGN');
            if (strtoupper($verification['currency']) !== $expectedCurrency) {
                $lockedPayment->update([
                    'status' => 'failed',
                    'metadata' => array_merge($lockedPayment->metadata ?? [], [
                        'failure_reason' => "Currency mismatch: expected {$expectedCurrency}, got {$verification['currency']}",
                    ]),
                ]);

                return [
                    'status' => false,
                    'already_processed' => false,
                    'message' => 'Payment verification failed due to an invalid currency.',
                    'payment' => $lockedPayment,
                ];
            }

            // Validate exact amount (in Naira, tolerance 0.01)
            $expectedAmount = round((float) $lockedPayment->amount, 2);
            $verifiedAmount = round((float) $verification['amount'], 2);
            if ($verifiedAmount < $expectedAmount || abs($verifiedAmount - $expectedAmount) > 0.01) {
                $lockedPayment->update([
                    'status' => 'failed',
                    'metadata' => array_merge($lockedPayment->metadata ?? [], [
                        'failure_reason' => "Amount mismatch: expected {$expectedAmount}, received {$verifiedAmount}",
                    ]),
                ]);

                return [
                    'status' => false,
                    'already_processed' => false,
                    'message' => 'Payment verification failed: the amount paid does not match the subscription price.',
                    'payment' => $lockedPayment,
                ];
            }

            // Validate ownership metadata if present in gateway response
            $gatewayMerchantId = $verification['metadata']['merchant_id'] ?? ($verification['metadata']['user_id'] ?? null);
            if ($gatewayMerchantId !== null && (int) $gatewayMerchantId !== (int) $lockedPayment->user_id) {
                $lockedPayment->update([
                    'status' => 'failed',
                    'metadata' => array_merge($lockedPayment->metadata ?? [], [
                        'failure_reason' => 'Transaction ownership mismatch',
                    ]),
                ]);

                return [
                    'status' => false,
                    'already_processed' => false,
                    'message' => 'Payment verification failed: transaction ownership mismatch.',
                    'payment' => $lockedPayment,
                ];
            }

            // Mark payment as successful
            $paidAt = ! empty($verification['paid_at']) ? Carbon::parse($verification['paid_at']) : now();
            $lockedPayment->update([
                'status' => 'successful',
                'paid_at' => $paidAt,
                'metadata' => array_merge($lockedPayment->metadata ?? [], [
                    'gateway_reference' => $verification['gateway_reference'],
                    'gateway_status' => $verification['payment_status'],
                    'gateway_message' => $verification['message'],
                    'verified_at' => now()->toIso8601String(),
                ]),
            ]);

            // Activate or upgrade the merchant's subscription
            $user = $lockedPayment->user;
            $plan = $lockedPayment->plan;

            if ($user && $plan) {
                $this->activateSubscriptionForUser($user, $plan, $lockedPayment->billing_cycle);
            }

            return [
                'status' => true,
                'already_processed' => false,
                'message' => "Payment verified! Your subscription has been upgraded to the {$plan?->name} plan.",
                'payment' => $lockedPayment,
            ];
        });
    }

    /**
     * Activate or upgrade the user's storage plan record inside a transaction.
     */
    public function activateSubscriptionForUser(User $user, StoragePlan $plan, string $billingCycle): UserStoragePlan
    {
        $cycle = $billingCycle === 'yearly' ? 'yearly' : 'monthly';
        $isFree = ((float) $plan->price_monthly) <= 0;

        $existingSub = UserStoragePlan::where('user_id', $user->id)->first();
        $startsAt = now();

        if ($isFree) {
            $expiresAt = null;
        } else {
            // If renewing the exact same active paid plan that hasn't expired yet, extend from its current expiry
            if (
                $existingSub &&
                (int) $existingSub->storage_plan_id === (int) $plan->id &&
                $existingSub->status === 'active' &&
                $existingSub->expires_at !== null &&
                $existingSub->expires_at->isFuture()
            ) {
                $baseDate = $existingSub->expires_at->copy();
                $startsAt = $existingSub->starts_at ?? now();
            } else {
                $baseDate = now();
            }

            $expiresAt = $cycle === 'yearly' ? $baseDate->addYear() : $baseDate->addMonth();
        }

        $subscription = UserStoragePlan::updateOrCreate(
            ['user_id' => $user->id],
            [
                'storage_plan_id' => $plan->id,
                'billing_cycle' => $cycle,
                'status' => 'active',
                'starts_at' => $startsAt,
                'expires_at' => $expiresAt,
                'auto_renew' => ! $isFree,
            ]
        );

        activity()->causedBy($user->id)->log("Activated {$plan->name} storage subscription ({$cycle})");

        return $subscription;
    }

    /**
     * Handle incoming webhook notifications from a payment gateway.
     *
     * @return array{status: bool, http_code: int, message: string}
     */
    public function handleWebhook(string $provider, Request $request): array
    {
        try {
            $gateway = $this->gatewayManager->resolve($provider);
        } catch (\Throwable $e) {
            return [
                'status' => false,
                'http_code' => 400,
                'message' => 'Unsupported gateway.',
            ];
        }

        $parsed = $gateway->parseAndValidateWebhook($request);

        if (! $parsed['valid']) {
            Log::warning("Invalid {$provider} webhook signature received.");

            return [
                'status' => false,
                'http_code' => 401,
                'message' => 'Invalid webhook signature.',
            ];
        }

        $event = (string) ($parsed['event'] ?? '');
        $reference = (string) ($parsed['reference'] ?? '');

        // Only process charge.success events; acknowledge other events with 200 OK
        if ($event !== 'charge.success') {
            return [
                'status' => true,
                'http_code' => 200,
                'message' => 'Event ignored.',
            ];
        }

        if (empty($reference)) {
            return [
                'status' => false,
                'http_code' => 400,
                'message' => 'Missing transaction reference in webhook payload.',
            ];
        }

        $result = $this->verifyAndCompletePayment($reference);

        return [
            'status' => $result['status'],
            'http_code' => 200,
            'message' => $result['message'],
        ];
    }
}
