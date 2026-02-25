// resources/js/Pages/Dashboard.tsx

import { useEffect, useState, ReactNode } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/pages/AppLayout'; // Assuming AppLayout is in /Layouts
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users, Target, CheckCircle, BarChart, Clock, LineChart, DollarSign, Monitor } from 'lucide-react';
import axios from 'axios';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, Line } from 'recharts';
import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Skeleton } from '@/components/ui/skeleton'; // Skeleton component for loading
import { Separator } from '@/components/ui/separator';

interface DailyVisitStat {
    date: string;
    page_views: number;
    unique_visitors: number;
}
interface TopItem {
    page_name?: string; // Corrected from page_url
    countryName?: string; // New field
    views?: number;
    unique_visitors?: number; // New field for country
}
interface VisitStats {
    dailyStats: DailyVisitStat[];
    topPages: TopItem[];
    topCountries: TopItem[]; // Renamed for accuracy
}
// --- New Monthly Visitor Data Structure ---
interface MonthlyVisitorData {
    months: string[];
    monthlyVisitCountData: number[];
}

interface SummaryData {
    total_companies: number;
    new_companies_30_days: number;
    total_contacts: number;
    open_opportunities: number;
    total_revenue_won: number;
    overdue_tasks: number;
}

interface ChartData {
    new_companies: { date: string; count: number }[];
    opportunities_by_stage: Record<string, number>;
    monthly_visitors: MonthlyVisitorData;
}

interface ActivityItem {
    type: 'company' | 'contact' | 'task';
    description: string;
    title: string;
    created_at: string;
    url: string;
}

interface StatCardProps { title: string; value: string | number; icon: ReactNode; description?: string; }
interface RecentActivityProps { activity: ActivityItem[]; }

const StatCard = ({ title, value, icon, description }: StatCardProps) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </CardContent>
    </Card>
);

// --- Reusable Components (Enhanced) ---
interface KpiCardProps { title: string; value: string | number; icon: ReactNode; description?: string; isLoading: boolean; }

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, description, isLoading }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
            ) : (
                <div className="text-2xl font-bold">{value}</div>
            )}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </CardContent>
    </Card>
);

const RecentActivity = ({ activity }: RecentActivityProps) => (
    <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {activity.map((item, index) => (
                    <div key={index} className="flex items-center">
                        <div className="p-2 bg-muted rounded-full mr-4">
                            {item.type === 'company' && <Building className="h-5 w-5 text-primary" />}
                            {item.type === 'contact' && <Users className="h-5 w-5 text-green-500" />}
                            {item.type === 'task' && <CheckCircle className="h-5 w-5 text-orange-500" />}
                        </div>
                        <div className="flex-grow">
                            <Link href={item.url} className="font-medium hover:underline">{item.title}</Link>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {new Date(item.created_at).toLocaleDateString()}
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

// --- Main Dashboard Component ---
export default function Dashboard({ auth }: PageProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [charts, setCharts] = useState<ChartData | null>(null);
    const [activity, setActivity] = useState<ActivityItem[] | null>(null);
    const [visitStats, setVisitStats] = useState<VisitStats | null>(null);
    const [dateRange, setDateRange] = useState('30d');

    const [isLoadingSummary, setIsLoadingSummary] = useState(true);
    const [isLoadingCharts, setIsLoadingCharts] = useState(true);
    const [isLoadingActivities, setIsLoadingActivities] = useState(true);
    const [isLoadingVisits, setIsLoadingVisits] = useState(true);

    const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF0000', '#00FF00'];

    // Convert charts.monthly_visitors into a format Recharts can use
    const monthlyVisitorData = charts?.monthly_visitors?.months.map((month, index) => ({
        month,
        count: charts.monthly_visitors.monthlyVisitCountData[index],
    })) || [];


    useEffect(() => {
        const fetcher = async (url: string, setState: (data: any) => void, setIsLoading: (loading: boolean) => void) => {
            setIsLoading(true);
            try {
                const response = await axios.get(url);
                setState(response.data);
            } catch (error) {
                console.error(`Failed to fetch data from ${url}:`, error);
                // Optionally set a flag/error state
            } finally {
                setIsLoading(false);
            }
        };

        const fetchData = async () => {
            // NOTE: getChartData now accepts { dateRange }
            await Promise.all([
                fetcher(route('dashboard.summary'), setSummary, setIsLoadingSummary),
                fetcher(route('dashboard.charts', { dateRange }), setCharts, setIsLoadingCharts), // Date range passed
                fetcher(route('dashboard.activity'), setActivity, setIsLoadingActivities),
                fetcher(route('dashboard.visits'), setVisitStats, setIsLoadingVisits), // Visitor stats fetch
            ]);

            setLoading(false);
        };

        fetchData();
    }, [dateRange]); // Refetch charts when dateRange changes

    const formatCurrency = (value: number | undefined) => {
        if (value === undefined || value === null) return '$0';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    }

    const isReady = !loading && summary && charts && activity && visitStats;


    if (!isReady) {
        return (
            <AppLayout auth={auth} breadcrumbs={[{ title: 'Dashboard' }]}>
                <Head title="Dashboard" />
                <div className="py-12"><div className="max-w-7xl mx-auto sm:px-6 lg:px-8"><div className="text-center text-lg">Loading Dashboard Data...</div></div></div>
            </AppLayout>
        )
    }

    return (
        <AppLayout auth={auth} breadcrumbs={[{ title: 'Dashboard' }]}>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-4">
                    <h1 className="text-3xl font-bold">CRM Overview</h1>

                    {/* KPI Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
                        <KpiCard title="Total Companies" value={summary!.total_companies} icon={<Building className="h-4 w-4 text-muted-foreground" />} description={`+${summary!.new_companies_30_days} New in last 30 days`} isLoading={isLoadingSummary} />
                        <KpiCard title="Total Contacts" value={summary!.total_contacts} icon={<Users className="h-4 w-4 text-muted-foreground" />} isLoading={isLoadingSummary} />
                        <KpiCard title="Open Opportunities" value={summary!.open_opportunities} icon={<Target className="h-4 w-4 text-muted-foreground" />} isLoading={isLoadingSummary} />
                        <KpiCard title="Revenue Won" value={formatCurrency(summary!.total_revenue_won)} icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} isLoading={isLoadingSummary} />
                        <KpiCard title="Overdue Tasks" value={summary!.overdue_tasks} icon={<Clock className="h-4 w-4 text-destructive" />} isLoading={isLoadingSummary} />
                        {/* NEW: VISITOR KPI CARD (Total Page Views Last 7 Days) */}
                        <KpiCard title="Total Views (7d)" value={visitStats!.dailyStats.reduce((sum, s) => sum + s.page_views, 0)} icon={<Monitor className="h-4 w-4 text-muted-foreground" />} description={`Unique Visitors: ${visitStats!.dailyStats.reduce((sum, s) => sum + s.unique_visitors, 0)}`} isLoading={isLoadingVisits} />
                    </div>

                    {/* Date Range Selector */}
                    <div className="flex justify-end items-center">
                        <label className="text-sm font-medium text-muted-foreground">Chart Range:</label>
                        <select
                            className="ml-4 border p-2 rounded-md"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                        >
                            <option value="7d">Last 7 Days</option>
                            <option value="30d">Last 30 Days</option>
                            <option value="90d">Last 90 Days</option>
                        </select>
                    </div>

                    {/* Charts and Recent Activity */}
                    <div className="grid gap-4 lg:grid-cols-3">
                        {/* NEW CHART: MONTHLY VISITS */}
                        <Card className="col-span-1 lg:col-span-3">
                            <CardHeader><CardTitle>Monthly Website Visits</CardTitle><CardDescription>Total page views over time.</CardDescription></CardHeader>
                            <CardContent className="pl-2">
                                <ResponsiveContainer width="100%" height={350}>
                                    <RechartsBarChart data={monthlyVisitorData}>
                                        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip />
                                        <Bar dataKey="count" name="Total Visits" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-blue-500" />
                                    </RechartsBarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-5">
                        {/* Chart 1: New Companies */}
                        <Card className="col-span-1 lg:col-span-3">
                            <CardHeader><CardTitle>New Companies (Last {dateRange})</CardTitle></CardHeader>
                            <CardContent className="pl-2">
                                <ResponsiveContainer width="100%" height={350}>
                                    <RechartsBarChart data={charts!.new_companies}>
                                        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                        <Tooltip />
                                        <Bar dataKey="count" name="New Companies" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                                    </RechartsBarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        {/* Chart 2: Opportunities by Stage */}
                        <Card className="col-span-1 lg:col-span-2">
                            <CardHeader><CardTitle>Opportunities by Stage</CardTitle></CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={350}>
                                    <PieChart>
                                        <Pie
                                            data={Object.entries(charts!.opportunities_by_stage).map(([name, value]) => ({ name, value }))}
                                            cx="50%" cy="50%"
                                            labelLine={false}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                            nameKey="name"
                                            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                        >
                                            {Object.keys(charts!.opportunities_by_stage).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '10px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* VISITORS SECTION: Daily Chart and Tables */}
                    <Separator className="my-8" />
                    <h2 className="text-2xl font-bold">Traffic Insights (Last 7 Days)</h2>

                    <div className="grid gap-4 lg:grid-cols-5">
                        <Card className="lg:col-span-3">
                            <CardHeader><CardTitle>Daily Visitors & Views</CardTitle><CardDescription>Unique visitors and total page views.</CardDescription></CardHeader>
                            <CardContent className="pl-2">
                                <ResponsiveContainer width="100%" height={350}>
                                    <LineChart data={visitStats!.dailyStats}>
                                        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                                        <YAxis yAxisId="left" stroke="#0088FE" fontSize={12} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#00C49F" fontSize={12} />
                                        <Tooltip />
                                        <Legend />
                                        <Line yAxisId="left" type="monotone" dataKey="unique_visitors" stroke="#0088FE" name="Unique Visitors" strokeWidth={2} />
                                        <Line yAxisId="right" type="monotone" dataKey="page_views" stroke="#00C49F" name="Page Views" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <div className="col-span-1 lg:col-span-2 space-y-4">
                            {/* Top Pages Table */}
                            <Card>
                                <CardHeader><CardTitle className="text-xl">Top 5 Pages</CardTitle></CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {visitStats!.topPages.map((item, index) => (
                                            <li key={index} className="flex justify-between text-sm items-center">
                                                <span className="truncate max-w-[70%] hover:text-primary">{item.page_name}</span>
                                                <span className="font-semibold">{item.views} views</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                            {/* Top Countries Table */}
                            <Card>
                                <CardHeader><CardTitle className="text-xl">Top 5 Countries</CardTitle></CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {visitStats!.topCountries.map((item, index) => (
                                            <li key={index} className="flex justify-between text-sm items-center">
                                                <span className="truncate max-w-[70%] hover:text-primary">{item.countryName}</span>
                                                <span className="font-semibold">{item.unique_visitors} visitors</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Recent Activity (Moved to bottom for better flow) */}
                    <div className="grid gap-4">
                        <RecentActivity activity={activity!} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
