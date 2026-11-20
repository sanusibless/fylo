<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\StoragePlan;
use App\Models\UserStoragePlan;
use App\Services\Payments\PaymentGatewayManager;
use App\Services\SubscriptionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function __construct(
        protected SubscriptionService $subscriptionService,
        protected PaymentGatewayManager $gatewayManager
    ) {}

    public function index()
    {
        $this->subscriptionService->ensurePlansSeeded();

        $user = auth()->user();
        $canonicalSlugs = array_column(config('fylo.plans', []), 'slug');

        $plans = StoragePlan::where('is_active', true)
            ->when(! empty($canonicalSlugs), fn ($q) => $q->whereIn('slug', $canonicalSlugs))
            ->orderBy('price_monthly')
            ->get()
            ->map(function (StoragePlan $plan) {
                $monthly = (float) $plan->price_monthly;
                $yearly = StoragePlan::calculateYearlyPrice($monthly);
                $yearlySavings = StoragePlan::calculateYearlyDiscountAmount($monthly);

                $plan->price_yearly = $yearly;
                $plan->setAttribute('yearly_savings', $yearlySavings);

                return $plan;
            });

        $currentPlanRecord = $user->activeStoragePlanRecord();
        $currentPlan = $currentPlanRecord?->storagePlanDetail ?? StoragePlan::where('slug', 'free')->first();

        $payments = Payment::with('plan')
            ->where('user_id', $user->id)
            ->latest()
            ->take(20)
            ->get();

        $storageUsage = [
            'totalUsed' => round($user->totalStorageUsedBytes() / (1024 * 1024 * 1024), 4),
            'totalUsedBytes' => (int) $user->totalStorageUsedBytes(),
            'totalAvailable' => $user->storageCapacityGB(),
            'totalAvailableBytes' => (int) $user->storageCapacityBytes(),
            'maxFileSizeMB' => $user->maxUploadSizeMB(),
            'planName' => $currentPlan?->name ?? 'Free',
            'expiresAt' => $currentPlanRecord?->expires_at?->toFormattedDateString(),
            'billingCycle' => $currentPlanRecord?->billing_cycle ?? 'monthly',
            'autoRenew' => $currentPlanRecord?->auto_renew ?? false,
        ];

        return Inertia::render('Subscription', [
            'plans' => $plans,
            'currentPlan' => $currentPlan,
            'currentSubscription' => $currentPlanRecord,
            'payments' => $payments,
            'storageUsage' => $storageUsage,
        ]);
    }

    public function showCheckout(Request $request)
    {
        $this->subscriptionService->ensurePlansSeeded();

        $planSlug = (string) $request->query('plan', '');
        $billingCycle = $request->query('cycle', 'monthly') === 'yearly' ? 'yearly' : 'monthly';

        $plan = StoragePlan::where('slug', $planSlug)
            ->where('is_active', true)
            ->first();

        if (! $plan) {
            return redirect()
                ->route('subscription.index')
                ->with('error', 'Please select a valid subscription package to continue.');
        }

        // If the merchant selected the Free plan, activate or return directly
        if ((float) $plan->price_monthly <= 0) {
            $user = auth()->user();
            $result = $this->subscriptionService->initiateSubscriptionCheckout($user, $plan, $billingCycle, 'free');

            return redirect()
                ->route('subscription.index')
                ->with('success', $result['message']);
        }

        $user = auth()->user();
        $currentPlanRecord = $user->activeStoragePlanRecord();
        $currentPlan = $currentPlanRecord?->storagePlanDetail ?? StoragePlan::where('slug', 'free')->first();

        $pricing = $this->subscriptionService->calculatePricingBreakdown($plan, $billingCycle);
        $gateways = $this->gatewayManager->getAvailableGatewaysForCheckout();
        $defaultGateway = $this->gatewayManager->getDefaultGatewayIdentifier();

        return Inertia::render('SubscriptionCheckout', [
            'plan' => $plan,
            'currentPlan' => $currentPlan,
            'billingCycle' => $billingCycle,
            'pricing' => $pricing,
            'gateways' => $gateways,
            'defaultGateway' => $defaultGateway,
        ]);
    }

    public function checkout(Request $request)
    {
        $this->subscriptionService->ensurePlansSeeded();

        $validated = $request->validate([
            'plan_slug' => 'required|string|exists:storage_plans,slug',
            'billing_cycle' => 'required|in:monthly,yearly',
            'provider' => 'nullable|string|in:moneta,paystack',
        ]);

        $user = auth()->user();
        $plan = StoragePlan::where('slug', $validated['plan_slug'])
            ->where('is_active', true)
            ->firstOrFail();

        $cycle = $validated['billing_cycle'];
        $provider = $validated['provider'] ?? $this->gatewayManager->getDefaultGatewayIdentifier();

        $result = $this->subscriptionService->initiateSubscriptionCheckout($user, $plan, $cycle, $provider);

        if (! $result['status']) {
            if ($request->expectsJson() && ! $request->header('X-Inertia')) {
                return response()->json([
                    'status' => false,
                    'message' => $result['message'],
                ], 422);
            }

            return redirect()
                ->route('subscription.checkout.show', [
                    'plan' => $plan->slug,
                    'cycle' => $cycle,
                ])
                ->with('error', $result['message']);
        }

        if ($result['is_free']) {
            return redirect()
                ->route('subscription.index')
                ->with('success', $result['message']);
        }

        if (! empty($result['authorization_url'])) {
            if ($request->header('X-Inertia')) {
                return Inertia::location($result['authorization_url']);
            }

            return redirect()->away($result['authorization_url']);
        }

        return redirect()
            ->route('subscription.index')
            ->with('success', $result['message']);
    }

    public function handleCallback(Request $request, string $gateway = 'paystack')
    {
        $reference = (string) ($request->query('reference') ?: $request->query('trxref') ?: '');

        if (empty($reference)) {
            return redirect()
                ->route('subscription.index')
                ->with('error', 'Payment verification failed: missing transaction reference.');
        }

        $result = $this->subscriptionService->verifyAndCompletePayment($reference, auth()->id());

        if ($result['status']) {
            return redirect()
                ->route('subscription.index')
                ->with('success', $result['message']);
        }

        return redirect()
            ->route('subscription.index')
            ->with('error', $result['message']);
    }

    public function verifyTransaction(Request $request, string $reference)
    {
        $result = $this->subscriptionService->verifyAndCompletePayment($reference, auth()->id());

        if ($result['status']) {
            return redirect()
                ->route('subscription.index')
                ->with('success', $result['message']);
        }

        return redirect()
            ->route('subscription.index')
            ->with('error', $result['message']);
    }

    public function handlePaystackWebhook(Request $request)
    {
        $result = $this->subscriptionService->handleWebhook('paystack', $request);

        return response()->json([
            'status' => $result['status'],
            'message' => $result['message'],
        ], $result['http_code']);
    }

    public function cancel(Request $request)
    {
        $user = auth()->user();

        $sub = UserStoragePlan::where('user_id', $user->id)->where('status', 'active')->first();
        if ($sub) {
            $sub->update(['auto_renew' => false]);
            activity()->causedBy($user->id)->log('Disabled automatic subscription renewal');
        }

        return back()->with('status', 'Automatic subscription renewal has been turned off.');
    }
}
