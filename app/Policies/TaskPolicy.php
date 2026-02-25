<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TaskPolicy
{
    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Task $task): bool
    {
        // User can update if they created the task OR if it's assigned to them.
        return $user->id === $task->created_by_user_id || $user->id === $task->assigned_to_user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Task $task): bool
    {
        // For simplicity, we'll use the same logic. You could restrict deletion to just the creator.
        return $user->id === $task->created_by_user_id || $user->id === $task->assigned_to_user_id;
    }
}
