<?php
// database/migrations/YYYY_MM_DD_HHMMSS_update_offer_items_foreign_key.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('offer_items', function (Blueprint $table) {
            // Drop the old foreign key constraint
            $table->dropForeign(['offer_id']);
            // Add the new foreign key constraint referencing 'crm_offers'
            $table->foreign('offer_id')->references('id')->on('crm_offers')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('offer_items', function (Blueprint $table) {
            // Revert by dropping the new FK and adding the old one (if 'offers' table still existed)
            $table->dropForeign(['offer_id']);
            // Note: If you renamed 'offers' to 'crm_offers' permanently, this 'down' might need adjustment
            // For now, assuming you might want to revert to a state where 'offers' table still exists with its original name.
            // If the rename is permanent, you might just remove this 'down' or adapt it.
            // $table->foreign('offer_id')->references('id')->on('offers')->onDelete('cascade');
        });
    }
};
