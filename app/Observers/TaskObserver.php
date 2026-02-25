<?php

namespace App\Observers;

use App\Models\Task;
use App\Models\Activity;
use Illuminate\Support\Facades\Auth;

class TaskObserver
{
    /**
     * Handle the Task "created" event.
     */
    public function created(Task $task): void
    {
        $userId = Auth::id() ?? $task->created_by_user_id ?? 1;

        Activity::create([
            'user_id' => $userId,
            'type' => 'task_created',
            'description' => 'Task created: ' . $task->title,
            'source_id' => $task->id,
            'source_type' => Task::class,
            'company_id' => $task->company_id,
            'contact_id' => $task->contact_id,
        ]);
    }

    /**
     * Handle the Task "updated" event (for status/due date changes).
     */
    public function updated(Task $task): void
    {
        $userId = Auth::id() ?? $task->assigned_to_user_id ?? 1;
        $description = '';

        if ($task->isDirty('status') && $task->status === 'completed') {
            $description = "Task marked as **Completed**: " . $task->title;
        } elseif ($task->isDirty('status') && $task->getOriginal('status') === 'completed') {
            $description = "Task marked as **Pending** (reopened): " . $task->title;
        } elseif ($task->isDirty('due_date')) {
            $description = "Due date updated for task: " . $task->title;
        }

        if ($description) {
            Activity::create([
                'user_id' => $userId,
                'type' => 'task_updated',
                'description' => $description,
                'source_id' => $task->id,
                'source_type' => Task::class,
                'company_id' => $task->company_id,
                'contact_id' => $task->contact_id,
            ]);
        }
    }
}
