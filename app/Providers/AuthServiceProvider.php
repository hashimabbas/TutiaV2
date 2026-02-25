<?php
// In app/Providers/AuthServiceProvider.php

use Illuminate\Support\Facades\Gate; // <-- Ensure Gate is imported
use App\Models\User; // <-- Ensure User is imported
// ... existing imports ...

class AuthServiceProvider extends ServiceProvider
{
    // ... existing policies ...

    public function boot(): void
    {
        // Define a Gate for managing users/admin sections
        Gate::define('manage-users', function (User $user) {
            // Check the new database column
            return $user->is_admin;
        });

        // Example for controlling access to a specific record (Task)
        // Gate::define('view-task', function (User $user, Task $task) {
        //     return $user->is_admin || $user->id === $task->assigned_to_user_id;
        // });
    }
}
