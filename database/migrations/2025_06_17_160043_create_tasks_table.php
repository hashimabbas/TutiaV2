// database/migrations/xxxx_xx_xx_xxxxxx_create_tasks_table.php

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('due_date')->nullable();
            $table->enum('status', ['pending', 'completed'])->default('pending')->index();
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');

            // --- Relationships ---
            // Who is this task assigned to?
            $table->foreignId('assigned_to_user_id')->constrained('users')->onDelete('cascade');
            // Who created this task?
            $table->foreignId('created_by_user_id')->constrained('users')->onDelete('cascade');

            // --- Contextual Links (What is this task ABOUT?) ---
            $table->foreignId('opportunity_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('contact_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
