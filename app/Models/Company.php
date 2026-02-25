<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder; // Import Builder
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\CheckForDuplicates;

class Company extends Model
{
    use HasFactory, CheckForDuplicates;

    protected $fillable = [
        'name',
        'website',
        'address',
        'phone_number',
        'email',
        'industry',
        'type',
        'lead_source_id',
        'description',
        'number_of_employees',
        'annual_revenue',
        'linkedin_url',
        'assigned_user_id',
    ];

    protected $casts = [
        'annual_revenue' => 'decimal:2',
        'number_of_employees' => 'integer',
    ];

    /**
     * Apply all relevant filters.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  array  $filters
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        // CORRECTED: Remove `?? null`.
        // The `when` helper will now only run the closure if the filter value is "truthy"
        // (i.e., not null, not an empty string, not false, not 0). This is exactly what we want.
        return $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('name', 'like', '%'.$search.'%')
                      ->orWhere('email', 'like', '%'.$search.'%')
                      ->orWhere('website', 'like', '%'.$search.'%');
            });
        })->when($filters['industry'] ?? null, function ($query, $industry) {
            $query->where('industry', $industry);
        })->when($filters['type'] ?? null, function ($query, $type) {
            $query->where('type', $type);
        });
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class);
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    public function supportCases(): HasMany
    {
        return $this->hasMany(SupportCase::class);
    }

    public function leadSource(): BelongsTo
    {
        return $this->belongsTo(LeadSource::class);
    }
}
