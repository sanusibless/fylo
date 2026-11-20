<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('storage_plans', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('name');
            $table->decimal('price_monthly', 10, 2)->default(0)->after('capacity');
            $table->decimal('price_yearly', 10, 2)->default(0)->after('price_monthly');
            $table->string('currency')->default('USD')->after('price_yearly');
            $table->text('description')->nullable()->after('currency');
            $table->text('features')->nullable()->after('description');
            $table->integer('max_file_size_mb')->default(50)->after('features');
            $table->boolean('is_popular')->default(false)->after('max_file_size_mb');
            $table->boolean('is_active')->default(true)->after('is_popular');
        });
    }

    public function down(): void
    {
        Schema::table('storage_plans', function (Blueprint $table) {
            $table->dropColumn([
                'slug',
                'price_monthly',
                'price_yearly',
                'currency',
                'description',
                'features',
                'max_file_size_mb',
                'is_popular',
                'is_active',
            ]);
        });
    }
};
