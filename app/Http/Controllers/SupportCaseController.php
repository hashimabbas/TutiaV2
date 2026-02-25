<?php

namespace App\Http\Controllers;

use App\Models\SupportCase;
use App\Models\Company;
use App\Models\Contact;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Database\Eloquent\Builder;

class SupportCaseController extends Controller
{
    /**
     * Helper to get the base query with filters applied.
     */
    private function getFilteredCasesQuery(Request $request): Builder
    {
        return SupportCase::query()
            ->with(['company:id,name', 'assignedUser:id,name'])
            ->when($request->input('search'), function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('subject', 'like', "%{$search}%")
                      ->orWhere('reference_number', 'like', "%{$search}%")
                      ->orWhereHas('company', fn($cq) => $cq->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->input('priority'), function ($query, $priority) {
                $query->where('priority', $priority);
            });
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $cases = $this->getFilteredCasesQuery($request)
            ->latest('updated_at')
            ->paginate(15)
            ->withQueryString();

        // Data for filter dropdowns
        $statuses = ['New', 'Open', 'In Progress', 'On Hold', 'Resolved', 'Closed'];
        $priorities = ['Low', 'Medium', 'High', 'Critical'];

        return Inertia::render('Cases/Index', [
            'cases' => $cases,
            'filters' => $request->only('search', 'status', 'priority'),
            'filterOptions' => compact('statuses', 'priorities'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Data required for form dropdowns
        return Inertia::render('Cases/Create', [
            'companies' => Company::orderBy('name')->get(['id', 'name']),
            'contacts' => Contact::orderBy('first_name')->orderBy('last_name')->get(['id', 'first_name', 'last_name', 'company_id']),
            'users' => User::orderBy('name')->get(['id', 'name']),
            'statuses' => ['New', 'Open', 'In Progress', 'On Hold', 'Resolved', 'Closed'],
            'priorities' => ['Low', 'Medium', 'High', 'Critical'],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $this->validateCaseRequest($request);

        // created_by_user_id is set in the model's boot method
        SupportCase::create($validated);

        return Redirect::route('support_cases.index')->with('success', 'Support Case created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(SupportCase $support_case)
    {
        $support_case->load(['company', 'contact', 'assignedUser', 'createdBy']);

        return Inertia::render('Cases/Show', [
            'case' => $support_case,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SupportCase $support_case)
    {
        return Inertia::render('Cases/Edit', [
            'case' => $support_case,
            'companies' => Company::orderBy('name')->get(['id', 'name']),
            'contacts' => Contact::orderBy('first_name')->orderBy('last_name')->get(['id', 'first_name', 'last_name', 'company_id']),
            'users' => User::orderBy('name')->get(['id', 'name']),
            'statuses' => ['New', 'Open', 'In Progress', 'On Hold', 'Resolved', 'Closed'],
            'priorities' => ['Low', 'Medium', 'High', 'Critical'],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SupportCase $support_case)
    {
        $validated = $this->validateCaseRequest($request);

        // Auto-set resolution_date if status is moving to 'Resolved' or 'Closed'
        if (in_array($validated['status'], ['Resolved', 'Closed']) && is_null($support_case->resolution_date)) {
            $validated['resolution_date'] = now();
        } elseif (!in_array($validated['status'], ['Resolved', 'Closed'])) {
             // Clear resolution date if case is reopened
             $validated['resolution_date'] = null;
        }

        $support_case->update($validated);

        return Redirect::route('support_cases.show', $support_case)->with('success', 'Support Case updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SupportCase $support_case)
    {
        $support_case->delete();

        return Redirect::route('support_cases.index')->with('success', 'Support Case deleted.');
    }

    /**
     * Helper method for common validation rules.
     */
    private function validateCaseRequest(Request $request): array
    {
        return $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'nullable|string',
            'company_id' => 'required|exists:companies,id',
            'contact_id' => 'nullable|exists:contacts,id',
            'assigned_user_id' => 'nullable|exists:users,id',
            'status' => ['required', Rule::in(['New', 'Open', 'In Progress', 'On Hold', 'Resolved', 'Closed'])],
            'priority' => ['required', Rule::in(['Low', 'Medium', 'High', 'Critical'])],
            'due_date' => 'nullable|date',
            'product_or_service' => 'nullable|string|max:255',
        ]);
    }
}
