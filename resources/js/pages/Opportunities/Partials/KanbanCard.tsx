import React from 'react';
import { Link } from '@inertiajs/react';
import { DollarSign, Calendar, User, Building2, UserCircle, AlertTriangle, Clock, Filter, GripVertical, CheckCircle2, XCircle } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Opportunity } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface KanbanCardProps {
    opportunity: Opportunity;
    isOverlay?: boolean;
}

const getProbabilityColor = (probability: number): string => {
    if (probability >= 90) return 'bg-emerald-500';
    if (probability >= 70) return 'bg-blue-500';
    if (probability >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
};

const formatCurrency = (value?: number | null, currencyCode?: string) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode || 'USD', maximumFractionDigits: 0 }).format(value);
};

const KanbanCard: React.FC<KanbanCardProps> = ({ opportunity, isOverlay }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: opportunity.id,
        data: { opportunity }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        zIndex: isDragging ? 50 : 'auto',
    };

    const isOverdue = opportunity.expected_close_date && new Date(opportunity.expected_close_date) < new Date() && opportunity.stage !== 'Won' && opportunity.stage !== 'Lost';
    const isWon = opportunity.stage === 'Won';
    const isLost = opportunity.stage === 'Lost';

    const assignedUser = opportunity.assignedUser;
    const probability = opportunity.probability || 0;
    const value = Number(opportunity.value) || 0;

    const dueDate = opportunity.expected_close_date ? new Date(opportunity.expected_close_date) : null;
    const dueDateText = dueDate ? format(dueDate, 'MMM d') : 'No date';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="group outline-none"
            >
                <Card className={cn(
                    "relative mb-3 cursor-grab active:cursor-grabbing transition-all duration-300",
                    "bg-white border-zinc-200/80 shadow-sm hover:shadow-md hover:border-primary/30 rounded-xl overflow-hidden",
                    isOverlay && "scale-105 shadow-2xl rotate-2 ring-2 ring-primary/20",
                    isDragging && "shadow-none border-dashed border-2 border-primary/40 bg-primary/5"
                )}>
                    {/* Left side probability indicator bar */}
                    <div className={cn(
                        "absolute left-0 top-0 bottom-0 w-1",
                        isWon ? "bg-emerald-500" : isLost ? "bg-rose-500" : getProbabilityColor(probability)
                    )} />

                    <CardContent className="p-4 pl-5">
                        <div className="flex justify-between items-start mb-2 gap-2">
                            <Link href={route('opportunities.show', opportunity.id)} className="hover:underline decoration-primary/50 flex-1">
                                <h3 className="font-semibold text-zinc-900 text-[15px] leading-snug line-clamp-2">
                                    {opportunity.title}
                                </h3>
                            </Link>
                            <div className="shrink-0 flex space-x-1">
                                {isWon && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                {isLost && <XCircle className="w-5 h-5 text-rose-500" />}
                                {!isWon && !isLost && (
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-300 hover:text-zinc-500 p-0.5">
                                        <GripVertical className="w-4 h-4 cursor-grab" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[17px] font-bold tracking-tight text-zinc-800">
                                {formatCurrency(value)}
                            </span>
                            {!isWon && !isLost && (
                                <Badge variant="secondary" className={cn(
                                    "px-1.5 py-0 text-[10px] uppercase font-bold tracking-wider",
                                    probability >= 70 ? "bg-primary/10 text-primary" : "bg-zinc-100 text-zinc-500"
                                )}>
                                    {probability}%
                                </Badge>
                            )}
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-y-2 mt-3 pt-3 border-t border-zinc-100">
                            {/* Company */}
                            <div className="flex items-center text-zinc-500 col-span-2">
                                <Building2 className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                                <span className="text-xs font-medium truncate">
                                    {opportunity.company ? opportunity.company.name : 'No Company'}
                                </span>
                            </div>

                            {/* Date */}
                            <div className={cn(
                                "flex items-center",
                                isOverdue ? "text-rose-600 font-semibold" : "text-zinc-500"
                            )}>
                                {isOverdue ? (
                                    <AlertTriangle className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                                ) : (
                                    <Calendar className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                                )}
                                <span className="text-xs truncate">
                                    {dueDateText}
                                </span>
                            </div>

                            {/* Assigned User */}
                            <div className="flex items-center justify-end text-right">
                                {assignedUser ? (
                                    <div className="flex items-center gap-1.5 group-hover:bg-zinc-50 px-1.5 py-0.5 rounded-md transition-colors">
                                        <span className="text-[11px] font-medium text-zinc-600 truncate max-w-[80px]">
                                            {assignedUser.name.split(' ')[0]}
                                        </span>
                                        <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold ring-1 ring-primary/20">
                                            {assignedUser.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-5 w-5 rounded-full border border-dashed border-zinc-300 flex items-center justify-center bg-zinc-50" title="Unassigned">
                                        <UserCircle className="h-3 w-3 text-zinc-400" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
};

export default KanbanCard;
