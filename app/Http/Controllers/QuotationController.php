<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Contact;
use App\Models\Quotation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class QuotationController extends Controller
{
    public function index(Request $request)
    {
        $quotations = Quotation::with(['company:id,name', 'contact:id,first_name,last_name'])
            // ->filter(...) // Add filtering logic
            ->latest()
            ->paginate(15);

        return Inertia::render('Quotations/Index', [
            'quotations' => $quotations,
        ]);
    }

    public function create()
    {
        return Inertia::render('Quotations/Create', [
            'companies' => Company::orderBy('name')->get(['id', 'name']),
            'contacts' => Contact::orderBy('first_name')->get(['id', 'first_name', 'last_name']),
            'users' => User::orderBy('name')->get(['id', 'name']), // For assigning ownership
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'company_id' => 'nullable|exists:companies,id',
            'contact_id' => 'nullable|exists:contacts,id',
            'user_id' => 'required|exists:users,id',
            'valid_until' => 'required|date',
            'notes' => 'nullable|string',
            'status' => 'required|string|in:draft,sent,accepted,rejected,expired',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        // Use a database transaction to ensure data integrity
        $quotation = DB::transaction(function () use ($validated, $request) {
            $quotation = Quotation::create([
                'number' => 'Q-' . str_pad(Quotation::count() + 1, 5, '0', STR_PAD_LEFT), // Simple number generation
                'subject' => $validated['subject'],
                'company_id' => $validated['company_id'],
                'contact_id' => $validated['contact_id'],
                'user_id' => $validated['user_id'],
                'valid_until' => $validated['valid_until'],
                'notes' => $validated['notes'],
                'status' => $validated['status'],
            ]);

            $subtotal = 0;
            foreach ($validated['items'] as $item) {
                $itemTotal = $item['quantity'] * $item['unit_price'];
                $quotation->items()->create([
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'subtotal' => $itemTotal, // Simplified, add tax/discount logic later
                    'total' => $itemTotal,
                ]);
                $subtotal += $itemTotal;
            }

            // Update the main quotation with calculated totals
            $quotation->update([
                'subtotal' => $subtotal,
                'total' => $subtotal, // Simplified, add tax/discount later
            ]);

            return $quotation;
        });

        return Redirect::route('quotations.show', $quotation)->with('success', 'Quotation created.');
    }

    public function show(Quotation $quotation)
    {
        $quotation->load(['items', 'company', 'contact', 'user']);
        return Inertia::render('Quotations/Show', [
            'quotation' => $quotation,
        ]);
    }

    public function edit(Quotation $quotation)
    {
        $quotation->load('items');
        return Inertia::render('Quotations/Edit', [
            'quotation' => $quotation,
            'companies' => Company::orderBy('name')->get(['id', 'name']),
            'contacts' => Contact::orderBy('first_name')->get(['id', 'first_name', 'last_name']),
            'users' => User::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Quotation $quotation)
    {
        // Validation is similar to store...
        $validated = $request->validate([ /* ... */ ]);

        DB::transaction(function () use ($validated, $quotation) {
            $quotation->update([ /* ... update main fields ... */ ]);

            // Easiest way to sync items is to delete old and re-create new
            $quotation->items()->delete();

            $subtotal = 0;
            foreach ($validated['items'] as $item) {
                // ... re-create items and calculate subtotal ...
            }

            // ... update totals on main quotation ...
        });

        return Redirect::route('quotations.show', $quotation)->with('success', 'Quotation updated.');
    }

    public function destroy(Quotation $quotation)
    {
        // The database schema's cascadeOnDelete will handle deleting the items.
        $quotation->delete();
        return Redirect::route('quotations.index')->with('success', 'Quotation deleted.');
    }
}
