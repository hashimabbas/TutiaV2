import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { format, isPast, isToday, differenceInDays } from 'date-fns';
import { Briefcase, Calendar, CheckCircle, Filter, Flag, MoreHorizontal, Plus, Trash2, User as UserIcon, Pencil, Loader2 } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Contact, Opportunity, PageProps, PaginatedResponse, Task, User } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { TaskForm } from './Partials/TaskForm';
import { Pagination } from './components/Pagination';

interface TaskIndexProps {
    tasks: PaginatedResponse<Task>;
    filters: {
        status?: 'pending' | 'completed';
        priority?: 'low' | 'medium' | 'high';
        due?: 'overdue' | 'today';
        assigned_to?: 'me';
    };
    users: User[];
    opportunities: Opportunity[];
    contacts: Contact[];
}

// --- SAFER HELPER FUNCTIONS ---

const getPriorityBadgeVariant = (priority: Task['priority']): BadgeProps['variant'] => {
    switch (priority) {
        case 'high': return 'destructive';
        case 'medium': return 'default';
        case 'low': return 'secondary';
        default: return 'secondary';
    }
};

const formatDueDate = (dueDate: string | null | undefined): { text: string; className: string } => {
    if (!dueDate) {
        return { text: 'No due date', className: 'text-muted-foreground' };
    }

    const date = new Date(dueDate);

    // CRITICAL FIX: Check if the date object is valid.
    if (isNaN(date.getTime())) {
        return { text: 'Invalid Date', className: 'text-red-500 font-semibold' };
    }

    if (isPast(date) && !isToday(date)) {
        const daysOverdue = differenceInDays(new Date(), date);
        const dayText = daysOverdue === 1 ? 'day' : 'days';
        return { text: `Overdue by ${daysOverdue} ${dayText}`, className: 'text-red-500 font-semibold' };
    }
    if (isToday(date)) {
        return { text: 'Due Today', className: 'text-blue-500 font-semibold' };
    }
    return { text: `Due ${format(date, 'MMM d')}`, className: 'text-muted-foreground' };
};


const TasksIndex: React.FC = () => {
    const { props } = usePage<PageProps & TaskIndexProps>();
    const { tasks, filters, users, opportunities, contacts } = props;

    // --- CONSOLIDATED STATE MANAGEMENT ---
    const [modalState, setModalState] = useState<{ mode: 'create' | 'edit' | null, task?: Task | null }>({ mode: null });
    const [currentFilters, setCurrentFilters] = useState(filters);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    useEffect(() => { setCurrentFilters(filters); }, [filters]);

    // --- LOGIC FUNCTIONS ---
    const handleFilterChange = (key: keyof typeof filters, value: string | undefined) => {
        setCurrentFilters(prev => ({ ...prev, [key]: value }));
    };
    const applyFilters = () => {
        router.get(route('tasks.index'), currentFilters, { preserveState: true, preserveScroll: true, replace: true });
    };
    const clearFilters = () => {
        router.get(route('tasks.index'), {}, { preserveState: true, preserveScroll: true, replace: true });
    };
    const handleToggleStatus = (task: Task) => {
        router.patch(route('tasks.toggle', task.id), {}, { preserveScroll: true });
    };
    const handleDelete = (taskId: number) => {
        router.delete(route('tasks.destroy', taskId), { preserveScroll: true, onStart: () => setIsDeleting(taskId), onFinish: () => setIsDeleting(null) });
    };

    const closeModal = () => setModalState({ mode: null });

    return (
        <AppLayout breadcrumbs={[{ title: 'Tasks' }]}>
            <Head title="Tasks" />

            {/* --- SINGLE, CONSOLIDATED MODAL --- */}
            <Dialog open={!!modalState.mode} onOpenChange={closeModal}>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <DialogTitle>{modalState.mode === 'edit' ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                        <DialogDescription>
                            {modalState.mode === 'edit'
                                ? `Update the details for "${modalState.task?.title}".`
                                : "Fill in the details below to add a new task."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <TaskForm
                            taskToEdit={modalState.mode === 'edit' ? modalState.task : null}
                            users={users}
                            opportunities={opportunities}
                            contacts={contacts}
                            onSuccess={closeModal}
                            onCancel={closeModal}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Task Management</h1>
                        <p className="text-muted-foreground mt-1">View, filter, and manage all your team's tasks.</p>
                    </div>
                    <Button onClick={() => setModalState({ mode: 'create' })}>
                        <Plus className="mr-2 h-4 w-4" /> Create Task
                    </Button>
                </div>

                {/* Filter Card */}
                <Card>
                    <CardHeader className="p-4"><CardTitle className="flex items-center gap-2 text-base"><Filter className="h-4 w-4" /> Filters</CardTitle></CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Select value={currentFilters.status || ''} onValueChange={(v) => handleFilterChange('status', v || undefined)}>
                                <SelectTrigger><SelectValue placeholder="By Status..." /></SelectTrigger>
                                <SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent>
                            </Select>
                            <Select value={currentFilters.priority || ''} onValueChange={(v) => handleFilterChange('priority', v || undefined)}>
                                <SelectTrigger><SelectValue placeholder="By Priority..." /></SelectTrigger>
                                <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent>
                            </Select>
                            <Select value={currentFilters.due || ''} onValueChange={(v) => handleFilterChange('due', v || undefined)}>
                                <SelectTrigger><SelectValue placeholder="By Due Date..." /></SelectTrigger>
                                <SelectContent><SelectItem value="overdue">Overdue</SelectItem><SelectItem value="today">Today</SelectItem></SelectContent>
                            </Select>
                            <div className="flex items-center justify-end space-x-2">
                                <Button variant="ghost" onClick={clearFilters} className="w-full sm:w-auto">Clear</Button>
                                <Button onClick={applyFilters} className="w-full sm:w-auto">Apply</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Task List */}
                <div className="space-y-3">
                    {tasks.data.length > 0 ? (
                        tasks.data.map(task => {
                            const dueDateInfo = formatDueDate(task.due_date); // Call the function only ONCE

                            return (
                                <div key={task.id} className="bg-card border rounded-lg p-4 flex items-start gap-4 transition-all hover:shadow-md data-[completed=true]:opacity-60" data-completed={task.status === 'completed'}>
                                    <TooltipProvider><Tooltip><TooltipTrigger asChild><Checkbox id={`task-${task.id}`} checked={task.status === 'completed'} onCheckedChange={() => handleToggleStatus(task)} className="mt-1" /></TooltipTrigger><TooltipContent><p>Mark as {task.status === 'completed' ? 'pending' : 'complete'}</p></TooltipContent></Tooltip></TooltipProvider>
                                    <div className="flex-1 space-y-1">
                                        {/* --- THIS IS THE FIX --- */}
                                        {/* Wrap the title in an Inertia Link that points to the show page */}
                                        <Link href={route('tasks.show', task.id)} className="block">
                                            <label
                                                htmlFor={`task-${task.id}`}
                                                className={cn(
                                                    "font-medium leading-none cursor-pointer hover:underline text-primary",
                                                    task.status === 'completed' && "line-through text-muted-foreground no-underline"
                                                )}
                                            >
                                                {task.title}
                                            </label>
                                        </Link>
                                        {/* --- END FIX --- */}
                                        <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
                                            <div className={cn("flex items-center", dueDateInfo.className)}><Calendar className="mr-1.5 h-3.5 w-3.5" />{dueDateInfo.text}</div>
                                            {task.opportunity && <Link href={route('opportunities.show', task.opportunity.id)} className="flex items-center text-primary hover:underline"><Briefcase className="mr-1.5 h-3.5 w-3.5" />{task.opportunity.title}</Link>}
                                            {task.contact && <Link href={route('contacts.show', task.contact.id)} className="flex items-center text-primary hover:underline"><UserIcon className="mr-1.5 h-3.5 w-3.5" />{task.contact.first_name} {task.contact.last_name}</Link>}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={getPriorityBadgeVariant(task.priority)} className="capitalize flex-none"><Flag className="mr-1 h-3 w-3" />{task.priority}</Badge>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onSelect={() => setModalState({ mode: 'edit', task })}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild><DropdownMenuItem onSelect={e => e.preventDefault()} className="text-red-500 focus:text-red-500"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem></AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader><AlertDialogTitle>Delete Task</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
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
                            )
                        })
                    ) : (
                        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-muted/50">
                            <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">All Clear!</h3>
                            <p className="mt-1 text-sm text-gray-500">No tasks match your current filters.</p>
                        </div>
                    )}
                </div>

                {/* --- IMPLEMENTED PAGINATION --- */}
                {tasks && tasks.meta && tasks.data.length > 0 && tasks.meta.links.length > 3 && (
                    <div className="mt-6 flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {tasks.meta.from} to {tasks.meta.to} of {tasks.meta.total} tasks
                        </p>
                        <Pagination links={tasks.meta.links} />
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default TasksIndex;
