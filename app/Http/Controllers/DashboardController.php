<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Contact;
use App\Models\Opportunity;
use App\Models\Task;
use App\Models\Visit; // <--- This should be Visitor model if using CountVisitor middleware
use App\Models\Visitor; // <--- Use your specific Visitor modelMODEL
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use DateTime; // <--- Import DateTime
use Illuminate\Support\Facades\Request;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(): Response
    {
        // We will fetch data asynchronously from the frontend
        // to provide a faster initial page load.
        return Inertia::render('Dashboard');
    }

     // --- NEW METHOD: Get Monthly Visitor Data (from VisitorChartController logic) ---
    private function getMonthlyVisitorData(): array
    {
        $month_array = array();
        // Use the Visitor model you provided
        $visit_dates = Visitor::orderBy('created_at', 'ASC')->pluck('created_at');
        $visit_dates = json_decode($visit_dates);

        if (!empty($visit_dates)) {
            foreach ($visit_dates as $date) {
                // Handle Carbon/DateTime object creation
                $dateObj = new DateTime($date);
                $month_no = $dateObj->format('m');
                $month_name = $dateObj->format('M Y'); // Add Year for clarity if multiple years exist
                $month_array[$month_no] = $month_name;
            }
        }

        $monthlyVisitCountArray = [];
        $months_name = [];

        foreach ($month_array as $month_no => $month_name) {
            // Count visitors for the month
            $monthlyVisitCount = Visitor::whereMonth('created_at', $month_no)
                                        ->count(); // Use count() for efficiency

            array_push($monthlyVisitCountArray, $monthlyVisitCount);
            array_push($months_name, $month_name);
        }

        return [
            'months' => $months_name,
            'monthlyVisitCountData' => $monthlyVisitCountArray,
        ];
    }
    // --- END NEW METHOD ---


    /**
     * Get data for dashboard charts (Enhanced to include Monthly Visitors).
     */
    // public function getChartData(Request $request): JsonResponse
    // {
    //     // Get date range from request (default to 30 days if not provided)
    //     $dateRange = $request->get('dateRange', '30d');
    //     $days = (int)str_replace('d', '', $dateRange);
    //     $startDate = Carbon::now()->subDays($days)->startOfDay();

    //     // New Companies per day for the last X days
    //     $newCompanies = Company::query()
    //         ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
    //         ->where('created_at', '>=', $startDate)
    //         ->groupBy('date')
    //         ->orderBy('date', 'asc')
    //         ->get();

    //     // Opportunities by Stage (This remains for all time)
    //     $opportunitiesByStage = Opportunity::query()
    //         ->select('stage', DB::raw('count(*) as count'))
    //         ->groupBy('stage')
    //         ->pluck('count', 'stage');

    //     // NEW: Monthly Visitor Data
    //     $monthlyVisitorData = $this->getMonthlyVisitorData();


    //     return response()->json([
    //         'new_companies' => $newCompanies,
    //         'opportunities_by_stage' => $opportunitiesByStage,
    //         'monthly_visitors' => $monthlyVisitorData, // <--- ADDED
    //     ]);
    // }

    /**
     * Get data for daily visitor stats (for the table/line chart).
     * This combines logic from your provided Visit/Dashboard controllers.
     */
     public function getVisitStats(): JsonResponse
    {
        $periodInDays = 7; // Default to last 7 days for the traffic section
        $startDate = Carbon::now()->subDays($periodInDays - 1)->startOfDay();

        // 1. Visitors and Page Views per day
        $dailyStats = Visitor::query()
            ->where('created_at', '>=', $startDate)
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get([
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as page_views'), // Total entries = total page views
                DB::raw('COUNT(DISTINCT ip) as unique_visitors'), // Unique IP = Unique Visitors
            ]);

        // 2. Top Pages (using 'page_name' from your Visitor model)
        $topPages = Visitor::query()
            ->where('created_at', '>=', $startDate)
            ->select('page_name', DB::raw('COUNT(*) as views'))
            ->groupBy('page_name')
            ->orderByDesc('views')
            ->limit(5)
            ->get();

        // 3. Top Countries (new, useful for IT company)
        $topCountries = Visitor::query()
            ->where('created_at', '>=', $startDate)
            ->whereNotNull('countryName')
            ->select('countryName', DB::raw('COUNT(DISTINCT ip) as unique_visitors'))
            ->groupBy('countryName')
            ->orderByDesc('unique_visitors')
            ->limit(5)
            ->get();


        return response()->json([
            'dailyStats' => $dailyStats,
            'topPages' => $topPages,
            'topCountries' => $topCountries, // Renamed from topReferrers for accuracy with Visitor model
        ]);
    }

    /**
     * Get summary counts for KPI cards.
     */
    public function getSummaryCounts(): JsonResponse
    {
        $thirtyDaysAgo = Carbon::now()->subDays(30);

        $summary = [
            'total_companies' => Company::count(),
            'new_companies_30_days' => Company::where('created_at', '>=', $thirtyDaysAgo)->count(),
            'total_contacts' => Contact::count(),
            'open_opportunities' => Opportunity::whereNotIn('stage', [Opportunity::STAGE_WON, Opportunity::STAGE_LOST])->count(),
            'total_revenue_won' => Opportunity::where('stage', Opportunity::STAGE_WON)->sum('value'),
            'overdue_tasks' => Task::where('status', 'pending')->whereDate('due_date', '<', today())->count(),
        ];

        return response()->json($summary);
    }

    /**
     * Get data for dashboard charts.
     */
    public function getChartData(): JsonResponse
    {
        $thirtyDaysAgo = Carbon::now()->subDays(30)->startOfDay();

        // New Companies per day for the last 30 days
        $newCompanies = Company::query()
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // Opportunities by Stage
        $opportunitiesByStage = Opportunity::query()
            ->select('stage', DB::raw('count(*) as count'))
            ->groupBy('stage')
            ->pluck('count', 'stage');

        // NEW: Monthly Visitor Data
        $monthlyVisitorData = $this->getMonthlyVisitorData();


        return response()->json([
            'new_companies' => $newCompanies,
            'opportunities_by_stage' => $opportunitiesByStage,
            'monthly_visitors' => $monthlyVisitorData, // <--- ADDED
        ]);

    }

    /**
     * Get recent activities.
     */
    public function getRecentActivity(): JsonResponse
    {
        $limit = 5;

        $companies = Company::latest()->limit($limit)->get()->map(fn($item) => [
            'type' => 'company',
            'description' => 'New company added',
            'title' => $item->name,
            'created_at' => $item->created_at,
            'url' => route('companies.show', $item),
        ]);

        $contacts = Contact::latest()->limit($limit)->get()->map(fn($item) => [
            'type' => 'contact',
            'description' => 'New contact created',
            'title' => $item->full_name,
            'created_at' => $item->created_at,
            'url' => route('contacts.show', $item),
        ]);

        $tasks = Task::latest()->limit($limit)->get()->map(fn($item) => [
            'type' => 'task',
            'description' => 'New task assigned',
            'title' => $item->title,
            'created_at' => $item->created_at,
            'url' => route('tasks.show', $item),
        ]);

        $activity = collect()->concat($companies)->concat($contacts)->concat($tasks)
            ->sortByDesc('created_at')
            ->take(7) // Take the 7 most recent items overall
            ->values();

        return response()->json($activity);
    }

}
