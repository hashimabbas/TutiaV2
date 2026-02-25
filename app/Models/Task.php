<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'due_date',
        'status',
        'priority',
        'assigned_to_user_id',
        'created_by_user_id',
        'opportunity_id',
        'contact_id',
        'company_id',
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    // --- Relationships ---

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to_user_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function opportunity(): BelongsTo
    {
        return $this->belongsTo(Opportunity::class);
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    // In app/Models/Task.php

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query->when($filters['status'] ?? null, function ($query, $status) {
            $query->where('status', $status);
        })->when($filters['priority'] ?? null, function ($query, $priority) {
            $query->where('priority', $priority);
        })->when($filters['due'] ?? null, function ($query, $due) {
            if ($due === 'today') {
                $query->whereDate('due_date', today());
            } elseif ($due === 'overdue') {
                $query->where('status', 'pending')->whereDate('due_date', '<', today());
            }
        })
        // Filter for tasks assigned to the logged-in user
        // THIS IS THE CORRECTED LINE
        ->when(($filters['assigned_to'] ?? null) === 'me', function ($query) {
            $query->where('assigned_to_user_id', auth()->id());
        });
    }
}
