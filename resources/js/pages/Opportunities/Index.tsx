// resources/js/pages/Opportunities/Index.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { motion, AnimatePresence } from 'framer-motion';
// Import the necessary partials
import KanbanColumn from './Partials/KanbanColumn';
import KanbanCard from './Partials/KanbanCard';
// Import necessary DND components
import {
    DndContext, closestCenter, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Opportunity, PaginatedResponse, PageProps } from '@/types';
import { route } from 'ziggy-js';
import { Download, Filter, Plus, Search, X, DollarSign, Target, BarChart } from "lucide-react";
import { pickBy } from 'lodash';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';


// You need to define this type or import it from wherever you defined it before
type OpportunityView = 'kanban' | 'list';

// Props for this specific page
interface OpportunitiesIndexProps {
    opportunities: PaginatedResponse<Opportunity>;
    filters: {
        search?: string;
        stage?: string;
        assigned_user_id?: string;
        source_id?: string;
    };
    filterOptions: {
        stages: string[];
        users: { id: number, name: string }[];
        leadSources: { id: number, name: string }[];
    }
}

const CLEAR_FILTER_VALUE = 'all';

const OPPORTUNITY_STAGES = [
    'New Lead', 'Qualification', 'Needs Analysis',
    'Proposal Sent', 'Negotiation', 'Won', 'Lost'
];

// Helper to format currency (retained for completeness)
const formatCurrency = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined || value === '') return '-';
    const num = Number(value);
    if (isNaN(num)) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
};

// Helper for pagination labels (retained for completeness)
function cleanPaginationLabel(label: string): string {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = label;
    return tempDiv.textContent || tempDiv.innerText || "";
}

const OpportunitiesIndex: React.FC = () => {
    const { props } = usePage<PageProps & OpportunitiesIndexProps>();
    // Use optional chaining just in case props are incomplete during hydration
    const { opportunities, filters, filterOptions, flash } = props;

    const [currentView, setCurrentView] = useState<OpportunityView>('kanban');
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const [showFlash, setShowFlash] = useState(false);

    // --- FILTER STATE ---
    const [filterValues, setFilterValues] = useState(filters);
    const isFiltersApplied = Object.values(filters).some(Boolean);
    // --- END FILTER STATE ---

    // DND States
    const [kanbanItems, setKanbanItems] = useState<Record<string, Opportunity[]>>({});
    const [activeOpportunity, setActiveOpportunity] = useState<Opportunity | null>(null);
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    // Map raw data to columns when props change (initial load or Inertia visit)
    useMemo(() => {
        const initialItems: Record<string, Opportunity[]> = {};
        OPPORTUNITY_STAGES.forEach(stage => initialItems[stage] = []);

        // --- DEFENSIVE CHECK ADDED HERE ---
        if (opportunities && opportunities.data) {
            opportunities.data.forEach(opp => {
                if (initialItems[opp.stage]) {
                    initialItems[opp.stage].push(opp);
                }
            });
        }
        // --- END DEFENSIVE CHECK ---

        setKanbanItems(initialItems);
    }, [opportunities]); // Dependency should be the entire 'opportunities' object


    // Helper to find the column (stage) by opportunity ID
    const findColumn = (opportunityId: number): string | undefined => {
        return Object.keys(kanbanItems).find(columnId =>
            kanbanItems[columnId].some(opp => opp.id === opportunityId)
        );
    };

    const handleDragStart = (event: any) => {
        setActiveOpportunity(event.active.data.current.opportunity);
    }

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveOpportunity(null);
        const { active, over } = event;
        if (!over) return;

        const activeColumn = findColumn(active.id as number);
        const overColumn = over.id as string;

        if (!activeColumn || !overColumn) return;

        const targetColumnId = overColumn;

        // --- DND: Update Local State ---

        setKanbanItems(prev => {
            // 1. Defensively get source and destination arrays (use empty array as fallback)
            const sourceItems = [...(prev[activeColumn] || [])];
            // FIX: Use || [] to ensure it's an array if targetColumnId unexpectedly maps to undefined/null
            const destinationItems = [...(prev[targetColumnId] || [])];

            // 2. Find the item and indices
            const activeIndex = sourceItems.findIndex(item => item.id === active.id);
            if (activeIndex === -1) return prev; // Safety check: Item not found

            const overIndex = over.data.current?.sortable?.index !== undefined
                ? over.data.current.sortable.index
                : destinationItems.length;

            // --- Case 1: Reordering within the same column ---
            if (activeColumn === targetColumnId) {
                // Since we used spread on sourceItems, activeColumn == targetColumnId, we only need to update that one array
                const newItems = arrayMove(sourceItems, activeIndex, overIndex);

                return {
                    ...prev,
                    [activeColumn]: newItems
                };
            }

            // --- Case 2: Moving to a different column ---

            // a. Remove item from the source array (mutates sourceItems copy)
            const [movedItem] = sourceItems.splice(activeIndex, 1);

            // b. Insert item into the destination array (mutates destinationItems copy)
            destinationItems.splice(overIndex, 0, movedItem);

            // c. Return the new state object with both columns updated
            return {
                ...prev,
                [activeColumn]: sourceItems,      // The new source array
                [targetColumnId]: destinationItems // The new destination array
            };
        });

        // --- API: Send Stage Update to Backend ---
        // ... (API logic remains the same, using targetColumnId)
        const opportunityId = active.id;
        const opportunityToUpdate = opportunities?.data?.find(o => o.id === opportunityId);

        if (opportunityToUpdate) {
            router.put(route('opportunities.update', opportunityId as unknown as string), {
                title: opportunityToUpdate.title,
                stage: targetColumnId,
                value: opportunityToUpdate.value,
                probability: opportunityToUpdate.probability,
                // Add other necessary fields if required by backend validation
            }, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => { /* toast success */ },
                onError: (errors) => { /* revert local state and toast error */ }
            });
        }
    };
    // Calculate total value per stage for the Kanban view
    const columnTotals = useMemo(() => {
        return Object.keys(kanbanItems).reduce((acc, stage) => {
            acc[stage] = kanbanItems[stage].reduce((sum, opp) => sum + (Number(opp.value) || 0), 0);
            return acc;
        }, {} as Record<string, number>);
    }, [kanbanItems]);

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);


    // --- FILTER HANDLERS ---
    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        const actualValue = value === CLEAR_FILTER_VALUE ? '' : value;
        setFilterValues(prev => ({ ...prev, [key]: actualValue }));
    };

    const handleFilterSubmit = () => {
        const query = pickBy(filterValues);
        router.get(route('opportunities.index'), query, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleResetFilters = () => {
        setFilterValues({});
        router.get(route('opportunities.index'));
    };

    const buildExportUrl = () => {
        const query = pickBy(filters);
        const queryString = new URLSearchParams(query as any).toString();
        // Point to the new export route
        return `${route('opportunities.export')}?${queryString}`;
    };
    // --- END FILTER HANDLERS ---

    // --- UI HELPERS ---
    const totalValue = opportunities.data.reduce((sum: number, opp: Opportunity) => sum + (Number(opp.value) || 0), 0);
    const totalWeightedValue = opportunities.data.reduce((sum: number, opp: Opportunity) => sum + ((Number(opp.value) || 0) * (opp.probability || 0) / 100), 0);
    const wonCount = opportunities.data.filter((o: Opportunity) => o.stage === 'Won').length;
    const lostCount = opportunities.data.filter((o: Opportunity) => o.stage === 'Lost').length;
    const winRate = (wonCount + lostCount) > 0 ? (wonCount / (wonCount + lostCount) * 100).toFixed(1) : 0;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Opportunities' }]}>
            <Head title="Opportunities Pipeline" />

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="flex flex-col flex-1 p-6 lg:p-8 space-y-6 bg-zinc-50 relative"
            >

                {/* --- TOP HEADER & ACTIONS --- */}
                <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative z-10">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                                Opportunities
                            </h1>
                        </div>
                        <p className="text-zinc-500 text-sm font-medium">
                            Manage your pipeline and track deal progress.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <div className="bg-zinc-200/50 p-0.5 rounded-lg flex items-center border border-zinc-200">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentView('kanban')}
                                className={cn("rounded-md font-medium text-xs h-7 px-3 transition-colors", currentView === 'kanban' ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-700")}
                            >
                                Kanban
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentView('list')}
                                className={cn("rounded-md font-medium text-xs h-7 px-3 transition-colors", currentView === 'list' ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-700")}
                            >
                                List
                            </Button>
                        </div>
                        <div className="h-8 w-px bg-border hidden sm:block" />
                        <div className="flex items-center gap-2">
                            <a href={buildExportUrl()}>
                                <Button variant="outline" className="bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-50 h-9 px-4 text-xs font-medium transition-colors shadow-sm">
                                    <Download className="mr-2 h-3.5 w-3.5" /> Export
                                </Button>
                            </a>
                            <Link href={route('opportunities.create')}>
                                <Button className="bg-primary hover:bg-primary-dark text-white font-medium h-9 px-4 text-xs rounded-lg shadow-sm transition-all active:scale-[0.98]">
                                    <Plus className="mr-2 h-4 w-4" /> New Deal
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* --- PIPELINE STATS CARDS --- */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                    <Card className="border border-zinc-200 shadow-sm bg-white rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 ease-in-out group">
                        <div className="h-1 bg-primary rounded-t-xl" />
                        <CardContent className="p-6 flex flex-col gap-2">
                            <p className="text-sm font-medium text-zinc-500">Total Pipeline</p>
                            <p className="text-2xl font-semibold text-primary tabular-nums">{formatCurrency(totalValue)}</p>
                        </CardContent>
                    </Card>

                    <Card className="border border-zinc-200 shadow-sm bg-white rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 ease-in-out group">
                        <div className="h-1 bg-primary rounded-t-xl" />
                        <CardContent className="p-6 flex flex-col gap-2">
                            <p className="text-sm font-medium text-zinc-500">Weighted</p>
                            <p className="text-2xl font-semibold text-primary tabular-nums">{formatCurrency(totalWeightedValue)}</p>
                        </CardContent>
                    </Card>

                    <Card className="border border-zinc-200 shadow-sm bg-white rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 ease-in-out group">
                        <div className="h-1 bg-primary rounded-t-xl" />
                        <CardContent className="p-6 flex flex-col gap-2">
                            <p className="text-sm font-medium text-zinc-500">Win Rate</p>
                            <p className="text-2xl font-semibold text-primary tabular-nums">{winRate}%</p>
                        </CardContent>
                    </Card>

                    <Card className="border border-zinc-200 shadow-sm bg-white rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 ease-in-out group">
                        <div className="h-1 bg-primary rounded-t-xl" />
                        <CardContent className="p-6 flex flex-col gap-2">
                            <p className="text-sm font-medium text-zinc-500">Win/Loss</p>
                            <p className="text-2xl font-semibold text-primary tabular-nums">{wonCount} / {lostCount}</p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* --- FILTERS & SEARCH --- */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-center bg-white border border-zinc-200 p-2 rounded-xl shadow-sm relative z-10">
                    <div className="relative flex-1 w-full group/search">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                            placeholder="Search deals..."
                            value={filterValues.search || ''}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleFilterSubmit()}
                            className="pl-9 pr-4 py-2 border-zinc-300 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary text-sm font-medium placeholder:text-zinc-400 h-9 rounded-lg"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto px-1">
                        <Select value={filterValues.stage || CLEAR_FILTER_VALUE} onValueChange={(v) => handleFilterChange('stage', v)}>
                            <SelectTrigger className="w-full sm:w-36 border-zinc-300 bg-white hover:bg-zinc-50 h-9 text-xs font-medium rounded-lg px-3 transition-colors">
                                <SelectValue placeholder="Stage" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg border-zinc-200 shadow-xl">
                                <SelectItem value={CLEAR_FILTER_VALUE} className="text-xs">All Stages</SelectItem>
                                {filterOptions.stages.map(s => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
                            </SelectContent>
                        </Select>

                        <Select value={filterValues.assigned_user_id || CLEAR_FILTER_VALUE} onValueChange={(v) => handleFilterChange('assigned_user_id', v)}>
                            <SelectTrigger className="w-full sm:w-36 border-zinc-300 bg-white hover:bg-zinc-50 h-9 text-xs font-medium rounded-lg px-3 transition-colors">
                                <SelectValue placeholder="Owner" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg border-zinc-200 shadow-xl">
                                <SelectItem value={CLEAR_FILTER_VALUE} className="text-xs">All Owners</SelectItem>
                                {filterOptions.users.map(u => <SelectItem key={u.id} value={String(u.id)} className="text-xs">{u.name}</SelectItem>)}
                            </SelectContent>
                        </Select>

                        <Button onClick={handleFilterSubmit} size="sm" className="bg-primary hover:bg-primary-dark text-white font-medium text-xs h-9 px-6 rounded-lg transition-colors">
                            Run
                        </Button>

                        {isFiltersApplied && (
                            <Button variant="ghost" size="icon" onClick={handleResetFilters} className="h-9 w-9 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </motion.div>

                {/* --- MAIN PIPELINE VIEW --- */}
                <motion.div variants={itemVariants} className="flex-1 min-h-0 relative z-10">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="flex gap-8 overflow-x-auto pb-10 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 snap-x overflow-y-hidden scrollbar-hide">
                            {OPPORTUNITY_STAGES.map(stage => (
                                <KanbanColumn
                                    key={stage}
                                    id={stage}
                                    title={stage}
                                    tasks={kanbanItems[stage] || []}
                                    totalValue={columnTotals[stage] || 0}
                                />
                            ))}
                        </div>
                        <DragOverlay dropAnimation={null}>
                            {activeOpportunity ? (
                                <div className="z-[100] cursor-grabbing">
                                    <KanbanCard opportunity={activeOpportunity} isOverlay />
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                </motion.div>
            </motion.div>
        </AppLayout>
    );
};

export default OpportunitiesIndex;
