<?php

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
        Schema::create('users', function (Blueprint $table) {

            $table->id();

            // Basic info
            $table->string('name');
            $table->string('email')->unique()->index();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');

            // Profile
            $table->string('image')->nullable();

            // Role & organization info
            $table->enum('role', ['admin', 'manager', 'staff'])
                ->default('staff')
                ->index();

            $table->string('program')->nullable();
            $table->string('position')->nullable();

            $table->enum('gender', ['male', 'female'])->nullable();
            $table->timestamp('last_log_reminder_sent_at')->nullable();

            // Security
            $table->rememberToken();

            // System
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
