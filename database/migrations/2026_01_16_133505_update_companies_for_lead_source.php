<?php

// In database/migrations/YYYY_MM_DD_update_companies_for_lead_source.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            // 1. Drop the old string column
            $table->dropColumn('source');

            // 2. Add the new foreign key column
            $table->foreignId('lead_source_id')
                  ->nullable()
                  ->constrained('lead_sources') // Assumes your LeadSource model uses 'lead_sources' table
                  ->onDelete('set null')
                  ->after('type'); // Place it after 'type' for logical order

            // 3. Update index
            $table->index('lead_source_id');
        });
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropForeign(['lead_source_id']);
            $table->dropIndex(['lead_source_id']);
            $table->dropColumn('lead_source_id');
            // Re-add the old column if you need a clean rollback
            $table->string('source')->nullable();
        });
    }
};
