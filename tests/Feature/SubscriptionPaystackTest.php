<?php

namespace Tests\Feature;

use App\Models\Payment;
use App\Models\StoragePlan;
use App\Models\User;
use App\Models\UserStoragePlan;
use App\Services\Payments\Gateways\PaystackPaymentGateway;
use App\Services\Payments\PaymentGatewayManager;
use Database\Seeders\StoragePlanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SubscriptionPaystackTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(StoragePlanSeeder::class);

        config([
            'services.paystack.environment' => 'test',
            'services.paystack.test_public_key' => 'pk_test_123456789',
            'services.paystack.test_secret_key' => 'sk_test_123456789',
            'services.paystack.live_public_key' => 'pk_live_987654321',
            'services.paystack.live_secret_key' => 'sk_live_987654321',
            'services.paystack.webhook_secret' => null,
        ]);
    }

    public function test_subscription_plans_and_yearly_20_percent_discount_calculations()
    {
        $free = StoragePlan::where('slug', 'free')->firstOrFail();
        $starter = StoragePlan::where('slug', 'starter')->firstOrFail();
        $growth = StoragePlan::where('slug', 'growth')->firstOrFail();
        $business = StoragePlan::where('slug', 'business')->firstOrFail();

        // Free: 5 GB, ₦0 monthly, ₦0 yearly
        $this->assertEquals('5', $free->capacity);
        $this->assertEquals(0.00, (float) $free->price_monthly);
        $this->assertEquals(0.00, $free->getAmountForCycle('yearly'));

        // Starter: 50 GB, ₦15,000 monthly, ₦144,000 yearly (15,000 * 12 * 0.8)
        $this->assertEquals('50', $starter->capacity);
        $this->assertEquals(15000.00, (float) $starter->price_monthly);
        $this->assertEquals(144000.00, $starter->getAmountForCycle('yearly'));
        $this->assertEquals(36000.00, $starter->getDiscountForCycle('yearly'));

        // Growth: 100 GB, ₦20,000 monthly, ₦192,000 yearly (20,000 * 12 * 0.8)
        $this->assertEquals('100', $growth->capacity);
        $this->assertEquals(20000.00, (float) $growth->price_monthly);
        $this->assertEquals(192000.00, $growth->getAmountForCycle('yearly'));
        $this->assertEquals(48000.00, $growth->getDiscountForCycle('yearly'));

        // Business: 250 GB, ₦30,000 monthly, ₦288,000 yearly (30,000 * 12 * 0.8)
        $this->assertEquals('250', $business->capacity);
        $this->assertEquals(30000.00, (float) $business->price_monthly);
        $this->assertEquals(288000.00, $business->getAmountForCycle('yearly'));
        $this->assertEquals(72000.00, $business->getDiscountForCycle('yearly'));
    }

    public function test_test_and_live_credential_selection_for_paystack()
    {
        /** @var PaystackPaymentGateway $paystack */
        $paystack = app(PaystackPaymentGateway::class);

        config(['services.paystack.environment' => 'test']);
        $this->assertEquals('test', $paystack->getEnvironment());
        $this->assertEquals('sk_test_123456789', $paystack->getSecretKey());
        $this->assertEquals('pk_test_123456789', $paystack->getPublicKey());

        config(['services.paystack.environment' => 'live']);
        $this->assertEquals('live', $paystack->getEnvironment());
        $this->assertEquals('sk_live_987654321', $paystack->getSecretKey());
        $this->assertEquals('pk_live_987654321', $paystack->getPublicKey());
    }

    public function test_checkout_page_renders_with_moneta_as_default_gateway()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('subscription.checkout.show', [
            'plan' => 'starter',
            'cycle' => 'yearly',
        ]));

        $response->assertOk();

        /** @var PaymentGatewayManager $manager */
        $manager = app(PaymentGatewayManager::class);
        $this->assertEquals('moneta', $manager->getDefaultGatewayIdentifier());
    }

    public function test_unconfigured_moneta_gateway_is_handled_gracefully_without_activating_subscription()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->post(route('subscription.checkout'), [
            'plan_slug' => 'starter',
            'billing_cycle' => 'monthly',
            'provider' => 'moneta',
        ]);

        $response->assertRedirect(route('subscription.checkout.show', [
            'plan' => 'starter',
            'cycle' => 'monthly',
        ]));
        $response->assertSessionHas('error');

        // Ensure user remains on Free (5 GB)
        $this->assertEquals(5.0, $user->fresh()->storageCapacityGB());
    }

    public function test_paystack_payment_initialization_sends_kobo_amount_and_creates_pending_payment()
    {
        $user = User::factory()->create(['email' => 'merchant@fylo.ng']);
        $this->actingAs($user);

        $capturedPayload = null;
        Http::fake(function ($request) use (&$capturedPayload) {
            if (str_contains($request->url(), '/transaction/initialize')) {
                $capturedPayload = $request->data();

                return Http::response([
                    'status' => true,
                    'message' => 'Authorization URL created',
                    'data' => [
                        'authorization_url' => 'https://checkout.paystack.com/auth_starter_monthly',
                        'access_code' => 'access_123',
                        'reference' => $capturedPayload['reference'],
                    ],
                ], 200);
            }

            return Http::response([], 404);
        });

        $response = $this->post(route('subscription.checkout'), [
            'plan_slug' => 'starter',
            'billing_cycle' => 'monthly',
            'provider' => 'paystack',
        ]);

        $response->assertRedirect('https://checkout.paystack.com/auth_starter_monthly');

        $this->assertNotNull($capturedPayload);
        // ₦15,000 = 1,500,000 kobo
        $this->assertEquals(1500000, $capturedPayload['amount']);
        $this->assertEquals('NGN', $capturedPayload['currency']);
        $this->assertEquals('merchant@fylo.ng', $capturedPayload['email']);

        $payment = Payment::where('user_id', $user->id)->firstOrFail();
        $this->assertEquals('pending', $payment->status);
        $this->assertEquals('paystack', $payment->provider);
        $this->assertEquals(15000.00, (float) $payment->amount);

        // User must NOT be upgraded while payment is only pending
        $this->assertEquals(5.0, $user->fresh()->storageCapacityGB());
    }

    public function test_yearly_checkout_and_successful_paystack_callback_verification_activates_subscription()
    {
        $user = User::factory()->create(['email' => 'merchant@fylo.ng']);
        $this->actingAs($user);

        Http::fake(function ($request) {
            if (str_contains($request->url(), '/transaction/initialize')) {
                $data = $request->data();

                return Http::response([
                    'status' => true,
                    'message' => 'Authorization URL created',
                    'data' => [
                        'authorization_url' => 'https://checkout.paystack.com/auth_growth_yearly',
                        'access_code' => 'access_yearly',
                        'reference' => $data['reference'],
                    ],
                ], 200);
            }

            if (str_contains($request->url(), '/transaction/verify/')) {
                $segments = explode('/', $request->url());
                $ref = end($segments);

                return Http::response([
                    'status' => true,
                    'message' => 'Verification successful',
                    'data' => [
                        'id' => 998877,
                        'status' => 'success',
                        'reference' => $ref,
                        'amount' => 19200000, // ₦192,000 in kobo (Growth yearly with 20% discount)
                        'currency' => 'NGN',
                        'paid_at' => now()->toIso8601String(),
                        'gateway_response' => 'Approved',
                        'metadata' => [],
                    ],
                ], 200);
            }

            return Http::response([], 404);
        });

        // 1. Initialize Yearly Growth checkout (₦192,000)
        $this->post(route('subscription.checkout'), [
            'plan_slug' => 'growth',
            'billing_cycle' => 'yearly',
            'provider' => 'paystack',
        ]);

        $payment = Payment::where('user_id', $user->id)->firstOrFail();
        $this->assertEquals('pending', $payment->status);
        $this->assertEquals(192000.00, (float) $payment->amount);

        // 2. Simulate Paystack Callback Redirect
        $callbackResp = $this->get(route('subscription.callback', [
            'gateway' => 'paystack',
            'reference' => $payment->reference,
        ]));

        $callbackResp->assertRedirect(route('subscription.index'));
        $callbackResp->assertSessionHas('success');

        // 3. Confirm payment is marked successful and subscription is upgraded to Growth (100 GB)
        $payment->refresh();
        $this->assertEquals('successful', $payment->status);
        $this->assertNotNull($payment->paid_at);

        $user->refresh();
        $this->assertEquals(100.0, $user->storageCapacityGB());
        $sub = $user->activeStoragePlanRecord();
        $this->assertNotNull($sub);
        $this->assertEquals('yearly', $sub->billing_cycle);
        $this->assertTrue($sub->expires_at->greaterThan(now()->addMonths(11)));
    }

    public function test_failed_payment_verification_does_not_activate_subscription()
    {
        $user = User::factory()->create();
        $starter = StoragePlan::where('slug', 'starter')->firstOrFail();

        $payment = Payment::create([
            'user_id' => $user->id,
            'storage_plan_id' => $starter->id,
            'reference' => 'FYLO_FAILED_TEST_REF',
            'amount' => 15000.00,
            'currency' => 'NGN',
            'billing_cycle' => 'monthly',
            'provider' => 'paystack',
            'status' => 'pending',
        ]);

        Http::fake([
            'https://api.paystack.co/transaction/verify/*' => Http::response([
                'status' => true,
                'message' => 'Verification successful',
                'data' => [
                    'id' => 111222,
                    'status' => 'failed',
                    'reference' => 'FYLO_FAILED_TEST_REF',
                    'amount' => 1500000,
                    'currency' => 'NGN',
                    'gateway_response' => 'Declined by financial institution',
                ],
            ], 200),
        ]);

        $this->actingAs($user);
        $response = $this->get(route('subscription.callback', [
            'gateway' => 'paystack',
            'reference' => $payment->reference,
        ]));

        $response->assertRedirect(route('subscription.index'));
        $response->assertSessionHas('error');

        $this->assertEquals('failed', $payment->fresh()->status);
        $this->assertEquals(5.0, $user->fresh()->storageCapacityGB());
    }

    public function test_incorrect_payment_amount_is_rejected_and_does_not_activate_subscription()
    {
        $user = User::factory()->create();
        $business = StoragePlan::where('slug', 'business')->firstOrFail();

        $payment = Payment::create([
            'user_id' => $user->id,
            'storage_plan_id' => $business->id,
            'reference' => 'FYLO_TAMPERED_AMOUNT',
            'amount' => 30000.00,
            'currency' => 'NGN',
            'billing_cycle' => 'monthly',
            'provider' => 'paystack',
            'status' => 'pending',
        ]);

        // Paystack reports only ₦5,000 paid instead of ₦30,000
        Http::fake([
            'https://api.paystack.co/transaction/verify/*' => Http::response([
                'status' => true,
                'message' => 'Verification successful',
                'data' => [
                    'id' => 333444,
                    'status' => 'success',
                    'reference' => 'FYLO_TAMPERED_AMOUNT',
                    'amount' => 500000, // ₦5,000 in kobo
                    'currency' => 'NGN',
                ],
            ], 200),
        ]);

        $this->actingAs($user);
        $response = $this->get(route('subscription.callback', [
            'gateway' => 'paystack',
            'reference' => $payment->reference,
        ]));

        $response->assertSessionHas('error');
        $this->assertEquals('failed', $payment->fresh()->status);
        $this->assertEquals(5.0, $user->fresh()->storageCapacityGB());
    }

    public function test_incorrect_currency_is_rejected_and_does_not_activate_subscription()
    {
        $user = User::factory()->create();
        $starter = StoragePlan::where('slug', 'starter')->firstOrFail();

        $payment = Payment::create([
            'user_id' => $user->id,
            'storage_plan_id' => $starter->id,
            'reference' => 'FYLO_WRONG_CURRENCY',
            'amount' => 15000.00,
            'currency' => 'NGN',
            'billing_cycle' => 'monthly',
            'provider' => 'paystack',
            'status' => 'pending',
        ]);

        Http::fake([
            'https://api.paystack.co/transaction/verify/*' => Http::response([
                'status' => true,
                'message' => 'Verification successful',
                'data' => [
                    'id' => 444555,
                    'status' => 'success',
                    'reference' => 'FYLO_WRONG_CURRENCY',
                    'amount' => 1500000,
                    'currency' => 'GHS',
                ],
            ], 200),
        ]);

        $this->actingAs($user);
        $response = $this->get(route('subscription.callback', [
            'gateway' => 'paystack',
            'reference' => $payment->reference,
        ]));

        $response->assertSessionHas('error');
        $this->assertEquals('failed', $payment->fresh()->status);
        $this->assertEquals(5.0, $user->fresh()->storageCapacityGB());
    }

    public function test_invalid_transaction_reference_returns_error()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('subscription.callback', [
            'gateway' => 'paystack',
            'reference' => 'NON_EXISTENT_REFERENCE_123',
        ]));

        $response->assertRedirect(route('subscription.index'));
        $response->assertSessionHas('error');
    }

    public function test_webhook_rejects_invalid_hmac_signature()
    {
        $user = User::factory()->create();
        $starter = StoragePlan::where('slug', 'starter')->firstOrFail();

        $payment = Payment::create([
            'user_id' => $user->id,
            'storage_plan_id' => $starter->id,
            'reference' => 'FYLO_WEBHOOK_INVALID_SIG',
            'amount' => 15000.00,
            'currency' => 'NGN',
            'billing_cycle' => 'monthly',
            'provider' => 'paystack',
            'status' => 'pending',
        ]);

        $payload = json_encode([
            'event' => 'charge.success',
            'data' => [
                'reference' => $payment->reference,
            ],
        ]);

        $response = $this->call(
            'POST',
            route('webhooks.paystack'),
            [],
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_X_PAYSTACK_SIGNATURE' => 'forged_invalid_signature_hash',
            ],
            $payload
        );

        $response->assertStatus(401);
        $this->assertEquals('pending', $payment->fresh()->status);
        $this->assertEquals(5.0, $user->fresh()->storageCapacityGB());
    }

    public function test_valid_webhook_verifies_and_activates_subscription_and_handles_duplicate_webhooks_idempotently()
    {
        $user = User::factory()->create();
        $business = StoragePlan::where('slug', 'business')->firstOrFail();

        $payment = Payment::create([
            'user_id' => $user->id,
            'storage_plan_id' => $business->id,
            'reference' => 'FYLO_WEBHOOK_VALID_001',
            'amount' => 30000.00,
            'currency' => 'NGN',
            'billing_cycle' => 'monthly',
            'provider' => 'paystack',
            'status' => 'pending',
        ]);

        $verifyCallCount = 0;
        Http::fake(function ($request) use (&$verifyCallCount, $payment) {
            if (str_contains($request->url(), '/transaction/verify/')) {
                $verifyCallCount++;

                return Http::response([
                    'status' => true,
                    'message' => 'Verification successful',
                    'data' => [
                        'id' => 777888,
                        'status' => 'success',
                        'reference' => $payment->reference,
                        'amount' => 3000000, // ₦30,000 in kobo
                        'currency' => 'NGN',
                        'paid_at' => now()->toIso8601String(),
                    ],
                ], 200);
            }

            return Http::response([], 404);
        });

        $payload = json_encode([
            'event' => 'charge.success',
            'data' => [
                'reference' => $payment->reference,
                'status' => 'success',
                'amount' => 3000000,
                'currency' => 'NGN',
            ],
        ]);

        $validSignature = hash_hmac('sha512', $payload, 'sk_test_123456789');

        // 1st Webhook delivery
        $firstResponse = $this->call(
            'POST',
            route('webhooks.paystack'),
            [],
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_X_PAYSTACK_SIGNATURE' => $validSignature,
            ],
            $payload
        );

        $firstResponse->assertStatus(200);
        $this->assertEquals('successful', $payment->fresh()->status);
        $this->assertEquals(250.0, $user->fresh()->storageCapacityGB());
        $this->assertEquals(1, $verifyCallCount);

        $firstExpiry = $user->fresh()->activeStoragePlanRecord()->expires_at;

        // 2nd Duplicate Webhook delivery (must be idempotent and not extend expiry twice)
        $secondResponse = $this->call(
            'POST',
            route('webhooks.paystack'),
            [],
            [],
            [],
            [
                'CONTENT_TYPE' => 'application/json',
                'HTTP_X_PAYSTACK_SIGNATURE' => $validSignature,
            ],
            $payload
        );

        $secondResponse->assertStatus(200);
        $this->assertEquals(1, $verifyCallCount);
        $this->assertEquals(
            $firstExpiry->toIso8601String(),
            $user->fresh()->activeStoragePlanRecord()->expires_at->toIso8601String()
        );

        // 3rd Duplicate Callback verification by the user (must also be idempotent)
        $this->actingAs($user);
        $callbackResp = $this->get(route('subscription.callback', [
            'gateway' => 'paystack',
            'reference' => $payment->reference,
        ]));
        $callbackResp->assertRedirect(route('subscription.index'));
        $callbackResp->assertSessionHas('success');
        $this->assertEquals(1, $verifyCallCount);
    }

    public function test_expired_subscription_falls_back_to_free_storage_allocation()
    {
        $user = User::factory()->create();
        $business = StoragePlan::where('slug', 'business')->firstOrFail();

        UserStoragePlan::updateOrCreate(
            ['user_id' => $user->id],
            [
                'storage_plan_id' => $business->id,
                'billing_cycle' => 'monthly',
                'status' => 'active',
                'starts_at' => now()->subMonths(2),
                'expires_at' => now()->subDay(),
                'auto_renew' => false,
            ]
        );

        $user->refresh();
        $this->assertEquals(5.0, $user->storageCapacityGB());
        $this->assertEquals('expired', UserStoragePlan::where('user_id', $user->id)->first()->status);
    }
}
