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
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name')->nullable();
            $table->string('email')->unique()->nullable(); // Unique constraint implies an index
            $table->string('phone')->nullable();
            $table->string('mobile_phone')->nullable();
            $table->string('job_title')->nullable();
            $table->string('department')->nullable();
            $table->string('linkedin_profile_url')->nullable();

            // Foreign key for company
            $table->foreignId('company_id')->nullable()->constrained('companies')->onDelete('set null');

            $table->text('description')->nullable();
            $table->string('source')->nullable(); // How the contact was acquired
            $table->string('status')->nullable(); // e.g., Lead, Qualified, Nurturing
            $table->timestamp('last_contacted_at')->nullable();

            // Foreign key for user assignment
            $table->foreignId('assigned_user_id')->nullable()->constrained('users')->onDelete('set null');

            $table->timestamps(); // Adds created_at and updated_at

            // Define additional indexes if needed (beyond what unique() and constrained() provide)
            $table->index('status');
            $table->index('source');
            // assigned_user_id and company_id will already have indexes due to constrained()
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
