<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DuplicateCheckController extends Controller
{
    /**
     * Check for potential duplicate companies or contacts.
     */
    public function check(Request $request)
    {
        $validated = $request->validate([
            'model' => ['required', 'string', Rule::in(['company', 'contact'])],
            'id' => 'nullable|integer',
            'attributes' => 'required|array',
        ]);

        $modelName = $validated['model'];
        $attributes = array_filter($validated['attributes'], fn($value) => !is_null($value) && $value !== '');
        $ignoreId = $validated['id'] ?? null;

        $potentialDuplicates = collect();

        if ($modelName === 'company') {
            $potentialDuplicates = Company::findPotentialDuplicates($attributes, $ignoreId);
        } elseif ($modelName === 'contact') {
            $potentialDuplicates = Contact::findPotentialDuplicates($attributes, $ignoreId);
        }

        // Transform the collection to match the frontend interface
        $formattedDuplicates = $potentialDuplicates->map(function ($record) use ($attributes, $modelName) {
            $matches = [];

            if ($modelName === 'company') {
                if (isset($attributes['name']) && str_contains(strtolower($record->name), strtolower($attributes['name']))) {
                    $matches[] = 'Name';
                }
                if (isset($attributes['email']) && strtolower($record->email ?? '') === strtolower($attributes['email'])) {
                    $matches[] = 'Email';
                }
                if (isset($attributes['website']) && str_contains(strtolower($record->website ?? ''), strtolower($attributes['website']))) {
                    $matches[] = 'Website';
                }
            } elseif ($modelName === 'contact') {
                // Check exact email match
                if (isset($attributes['email']) && strtolower($record->email ?? '') === strtolower($attributes['email'])) {
                    $matches[] = 'Email';
                }
                // Check exact phone match
                if (isset($attributes['phone']) && $record->phone === $attributes['phone']) {
                    $matches[] = 'Phone';
                }
                // Check loose name match
                $inputName = strtolower(($attributes['first_name'] ?? '') . ' ' . ($attributes['last_name'] ?? ''));
                $recordName = strtolower($record->first_name . ' ' . $record->last_name);
                if (str_contains($recordName, trim($inputName)) && trim($inputName) !== '') {
                    $matches[] = 'Name';
                }
            }

            // Fallback if logic misses (e.g. strict fuzzy search matched but simple check didn't)
            if (empty($matches)) {
                $matches[] = 'Similar Record';
            }

            return [
                'id' => $record->id,
                'name' => $modelName === 'company' ? $record->name : $record->full_name,
                'matches' => array_unique($matches),
            ];
        });

        return response()->json([
            'duplicates' => $formattedDuplicates->values(),
        ]);
    }
}
