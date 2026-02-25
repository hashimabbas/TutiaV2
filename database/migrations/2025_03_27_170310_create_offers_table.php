<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Offer; // Import your Offer model if using constants for defaults

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('offers', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('title_ar')->nullable();
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->text('description_ar')->nullable();

            $table->string('status')->default(Offer::STATUS_DRAFT)->index();
            $table->decimal('value', 15, 2)->nullable();
            $table->string('currency', 3)->default('SAR');
            $table->unsignedTinyInteger('probability')->nullable();
            $table->date('expected_close_date')->nullable();
            $table->date('actual_close_date')->nullable();
            $table->string('offer_type')->default(Offer::TYPE_PROMOTION)->index();
            $table->text('notes')->nullable();

            $table->decimal('discount_percentage', 5, 2)->nullable();
            $table->timestamp('start_date')->nullable();
            $table->timestamp('end_date')->nullable();
            $table->boolean('is_active')->default(true);

            $table->string('code', 50)->nullable()->unique();
            $table->integer('usage_limit')->nullable();
            $table->integer('usage_count')->default(0);
            $table->integer('user_usage_limit')->nullable();

            $table->string('image')->nullable();

            // Define the columns BUT NOT THE CONSTRAINTS YET
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('contact_id')->nullable();
            $table->unsignedBigInteger('assigned_user_id')->nullable();

            $table->timestamps();
        });

        Schema::create('offer_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('offer_id')->constrained('offers')->onDelete('cascade');
            $table->unsignedBigInteger('product_id')->nullable(); // Define column first
            // If you have a products table, add its FK in the new migration too.
            // $table->foreign('product_id')->references('id')->on('products')->onDelete('set null');

            $table->string('service_name');
            $table->text('description')->nullable();
            $table->decimal('quantity', 10, 2)->default(1);
            $table->decimal('unit_price', 15, 2);
            $table->decimal('discount_percentage', 5, 2)->nullable();
            $table->decimal('discount_amount', 15, 2)->nullable();
            $table->decimal('tax_rate', 7, 4)->nullable();
            $table->decimal('total_price', 15, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offer_items');
        Schema::dropIfExists('offers');
    }
};
