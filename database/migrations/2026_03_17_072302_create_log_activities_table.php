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
        Schema::create('log_activities', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('donor_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->foreignId('leave_type_id')
                ->nullable()
                ->constrained('leave_types')
                ->nullOnDelete();

            $table->date('date');
            $table->string('task');
            $table->string('project')->nullable();

            $table->decimal('hours', 5, 2);
            $table->text('remarks')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('log_activities');
    }
};
