<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\StoragePlan;
use App\Models\UserStoragePlan;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $plans = StoragePlan::where('is_active', true)->orderBy('price_monthly')->get();

        $currentPlanRecord = UserStoragePlan::with('storagePlanDetail')
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->latest()
            ->first();

        $currentPlan = $currentPlanRecord?->storagePlanDetail ?? StoragePlan::where('name', 'Free')->first();

        $payments = Payment::with('plan')
            ->where('user_id', $user->id)
            ->latest()
            ->take(15)
            ->get();

        $storageUsage = [
            'totalUsed' => round($user->totalStorageUsedBytes() / (1024 * 1024 * 1024), 2),
            'totalAvailable' => $user->storageCapacityGB(),
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

    public function checkout(Request $request)
    {
        $request->validate([
            'plan_slug' => 'required|string|exists:storage_plans,slug',
            'billing_cycle' => 'required|in:monthly,yearly',
            'provider' => 'nullable|string|in:sandbox,paystack,flutterwave',
        ]);

        $user = auth()->user();
        $plan = StoragePlan::where('slug', $request->plan_slug)->firstOrFail();
        $cycle = $request->billing_cycle;
        $amount = $cycle === 'yearly' ? $plan->price_yearly : $plan->price_monthly;
        $provider = $request->provider ?: 'sandbox';

        $reference = 'FYLO_'.strtoupper(Str::random(12));

        $payment = Payment::create([
            'user_id' => $user->id,
            'storage_plan_id' => $plan->id,
            'reference' => $reference,
            'amount' => $amount,
            'currency' => $plan->currency ?: 'USD',
            'billing_cycle' => $cycle,
            'provider' => $provider,
            'status' => 'pending',
            'metadata' => [
                'plan_name' => $plan->name,
                'user_email' => $user->email,
            ],
        ]);

        // When amount is 0 (Free Plan) or Sandbox mode, auto-activate immediately
        if ($amount == 0 || $provider === 'sandbox') {
            $payment->update([
                'status' => 'successful',
                'paid_at' => now(),
            ]);

            // Update user active storage plan
            $startsAt = now();
            $expiresAt = $cycle === 'yearly' ? now()->addYear() : now()->addMonth();

            UserStoragePlan::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'storage_plan_id' => $plan->id,
                    'billing_cycle' => $cycle,
                    'status' => 'active',
                    'starts_at' => $startsAt,
                    'expires_at' => $expiresAt,
                    'auto_renew' => true,
                ]
            );

            activity()->causedBy($user->id)->log("Upgraded storage subscription to {$plan->name} ({$cycle})");

            return redirect()->route('subscription.index')->with('success', "Congratulations! Your subscription has been upgraded to {$plan->name}.");
        }

        // Production Webhook & Checkout architecture for Paystack/Flutterwave
        return redirect()->route('subscription.index')->with('success', "Payment reference {$reference} initiated.");
    }

    public function cancel(Request $request)
    {
        $user = auth()->user();

        $sub = UserStoragePlan::where('user_id', $user->id)->where('status', 'active')->first();
        if ($sub) {
            $sub->update(['auto_renew' => false]);
        }

        return back()->with('status', 'Automatic subscription renewal has been turned off.');
    }
}
