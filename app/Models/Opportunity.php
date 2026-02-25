<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Opportunity extends Model
{
    use HasFactory;

    public const STAGE_NEW_LEAD = 'New Lead';
    public const STAGE_QUALIFICATION = 'Qualification';
    public const STAGE_NEEDS_ANALYSIS = 'Needs Analysis';
    public const STAGE_PROPOSAL_SENT = 'Proposal Sent';
    public const STAGE_NEGOTIATION = 'Negotiation';
    public const STAGE_WON = 'Won';
    public const STAGE_LOST = 'Lost';

    public static function getStages(): array
    {
        return [
            self::STAGE_NEW_LEAD,
            self::STAGE_QUALIFICATION,
            self::STAGE_NEEDS_ANALYSIS,
            self::STAGE_PROPOSAL_SENT,
            self::STAGE_NEGOTIATION,
            self::STAGE_WON,
            self::STAGE_LOST,
        ];
    }

    // FIX: Add 'source_id' to fillable properties
    protected $fillable = [
        'title',
        'description',
        'stage',
        'value',
        'probability',
        'expected_close_date',
        'company_id',
        'contact_id',
        'assigned_user_id',
        'source_id',
        'notes',
        'next_step_label', // <--- ADDED
        'next_step_due_date' // <--- ADDED
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'probability' => 'integer',
        'expected_close_date' => 'date',
        'next_step_due_date' => 'date' // <--- CORRECTED: Changed 'data' to 'date'
    ];

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

    // In app/Models/Opportunity.php

    // This is the CORRECT line (it explicitly defines the foreign key)
    public function source(): BelongsTo
    {
        // The second argument specifies the foreign key name.
        return $this->belongsTo(LeadSource::class, 'source_id');
    }
}
