<?php

namespace App\Http\Controllers;

use App\Models\LeadSource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class LeadSourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('LeadSources/Index', [
            'leadSources' => LeadSource::orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     * --- NEW METHOD ---
     */
    public function create()
    {
        return Inertia::render('LeadSources/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:lead_sources',
            'description' => 'nullable|string',
        ]);

        LeadSource::create($validated);

        // --- UPDATED REDIRECT ---
        // Redirect to the index page on success
        return Redirect::route('leadSources.index')->with('success', 'Lead source created.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LeadSource $leadSource)
    {
        // ... (this method remains the same)
        // Note: If you create a dedicated Edit page, you would also
        // change this redirect to go to the index or show page.
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:lead_sources,name,' . $leadSource->id,
            'description' => 'nullable|string',
        ]);

        $leadSource->update($validated);

        return Redirect::route('leadSources.index')->with('success', 'Lead source updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LeadSource $leadSource)
    {
        // ... (this method remains the same)
        if ($leadSource->leads()->exists()) {
            return Redirect::back()->with('error', 'Cannot delete source because it is in use.');
        }

        $leadSource->delete();

        return Redirect::back()->with('success', 'Lead source deleted.');
    }
}
