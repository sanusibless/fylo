<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('uploaded_files', function (Blueprint $table) {
            if (! Schema::hasColumn('uploaded_files', 'mime_type')) {
                $table->string('mime_type')->nullable()->after('type');
            }
            if (! Schema::hasColumn('uploaded_files', 'extension')) {
                $table->string('extension', 20)->nullable()->after('mime_type');
            }
            if (! Schema::hasColumn('uploaded_files', 'storage_disk')) {
                $table->string('storage_disk', 30)->default('local')->after('relative_path');
            }
        });

        // Add helpful indexes for performance
        Schema::table('uploaded_files', function (Blueprint $table) {
            $table->index(['user_id', 'deleted_at']);
            $table->index(['user_id', 'folder_id']);
            $table->index(['user_id', 'is_favorite']);
        });

        Schema::table('folders', function (Blueprint $table) {
            $table->index(['user_id', 'parent_id', 'deleted_at']);
        });

        Schema::table('shared_files', function (Blueprint $table) {
            $table->index(['receiver_id']);
            $table->index(['file_id', 'receiver_id']);
        });

        // Update any legacy USD currencies in storage_plans or payments to NGN
        DB::table('storage_plans')->where('currency', 'USD')->update(['currency' => 'NGN']);
        DB::table('payments')->where('currency', 'USD')->update(['currency' => 'NGN']);
    }

    public function down(): void
    {
        Schema::table('uploaded_files', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'deleted_at']);
            $table->dropIndex(['user_id', 'folder_id']);
            $table->dropIndex(['user_id', 'is_favorite']);
            $table->dropColumn(['mime_type', 'extension', 'storage_disk']);
        });

        Schema::table('folders', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'parent_id', 'deleted_at']);
        });

        Schema::table('shared_files', function (Blueprint $table) {
            $table->dropIndex(['receiver_id']);
            $table->dropIndex(['file_id', 'receiver_id']);
        });
    }
};
