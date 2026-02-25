<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('opportunities', function (Blueprint $table) {
            $table->string('next_step_label')->nullable()->after('notes');
            $table->date('next_step_due_date')->nullable()->after('next_step_label');
        });
    }

    public function down(): void
    {
        Schema::table('opportunities', function (Blueprint $table) {
            $table->dropColumn(['next_step_label', 'next_step_due_date']);
        });
    }
};
