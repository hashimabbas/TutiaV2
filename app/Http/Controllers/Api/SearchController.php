<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Contact;
use App\Models\User;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Search Companies.
     */
    public function companies(Request $request)
    {
        $search = $request->input('q');
        $results = Company::query()
            ->select('id', 'name')
            ->where('name', 'like', "%{$search}%")
            ->orWhere('email', 'like', "%{$search}%")
            ->limit(50) // Limit the results
            ->orderBy('name')
            ->get();

        return response()->json($results);
    }

    /**
     * Search Contacts.
     */
    public function contacts(Request $request)
    {
        $search = $request->input('q');
        $results = Contact::query()
            ->select('id', 'first_name', 'last_name', 'company_id')
            ->where('first_name', 'like', "%{$search}%")
            ->orWhere('last_name', 'like', "%{$search}%")
            ->orWhere('email', 'like', "%{$search}%")
            ->limit(50)
            ->orderBy('last_name')
            ->get()
            ->map(fn($contact) => [
                'id' => $contact->id,
                'name' => "{$contact->first_name} {$contact->last_name}",
                'company_id' => $contact->company_id,
            ]);

        return response()->json($results);
    }

    /**
     * Search Users.
     */
    public function users(Request $request)
    {
        $search = $request->input('q');
        $results = User::query()
            ->select('id', 'name')
            ->where('name', 'like', "%{$search}%")
            ->limit(50)
            ->orderBy('name')
            ->get();

        return response()->json($results);
    }
}
