<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\DuplicateCheckController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CrmOfferController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeadSourceController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\OpportunityController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PublicPromotionController;
use App\Http\Controllers\QuotationController;
use App\Http\Controllers\SupportCaseController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\CountVisitor;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;


// Route::get('/', function () {
//     return Inertia::render('welcome', [
//         'canRegister' => Features::enabled(Features::registration()),
//     ]);
// })->name('home');


// Public Promotions Routes
Route::get('/promotions', [PublicPromotionController::class, 'index'])->name('public.promotions.index');
Route::get('/promotions/{promotion:slug}', [PublicPromotionController::class, 'show'])->name('public.promotions.show');
Route::post('/promotions/apply', [PublicPromotionController::class, 'applyOffer'])->name('public.promotions.apply');


Route::get('/login', [AdminController::class, 'showEmailLoginForm'])->name('login'); // Show email input form

    Route::post('/login/send-otp', [AdminController::class, 'sendEmailOtp'])->name('admin_send_email_otp'); // Send OTP
    Route::get('/login/verify-otp', [AdminController::class, 'showEmailOtpForm'])->name('admin_show_email_otp_form'); // Show OTP input form
    Route::post('/login/verify-otp', [AdminController::class, 'verifyEmailOtp'])->name('admin_verify_email_otp'); // Verify OTP

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/summary', [DashboardController::class, 'getSummaryCounts'])->name('dashboard.summary');
    Route::get('/dashboard/charts', [DashboardController::class, 'getChartData'])->name('dashboard.charts');
    Route::get('/dashboard/recent-activity', [DashboardController::class, 'getRecentActivity'])->name('dashboard.activity');
    Route::get('/dashboard/visits', [DashboardController::class, 'getVisitStats'])->name('dashboard.visits');

       // --- Import/Export ---
    Route::get('/companies/import', [CompanyController::class, 'showImportForm'])->name('companies.import.form');
    Route::post('/companies/import', [CompanyController::class, 'handleImport'])->name('companies.import.handle');
    Route::get('/companies/export', [CompanyController::class, 'export'])->name('companies.export');
    Route::get('/contacts/import', [ContactController::class, 'showImportForm'])->name('contacts.import.form');
    Route::post('/contacts/import', [ContactController::class, 'handleImport'])->name('contacts.import.handle');
    Route::get('/contacts/export', [ContactController::class, 'export'])->name('contacts.export');
    Route::get('/opportunities/import', [OpportunityController::class, 'showImportForm'])->name('opportunities.import.form');
    Route::post('/opportunities/import', [OpportunityController::class, 'handleImport'])->name('opportunities.import.handle');
    Route::get('/opportunities/export', [OpportunityController::class, 'export'])->name('opportunities.export');
    Route::get('/opportunities/import/template', [OpportunityController::class, 'downloadTemplate'])->name('opportunities.import.template');

    // --- Resources ---
    Route::resource('companies', CompanyController::class);
    Route::resource('contacts', ContactController::class);
    Route::resource('opportunities', OpportunityController::class);
    Route::resource('quotations', QuotationController::class);
    Route::resource('tasks', TaskController::class);
    // Route::resource('users', UserController::class)->middleware('can:manage-users');
    Route::resource('users', UserController::class);
    // Route::resource('offers', OfferController::class);
    Route::resource('leadSources', LeadSourceController::class)->only(['index', 'store', 'update', 'destroy']);

    // --- Messages (Admin) ---
    Route::get('/messages/export', [MessageController::class, 'export'])->name('messages.export');
    Route::get('/messages', [MessageController::class, 'adminIndex'])->name('messages.index');
    Route::get('/messages/{message}', [MessageController::class, 'show'])->name('messages.show');
    Route::delete('/messages/{message}', [MessageController::class, 'destroy'])->name('messages.destroy');
    Route::get('/messages/{message}/attachment', [MessageController::class, 'downloadAttachment'])
    ->name('messages.download.attachment');

    Route::resource('support_cases', SupportCaseController::class); // <-- NEW ROUTE
    Route::resource('visitors', \App\Http\Controllers\VisitorController::class)->only(['index', 'destroy']);

    Route::post('/api/duplicate-check', [DuplicateCheckController::class, 'check'])
        ->name('api.duplicate.check');

    Route::get('/api/search/companies', [SearchController::class, 'companies'])->name('api.search.companies');
    Route::get('/api/search/contacts', [SearchController::class, 'contacts'])->name('api.search.contacts');
    Route::get('/api/search/users', [SearchController::class, 'users'])->name('api.search.users');

    // --- Special Actions ---
    Route::patch('tasks/{task}/toggle', [TaskController::class, 'toggleComplete'])->name('tasks.toggle');

    // NEW: Admin Blog Management (CRUD)
    Route::resource('dashboard/blog', PostController::class)->except(['show', 'publicIndex', 'publicShow']);

     // Other CRM resources can go here (e.g., companies, contacts, users)

    // CRM for Offers (Quotes, Proposals, Service Packages)
    Route::resource('crm/offers', CrmOfferController::class)->names('crm.offers');

    // CRM for Promotions (if you want to manage promotions in the CRM too)
    Route::prefix('crm')->group(function () {
        Route::get('/promotions', [PublicPromotionController::class, 'crmIndex'])->name('crm.promotions.index');
        Route::get('/promotions/create', [PublicPromotionController::class, 'create'])->name('crm.promotions.create');
        Route::post('/promotions', [PublicPromotionController::class, 'store'])->name('crm.promotions.store');
        Route::get('/promotions/{promotion}/edit', [PublicPromotionController::class, 'edit'])->name('crm.promotions.edit');
        Route::put('/promotions/{promotion}', [PublicPromotionController::class, 'update'])->name('crm.promotions.update');
        Route::delete('/promotions/{promotion}', [PublicPromotionController::class, 'destroy'])->name('crm.promotions.destroy');
    });

    // Product Management CRUD
    Route::resource('products', ProductController::class);
});

// Route::get('/', function () {
//     return view('index');
// })->name('home')->middleware(CountVisitor::class);
// Route::get('/contact', function (){
//     return view('contact');
// })->middleware(CountVisitor::class)->name('contact');
// // Route::post('/create/message', [MessageController::class, 'store']);
// Route::get('/ecommerce', function () {
//     return view('ecommerce');
// })->middleware(CountVisitor::class);
// Route::get('/web', function (){
//     return view('web');
// })->middleware(CountVisitor::class);
// Route::get('/ict', function () {
//     return view('ict');
// })->middleware(CountVisitor::class);
// Route::get('/sms', function (){
//     return view('sms');
// })->middleware(CountVisitor::class);
// Route::get('/call_center', function (){
//     return view('call');
// })->middleware(CountVisitor::class);
// Route::get('/ticketing', function (){
//     return view('ticketing');
// })->middleware(CountVisitor::class);
// Route::get('/vpn', function (){
//     return view('vpn');
// })->middleware(CountVisitor::class);
// Route::get('/payment', function (){
//     return view('payment');
// })->middleware(CountVisitor::class);
// Route::get('/connectivity', function (){
//     return view('connectivity');
// })->middleware(CountVisitor::class);
// Route::get('/erp', function (){
//     return view('/erp');
// })->middleware(CountVisitor::class);

// // Route::get('/contact', [MessageController::class, 'publicIndex'])->name('contact.index');
// Route::post('/contact', [MessageController::class, 'store'])->name('contact.store');
// Route::get('/show_offers', [OfferController::class, 'publicOffers'])->name('offers.show.offers');


// --- PUBLIC SPA ROUTES (Using Inertia::render) ---
Route::middleware([CountVisitor::class])->group(function() {

    // HOME PAGE (Renders Welcome.tsx)
    Route::get('/', function () {
        return Inertia::render('public/welcome');
    })->name('home');

    // CONTACT PAGE (Renders public/Contact.tsx)
    Route::get('/contact', function () {
        return Inertia::render('public/Contact');
    })->name('contact');

    // SERVICE PAGES (Render specific service components)
    Route::get('/ecommerce', function () {
        return Inertia::render('public/ECommerce');
    })->name('ecommerce');

    Route::get('/web', function () {
        return Inertia::render('public/Web');
    })->name('web');

    Route::get('/ict', function () {
        return Inertia::render('public/Ict');
    })->name('ict');

    Route::get('/sms', function () {
        return Inertia::render('public/Sms');
    })->name('sms');

    Route::get('/call_center', function () {
        return Inertia::render('public/CallCenter');
    })->name('call_center');

    Route::get('/ticketing', function () {
        return Inertia::render('public/Ticketing');
    })->name('ticketing');

    Route::get('/vpn', function () {
        return Inertia::render('public/Vpn');
    })->name('vpn');

    Route::get('/payment', function () {
        return Inertia::render('public/Payment');
    })->name('payment');

    Route::get('/connectivity', function () {
        return Inertia::render('public/Connectivity');
    })->name('connectivity');

    Route::get('/erp', function () {
        return Inertia::render('public/Erp');
    })->name('erp');

    // OFFERS PAGE (Uses the dedicated Controller method)


    Route::get('/blog', [PostController::class, 'publicIndex'])->name('blog.public.index');
    Route::get('/blog/{post:slug}', [PostController::class, 'publicShow'])->name('blog.public.show');
});
Route::post('/contact', [MessageController::class, 'store'])->name('contact.store');


require __DIR__.'/settings.php';
