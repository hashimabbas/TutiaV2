<?php

namespace App\Observers;

use App\Models\SupportCase;
use App\Models\Activity;
use Illuminate\Support\Facades\Auth;

class SupportCaseObserver
{
    /**
     * Handle the SupportCase "created" event.
     */
    public function created(SupportCase $case): void
    {
        $userId = Auth::id() ?? $case->created_by_user_id ?? 1;

        Activity::create([
            'user_id' => $userId,
            'type' => 'case_created',
            'description' => 'New Support Case opened: ' . $case->subject,
            'source_id' => $case->id,
            'source_type' => SupportCase::class,
            'company_id' => $case->company_id,
            'contact_id' => $case->contact_id,
        ]);
    }

    /**
     * Handle the SupportCase "updated" event.
     */
    public function updated(SupportCase $case): void
    {
        $userId = Auth::id() ?? $case->assigned_user_id ?? 1;
        $description = '';

        if ($case->isDirty('status')) {
            $description = 'Case **Status Updated** from ' . $case->getOriginal('status') . ' to ' . $case->status;
        } elseif ($case->isDirty('assigned_user_id')) {
            $description = 'Case **Reassigned** to ' . $case->assignedUser->name ?? 'Unassigned';
        }

        if ($description) {
            Activity::create([
                'user_id' => $userId,
                'type' => 'case_updated',
                'description' => $description . ' for Case: ' . $case->reference_number,
                'source_id' => $case->id,
                'source_type' => SupportCase::class,
                'company_id' => $case->company_id,
                'contact_id' => $case->contact_id,
            ]);
        }
    }
}
