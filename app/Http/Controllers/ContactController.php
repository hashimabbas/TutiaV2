<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;
use App\Models\Contact;
use App\Models\Company; // Import Company model
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ContactController extends Controller
{
    private function getFilteredContactsQuery(Request $request): Builder
    {
        // Eager load relationships with specific columns for efficiency
        return Contact::with([
                'company:id,name',
                'assignedUser:id,name'
            ])
            ->filter($request->only('search', 'status', 'company_id'));
    }

    public function index(Request $request)
    {
        // This now correctly calls the helper method which uses the scopeFilter.
        // The query is built correctly and efficiently.



        $contacts = $this->getFilteredContactsQuery($request)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        // Data for filter dropdowns
        $companies = Company::orderBy('name')->get(['id', 'name']);
        $statuses = Contact::query()->select('status')->whereNotNull('status')->distinct()->pluck('status');

        return Inertia::render('Contacts/Index', [
            'contacts' => $contacts,
            'filters' => $request->all(['search', 'status', 'company_id']),
            'filterOptions' => [
                'companies' => $companies,
                'statuses' => $statuses,
            ],
        ]);
    }

    // ... (create, store, show, edit, update, destroy methods are fine, but I'll optimize show/edit) ...

    public function show(Contact $contact)
    {
        // Eager load relationships with specific columns for efficiency
        $contact->load(['company:id,name', 'assignedUser:id,name']);
        return Inertia::render('Contacts/Show', [
            'contact' => $contact,
        ]);
    }

    public function edit(Contact $contact)
    {
        $companies = Company::orderBy('name')->get(['id', 'name']);
        $users = User::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Contacts/Edit', [
            'contact' => $contact,
            'companies' => $companies,
            'users' => $users,
        ]);
    }

    /**
     * Show the form for importing contacts.
     */
    public function showImportForm()
    {
        return Inertia::render('Contacts/Import');
    }

    /**
     * Handle the import of a CSV file.
     */
    public function handleImport(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt'],
        ]);

        $file = $request->file('file');
        $records = array_map('str_getcsv', file($file->getRealPath()));

        if (count($records) < 1) {
            return Redirect::back()->withErrors(['file' => 'The CSV file is empty.']);
        }

        $header = array_map('trim', array_shift($records));

        $successCount = 0;
        $errorCount = 0;
        $errors = [];

        foreach ($records as $index => $row) {
            if (count($header) !== count($row)) {
                $errorCount++;
                $errors[] = "Row ".($index+2).": Column count mismatch.";
                continue;
            }

            $data = array_combine($header, $row);

            // Handle nullable fields (empty string to null)
            $data['first_name'] = empty($data['first_name']) ? null : $data['first_name'];
            $data['last_name'] = empty($data['last_name']) ? null : $data['last_name'];
            $data['email'] = empty($data['email']) ? null : $data['email'];
            $data['phone'] = empty($data['phone']) ? null : $data['phone'];
            $data['status'] = empty($data['status']) ? null : $data['status'];

            // Special handling for company_name
            if (!empty($data['company_name'])) {
                $company = Company::where('name', $data['company_name'])->first();
                $data['company_id'] = $company ? $company->id : null;
            }

            $validator = Validator::make($data, [
                'first_name' => 'required|string|max:255',
                'last_name' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255|unique:contacts,email',
                'company_id' => 'nullable|exists:companies,id',
                'phone' => 'nullable|string|max:50',
                'status' => 'nullable|string|max:50',
            ]);

            if ($validator->fails()) {
                $errorCount++;
                $errors[] = "Row ".($index+2).": ".implode(', ', $validator->errors()->all());
            } else {
                Contact::create($validator->validated());
                $successCount++;
            }
        }

        $flash = ['success' => "Import complete. {$successCount} contacts imported."];

        if ($errorCount > 0) {
            $flash['warning'] = "{$errorCount} rows failed to import.";
            $flash['import_errors'] = $errors;
        }

        return Redirect::route('contacts.index')->with($flash);
    }


    /**
     * Export contacts to a CSV file.
     */
    public function export(Request $request)
    {
        $fileName = 'contacts-' . now()->format('Y-m-d-His') . '.csv';
        $contacts = $this->getFilteredContactsQuery($request)->get();
        $columns = [
            'ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Mobile Phone',
            'Job Title', 'Company', 'Status', 'Source', 'Assigned To', 'Created At'
        ];

        $callback = function () use ($contacts, $columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            foreach ($contacts as $contact) {
                fputcsv($file, [
                    $contact->id,
                    $contact->first_name,
                    $contact->last_name,
                    $contact->email,
                    $contact->phone,
                    $contact->mobile_phone,
                    $contact->job_title,
                    $contact->company->name ?? '',
                    $contact->status,
                    $contact->source,
                    $contact->assignedUser->name ?? 'Unassigned',
                    $contact->created_at->toDateTimeString(),
                ]);
            }
            fclose($file);
        };

        return new StreamedResponse($callback, 200, [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ]);
    }


    public function create(Request $request)
    {
        $companies = Company::orderBy('name')->get(['id', 'name']);
        $users = User::orderBy('name')->get(['id', 'name']); // Get users for dropdown
        // You might also fetch predefined statuses/sources if they are not free text
        // $statuses = ['New Lead', 'Contacted', 'Qualified', ...];

        return Inertia::render('Contacts/Create', [
            'companies' => $companies,
            'users' => $users, // Pass users
            // 'statuses' => $statuses,
            'preselected_company_id' => $request->query('company_id'),
        ]);
    }

    // In ContactController.php
    public function store(Request $request) // Or StoreContactRequest $request
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255|unique:contacts,email',
            'phone' => 'nullable|string|max:50',
            'job_title' => 'nullable|string|max:255',
            'company_id' => 'nullable|exists:companies,id',

            // --- Validation for New Fields ---
            'linkedin_profile_url' => 'nullable|url|max:255',
            'mobile_phone' => 'nullable|string|max:50',
            'department' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'source' => 'nullable|string|max:100',
            'status' => 'nullable|string|max:50', // Consider Rule::in(['New Lead', ...]) if you have fixed statuses
            'last_contacted_at' => 'nullable|date',
            'assigned_user_id' => 'nullable|exists:users,id', // Ensure the user ID exists
            // --- End Validation for New Fields ---
        ]);

        Contact::create($validated);
        return Redirect::route('contacts.index')->with('success', 'Contact created.');
    }



    public function update(Request $request, Contact $contact) // Or UpdateContactRequest $request
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255|unique:contacts,email,' . $contact->id, // Ignore current contact
            'phone' => 'nullable|string|max:50',
            'job_title' => 'nullable|string|max:255',
            'company_id' => 'nullable|exists:companies,id',

            // --- Validation for New Fields ---
            'linkedin_profile_url' => 'nullable|url|max:255',
            'mobile_phone' => 'nullable|string|max:50',
            'department' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'source' => 'nullable|string|max:100',
            'status' => 'nullable|string|max:50',
            'last_contacted_at' => 'nullable|date',
            'assigned_user_id' => 'nullable|exists:users,id',
            // --- End Validation for New Fields ---
        ]);

        $contact->update($validated);
        return Redirect::route('contacts.index')->with('success', 'Contact updated.');
    }

    public function scopeFilter(Builder $query, array $filters): Builder
    {
        return $query->when($filters['search'] ?? null, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                ->orWhere('last_name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                // Correctly search by the related company's name
                ->orWhereHas('company', fn($companyQuery) => $companyQuery->where('name', 'like', "%{$search}%"));
            });
        })->when($filters['status'] ?? null, function ($query, $status) {
            $query->where('status', $status);
        })->when($filters['company_id'] ?? null, function ($query, $companyId) {
            $query->where('company_id', $companyId);
        });
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();
        return Redirect::route('contacts.index')->with('success', 'Contact deleted.');
    }
}
