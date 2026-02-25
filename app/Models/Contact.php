<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder; // Import Builder
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Traits\CheckForDuplicates;

class Contact extends Model
{
    use HasFactory, CheckForDuplicates;

    protected $fillable = [
        'first_name', 'last_name', 'email', 'phone', 'job_title', 'company_id',
        'linkedin_profile_url', 'mobile_phone', 'department', 'description',
        'source', 'status', 'last_contacted_at', 'assigned_user_id',
        'next_followup_date' // <--- ADDED
    ];

    protected $casts = [
        'last_contacted_at' => 'datetime',
        'next_followup_date' => 'date' // <--- ADDED
    ];

    protected $appends = ['full_name'];

    /**
     * Apply all relevant filters to the query.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  array  $filters
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  // Search by company name
                  ->orWhereHas('company', fn($q) => $q->where('name', 'like', "%{$search}%"));
            });
        })->when($filters['status'] ?? null, function ($query, $status) {
            $query->where('status', $status);
        })->when($filters['company_id'] ?? null, function ($query, $companyId) {
            $query->where('company_id', $companyId);
        });
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_user_id');
    }

    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

     // --- NEW RELATIONSHIP ---
    public function supportCases(): HasMany
    {
        return $this->hasMany(SupportCase::class);
    }
    // --- END NEW RELATIONSHIP ---
}
