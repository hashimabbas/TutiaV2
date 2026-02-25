<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade'); // Track logged-in user
            $table->string('ip_address', 45)->nullable(); // Store anonymized/hashed IP
            $table->text('user_agent')->nullable();
            $table->text('page_url');
            $table->text('referrer_url')->nullable();
            $table->string('session_id')->nullable()->index(); // To group actions within a session
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visits');
    }
};
