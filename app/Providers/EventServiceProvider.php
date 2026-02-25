<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
// Core Laravel imports
use Illuminate\Support\Facades\Event;

// Imports for Observers
use App\Models\Opportunity;
use App\Observers\OpportunityObserver;

// --- Add Observers for other core CRM models for the timeline to work ---
use App\Models\Task;
use App\Observers\TaskObserver; // Assumes you create this observer
use App\Models\SupportCase;
use App\Observers\SupportCaseObserver; // Assumes you create this observer

class EventServiceProvider extends ServiceProvider // <--- CORRECT INHERITANCE
{
    /**
     * The model observers for your application.
     *
     * @var array
     */
    protected $observers = [
        Opportunity::class => [OpportunityObserver::class],
        Task::class => [TaskObserver::class],
        SupportCase::class => [SupportCaseObserver::class],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        // ... any existing logic ...
    }

    // ... (rest of the class) ...
}
