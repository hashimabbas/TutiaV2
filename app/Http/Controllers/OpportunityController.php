<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Contact;
use App\Models\LeadSource;
use App\Models\Opportunity;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

use Illuminate\Database\Eloquent\Builder; // Ensure this is imported
use Symfony\Component\HttpFoundation\StreamedResponse; // For export

class OpportunityController extends Controller
{
    /**
     * Display a listing of the resource.
     * This will be the main pipeline view (table or Kanban).
     */
    public function index(Request $request)
    {
        $opportunities = $this->getFilteredOpportunitiesQuery($request) // Use the filtered query
            ->latest()
            ->paginate(15)
            ->withQueryString();

        // Data for Filter Dropdowns
        $users = User::orderBy('name')->get(['id', 'name']);
        $leadSources = LeadSource::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Opportunities/Index', [
            'opportunities' => $opportunities,
            'filters' => $request->only('search', 'stage', 'assigned_user_id', 'source_id'), // Pass all filters
            'filterOptions' => [
                'stages' => Opportunity::getStages(),
                'users' => $users,
                'leadSources' => $leadSources,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Fetch data needed for form dropdowns
        return Inertia::render('Opportunities/Create', [
            'companies' => Company::orderBy('name')->get(['id', 'name']),
            'contacts' => Contact::orderBy('first_name')->orderBy('last_name')->get(['id', 'first_name', 'last_name']),
            'users' => User::orderBy('name')->get(['id', 'name']),
            'leadSources' => LeadSource::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * In a larger app, you would move validation to a Form Request class (e.g., StoreOpportunityRequest).
     */
    public function store(Request $request)
    {
        // FIX: Update validation to match the database schema and model
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'company_id' => 'nullable|exists:companies,id',
            'contact_id' => 'nullable|exists:contacts,id',
            'assigned_user_id' => 'nullable|exists:users,id',
            'source_id' => 'nullable|exists:lead_sources,id',
            'value' => 'nullable|numeric|min:0',
            'stage' => ['required', 'string', Rule::in(Opportunity::getStages())],
            'probability' => 'nullable|integer|min:0|max:100',
            'expected_close_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'next_step_label' => 'nullable|string|max:255', // <--- ADDED
            'next_step_due_date' => 'nullable|date', // <--- ADDED
        ]);

        $opportunity = Opportunity::create($validated); // This will now work correctly

        // --- AUTOMATION: Create initial task if stage is 'New Lead' ---
        if ($opportunity->stage === Opportunity::STAGE_NEW_LEAD) {
             Task::create([
                'title' => "Qualify new lead: {$opportunity->title}",
                'description' => "Initial qualification call for new opportunity.",
                'due_date' => now()->addDay(),
                'priority' => 'medium',
                'assigned_to_user_id' => $opportunity->assigned_user_id ?? auth()->id(),
                'opportunity_id' => $opportunity->id,
                'created_by_user_id' => auth()->id(),
                'status' => 'pending',
            ]);
        }
        // --- END AUTOMATION ---

        return Redirect::route('opportunities.index')->with('success', 'Opportunity created.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Opportunity $opportunity)
    {
        // Eager load all relationships for the detail view
        $opportunity->load(['company', 'contact','assignedUser:id,name', 'source']);

        return Inertia::render('Opportunities/Show', [
            'opportunity' => $opportunity,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Opportunity $opportunity)
    {
        return Inertia::render('Opportunities/Edit', [
            'opportunity' => $opportunity,
            'companies' => Company::orderBy('name')->get(['id', 'name']),
            'contacts' => Contact::orderBy('first_name')->orderBy('last_name')->get(['id', 'first_name', 'last_name']),
            'users' => User::orderBy('name')->get(['id', 'name']),
            'leadSources' => LeadSource::orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Opportunity $opportunity)
    {
        // Capture old stage for automation comparison
        $oldStage = $opportunity->stage;

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'company_id' => 'nullable|exists:companies,id',
            'contact_id' => 'nullable|exists:contacts,id',
            'assigned_user_id' => 'nullable|exists:users,id',
            'source_id' => 'nullable|exists:lead_sources,id',
            'value' => 'nullable|numeric|min:0',
            'stage' => ['required', 'string', Rule::in(Opportunity::getStages())],
            'probability' => 'nullable|integer|min:0|max:100',
            'expected_close_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'next_step_label' => 'nullable|string|max:255', // <--- ADDED
            'next_step_due_date' => 'nullable|date', // <--- ADDED
        ]);

        $opportunity->update($validated);

        // --- AUTOMATION: Create a task when stage is updated ---
        if ($validated['stage'] !== $oldStage && $validated['stage'] === Opportunity::STAGE_PROPOSAL_SENT) {
            Task::create([
                'title' => "Follow up on proposal for {$opportunity->title}",
                'description' => "Client sent proposal on " . now()->toDateString() . ". Follow up to ensure receipt and schedule a review call.",
                'due_date' => now()->addDays(5), // Due in 5 days
                'priority' => 'medium',
                'assigned_to_user_id' => $opportunity->assigned_user_id ?? auth()->id(),
                'opportunity_id' => $opportunity->id,
                'created_by_user_id' => auth()->id(),
                'status' => 'pending',
            ]);
        }
        // --- END AUTOMATION ---

        return Redirect::route('opportunities.show', $opportunity)->with('success', 'Opportunity updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Opportunity $opportunity)
    {
        $opportunity->delete();

        return Redirect::route('opportunities.index')->with('success', 'Opportunity deleted.');
    }
    /**
     * Export opportunities to a CSV file.
     */
        /**
     * Export opportunities to a CSV file.
     */
    public function export()
    {
        $filename = "opportunities-" . now()->format('Y-m-d') . ".csv";
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        $callback = function () {
            $handle = fopen('php://output', 'w');

            // Header row
            fputcsv($handle, [
                'title', 'description', 'stage', 'value', 'probability', 'expected_close_date',
                'company_name', 'contact_full_name', 'assigned_user_name', 'source_name', 'notes'
            ]);

            Opportunity::with(['company', 'contact', 'assignedUser', 'source'])->chunk(200, function ($opportunities) use ($handle) {
                foreach ($opportunities as $opportunity) {
                    fputcsv($handle, [
                        $opportunity->title,
                        $opportunity->description,
                        $opportunity->stage,
                        $opportunity->value,
                        $opportunity->probability,
                        $opportunity->expected_close_date ? $opportunity->expected_close_date->format('Y-m-d') : '',

                        // --- THE FIX IS HERE ---
                        // Use optional chaining (?->) to prevent errors if a relationship is null
                        $opportunity->company?->name,
                        $opportunity->contact ? $opportunity->contact->first_name . ' ' . $opportunity->contact->last_name : '', // This one was already safe
                        $opportunity->assignedUser?->name,
                        $opportunity->source?->name,

                        $opportunity->notes,
                    ]);
                }
            });

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Show the form for importing opportunities.
     */
    public function showImportForm()
    {
        return Inertia::render('Opportunities/Import');
    }

    /**
     * Download a CSV template for importing opportunities.
     */
    public function downloadTemplate()
    {
        $filename = "opportunities-import-template.csv";
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function () {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, [
                'title', 'description', 'stage', 'value', 'probability', 'expected_close_date',
                'company_name', 'contact_full_name', 'assigned_user_name', 'source_name', 'notes'
            ]);
            // Add an example row
            fputcsv($handle, [
                'New Website for Acme Inc.', 'Full redesign of their corporate website.', 'Proposal Sent', '15000.00', '75', '2024-12-31',
                'Acme Inc.', 'John Doe', 'Sales Rep', 'Referral', 'Met John at a conference. He is the main decision maker.'
            ]);
            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Handle the import of opportunities from a CSV file.
     */
    public function handleImport(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt'
        ]);

        $file = $request->file('file');
        $path = $file->getRealPath();
        $records = array_map('str_getcsv', file($path));
        $headers = array_shift($records); // Remove header row

        $createdCount = 0;
        $errors = [];

        foreach ($records as $index => $row) {
            if (count($headers) !== count($row)) {
                $errors[] = "Row " . ($index + 2) . ": Column count does not match header count.";
                continue;
            }
            $rowData = array_combine($headers, $row);
            $rowNumber = $index + 2; // +1 for 0-based index, +1 for header row

            // --- Data Lookups ---
            $company = $rowData['company_name'] ? Company::where('name', $rowData['company_name'])->first() : null;
            $user = $rowData['assigned_user_name'] ? User::where('name', $rowData['assigned_user_name'])->first() : null;
            $source = $rowData['source_name'] ? LeadSource::where('name', $rowData['source_name'])->first() : null;

            // Contact lookup is tricky. Split full name.
            $contact = null;
            if (!empty($rowData['contact_full_name'])) {
                $nameParts = explode(' ', $rowData['contact_full_name'], 2);
                $firstName = $nameParts[0];
                $lastName = $nameParts[1] ?? '';
                $contact = Contact::where('first_name', $firstName)->where('last_name', $lastName)->first();
            }

            // --- Prepare data for validation ---
            $dataToValidate = [
                'title' => $rowData['title'] ?? null,
                'description' => $rowData['description'] ?? null,
                'stage' => $rowData['stage'] ?? null,
                'value' => $rowData['value'] ? (float) $rowData['value'] : null,
                'probability' => $rowData['probability'] ? (int) $rowData['probability'] : null,
                'expected_close_date' => $rowData['expected_close_date'] ?: null,
                'company_id' => $company->id ?? null,
                'contact_id' => $contact->id ?? null,
                'assigned_user_id' => $user->id ?? null,
                'source_id' => $source->id ?? null,
                'notes' => $rowData['notes'] ?? null,
            ];

            // --- Validation ---
            $validator = Validator::make($dataToValidate, [
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'stage' => ['required', 'string', Rule::in(Opportunity::getStages())],
                'value' => 'nullable|numeric|min:0',
                'probability' => 'nullable|integer|min:0|max:100',
                'expected_close_date' => 'nullable|date_format:Y-m-d',
                'company_id' => 'nullable|exists:companies,id',
                'contact_id' => 'nullable|exists:contacts,id',
                'assigned_user_id' => 'nullable|exists:users,id',
                'source_id' => 'nullable|exists:lead_sources,id',
                'notes' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                $errors[] = "Row $rowNumber: " . implode(', ', $validator->errors()->all());
                continue;
            }

            // --- Add additional checks for lookups ---
            if ($rowData['company_name'] && !$company) {
                $errors[] = "Row $rowNumber: Company '{$rowData['company_name']}' not found.";
                continue;
            }
            if ($rowData['contact_full_name'] && !$contact) {
                $errors[] = "Row $rowNumber: Contact '{$rowData['contact_full_name']}' not found.";
                continue;
            }
            if ($rowData['assigned_user_name'] && !$user) {
                $errors[] = "Row $rowNumber: User '{$rowData['assigned_user_name']}' not found.";
                continue;
            }
            if ($rowData['source_name'] && !$source) {
                $errors[] = "Row $rowNumber: Lead Source '{$rowData['source_name']}' not found.";
                continue;
            }

            Opportunity::create($validator->validated());
            $createdCount++;
        }

        $message = "Successfully imported $createdCount opportunities.";
        if (!empty($errors)) {
            $message .= " However, some rows had issues.";
            return Redirect::back()->with('success', $message)->withErrors(['import_errors' => $errors]);
        }

        return Redirect::route('opportunities.index')->with('success', $message);
    }

    // --- Helper to get the base query with filters applied ---
    private function getFilteredOpportunitiesQuery(Request $request): Builder
    {
        return Opportunity::query()
            ->with(['company:id,name', 'contact:id,first_name,last_name', 'assignedUser:id,name', 'source:id,name'])
            ->when($request->input('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhereHas('company', fn($q) => $q->where('name', 'like', "%{$search}%"));
            })
            ->when($request->input('stage'), function ($query, $stage) {
                $query->where('stage', $stage);
            })
            ->when($request->input('assigned_user_id'), function ($query, $userId) {
                $query->where('assigned_user_id', $userId);
            })
            ->when($request->input('source_id'), function ($query, $sourceId) {
                $query->where('source_id', $sourceId);
            });
    }
}
