import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { format } from 'date-fns';
import { Briefcase, Calendar as CalendarIcon, Check, ChevronsUpDown, Loader2, User as UserIcon } from 'lucide-react';

import { Opportunity, User, Contact, Task } from '@/types';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// --- Schema and Types ---

const taskPriorities = ['low', 'medium', 'high'] as const;

const taskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    assigned_to_user_id: z.string().min(1, 'A user must be assigned'),
    priority: z.enum(taskPriorities, { required_error: 'Priority is required' }),
    due_date: z.date().optional(),
    opportunity_id: z.string().optional(),
    contact_id: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

// --- ENHANCED PROPS ---
interface TaskFormProps {
    users: User[];
    opportunities: Opportunity[];
    contacts: Contact[];
    taskToEdit?: Task | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ users, opportunities, contacts, taskToEdit = null, onSuccess, onCancel }) => {
    const isEditing = !!taskToEdit;

    const form = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: taskToEdit?.title || '',
            description: taskToEdit?.description || '',
            assigned_to_user_id: taskToEdit ? String(taskToEdit.assigned_to_user_id) : '',
            priority: taskToEdit?.priority || 'medium',
            due_date: taskToEdit?.due_date ? new Date(taskToEdit.due_date) : undefined,
            opportunity_id: taskToEdit?.opportunity_id ? String(taskToEdit.opportunity_id) : '',
            contact_id: taskToEdit?.contact_id ? String(taskToEdit.contact_id) : '',
        },
    });

    // --- DYNAMIC SUBMISSION ---
    const onSubmit = (data: TaskFormData) => {
        const postData = {
            ...data,
            due_date: data.due_date ? format(data.due_date, 'yyyy-MM-dd') : null,
            assigned_to_user_id: Number(data.assigned_to_user_id),
            opportunity_id: data.opportunity_id ? Number(data.opportunity_id) : null,
            contact_id: data.contact_id ? Number(data.contact_id) : null,
        };

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                onSuccess();
            },
            onError: (errors: any) => { console.error("Form submission error:", errors); },
        };

        if (isEditing) {
            router.put(route('tasks.update', taskToEdit.id), postData, options);
        } else {
            router.post(route('tasks.store'), postData, options);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* --- ALL FORM FIELDS ARE NOW FILLED IN --- */}
                <div className="space-y-4">
                    <FormField name="title" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Follow up with client" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />

                    <FormField name="assigned_to_user_id" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Assign To</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a user" /></SelectTrigger></FormControl><SelectContent>
                            {users.map(user => (<SelectItem key={user.id} value={String(user.id)}>{user.name}</SelectItem>))}
                        </SelectContent></Select><FormMessage /></FormItem>
                    )} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField name="due_date" control={form.control} render={({ field }) => (
                            <FormItem className="flex flex-col"><FormLabel>Due Date</FormLabel><Popover>
                                <PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button></FormControl></PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                </PopoverContent></Popover><FormMessage /></FormItem>
                        )} />
                        <FormField name="priority" control={form.control} render={({ field }) => (
                            <FormItem><FormLabel>Priority</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Set priority" /></SelectTrigger></FormControl><SelectContent>
                                {taskPriorities.map(p => (<SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>))}
                            </SelectContent></Select><FormMessage /></FormItem>
                        )} />
                    </div>

                    <h4 className="text-sm font-medium text-muted-foreground pt-2">Link To (Optional)</h4>

                    <FormField name="opportunity_id" control={form.control} render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Opportunity</FormLabel><Popover><PopoverTrigger asChild>
                            <FormControl><Button variant="outline" role="combobox" className={cn("w-full justify-between", !field.value && "text-muted-foreground")}>
                                <Briefcase className="mr-2 h-4 w-4" />{field.value ? opportunities.find(o => String(o.id) === field.value)?.title : "Select an opportunity"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button></FormControl>
                        </PopoverTrigger><PopoverContent className="w-[--radix-popover-trigger-width] p-0"><Command><CommandInput placeholder="Search opportunity..." /><CommandEmpty>No opportunity found.</CommandEmpty><CommandList><CommandGroup>
                            {opportunities.map(opp => (<CommandItem value={opp.title} key={opp.id} onSelect={() => form.setValue("opportunity_id", String(opp.id))}><Check className={cn("mr-2 h-4 w-4", String(opp.id) === field.value ? "opacity-100" : "opacity-0")} />{opp.title}</CommandItem>))}
                        </CommandGroup></CommandList></Command></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />

                    <FormField name="contact_id" control={form.control} render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Contact</FormLabel><Popover><PopoverTrigger asChild>
                            <FormControl><Button variant="outline" role="combobox" className={cn("w-full justify-between", !field.value && "text-muted-foreground")}>
                                <UserIcon className="mr-2 h-4 w-4" />{field.value ? contacts.find(c => String(c.id) === field.value)?.first_name + ' ' + contacts.find(c => String(c.id) === field.value)?.last_name : "Select a contact"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button></FormControl>
                        </PopoverTrigger><PopoverContent className="w-[--radix-popover-trigger-width] p-0"><Command><CommandInput placeholder="Search contact..." /><CommandEmpty>No contact found.</CommandEmpty><CommandList><CommandGroup>
                            {contacts.map(contact => (<CommandItem value={`${contact.first_name} ${contact.last_name}`} key={contact.id} onSelect={() => form.setValue("contact_id", String(contact.id))}><Check className={cn("mr-2 h-4 w-4", String(contact.id) === field.value ? "opacity-100" : "opacity-0")} />{contact.first_name} {contact.last_name}</CommandItem>))}
                        </CommandGroup></CommandList></Command></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />

                    <FormField name="description" control={form.control} render={({ field }) => (
                        <FormItem><FormLabel>Description / Notes</FormLabel><FormControl><Textarea placeholder="Add any relevant details..." className="min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>

                {/* --- DYNAMIC FOOTER BUTTONS --- */}
                <div className="flex justify-end space-x-4 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={form.formState.isSubmitting}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditing ? 'Save Changes' : 'Create Task'}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
