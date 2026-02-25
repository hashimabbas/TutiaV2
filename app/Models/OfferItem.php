<?php
// app/Models/OfferItem.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OfferItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'offer_id', // Renamed from crm_offer_id for simplicity but points to CrmOffer
        'product_id',
        'service_name',
        'description',
        'quantity',
        'unit_price',
        'discount_percentage',
        'discount_amount',
        'tax_rate',
        'total_price',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'tax_rate' => 'decimal:4',
        'total_price' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();
        static::saving(function ($item) {
            $basePrice = $item->quantity * $item->unit_price;
            $discount = 0;

            if (!is_null($item->discount_percentage) && $item->discount_percentage > 0) {
                $discount = $basePrice * ($item->discount_percentage / 100);
            } elseif (!is_null($item->discount_amount) && $item->discount_amount > 0) {
                $discount = $item->discount_amount;
            }

            $priceAfterDiscount = $basePrice - $discount;
            $taxAmount = 0;

            if (!is_null($item->tax_rate) && $item->tax_rate > 0) {
                $taxAmount = $priceAfterDiscount * $item->tax_rate;
            }

            $item->total_price = $priceAfterDiscount + $taxAmount;
        });
    }

    public function offer(): BelongsTo // This is the relationship that needs to point to CrmOffer
    {
        return $this->belongsTo(CrmOffer::class); // Changed from Offer::class
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
