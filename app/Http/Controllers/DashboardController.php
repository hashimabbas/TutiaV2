<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Contact;
use App\Models\Opportunity;
use App\Models\Task;
use App\Models\Visit; // <--- This should be Visitor model if using CountVisitor middleware
use App\Models\Visitor;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(): Response
    {
        return Inertia::render('Dashboard');
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
     * Get data for dashboard charts (Updated to handle dateRange).
     */
    public function getChartData(Request $request): JsonResponse
    {
        $dateRange = $request->get('dateRange', '30d');
        $days = (int)str_replace('d', '', $dateRange);
        $startDate = Carbon::now()->subDays($days)->startOfDay();

        $newCompanies = Company::query()
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->where('created_at', '>=', $startDate)
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date', 'asc')
            ->get();

        $opportunitiesByStage = Opportunity::query()
            ->select('stage', DB::raw('count(*) as count'))
            ->groupBy('stage')
            ->pluck('count', 'stage');

        $monthlyVisitorData = $this->getMonthlyVisitorData();

        return response()->json([
            'new_companies' => $newCompanies,
            'opportunities_by_stage' => $opportunitiesByStage,
            'monthly_visitors' => $monthlyVisitorData,
        ]);
    }

    /**
     * Get data for daily visitor stats.
     */
    public function getVisitStats(): JsonResponse
    {
        $periodInDays = 7;
        $startDate = Carbon::now()->subDays($periodInDays - 1)->startOfDay();

        $dailyStats = Visitor::query()
            ->where('created_at', '>=', $startDate)
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as page_views'),
                DB::raw('COUNT(DISTINCT ip) as unique_visitors')
            )
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date', 'asc')
            ->get();

        $topPages = Visitor::query()
            ->where('created_at', '>=', $startDate)
            ->select('page_name', DB::raw('COUNT(*) as views'))
            ->groupBy('page_name')
            ->orderByDesc('views')
            ->limit(5)
            ->get();

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
            'topCountries' => $topCountries,
        ]);
    }

    /**
     * Get Monthly Visitor Data (Optimized with DB grouping).
     */
    private function getMonthlyVisitorData(): array
    {
        // Group by month and year for the last 12 months
        $stats = Visitor::query()
            ->select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('YEAR(created_at) as year'),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', Carbon::now()->subYear())
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();

        $months_name = [];
        $monthlyVisitCountArray = [];

        foreach ($stats as $stat) {
            $monthName = Carbon::createFromDate($stat->year, $stat->month, 1)->format('M Y');
            $months_name[] = $monthName;
            $monthlyVisitCountArray[] = $stat->count;
        }

        return [
            'months' => $months_name,
            'monthlyVisitCountData' => $monthlyVisitCountArray,
        ];
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
