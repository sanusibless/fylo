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
                'slug' => 'free',
                'capacity' => '10',
                'price_monthly' => 0.00,
                'price_yearly' => 0.00,
                'currency' => 'USD',
                'description' => 'Essential cloud storage for individuals getting started.',
                'features' => [
                    '10 GB secure cloud storage',
                    'Up to 50 MB per file upload',
                    'Standard file management',
                    'Basic file sharing links',
                    'Web browser access',
                    'Recycle bin recovery (7 days)',
                ],
                'max_file_size_mb' => 50,
                'is_popular' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Basic',
                'slug' => 'basic',
                'capacity' => '50',
                'price_monthly' => 9.00,
                'price_yearly' => 85.00,
                'currency' => 'USD',
                'description' => 'Expanded storage and unlimited folder structures for power users.',
                'features' => [
                    '50 GB high-speed storage',
                    'Unlimited nested folders',
                    'Direct link file sharing',
                    'In-browser media & PDF previews',
                    'Up to 250 MB per file upload',
                    'Standard customer support',
                ],
                'max_file_size_mb' => 250,
                'is_popular' => false,
                'is_active' => true,
            ],
            [
                'name' => 'Pro',
                'slug' => 'pro',
                'capacity' => '250',
                'price_monthly' => 19.00,
                'price_yearly' => 180.00,
                'currency' => 'USD',
                'description' => 'Maximum protection, password links, and version history.',
                'features' => [
                    '250 GB ultra-fast storage',
                    'Password-protected share links',
                    'Custom link expiration dates',
                    'Extended file upload limit (2 GB)',
                    'Detailed storage analytics',
                    'Priority 24/7 support',
                ],
                'max_file_size_mb' => 2048,
                'is_popular' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Business',
                'slug' => 'business',
                'capacity' => '1000',
                'price_monthly' => 49.00,
                'price_yearly' => 470.00,
                'currency' => 'USD',
                'description' => 'Enterprise capacity, multi-user teams, and activity logging.',
                'features' => [
                    '1 TB scalable cloud storage',
                    'Multiple team accounts',
                    'Full audit logs & activity monitoring',
                    'Dedicated account manager',
                    'Enterprise SLA guarantee',
                    'Compliant data governance',
                ],
                'max_file_size_mb' => 10240,
                'is_popular' => false,
                'is_active' => true,
            ],
        ];

        foreach ($plans as $plan) {
            StoragePlan::updateOrCreate(
                ['slug' => $plan['slug']],
                $plan
            );
        }
    }
}
