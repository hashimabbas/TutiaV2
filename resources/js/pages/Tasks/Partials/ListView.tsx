import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { format, isPast, isToday, differenceInDays } from 'date-fns';
import { Briefcase, Calendar, CheckCircle, Flag, Loader2, MoreHorizontal, Pencil, Trash2, User as UserIcon } from 'lucide-react';

import { Task } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';

// --- Props for this component ---
interface ListViewProps {
    tasks: Task[];
    onEditTask: (task: Task) => void; // Callback to open the edit modal in the parent
}

// --- Helper Functions (copied from your old Index.tsx) ---
const getPriorityBadgeVariant = (priority: Task['priority']): BadgeProps['variant'] => {
    switch (priority) {
        case 'high': return 'destructive';
        case 'medium': return 'default';
        case 'low': return 'secondary';
        default: return 'secondary';
    }
};

const formatDueDate = (dueDate: string | null | undefined): { text: string; className: string } => {
    if (!dueDate) return { text: 'No due date', className: 'text-muted-foreground' };
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) {
        const daysOverdue = differenceInDays(new Date(), date);
        return { text: `Overdue by ${daysOverdue} day(s)`, className: 'text-red-500 font-semibold' };
    }
    if (isToday(date)) {
        return { text: 'Due Today', className: 'text-blue-500 font-semibold' };
    }
    return { text: `Due ${format(date, 'MMM d')}`, className: 'text-muted-foreground' };
};


export const ListView: React.FC<ListViewProps> = ({ tasks, onEditTask }) => {
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const handleToggleStatus = (task: Task) => {
        router.patch(route('tasks.toggle', task.id), {}, { preserveScroll: true });
    };

    const handleDelete = (taskId: number) => {
        router.delete(route('tasks.destroy', taskId), {
            preserveScroll: true,
            onStart: () => setIsDeleting(taskId),
            onFinish: () => setIsDeleting(null),
        });
    };

    return (
        <div className="space-y-3">
            {tasks.length > 0 ? (
                tasks.map(task => (
                    <div key={task.id} className="bg-card border rounded-lg p-4 flex items-start gap-4 transition-all hover:shadow-md data-[completed=true]:opacity-60" data-completed={task.status === 'completed'}>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Checkbox
                                        id={`task-${task.id}`}
                                        checked={task.status === 'completed'}
                                        onCheckedChange={() => handleToggleStatus(task)}
                                        className="mt-1"
                                    />
                                </TooltipTrigger>
                                <TooltipContent><p>Mark as {task.status === 'completed' ? 'pending' : 'complete'}</p></TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <div className="flex-1 space-y-1">
                            <label htmlFor={`task-${task.id}`} className={cn("font-medium leading-none cursor-pointer", task.status === 'completed' && "line-through")}>
                                {task.title}
                            </label>
                            <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
                                <div className={cn("flex items-center", formatDueDate(task.due_date).className)}><Calendar className="mr-1.5 h-3.5 w-3.5" />{formatDueDate(task.due_date).text}</div>
                                {task.opportunity && <Link href={route('opportunities.show', task.opportunity.id)} className="flex items-center text-primary hover:underline"><Briefcase className="mr-1.5 h-3.5 w-3.5" />{task.opportunity.title}</Link>}
                                {task.contact && <Link href={route('contacts.show', task.contact.id)} className="flex items-center text-primary hover:underline"><UserIcon className="mr-1.5 h-3.5 w-3.5" />{task.contact.first_name} {task.contact.last_name}</Link>}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Badge variant={getPriorityBadgeVariant(task.priority)} className="capitalize flex-none"><Flag className="mr-1 h-3 w-3" /> {task.priority}</Badge>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onSelect={() => onEditTask(task)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500 focus:text-red-500"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem></AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>Delete Task</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete this task? This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel disabled={isDeleting === task.id}>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(task.id)} disabled={isDeleting === task.id} className="bg-destructive hover:bg-destructive/90">{isDeleting === task.id ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : 'Yes, delete'}</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg bg-muted/50">
                    <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">All Clear!</h3>
                    <p className="mt-1 text-sm text-gray-500">No tasks match your current filters.</p>
                </div>
            )}
        </div>
    );
};
