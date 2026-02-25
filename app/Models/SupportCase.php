<?php
// In app/Models/SupportCase.php (Renamed from Case.php)

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SupportCase extends Model // <-- Renamed to SupportCase
{
    use HasFactory;

    // IMPORTANT: Tell Laravel the custom table name
    protected $table = 'support_cases';

    protected $fillable = [
        'subject', 'description', 'company_id', 'contact_id',
        'assigned_user_id', 'created_by_user_id', 'status',
        'priority', 'due_date', 'resolution_date', 'reference_number',
        'product_or_service',
    ];

    protected $casts = [
        'due_date' => 'datetime',
        'resolution_date' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        // Auto-generate reference number on creation
        static::creating(function ($case) {
            if (empty($case->reference_number)) {
                 // Reference number uses 'SC' for SupportCase
                 $lastId = static::max('id') ?? 0;
                 $case->reference_number = 'SC-' . str_pad($lastId + 1, 5, '0', STR_PAD_LEFT);
            }
            if (empty($case->created_by_user_id)) {
                 $case->created_by_user_id = auth()->id();
            }
        });
    }

    // Relationships (method names are fine)
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

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }
}
