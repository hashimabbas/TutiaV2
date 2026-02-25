import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Opportunity } from '@/types';
import KanbanCard from './KanbanCard';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence } from 'framer-motion';

interface KanbanColumnProps {
    id: string; // The stage name
    title: string;
    tasks: Opportunity[]; // Opportunities for this stage
    totalValue: number;
}

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
};

// Map stage names to specific dynamic colors.
const getStageColorStyle = (stage: string) => {
    switch (stage) {
        case 'New Lead': return { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-400', indicator: 'bg-blue-500' };
        case 'Qualification': return { bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-200 dark:border-indigo-800', text: 'text-indigo-700 dark:text-indigo-400', indicator: 'bg-indigo-500' };
        case 'Needs Analysis': return { bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-200 dark:border-violet-800', text: 'text-violet-700 dark:text-violet-400', indicator: 'bg-violet-500' };
        case 'Proposal Sent': return { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-400', indicator: 'bg-amber-500' };
        case 'Negotiation': return { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-400', indicator: 'bg-orange-500' };
        case 'Won': return { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-400', indicator: 'bg-emerald-500' };
        case 'Lost': return { bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-800', text: 'text-rose-700 dark:text-rose-400', indicator: 'bg-rose-500' };
        default: return { bg: 'bg-zinc-50 dark:bg-zinc-900/20', border: 'border-zinc-200 dark:border-zinc-800', text: 'text-zinc-700 dark:text-zinc-400', indicator: 'bg-zinc-500' };
    }
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, tasks, totalValue }) => {
    const { setNodeRef } = useDroppable({
        id,
        data: {
            type: 'COLUMN',
            title,
        }
    });

    const colors = getStageColorStyle(title);

    return (
        <div className="flex-none w-[340px] h-full flex flex-col group/column snap-start">
            {/* Header Area */}
            <div className={cn("px-4 py-3 mb-3 rounded-xl border bg-white/60 backdrop-blur-sm shadow-sm", colors.border)}>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                        <div className={cn("w-2.5 h-2.5 rounded-full", colors.indicator)} />
                        <h3 className="font-semibold text-zinc-900 text-[15px] tracking-tight">
                            {title}
                        </h3>
                    </div>
                    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", colors.bg, colors.text)}>
                        {tasks.length}
                    </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500 font-medium">Pipeline Value</span>
                    <span className="font-semibold text-zinc-900">
                        {formatCurrency(totalValue)}
                    </span>
                </div>
            </div>

            {/* Content Area */}
            <div
                ref={setNodeRef}
                className={cn(
                    "flex-grow rounded-2xl p-2.5 transition-colors duration-200",
                    "bg-zinc-100/60 border border-zinc-200/50",
                    "scrollbar-hide overflow-y-auto"
                )}
                style={{ minHeight: 'calc(100vh - 360px)' }}
            >
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3 min-h-[150px]">
                        <AnimatePresence mode="popLayout">
                            {tasks.map(opportunity => (
                                <KanbanCard key={opportunity.id} opportunity={opportunity} />
                            ))}
                        </AnimatePresence>

                        {tasks.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 px-4 shadow-sm border border-dashed border-zinc-300 rounded-xl bg-white/40 backdrop-blur-sm text-center">
                                <Plus className="h-8 w-8 text-zinc-400 mb-3" />
                                <p className="text-sm font-medium text-zinc-600">
                                    No deals in this stage
                                </p>
                                <p className="text-xs text-zinc-400 mt-1">
                                    Drag deals here to update
                                </p>
                            </div>
                        )}
                    </div>
                </SortableContext>
            </div>
        </div>
    );
};

export default KanbanColumn;
