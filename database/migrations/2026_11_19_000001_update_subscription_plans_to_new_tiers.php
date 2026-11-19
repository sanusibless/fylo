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

        // Rename legacy Basic -> Starter and Pro -> Growth if they exist so existing foreign keys remain intact
        $basic = DB::table('storage_plans')->where('slug', 'basic')->first();
        $starterExists = DB::table('storage_plans')->where('slug', 'starter')->exists();
        if ($basic && ! $starterExists) {
            DB::table('storage_plans')->where('id', $basic->id)->update([
                'name' => 'Starter',
                'slug' => 'starter',
            ]);
        } elseif ($basic && $starterExists) {
            DB::table('storage_plans')->where('id', $basic->id)->update(['is_active' => false]);
        }

        $pro = DB::table('storage_plans')->where('slug', 'pro')->first();
        $growthExists = DB::table('storage_plans')->where('slug', 'growth')->exists();
        if ($pro && ! $growthExists) {
            DB::table('storage_plans')->where('id', $pro->id)->update([
                'name' => 'Growth',
                'slug' => 'growth',
            ]);
        } elseif ($pro && $growthExists) {
            DB::table('storage_plans')->where('id', $pro->id)->update(['is_active' => false]);
        }

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
                'is_active' => $plan['is_active'],
                'updated_at' => now(),
            ];

            if ($existing) {
                DB::table('storage_plans')->where('id', $existing->id)->update($payload);
            } else {
                $payload['created_at'] = now();
                DB::table('storage_plans')->insert($payload);
            }
        }
    }

    public function down(): void
    {
        // Non-destructive migration
    }
};
