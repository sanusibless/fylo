<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('uploaded_files', function (Blueprint $table) {
            $table->id();
            $table->uuid("uuid")->unique();
            $table->foreignIdFor(User::class);
            $table->longText('name');
            $table->string('type');
            $table->decimal('size', 16, 2);
            $table->longText('base_url')->nullable();
            $table->longText('full_path')->nullable();
            $table->longText('relative_path')->nullable();
            $table->boolean('is_favorite')->default(false);
            $table->decimal('downloads', 16, 2)->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('uploaded_files');
    }
};
