<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Company;
use App\Models\LeadSource;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder; // <--- CORRECT: Change this import
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\StreamedResponse; // For export

class CompanyController extends Controller
{

    /**
     * Helper to get the base query with filters applied.
     * This avoids code duplication between index() and export().
     */
    private function getFilteredCompaniesQuery(Request $request): Builder // <--- CORRECT: Update the return type
    {
        return Company::query()
            ->with('assignedUser:id,name')
            ->filter($request->only('search', 'type', 'industry'));
    }

    public function index(Request $request)
    {
        // Use the helper to get the filtered query
        $companies = $this->getFilteredCompaniesQuery($request)
                          ->latest()
                          ->paginate(10)
                          ->withQueryString();

        // Get unique industries and types for filter dropdowns
        $industries = Company::query()->select('industry')->whereNotNull('industry')->distinct()->pluck('industry');
        $types = Company::query()->select('type')->whereNotNull('type')->distinct()->pluck('type');


        $leadSources = LeadSource::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Companies/Index', [
            'companies' => $companies,

            // Pass filters and options to the view
            'filters' => $request->all(['search', 'type', 'industry']),
            'filterOptions' => [
                'industries' => $industries,
                'types' => $types,
                'leadSources' => $leadSources,
            ],
        ]);
    }

    // ... (create, store, etc. methods remain the same) ...

    /**
     * Show the form for importing companies.
     */
    public function showImportForm()
    {
        return Inertia::render('Companies/Import');
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
        $path = $file->getRealPath();
        $records = array_map('str_getcsv', file($path));

        // Ensure there are records to process
        if (count($records) <= 1) { // Check if only header or empty
            return Redirect::back()->withErrors(['file' => 'The CSV file is empty or only contains a header.']);
        }

        $header = array_map('trim', array_shift($records));
        // Normalize headers to snake_case if necessary (e.g., 'Company Name' to 'company_name')
        // For simplicity, we assume headers exactly match database fields (name, email, etc.)

        $successCount = 0;
        $errorCount = 0;
        $errors = [];

        foreach ($records as $index => $row) {
            $rowNumber = $index + 2; // For error reporting (Header is row 1)

            // Check if column count matches header count
            if (count($header) !== count($row)) {
                $errorCount++;
                $errors[] = "Row {$rowNumber}: Column count mismatch. Expected " . count($header) . ", got " . count($row) . ".";
                continue;
            }

            // Combine header and row data
            $data = array_combine($header, $row);

            // --- Simplified empty string to null conversion for all fields ---
            $data = array_map(function($value) {
                return $value === '' ? null : $value;
            }, $data);

            // --- Remove fields we don't want to mass assign (like 'id' or relation names) ---
            unset($data['id']);
            unset($data['assigned_user']); // Assuming you don't import 'assigned_user'

            // --- Date Conversion Logic (can be skipped for this minimal test) ---
            // If the user includes created_at/updated_at, they are likely wrong or cause issues.
            // It's safer to remove them and let the database handle it.
            unset($data['created_at']);
            unset($data['updated_at']);
            // --- End Date Logic ---


            // Validate the data
            $validator = Validator::make($data, [
                'name' => 'required|string|max:255',
                'website' => 'nullable|url|max:255',
                'address' => 'nullable|string',
                'phone_number' => 'nullable|string|max:30',
                // FIX: unique rule must allow null values through, but the DB handles the constraint.
                'email' => 'nullable|email|max:255|unique:companies,email',
                'industry' => 'nullable|string|max:100',
                'type' => 'nullable|string|max:50',
                'source' => 'nullable|string|max:50',
                'description' => 'nullable|string',
                // Ensure numeric fields are correctly cast/parsed for validation
                'number_of_employees' => 'nullable|integer|min:0',
                'annual_revenue' => 'nullable|numeric|min:0',
                'linkedin_url' => 'nullable|url|max:255',
            ]);

            if ($validator->fails()) {
                $errorCount++;
                $errors[] = "Row {$rowNumber}: " . implode(', ', $validator->errors()->all());
            } else {
                try {
                    // Create the company using ONLY validated data
                    Company::create($validator->validated());
                    $successCount++;
                } catch (\Throwable $e) {
                    $errorCount++;
                    // Catch unexpected DB errors (e.g., uniqueness constraint on name)
                    $errors[] = "Row {$rowNumber}: Unexpected Database Error: " . $e->getMessage();
                }
            }
        }

        // --- IMPROVED UX REDIRECT LOGIC ---
        $flash = ['success' => "Import complete. {$successCount} companies imported."];
        if ($errorCount > 0) {
            $flash['warning'] = "{$errorCount} rows failed to import.";
            $flash['import_errors'] = $errors; // Pass detailed errors for frontend display
        }

        return Redirect::route('companies.index')->with($flash);
    }


    /**
     * Export companies to a CSV file.
     */
    // In app/Http/Controllers/CompanyController.php

    // ... (other methods) ...

    /**
     * Export companies to a CSV file.
     */
    public function export(Request $request)
    {
        $fileName = 'companies-' . now()->format('Y-m-d-His') . '.csv';

        // Use the same filtering logic as the index page to export only what's visible.
        // Or use Company::query()->get() to export everything regardless of filters.
        $companies = $this->getFilteredCompaniesQuery($request)->get();

        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$fileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        // --- UPDATED COLUMNS ---
        // This now matches all the fields in your comprehensive import template.
        $columns = [
            'id',
            'name',
            'website',
            'email',
            'phone_number',
            'industry',
            'type',
            'source',
            'number_of_employees',
            'annual_revenue',
            'linkedin_url',
            'address',
            'description',
            'assigned_user', // Changed to be more descriptive
            'created_at',
            'updated_at',
        ];

        $callback = function () use ($companies, $columns) {
            $file = fopen('php://output', 'w');
            // Write the header row
            fputcsv($file, $columns);

            foreach ($companies as $company) {
                // --- UPDATED DATA ROW ---
                // The order here must match the order of the $columns array above.
                fputcsv($file, [
                    $company->id,
                    $company->name,
                    $company->website,
                    $company->email,
                    $company->phone_number,
                    $company->industry,
                    $company->type,
                    $company->source,
                    $company->number_of_employees,
                    $company->annual_revenue,
                    $company->linkedin_url,
                    $company->address,
                    $company->description,
                    $company->assignedUser->name ?? 'Unassigned', // Safely get the user's name
                    $company->created_at->toDateTimeString(),
                    $company->updated_at->toDateTimeString(),
                ]);
            }

            fclose($file);
        };

        return new StreamedResponse($callback, 200, $headers);
    }



    public function create()
    {
        $users = User::orderBy('name')->get(['id', 'name']);
        $leadSources = LeadSource::orderBy('name')->get(['id', 'name']);
        return Inertia::render('Companies/Create', [
            'users' => $users,
            'leadSources' => $leadSources,
        ]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'website' => 'nullable|url|max:255',
            'address' => 'nullable|string',
            'phone_number' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:255',
            'industry' => 'nullable|string|max:100',
            'type' => 'nullable|string|max:50',
            'lead_source_id' => 'nullable|exists:lead_sources,id',
            'description' => 'nullable|string',
            'number_of_employees' => 'nullable|integer|min:0',
            'annual_revenue' => 'nullable|numeric|min:0',
            'linkedin_url' => 'nullable|url|max:255',
            'assigned_user_id' => 'nullable|exists:users,id',
        ]);

        Company::create($validated);

        return Redirect::route('companies.index')->with('success', 'Company created.');
    }

    /**
     * Display the specified resource.
     *
     * EFFICIENCY IMPROVEMENT:
     * 1.  Eager Load Multiple Relations: Load both `assignedUser` and `contacts` in one go.
     * 2.  Select Specific Columns: Just like in `index`, we only get the `id` and `name` for the user.
     * 3.  Limit Related Records: A company could have thousands of contacts. Loading them all on the
     *     `show` page is inefficient and can crash the browser. We'll load only the 10 most
     *     recently created contacts as a preview.
     * 4.  Select Specific Contact Columns: We'll also specify which columns to retrieve for the contacts
     *     to keep the payload small.
     */
    public function show(Company $company)
    {
        $company->load([
            'assignedUser:id,name',
            'contacts' => function ($query) {
                // Eager load only the 10 most recent contacts with specific columns
                $query->select('id', 'company_id', 'first_name', 'last_name', 'email', 'phone', 'job_title')
                      ->latest() // Order by created_at descending
                      ->limit(10);
            },
            // --- ADDED SUPPORT CASES RELATION ---
            'supportCases' => function ($query) {
                 // Load the 10 most recent cases with key fields
                 $query->select('id', 'company_id', 'reference_number', 'subject', 'status', 'priority', 'due_date')
                       ->latest('updated_at')
                       ->limit(10);
            }
            // --- END ADDED SUPPORT CASES RELATION ---
        ]);

        // --- NEW: FETCH ACTIVITIES ---
        $activities = Activity::where('company_id', $company->id)
            ->with('user:id,name') // Eager load the user who performed the action
            ->latest()
            ->limit(15) // Limit the timeline length
            ->get();
        // --- END NEW: FETCH ACTIVITIES ---

        return Inertia::render('Companies/Show', [
            'company' => $company,
        ]);
    }


   public function edit(Company $company)
    {
        $users = User::orderBy('name')->get(['id', 'name']);

        // FIX: Fetch Lead Sources here
        $leadSources = LeadSource::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Companies/Edit', [
            'company' => $company,
            'users' => $users,
            'leadSources' => $leadSources, // <-- ADDED
        ]);
    }

    public function update(Request $request, Company $company)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'website' => 'nullable|url|max:255',
            'address' => 'nullable|string',
            'phone_number' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:255',
            'industry' => 'nullable|string|max:100',
            'type' => 'nullable|string|max:50',
            'lead_source_id' => 'nullable|exists:lead_sources,id',
            'description' => 'nullable|string',
            'number_of_employees' => 'nullable|integer|min:0',
            'annual_revenue' => 'nullable|numeric|min:0',
            'linkedin_url' => 'nullable|url|max:255',
            'assigned_user_id' => 'nullable|exists:users,id',
        ]);

        $company->update($validated);

        return Redirect::route('companies.index')->with('success', 'Company updated.');
    }

    public function destroy(Company $company)
    {
        $company->delete();

        return Redirect::route('companies.index')->with('success', 'Company deleted.');
    }
}
