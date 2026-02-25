<?php

namespace App\Models;

// 1. IMPORT THE CORRECT MODEL
use App\Models\Opportunity; // <--- ADD THIS
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LeadSource extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description'
    ];

    /**
     * Get all of the opportunities that originated from this source.
     *
     * 2. RENAME AND FIX THE RELATIONSHIP
     */
    public function opportunities(): HasMany // <--- RENAMED from 'leads' to 'opportunities'
    {
        // 3. POINT TO THE CORRECT MODEL
        return $this->hasMany(Opportunity::class, 'source_id'); // <--- CHANGED from Lead::class
    }
}
