<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use App\Http\Resources\UserResource; // Optional: Use Resource for consistency
use Illuminate\Validation\Rule; // <-- Import the Rule class
use Illuminate\Support\Facades\Hash;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Paginate for better performance with large datasets
        $users = User::orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Admin/Users/Index', [
            // Optionally use API Resources to control data shape
            // 'users' => UserResource::collection($users),
            'users' => $users, // Or pass the paginator directly
             'breadcrumbs' => [ // Add breadcrumbs data
                 ['title' => 'Dashboard', 'href' => route('dashboard')],
                 ['title' => 'Users', 'href' => route('users.index')]
             ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
         return Inertia::render('Admin/Users/Create', [ // Make sure path matches your file structure
             'breadcrumbs' => [
                 ['title' => 'Dashboard', 'href' => route('dashboard')],
                 ['title' => 'Users', 'href' => route('users.index')],
                 ['title' => 'Create User', 'href' => route('users.create')] // Correct breadcrumb
             ]
         ]);
    }

    // Inside the store method:
public function store(Request $request): RedirectResponse
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
        'password' => ['required', 'confirmed', Rules\Password::defaults()],
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    event(new Registered($user));

    // Optional: Log in the newly created user if desired (though maybe not for admin creation)
    // Auth::login($user);

    // Redirect to the user index route
    return Redirect::route('users.index')->with('success', 'User created successfully.'); // Add a success message
}


    /**
     * Show the form for editing the specified resource.
     * (Placeholder - Implement later)
     */
    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [ // Assuming you'll have an Edit.tsx
            'user' => $user, // Pass the specific user data
            'breadcrumbs' => [
                 ['title' => 'Dashboard', 'href' => route('dashboard')],
                 ['title' => 'Users', 'href' => route('users.index')],
                 ['title' => 'Edit', 'href' => route('users.edit', $user->id)]
             ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     * (Placeholder - Implement later)
     */
    public function update(Request $request, User $user) // Route model binding is correct
    {
        // --- Define the validation rules ---
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                // Ensure email is unique, *ignoring* the current user's ID
                Rule::unique('users')->ignore($user->id),
            ],
            // Add password validation ONLY if you include password fields in the form
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ];

        // --- Validate the request data against the rules ---
        $validated = $request->validate($rules);

        // --- Update the user model ---
        // Use fill + save or update directly with validated data
        // Option 1: fill + save (useful if handling password separately)
        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        // Option 2: update directly (simpler if not handling password)
        // $user->update($validated); // This would work too if password isn't included


        // --- Handle optional password update ---
        // Uncomment this block if you added password fields to your form and validation
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save(); // Save changes (needed for Option 1 or if password was set)


        // --- Redirect back with success message ---
        return Redirect::route('users.index')->with('success', 'User updated successfully.');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        // Redirect back to the index page with a success message
        return Redirect::route('users.index')->with('success', 'User deleted successfully.');
    }
}
