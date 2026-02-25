<?php

//api.php

use App\Http\Controllers\Api\VisitController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\Api\DuplicateCheckController;


Route::post('/track-visit', [VisitController::class, 'store'])->middleware('web'); // Example using web middleware group
Route::get('/api/visits', [VisitController::class, 'index']);
Route::post('/visits', [VisitController::class, 'store']);



