<?php
// app/Models/CrmOffer.php (formerly Offer.php)

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\App;

class CrmOffer extends Model // Renamed from Offer
{
    use HasFactory;

    protected $table = 'crm_offers'; // Explicitly set the new table name

    // CRM Offer Statuses (can be same as before)
    public const STATUS_DRAFT = 'draft';
    public const STATUS_PROPOSED = 'proposed';
    public const STATUS_ACCEPTED = 'accepted';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_EXPIRED = 'expired';
    public const STATUS_WITHDRAWN = 'withdrawn';

    // CRM Offer Types (promotion type moved to Promotion model)
    public const TYPE_QUOTE = 'quote';
    public const TYPE_PROPOSAL = 'proposal';
    public const TYPE_SERVICE_PACKAGE = 'service_package';

    protected $fillable = [
        'title', 'title_ar', 'slug', 'description', 'description_ar',
        'status', 'value', 'currency', 'probability', 'expected_close_date', 'actual_close_date',
        'offer_type', // This remains to distinguish CRM types (quote, proposal, package)
        'notes', 'company_id', 'contact_id', 'assigned_user_id',
        // Removed all promotion-specific fields
    ];

    protected $casts = [
        'expected_close_date' => 'date',
        'actual_close_date' => 'date',
        'value' => 'decimal:2',
        'probability' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($crmOffer) { // Changed variable name to crmOffer
            if (empty($crmOffer->slug)) {
                $slugBase = Str::slug($crmOffer->title ?: 'crm-offer-' . Str::random(5));
                $slug = $slugBase;
                $count = 1;
                while (static::where('slug', $slug)->exists()) {
                    $slug = $slugBase . '-' . $count++;
                }
                $crmOffer->slug = $slug;
            }
            if (empty($crmOffer->status)) {
                $crmOffer->status = self::STATUS_DRAFT;
            }
            if (empty($crmOffer->currency)) {
                $crmOffer->currency = config('app.default_currency', 'SAR');
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

    public function items(): HasMany
    {
        // Explicitly specify the foreign key column name as 'offer_id'
        // because the column name in the database table 'offer_items' is still 'offer_id',
        // not the default 'crm_offer_id' Laravel would infer.
        return $this->hasMany(OfferItem::class, 'offer_id');
    }

    // Accessors for localized fields
    public function getTitleAttribute($value)
    {
        if (App::getLocale() === 'ar' && !empty($this->attributes['title_ar'])) {
            return $this->attributes['title_ar'];
        }
        return $this->attributes['title'] ?? $value;
    }

    public function getDescriptionAttribute($value)
    {
        if (App::getLocale() === 'ar' && !empty($this->attributes['description_ar'])) {
            return $this->attributes['description_ar'];
        }
        return $this->attributes['description'] ?? $value;
    }


}
