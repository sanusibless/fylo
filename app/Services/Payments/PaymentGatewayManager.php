<?php

namespace App\Services\Payments;

use App\Services\Payments\Contracts\PaymentGatewayInterface;
use App\Services\Payments\Gateways\MonetaPaymentGateway;
use App\Services\Payments\Gateways\PaystackPaymentGateway;
use InvalidArgumentException;

class PaymentGatewayManager
{
    /**
     * @var array<string, PaymentGatewayInterface>
     */
    protected array $gateways = [];

    public function __construct(
        PaystackPaymentGateway $paystackGateway,
        MonetaPaymentGateway $monetaGateway
    ) {
        $this->register($monetaGateway);
        $this->register($paystackGateway);
    }

    public function register(PaymentGatewayInterface $gateway): void
    {
        $this->gateways[strtolower($gateway->getIdentifier())] = $gateway;
    }

    public function resolve(?string $identifier = null): PaymentGatewayInterface
    {
        $key = strtolower($identifier ?: $this->getDefaultGatewayIdentifier());

        if (! isset($this->gateways[$key])) {
            throw new InvalidArgumentException("Unsupported payment gateway [{$identifier}].");
        }

        return $this->gateways[$key];
    }

    public function getDefaultGatewayIdentifier(): string
    {
        return strtolower((string) config('fylo.payments.default_gateway', 'moneta'));
    }

    /**
     * Return metadata for all registered gateways for the checkout UI.
     *
     * @return array<int, array{id: string, name: string, description: string, available: bool, is_default: bool}>
     */
    public function getAvailableGatewaysForCheckout(): array
    {
        $default = $this->getDefaultGatewayIdentifier();

        return [
            [
                'id' => 'moneta',
                'name' => 'Moneta',
                'description' => 'Direct merchant collection & instant bank settlement in Nigerian Naira (₦).',
                'available' => $this->resolve('moneta')->isAvailable(),
                'is_default' => $default === 'moneta',
            ],
            [
                'id' => 'paystack',
                'name' => 'Paystack',
                'description' => 'Pay securely in NGN (₦) with Debit Cards, Bank Transfer, or USSD via Paystack.',
                'available' => $this->resolve('paystack')->isAvailable(),
                'is_default' => $default === 'paystack',
            ],
        ];
    }
}
