<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_storage_plans', function (Blueprint $table) {
            $table->string('billing_cycle')->default('monthly')->after('storage_plan_id');
            $table->string('status')->default('active')->after('billing_cycle');
            $table->timestamp('starts_at')->nullable()->after('status');
            $table->timestamp('expires_at')->nullable()->after('starts_at');
            $table->boolean('auto_renew')->default(true)->after('expires_at');
        });
    }

    public function down(): void
    {
        Schema::table('user_storage_plans', function (Blueprint $table) {
            $table->dropColumn(['billing_cycle', 'status', 'starts_at', 'expires_at', 'auto_renew']);
        });
    }
};
