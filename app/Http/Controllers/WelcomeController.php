<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\App;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class WelcomeController extends Controller
{
    public function index($locale)
    {
        return Inertia::render('welcome', [
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }
}
