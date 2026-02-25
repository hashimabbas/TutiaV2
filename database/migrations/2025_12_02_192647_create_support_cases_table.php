<?php

// In database/migrations/YYYY_MM_DD_create_support_cases_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Renamed table from 'cases' to 'support_cases'
        Schema::create('support_cases', function (Blueprint $table) {
            $table->id();
            $table->string('subject');
            $table->text('description')->nullable();

            // Core Relationships
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('contact_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('assigned_user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('created_by_user_id')->constrained('users')->onDelete('cascade');

            // Case-specific Fields
            $table->enum('status', ['New', 'Open', 'In Progress', 'On Hold', 'Resolved', 'Closed'])->default('New');
            $table->enum('priority', ['Low', 'Medium', 'High', 'Critical'])->default('Medium');
            $table->timestamp('due_date')->nullable();
            $table->timestamp('resolution_date')->nullable();
            $table->string('reference_number')->unique();
            $table->string('product_or_service')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('support_cases');
    }
};
