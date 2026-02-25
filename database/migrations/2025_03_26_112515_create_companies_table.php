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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('website')->nullable();
            $table->text('address')->nullable();

            // --- New Fields Added ---
            $table->string('phone_number')->nullable();
            $table->string('email')->nullable(); // General company email
            $table->string('industry')->nullable();
            $table->string('type')->nullable(); // e.g., Prospect, Customer, Partner
            $table->string('source')->nullable(); // e.g., Website, Referral
            $table->text('description')->nullable();
            $table->integer('number_of_employees')->nullable();
            $table->decimal('annual_revenue', 15, 2)->nullable(); // Example: Up to 999,999,999,999.99
            $table->string('linkedin_url')->nullable();

            // Foreign key for user assignment
            // Assumes you have a 'users' table with an 'id' primary key.
            // onDelete('set null') means if the user is deleted, this company's assigned_user_id will become null.
            // You might choose onDelete('cascade') if a company should be deleted if its owner is deleted,
            // or onDelete('restrict') to prevent user deletion if they own companies. 'set null' is common.
            $table->foreignId('assigned_user_id')->nullable()->constrained('users')->onDelete('set null');
            // --- End New Fields ---

            $table->timestamps();

            // --- Optional: Add Indexes for commonly searched/filtered fields ---
            $table->index('industry');
            $table->index('type');
            $table->index('source');
            $table->index('assigned_user_id');
            // Name is often indexed by default if it's a primary candidate, but explicit is fine.
            // $table->index('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
