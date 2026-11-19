<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(StoragePlanSeeder::class);

        User::firstOrCreate(
            ['email' => 'admin@fylo.ng'],
            [
                'name' => 'Amina Danjuma (Admin)',
                'phone' => '+234 9 291 0482',
                'is_admin' => true,
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Chinedu Okafor',
                'phone' => '+234 803 555 0192',
                'is_admin' => false,
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
    }
}
