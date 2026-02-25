<?php
// database/migrations/YYYY_MM_DD_HHMMSS_rename_offers_to_crm_offers_and_refine_schema.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\CrmOffer; // Will be the new model name
use App\Models\Offer; // Old model name for constants

return new class extends Migration
{
    public function up(): void
    {
        // First, rename the table
        Schema::rename('offers', 'crm_offers');

        // Then, modify the columns
        Schema::table('crm_offers', function (Blueprint $table) {
            // Drop columns that are now specific to promotions
            $table->dropColumn([
                'discount_percentage',
                'start_date',
                'end_date',
                'is_active',
                'image',
                'code',
                'usage_limit',
                'usage_count',
                'user_usage_limit',
            ]);

            // Drop the offer_type column as it's now implicit (CRM specific types)
            $table->dropColumn('offer_type');

            // Add the offer_type column back with CRM-specific types as default
            // This is if you still want to differentiate between 'quote', 'proposal', 'service_package' within CRM
            $table->string('offer_type')->default(\App\Models\CrmOffer::TYPE_QUOTE)->after('actual_close_date');
        });
    }

    public function down(): void
    {
        // Revert column changes first
        Schema::table('crm_offers', function (Blueprint $table) {
            $table->decimal('discount_percentage', 5, 2)->nullable();
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('image')->nullable();
            $table->string('code', 50)->nullable()->unique();
            $table->integer('usage_limit')->nullable();
            $table->integer('usage_count')->default(0);
            $table->integer('user_usage_limit')->nullable();
            $table->string('offer_type')->default(\App\Models\Offer::TYPE_PROMOTION); // Old default
        });
        // Then, rename the table back
        Schema::rename('crm_offers', 'offers');
    }
};
