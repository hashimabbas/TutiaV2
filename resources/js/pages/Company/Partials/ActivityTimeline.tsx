// resources/js/pages/Company/Partials/ActivityTimeline.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import {
    Activity, ArrowUpCircle, CheckCircle, Clock, FileText, Briefcase, User
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { route } from 'ziggy-js';

// Define a minimal activity type for the timeline
export interface TimelineActivity {
    id: number;
    user_id: number;
    type: string;
    description: string;
    created_at: string;
    source_type: string;
    source_id: number;
    user: { id: number, name: string };
    // Add other fields you need for display
}

interface ActivityTimelineProps {
    activities: TimelineActivity[];
}

const getActivityIcon = (type: string) => {
    switch (type) {
        case 'stage_change': return <ArrowUpCircle className="w-5 h-5 text-indigo-500" />;
        case 'task_created': return <Clock className="w-5 h-5 text-blue-500" />;
        case 'opportunity_created': return <Briefcase className="w-5 h-5 text-green-500" />;
        case 'note_added': return <FileText className="w-5 h-5 text-yellow-500" />;
        case 'case_resolved': return <CheckCircle className="w-5 h-5 text-teal-500" />;
        default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
};

// Helper to determine the URL route name based on source_type
const getSourceRoute = (sourceType: string): string | null => {
    switch (sourceType) {
        case 'App\\Models\\Opportunity': return 'opportunities.show';
        case 'App\\Models\\Task': return 'tasks.show';
        case 'App\\Models\\SupportCase': return 'support_cases.show';
        default: return null;
    }
};

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities = [] }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-xl">
                    <Activity className="mr-2 h-6 w-6" /> Unified Activity Timeline
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {activities.length === 0 ? (
                    <p className="text-muted-foreground">No recent activity recorded.</p>
                ) : (
                    <div className="relative border-l border-gray-200 dark:border-gray-700 ml-4 pl-6">
                        {activities.map((activity, index) => {
                            const routeName = getSourceRoute(activity.source_type);

                            return (
                                <div key={activity.id} className="mb-8 relative">
                                    {/* Timeline Icon */}
                                    <div className="absolute -left-10 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-800 ring-4 ring-white dark:ring-gray-900">
                                        {getActivityIcon(activity.type)}
                                    </div>

                                    {/* Activity Content */}
                                    <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                                        {format(parseISO(activity.created_at), 'PPP h:mm a')}
                                    </time>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {activity.user?.name || 'System'}
                                    </h3>
                                    <p className="mb-4 text-base font-normal text-gray-600 dark:text-gray-300">
                                        {activity.description}
                                    </p>

                                    {/* Source Link */}
                                    {routeName && (
                                        <Link
                                            href={route(routeName, activity.source_id)}
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg text-primary hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                                        >
                                            View Source Record
                                            <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};


export default ActivityTimeline;
