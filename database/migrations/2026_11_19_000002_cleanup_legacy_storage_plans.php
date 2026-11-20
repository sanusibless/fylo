<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('storage_plans')) {
            return;
        }

        $canonicalSlugs = ['free', 'starter', 'growth', 'business'];

        // Ensure canonical plans exist
        $plans = config('fylo.plans', []);
        foreach ($plans as $plan) {
            $existing = DB::table('storage_plans')->where('slug', $plan['slug'])->first();
            $payload = [
                'name' => $plan['name'],
                'slug' => $plan['slug'],
                'capacity' => $plan['capacity'],
                'price_monthly' => $plan['price_monthly'],
                'price_yearly' => $plan['price_yearly'],
                'currency' => $plan['currency'],
                'description' => $plan['description'],
                'features' => json_encode($plan['features']),
                'max_file_size_mb' => $plan['max_file_size_mb'],
                'is_popular' => $plan['is_popular'],
                'is_active' => true,
                'updated_at' => now(),
            ];

            if ($existing) {
                DB::table('storage_plans')->where('id', $existing->id)->update($payload);
            } else {
                $payload['created_at'] = now();
                DB::table('storage_plans')->insert($payload);
            }
        }

        $freePlan = DB::table('storage_plans')->where('slug', 'free')->first();
        $starterPlan = DB::table('storage_plans')->where('slug', 'starter')->first();
        $growthPlan = DB::table('storage_plans')->where('slug', 'growth')->first();
        $businessPlan = DB::table('storage_plans')->where('slug', 'business')->first();

        // Find all legacy/non-canonical plans (including null slug rows)
        $legacyPlans = DB::table('storage_plans')
            ->where(function ($q) use ($canonicalSlugs) {
                $q->whereNull('slug')
                    ->orWhereNotIn('slug', $canonicalSlugs);
            })
            ->get();

        foreach ($legacyPlans as $legacy) {
            $nameLower = strtolower((string) $legacy->name);
            $targetId = match (true) {
                str_contains($nameLower, 'basic') && $starterPlan => $starterPlan->id,
                (str_contains($nameLower, 'premium') || str_contains($nameLower, 'pro')) && $growthPlan => $growthPlan->id,
                str_contains($nameLower, 'enterprise') && $businessPlan => $businessPlan->id,
                default => $freePlan?->id,
            };

            if ($targetId) {
                if (Schema::hasTable('user_storage_plans')) {
                    DB::table('user_storage_plans')
                        ->where('storage_plan_id', $legacy->id)
                        ->update(['storage_plan_id' => $targetId]);
                }
                if (Schema::hasTable('payments')) {
                    DB::table('payments')
                        ->where('storage_plan_id', $legacy->id)
                        ->update(['storage_plan_id' => $targetId]);
                }
            }

            DB::table('storage_plans')->where('id', $legacy->id)->delete();
        }
    }

    public function down(): void
    {
        // Non-destructive rollback
    }
};
