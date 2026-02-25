<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\Opportunity;
use App\Models\Task;
use App\Models\User; // Import the User model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Redirect; // Import Redirect
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class TaskController extends Controller
{

    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Inertia::render('Tasks/Index', [
            'tasks' => Task::with(['contact:id,first_name,last_name', 'opportunity:id,title', 'assignedTo:id,name'])
                ->filter($request->only('status', 'priority', 'due', 'assigned_to'))
                ->latest('due_date')
                ->paginate(20)
                ->withQueryString(),
            'filters' => $request->all('status', 'priority', 'due', 'assigned_to'),

            // --- DATA FOR THE FORM MODAL ---
            'users' => User::orderBy('name')->get(['id', 'name']),
            // Note: For large CRMs, fetching ALL is not ideal.
            // An async search endpoint would be the next step.
            'opportunities' => Opportunity::orderBy('title')->get(['id', 'title']),
            'contacts' => Contact::orderBy('first_name')->get(['id', 'first_name', 'last_name']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'priority' => ['required', Rule::in(['low', 'medium', 'high'])],
            'assigned_to_user_id' => 'required|exists:users,id',
            'opportunity_id' => 'nullable|exists:opportunities,id',
            'contact_id' => 'nullable|exists:contacts,id',
            'company_id' => 'nullable|exists:companies,id',
        ]);

        Auth::user()->createdTasks()->create($validated);

        return back()->with('success', 'Task created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'priority' => ['required', Rule::in(['low', 'medium', 'high'])],
            'assigned_to_user_id' => 'required|exists:users,id',
            'opportunity_id' => 'nullable|exists:opportunities,id',
            'contact_id' => 'nullable|exists:contacts,id',
            'company_id' => 'nullable|exists:companies,id',
        ]);

        $task->update($validated);

        return back()->with('success', 'Task updated successfully.');
    }

    public function show(Task $task)
    {
        // Eager load all relationships for the detail view
        $task->load(['company', 'contact', 'opportunity', 'assignedTo', 'createdBy']);

        return Inertia::render('Tasks/Show', [
            'task' => $task,
            // Pass data needed for the 'Edit' modal form
            'users' => User::orderBy('name')->get(['id', 'name']),
            'opportunities' => Opportunity::orderBy('title')->get(['id', 'title']),
            'contacts' => Contact::orderBy('first_name')->get(['id', 'first_name', 'last_name']),
        ]);
    }
    /**
     * Toggle the completion status of a task.
     */
    public function toggleComplete(Task $task)
    {
        //$this->authorize('update', $task);

        $task->update([
            'status' => $task->status === 'pending' ? 'completed' : 'pending',
        ]);

        $newStatus = $task->status === 'completed' ? 'completed' : 'pending';

        return back()->with('success', "Task marked as {$newStatus}.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $this->authorize('delete', $task);

        $task->delete();

        return back()->with('success', 'Task deleted successfully.');
    }
}
