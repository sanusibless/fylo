<?php

namespace App\Services\Payments\Contracts;

use App\Models\Payment;
use Illuminate\Http\Request;

interface PaymentGatewayInterface
{
    /**
     * Unique provider identifier (e.g., 'paystack', 'moneta').
     */
    public function getIdentifier(): string;

    /**
     * Human-readable gateway display name.
     */
    public function getDisplayName(): string;

    /**
     * Determine whether the gateway is configured and ready to accept payments.
     */
    public function isAvailable(): bool;

    /**
     * Initialize a payment transaction with the gateway.
     *
     * @param  array<string, mixed>  $options
     * @return array{
     *     status: bool,
     *     message: string,
     *     authorization_url: string|null,
     *     access_code: string|null,
     *     reference: string,
     *     raw: array<string, mixed>
     * }
     */
    public function initializePayment(Payment $payment, array $options = []): array;

    /**
     * Verify a payment transaction directly against the gateway using its reference.
     *
     * @return array{
     *     status: bool,
     *     payment_status: string,
     *     message: string,
     *     reference: string,
     *     amount: float,
     *     currency: string,
     *     gateway_reference: string|null,
     *     paid_at: string|null,
     *     metadata: array<string, mixed>,
     *     raw: array<string, mixed>
     * }
     */
    public function verifyPayment(string $reference): array;

    /**
     * Validate an incoming webhook request signature and parse the payload.
     *
     * @return array{
     *     valid: bool,
     *     event: string|null,
     *     reference: string|null,
     *     payload: array<string, mixed>
     * }
     */
    public function parseAndValidateWebhook(Request $request): array;
}
