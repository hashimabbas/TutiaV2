<?php
// app/Models/Promotion.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\App;

class Promotion extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'title_ar', 'slug', 'description', 'description_ar',
        'value', 'currency', 'discount_percentage', 'start_date', 'end_date',
        'is_active', 'image', 'code', 'usage_limit', 'usage_count', 'user_usage_limit',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean',
        'value' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'usage_limit' => 'integer',
        'usage_count' => 'integer',
        'user_usage_limit' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($promotion) {
            if (empty($promotion->slug)) {
                $slugBase = Str::slug($promotion->title ?: 'promotion-' . Str::random(5));
                $slug = $slugBase;
                $count = 1;
                while (static::where('slug', $slug)->exists()) {
                    $slug = $slugBase . '-' . $count++;
                }
                $promotion->slug = $slug;
            }
            if (empty($promotion->currency)) {
                $promotion->currency = config('app.default_currency', 'SAR');
            }
        });
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

    // Scope to get active public promotions
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
