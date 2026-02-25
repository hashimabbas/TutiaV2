<?php

namespace App\Observers;

use App\Models\Opportunity;
use App\Models\Activity;
use Illuminate\Support\Facades\Auth;

class OpportunityObserver
{
    /**
     * Handle the Opportunity "updated" event (for stage changes).
     */
    public function updated(Opportunity $opportunity): void
    {
        $userId = Auth::id() ?? 1;
        // Only log if the 'stage' attribute was changed
        if ($opportunity->isDirty('stage')) {
            Activity::create([
                'user_id' => $userId,
                'type' => 'stage_change',
                'description' => 'Stage changed from ' . $opportunity->getOriginal('stage') . ' to ' . $opportunity->stage,
                'source_id' => $opportunity->id,
                'source_type' => Opportunity::class,
                'company_id' => $opportunity->company_id,
                'contact_id' => $opportunity->contact_id,
            ]);
        }
    }

    /**
     * Handle the Opportunity "created" event.
     */
    public function created(Opportunity $opportunity): void
    {
        Activity::create([
            'user_id' => Auth::id(),
            'type' => 'opportunity_created',
            'description' => 'New opportunity created: ' . $opportunity->title,
            'source_id' => $opportunity->id,
            'source_type' => Opportunity::class,
            'company_id' => $opportunity->company_id,
            'contact_id' => $opportunity->contact_id,
        ]);
    }
}
