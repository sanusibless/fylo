<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('uploaded_files', function (Blueprint $table) {
            $table->foreignId('folder_id')->nullable()->after('user_id')->constrained('folders')->nullOnDelete();
            $table->string('share_token', 64)->nullable()->unique()->after('downloads');
            $table->string('share_password')->nullable()->after('share_token');
            $table->timestamp('share_expires_at')->nullable()->after('share_password');
            $table->boolean('is_public')->default(false)->after('share_expires_at');
        });
    }

    public function down(): void
    {
        Schema::table('uploaded_files', function (Blueprint $table) {
            $table->dropForeign(['folder_id']);
            $table->dropColumn(['folder_id', 'share_token', 'share_password', 'share_expires_at', 'is_public']);
        });
    }
};
