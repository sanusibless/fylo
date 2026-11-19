<?php

namespace Database\Seeders;

use App\Models\StoragePlan;
use Illuminate\Database\Seeder;

class StoragePlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = config('fylo.plans', []);

        foreach ($plans as $plan) {
            StoragePlan::updateOrCreate(
                ['slug' => $plan['slug']],
                $plan
            );
        }
    }
}
