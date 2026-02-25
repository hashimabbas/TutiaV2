<?php
// app/Http/Controllers/PublicPromotionController.php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;

class PublicPromotionController extends Controller
{
    public function index(Request $request)
    {
        $promotions = Promotion::activePublic()
            ->when($request->input('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->orderBy('start_date')
            ->get(); // Typically all active promotions are fetched for public display

        return Inertia::render('PublicPromotions/Index', [
            'offers' => $promotions, // Keep 'offers' as prop name for minimal frontend change
            'locale' => app()->getLocale(),
        ]);
    }

    // Optional: Show a single public promotion page (e.g., /promotions/my-awesome-deal)
    public function show(Promotion $promotion)
    {
        return Inertia::render('PublicPromotions/Show', [ // New page for single promo
            'offer' => $promotion, // Keep 'offer' as prop name for minimal frontend change
            'locale' => app()->getLocale(),
        ]);
    }

    public function applyOffer(Request $request)
    {
        $offerCode = $request->input('offer_code');
        $promotion = Promotion::where('code', $offerCode)->first();

        if (!$promotion) {
            return response()->json(['error' => 'Invalid promotion code.'], 400);
        }

        $now = now();
        if (
            !$promotion->is_active ||
            ($promotion->start_date && $promotion->start_date > $now) ||
            ($promotion->end_date && $promotion->end_date < $now) ||
            ($promotion->usage_limit !== null && $promotion->usage_count >= $promotion->usage_limit)
        ) {
            return response()->json(['error' => 'Promotion is not currently active or has reached its limit.'], 400);
        }

        $cartTotal = $request->input('cart_total', 100);
        $discountAmount = 0;

        if ($promotion->discount_percentage) {
            $discountAmount = $cartTotal * ($promotion->discount_percentage / 100);
        }

        return response()->json([
            'success' => true,
            'discount_amount' => round($discountAmount, 2),
            'offer_title' => $promotion->title
        ]);
    }

    public function recordOfferUsage(Promotion $promotion)
    {
        if ($promotion->code && $promotion->usage_limit !== null) {
            $promotion->increment('usage_count');
        }
    }

    // CRM methods for Promotions (if you want CRUD for promotions within CRM)
    public function crmIndex(Request $request) {
        $promotions = Promotion::when($request->input('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('CrmPromotions/Index', [ // New CRM page for promotions
            'promotions' => $promotions,
            'filters' => $request->only(['search']),
            'success' => session('success')
        ]);
    }

    public function create() {
        return Inertia::render('CrmPromotions/Create'); // New CRM page to create promotions
    }

    public function store(Request $request) {
        $validatedData = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'title_ar' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
            'value' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['required', 'string', 'max:3'],
            'discount_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'is_active' => ['sometimes', 'boolean'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:2048'],
            'code' => ['nullable', 'string', 'max:50', Rule::unique('promotions', 'code')],
            'usage_limit' => ['nullable', 'integer', 'min:0'],
            'user_usage_limit' => ['nullable', 'integer', 'min:0'],
        ]);

        DB::beginTransaction();
        try {
            $promotion = Promotion::create($validatedData);
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('promotions', 'public');
                $promotion->image = $imagePath;
                $promotion->save();
            }
            DB::commit();
            return Redirect::route('crm.promotions.index')->with('success', 'Promotion created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            if ($request->hasFile('image') && isset($imagePath) && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
            return back()->withErrors(['server_error' => 'Could not create promotion. ' . $e->getMessage()])->withInput();
        }
    }

    public function edit(Promotion $promotion) {
        return Inertia::render('CrmPromotions/Edit', ['promotion' => $promotion]); // New CRM page to edit promotions
    }

    public function update(Request $request, Promotion $promotion) {
        $validatedData = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'title_ar' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
            'value' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['required', 'string', 'max:3'],
            'discount_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'is_active' => ['sometimes', 'boolean'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:2048'],
            'remove_image' => ['boolean'], // Flag to remove existing image
            'code' => ['nullable', 'string', 'max:50', Rule::unique('promotions', 'code')->ignore($promotion->id)],
            'usage_limit' => ['nullable', 'integer', 'min:0'],
            'user_usage_limit' => ['nullable', 'integer', 'min:0'],
        ]);

        DB::beginTransaction();
        try {
            $promotion->update($validatedData);

            if ($request->hasFile('image')) {
                if ($promotion->image && Storage::disk('public')->exists($promotion->image)) {
                    Storage::disk('public')->delete($promotion->image);
                }
                $imagePath = $request->file('image')->store('promotions', 'public');
                $promotion->image = $imagePath;
                $promotion->save();
            } elseif ($request->boolean('remove_image')) {
                 if ($promotion->image && Storage::disk('public')->exists($promotion->image)) {
                    Storage::disk('public')->delete($promotion->image);
                    $promotion->image = null;
                    $promotion->save();
                }
            }
            DB::commit();
            return Redirect::route('crm.promotions.index')->with('success', 'Promotion updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['server_error' => 'Could not update promotion. ' . $e->getMessage()])->withInput();
        }
    }

    public function destroy(Promotion $promotion) {
        DB::beginTransaction();
        try {
            if ($promotion->image && Storage::disk('public')->exists($promotion->image)) {
                Storage::disk('public')->delete($promotion->image);
            }
            $promotion->delete();
            DB::commit();
            return Redirect::route('crm.promotions.index')->with('success', 'Promotion deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return Redirect::route('crm.promotions.index')->with('error', 'Promotion could not be deleted.');
        }
    }

}
