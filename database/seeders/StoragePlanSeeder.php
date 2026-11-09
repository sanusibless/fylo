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
        $plans = [
            [
                'name' => 'Free',
                'capacity' => '10',
            ],
            [
                'name' => 'Basic',
                'capacity' => '20',
            ],
            [
                'name' => 'Premium',
                'capacity' => '200',
            ],
            [
                'name' => 'Enterprise',
                'capacity' => 'Unlimited',
            ],
        ];

        foreach ($plans as $plan) {
            StoragePlan::firstOrCreate(
                ['name' => $plan['name']],
                ['capacity' => $plan['capacity']]
            );
        }
    }
}
