<?php

use App\Models\Opportunity;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('opportunities', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();

            // FIX: Let's use the constants from the model we discussed.
            $table->string('stage')->default(Opportunity::STAGE_NEW_LEAD); // More flexible than ENUM

            $table->decimal('value', 15, 2)->nullable(); // FIX: A new lead won't have a value.

            $table->integer('probability')->nullable();
            $table->date('expected_close_date')->nullable();

            // --- CRITICAL FIXES FOR RELATIONSHIPS ---
            // A lead might not have a company.
            // Using 'set null' is safer than 'cascade' for users/sources.
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('cascade'); // Can cascade
            $table->foreignId('contact_id')->nullable()->constrained()->onDelete('cascade'); // Can cascade
            $table->foreignId('assigned_user_id')->nullable()->constrained('users')->onDelete('set null'); // Safer
            $table->foreignId('source_id')->nullable()->constrained('lead_sources')->onDelete('set null'); // Safer

            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('opportunities');
    }
};
