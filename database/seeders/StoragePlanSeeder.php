<?php

namespace Database\Seeders;

use App\Models\StoragePlan;
use App\Models\UserStoragePlan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
                "name" => "Free",
                "capacity" => "10",
            ],
            [
                "name" => "Basic",
                "capacity" => "20",
            ],
            [
                "name" => "Premium",
                "capacity" => "200",
            ],
            [
                "name" => "Enterprise",
                "capacity" => "Unlimited",
            ]
        ];

        StoragePlan::insert($plans);
        UserStoragePlan::create([
            "user_id" => 3,
            "storage_plan_id" => 2,
        ]);

    }
}
