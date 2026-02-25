<?php
// app/Models/Offer.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\App;

class Offer extends Model
{
    use HasFactory;

    // Define potential statuses for an offer in a CRM
    public const STATUS_DRAFT = 'draft';
    public const STATUS_PROPOSED = 'proposed'; // or 'Sent'
    public const STATUS_ACCEPTED = 'accepted'; // or 'Won'
    public const STATUS_REJECTED = 'rejected'; // or 'Lost'
    public const STATUS_EXPIRED = 'expired';
    public const STATUS_WITHDRAWN = 'withdrawn';

    // Define potential types for an offer
    public const TYPE_PROMOTION = 'promotion'; // For Maristan style public offers
    public const TYPE_QUOTE = 'quote';
    public const TYPE_PROPOSAL = 'proposal';
    public const TYPE_SERVICE_PACKAGE = 'service_package';


    protected $fillable = [
        'title',            // Name of the offer/quote
        'title_ar',         // Arabic title
        'slug',             // URL-friendly slug
        'description',      // Detailed description (can be for internal or client)
        'description_ar',   // Arabic description
        'status',           // CRM status (e.g., draft, proposed, accepted, rejected)
        'value',            // Monetary value of the offer
        'currency',         // e.g., USD, EUR, SAR (default can be set in config)
        'probability',      // Likelihood of winning (0-100%)
        'expected_close_date', // When this deal is expected to close
        'actual_close_date',   // When the deal actually closed (won/lost)
        'offer_type',       // e.g., 'Promotion', 'Quote', 'Service Package'
        'notes',            // Internal notes for the CRM user

        'company_id',       // Link to a Company
        'contact_id',       // Link to a specific Contact (can be null if offer is for company level)
        'assigned_user_id', // CRM user responsible for this offer

        // Fields from your original Maristan offer
        'discount_percentage', // Still useful for promotions or overall discount
        'start_date',       // When the offer/promotion becomes valid
        'end_date',         // When the offer/promotion expires
        'is_active',        // For public promotions: is it visible/usable?
        'image',            // Image for the promotion

        // For redeemable codes (from your Maristan applyOffer logic)
        'code',             // Unique code for redeeming the offer
        'usage_limit',      // How many times this offer code can be used overall
        'usage_count',      // How many times it has been used
        'user_usage_limit', // How many times a single user/contact can use this offer (optional)
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'expected_close_date' => 'date',
        'actual_close_date' => 'date',
        'is_active' => 'boolean',
        'value' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'probability' => 'integer',
        'usage_limit' => 'integer',
        'usage_count' => 'integer',
        'user_usage_limit' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($offer) {
            // Generate slug if not provided
            if (empty($offer->slug)) {
                $slugBase = Str::slug($offer->title ?: 'offer-' . Str::random(5)); // Default to English title or random
                $slug = $slugBase;
                $count = 1;
                while (static::where('slug', $slug)->exists()) {
                    $slug = $slugBase . '-' . $count++;
                }
                $offer->slug = $slug;
            }

            // Default status if not set
            if (empty($offer->status)) {
                $offer->status = self::STATUS_DRAFT;
            }

            // Default currency if not set (you might want to get this from config)
            if (empty($offer->currency)) {
                $offer->currency = 'SAR'; // Example, change as needed
            }
        });
    }

    // Relationships
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    /**
     * An offer can have many line items (products/services).
     */
    public function items(): HasMany
    {
        return $this->hasMany(OfferItem::class); // We'll create this model next
    }

    // Accessors for localized fields
    public function getTitleAttribute($value)
    {
        if (App::getLocale() === 'ar' && !empty($this->attributes['title_ar'])) {
            return $this->attributes['title_ar'];
        }
        return $this->attributes['title'] ?? $value; // Fallback to raw title if title_en is not set
    }

    public function getDescriptionAttribute($value)
    {
        if (App::getLocale() === 'ar' && !empty($this->attributes['description_ar'])) {
            return $this->attributes['description_ar'];
        }
        return $this->attributes['description'] ?? $value; // Fallback to raw description
    }

    // Scope to get active public promotions (like your Maristan offers)
    public function scopeActivePublic($query)
    {
        $now = now();
        return $query->where('is_active', true)
            ->where(function ($q) use ($now) {
                $q->whereNull('start_date')
                    ->orWhere('start_date', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', $now);
            })
            ->where(function ($q) {
                $q->whereNull('usage_limit')
                    ->orWhereRaw('usage_count < usage_limit');
            });
    }
}
