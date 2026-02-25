import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { format, isToday, isPast } from 'date-fns';
import {
    ArrowLeft, Briefcase, Building2, Calendar as CalendarIcon, CheckCircle, Info,
    Pencil, Trash2, User as UserIcon, Users, Flag, Loader2
} from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { PageProps, Task, User, Opportunity, Contact } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle as ModalTitle, DialogDescription as ModalDescription } from '@/components/ui/dialog';
import { TaskForm } from './Partials/TaskForm';

// --- PROPS INTERFACE ---
interface ShowProps {
    task: Task;
    users: User[];
    opportunities: Opportunity[];
    contacts: Contact[];
}

// --- HELPER FUNCTIONS ---
const getStatusBadgeVariant = (status: Task['status']): BadgeProps['variant'] => {
    return status === 'completed' ? 'default' : 'secondary';
};

const getPriorityBadgeVariant = (priority: Task['priority']): BadgeProps['variant'] => {
    switch (priority) {
        case 'high': return 'destructive';
        case 'medium': return 'default';
        case 'low': return 'secondary';
        default: return 'secondary';
    }
};

const formatDetailDate = (dateString?: string | null): string | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return format(date, 'PPP'); // e.g., "October 26th, 2024"
};

// --- REUSABLE DETAIL ITEM COMPONENT ---
const DetailItem: React.FC<{ icon: React.ElementType, label: string, children?: React.ReactNode }> = ({ icon: Icon, label, children }) => (
    <div className="flex flex-col space-y-1">
        <dt className="text-sm font-medium text-muted-foreground flex items-center">
            <Icon className="mr-2 h-4 w-4" />
            {label}
        </dt>
        <dd className="text-base sm:text-lg">
            {children || <span className="text-muted-foreground">-</span>}
        </dd>
    </div>
);


const TasksShow: React.FC = () => {
    const { props } = usePage<PageProps & ShowProps>();
    const { task, users, opportunities, contacts, flash } = props;

    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showFlash, setShowFlash] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleDelete = () => {
        router.delete(route('tasks.destroy', task.id), {
            onStart: () => setIsDeleting(true),
            onFinish: () => setIsDeleting(false),
            onSuccess: () => {
                // On success, Inertia will automatically take us to the index page
                // because we are redirecting from the controller's destroy method.
            }
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Tasks', url: route('tasks.index') }, { title: task.title }]}>
            <Head title={`Task: ${task.title}`} />

            {/* --- EDIT MODAL --- */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[625px]">
                    <DialogHeader>
                        <ModalTitle>Edit Task</ModalTitle>
                        <ModalDescription>Update the details for "{task.title}".</ModalDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <TaskForm
                            taskToEdit={task}
                            users={users}
                            opportunities={opportunities}
                            contacts={contacts}
                            onSuccess={() => setIsEditModalOpen(false)}
                            onCancel={() => setIsEditModalOpen(false)}
                        />
                    </div>
                </DialogContent>
            </Dialog>


            <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                {/* Header with actions */}
                <div className="flex items-center justify-between mb-6">
                    <Link href={route('tasks.index')}>
                        <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to All Tasks</Button>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <Button onClick={() => setIsEditModalOpen(true)}><Pencil className="mr-2 h-4 w-4" /> Edit</Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" disabled={isDeleting}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>Delete Task</AlertDialogTitle><AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                                        {isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : 'Yes, delete'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                {/* Flash Message on Update */}
                {showFlash && flash?.success && (
                    <Alert className="mb-4 border-green-500 text-green-700">
                        <Info className="h-4 w-4 !text-green-700" /><AlertTitle>Success!</AlertTitle><AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                {/* Main Details Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <CheckCircle className={`h-7 w-7 ${task.status === 'completed' ? 'text-green-500' : 'text-muted-foreground'}`} /> {task.title}
                        </CardTitle>
                        <CardDescription>
                            Created by {task.createdBy?.name || 'N/A'} on {formatDetailDate(task.created_at)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                            <DetailItem icon={Info} label="Status"><Badge variant={getStatusBadgeVariant(task.status)} className="text-base capitalize">{task.status}</Badge></DetailItem>
                            <DetailItem icon={Flag} label="Priority"><Badge variant={getPriorityBadgeVariant(task.priority)} className="text-base capitalize">{task.priority}</Badge></DetailItem>
                            <DetailItem icon={CalendarIcon} label="Due Date">{formatDetailDate(task.due_date)}</DetailItem>
                            <DetailItem icon={Users} label="Assigned To">{task.assignedTo?.name}</DetailItem>
                            <DetailItem icon={Briefcase} label="Related Opportunity">{task.opportunity ? <Link href={route('opportunities.show', task.opportunity.id)} className="text-primary hover:underline">{task.opportunity.title}</Link> : null}</DetailItem>
                            <DetailItem icon={UserIcon} label="Related Contact">{task.contact ? <Link href={route('contacts.show', task.contact.id)} className="text-primary hover:underline">{task.contact.first_name} {task.contact.last_name}</Link> : null}</DetailItem>
                        </dl>

                        {task.description && (
                            <>
                                <Separator />
                                <div className="space-y-2">
                                    <h3 className="text-lg font-medium">Description</h3>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{task.description}</p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default TasksShow;
