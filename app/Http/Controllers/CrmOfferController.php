<?php
// app/Http/Controllers/CrmOfferController.php (formerly OfferController.php)

namespace App\Http\Controllers;

use App\Models\CrmOffer; // Renamed from Offer
use App\Models\OfferItem;
use App\Models\Company;
use App\Models\Contact;
use App\Models\User;
use App\Models\Product; // Assuming you have a Product model
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class CrmOfferController extends Controller // Renamed class
{
    public function index(Request $request)
    {
        $crmOffers = CrmOffer::with(['company', 'contact', 'assignedUser', 'items'])
            ->when($request->input('search'), function ($query, $search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhereHas('company', fn($q) => $q->where('name', 'like', "%{$search}%"))
                    ->orWhereHas('contact', fn($q) => $q->where('first_name', 'like', "%{$search}%")->orWhere('last_name', 'like', "%{$search}%"));
            })
            ->when($request->input('status'), function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($request->input('assigned_user_id'), function ($query, $userId) {
                $query->where('assigned_user_id', $userId);
            })
            ->when($request->input('offer_type'), function ($query, $offerType) {
                $query->where('offer_type', $offerType);
            })
            ->latest('expected_close_date')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('CrmOffers/Index', [ // New Inertia component path
            'crmOffers' => $crmOffers, // Changed prop name
            'filters' => $request->only(['search', 'status', 'assigned_user_id', 'offer_type']),
            'statuses' => [
                CrmOffer::STATUS_DRAFT, CrmOffer::STATUS_PROPOSED, CrmOffer::STATUS_ACCEPTED,
                CrmOffer::STATUS_REJECTED, CrmOffer::STATUS_EXPIRED, CrmOffer::STATUS_WITHDRAWN
            ],
            'offerTypes' => [ // CRM-specific offer types
                CrmOffer::TYPE_QUOTE, CrmOffer::TYPE_PROPOSAL, CrmOffer::TYPE_SERVICE_PACKAGE
            ],
            'users' => User::orderBy('name')->get(['id', 'name']),
            'success' => session('success')
        ]);
    }

    public function create()
    {
        $statuses = [CrmOffer::STATUS_DRAFT, CrmOffer::STATUS_PROPOSED, CrmOffer::STATUS_ACCEPTED, CrmOffer::STATUS_REJECTED, CrmOffer::STATUS_EXPIRED, CrmOffer::STATUS_WITHDRAWN];
        $offerTypes = [CrmOffer::TYPE_QUOTE, CrmOffer::TYPE_PROPOSAL, CrmOffer::TYPE_SERVICE_PACKAGE];

        return Inertia::render('CrmOffers/Create', [ // New Inertia component path
            'companies' => Company::orderBy('name')->get(['id', 'name']),
            'contacts' => Contact::orderBy('first_name')->orderBy('last_name')->get(['id', 'first_name', 'last_name', 'company_id']),
            'users' => User::orderBy('name')->get(['id', 'name']),
            'statuses' => $statuses,
            'offerTypes' => $offerTypes,
            'products' => Product::select('id', 'name', 'sku', 'description', 'unit_price')->get(),
            'defaultCurrency' => config('app.default_currency', 'SAR'),
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $this->validateCrmOfferRequest($request);
        $offerItemsData = $request->input('items', []);

        DB::beginTransaction();
        try {
            $crmOffer = CrmOffer::create($validatedData['crm_offer']); // Changed model

            if (!empty($offerItemsData)) {
                $itemsToCreate = [];
                foreach ($offerItemsData as $itemData) {
                    $itemsToCreate[] = new OfferItem($itemData);
                }
                $crmOffer->items()->saveMany($itemsToCreate);
            }

            if ($crmOffer->items()->exists() && is_null($validatedData['crm_offer']['value'])) {
                 $crmOffer->value = $crmOffer->items()->sum('total_price');
                 $crmOffer->save();
            }

            DB::commit();
            return Redirect::route('crm.offers.index')->with('success', 'CRM Offer created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['server_error' => 'Could not create CRM offer. ' . $e->getMessage()])->withInput();
        }
    }

    public function show(CrmOffer $offer) // Changed from $crmOffer
    {
        $offer->load(['company', 'contact', 'assignedUser', 'items']);
        return Inertia::render('CrmOffers/Show', ['crmOffer' => $offer]); // Prop name remains crmOffer for frontend
    }

    public function edit(CrmOffer $offer) // Changed from $crmOffer
    {
        $offer->load('items');
        return Inertia::render('CrmOffers/Edit', [
            'crmOffer' => $offer, // Prop name remains crmOffer for frontend
            'companies' => Company::orderBy('name')->get(['id', 'name']),
            'contacts' => Contact::orderBy('first_name')->orderBy('last_name')->get(['id', 'first_name', 'last_name', 'company_id']),
            'users' => User::orderBy('name')->get(['id', 'name']),
            'statuses' => [
                CrmOffer::STATUS_DRAFT, CrmOffer::STATUS_PROPOSED, CrmOffer::STATUS_ACCEPTED,
                CrmOffer::STATUS_REJECTED, CrmOffer::STATUS_EXPIRED, CrmOffer::STATUS_WITHDRAWN
            ],
            'offerTypes' => [
                CrmOffer::TYPE_QUOTE, CrmOffer::TYPE_PROPOSAL, CrmOffer::TYPE_SERVICE_PACKAGE
            ],
            'defaultCurrency' => $offer->currency ?: 'SAR',
            'products' => Product::select('id', 'name', 'sku', 'description', 'unit_price')->get(),
        ]);
    }

    public function update(Request $request, CrmOffer $offer) // Changed from $crmOffer
    {
        $validatedData = $this->validateCrmOfferRequest($request, $offer);
        $offerItemsData = $request->input('items', []);

        DB::beginTransaction();
        try {
            $offer->update($validatedData['crm_offer']);

            $offer->items()->delete();
            $itemsToCreate = [];
            if (!empty($offerItemsData)) {
                foreach ($offerItemsData as $itemData) {
                    $itemsToCreate[] = new OfferItem($itemData);
                }
                $offer->items()->saveMany($itemsToCreate);
            }

            if ($offer->items()->exists() && is_null($validatedData['crm_offer']['value'])) {
                 $offer->value = $offer->items()->sum('total_price');
                 $offer->save();
            }

            DB::commit();
            return Redirect::route('crm.offers.index')->with('success', 'CRM Offer updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['server_error' => 'Could not update CRM offer. ' . $e->getMessage()])->withInput();
        }
    }

    public function destroy(CrmOffer $offer) // Changed from $crmOffer
    {
        DB::beginTransaction();
        try {
            $offer->items()->delete();
            $offer->delete();
            DB::commit();
            return Redirect::route('crm.offers.index')->with('success', 'CRM Offer deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return Redirect::route('crm.offers.index')->with('error', 'CRM Offer could not be deleted.');
        }
    }

    private function validateCrmOfferRequest(Request $request, ?CrmOffer $crmOffer = null): array
    {
        $offerType = $request->input('offer_type');
        $isProposal = $offerType === CrmOffer::TYPE_PROPOSAL;

        $rules = [
            'title' => ['required', 'string', 'max:255'],
            'title_ar' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'description_ar' => ['nullable', 'string'],
            'status' => ['required', Rule::in([
                CrmOffer::STATUS_DRAFT, CrmOffer::STATUS_PROPOSED, CrmOffer::STATUS_ACCEPTED,
                CrmOffer::STATUS_REJECTED, CrmOffer::STATUS_EXPIRED, CrmOffer::STATUS_WITHDRAWN
            ])],
            'value' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['required', 'string', 'max:3'],
            'probability' => ['nullable', 'integer', 'min:0', 'max:100'],
            'expected_close_date' => ['nullable', 'date'],
            'actual_close_date' => ['nullable', 'date', 'after_or_equal:expected_close_date'],
            'offer_type' => ['required', Rule::in([ // Only CRM types here
                CrmOffer::TYPE_QUOTE, CrmOffer::TYPE_PROPOSAL, CrmOffer::TYPE_SERVICE_PACKAGE
            ])],
            'notes' => ['nullable', 'string'],
            'assigned_user_id' => ['nullable', 'exists:users,id'],
            'company_id' => ['nullable', 'exists:companies,id'],
            'contact_id' => [
                'nullable',
                Rule::requiredIf($isProposal),
                'exists:contacts,id',
                Rule::exists('contacts', 'id')->where('company_id', $request->input('company_id'))
            ],

            // Item List Rules
            'items' => ['required', 'array', 'min:1'],
            'items.*.service_name' => ['required_without:items.*.product_id', 'string', 'max:255'],
            'items.*.product_id' => ['nullable', 'exists:products,id'],
            'items.*.description' => ['nullable', 'string'],
            'items.*.quantity' => ['required', 'numeric', 'min:0'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.discount_percentage' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'items.*.discount_amount' => ['nullable', 'numeric', 'min:0'],
            'items.*.tax_rate' => ['nullable', 'numeric', 'min:0', 'max:1'],
        ];

        $validatedRequestData = $request->validate($rules);

        $itemsToProcess = $validatedRequestData['items'] ?? [];
        $processedItems = [];
        $totalValueFromItems = 0;

        foreach ($itemsToProcess as $itemData) {
            $product = null;
            if ($itemData['product_id']) {
                $product = Product::find($itemData['product_id']);
                if ($product) {
                    $itemData['service_name'] = $product->name;
                    $itemData['unit_price'] = $product->unit_price;
                    $itemData['description'] = $itemData['description'] ?? $product->description;
                }
            }

            $qty = (float) $itemData['quantity'];
            $price = (float) $itemData['unit_price'];
            $discountPercent = (float) ($itemData['discount_percentage'] ?? 0);
            $taxRate = (float) ($itemData['tax_rate'] ?? 0);

            $basePrice = $qty * $price;
            $discount = $basePrice * ($discountPercent / 100);
            $priceAfterDiscount = $basePrice - $discount;
            $taxAmount = $priceAfterDiscount * $taxRate;

            $itemData['total_price'] = round($priceAfterDiscount + $taxAmount, 4); // Keep more precision until the end
            $totalValueFromItems += $itemData['total_price'];

            $processedItems[] = $itemData;
        }

        $crmOfferInput = [];
        $crmOfferModelFillable = (new CrmOffer())->getFillable(); // Changed model

        foreach ($crmOfferModelFillable as $fillableKey) {
            if (array_key_exists($fillableKey, $validatedRequestData)) {
                $crmOfferInput[$fillableKey] = $validatedRequestData[$fillableKey];
            }
        }

        if (is_null($validatedRequestData['value'] ?? null)) {
             $crmOfferInput['value'] = round($totalValueFromItems, 2);
        } else {
             $crmOfferInput['value'] = $validatedRequestData['value'];
        }

        return [
            'crm_offer' => $crmOfferInput, // Changed key
            'items' => $processedItems
        ];
    }
}
