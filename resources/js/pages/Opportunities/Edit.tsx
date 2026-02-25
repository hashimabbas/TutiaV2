import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { route } from 'ziggy-js';
import { format } from 'date-fns';
import {
    Briefcase, Building2, Calendar as CalendarIcon, Check, ChevronsUpDown, DollarSign, FileText, Percent, User as UserIcon, Users
} from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { PageProps, Company, Contact, User, LeadSource, Opportunity } from '@/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Slider } from '@/components/ui/slider';
import { opportunitySchema, opportunityStages, OpportunityFormData } from '@/lib/opportunities';


// Props now include the opportunity to edit
interface OpportunitiesEditProps {
    opportunity: Opportunity;
    companies: Company[];
    contacts: Contact[];
    users: User[];
    leadSources: LeadSource[];
}


const OpportunitiesEdit: React.FC = () => {
    const { props } = usePage<PageProps & OpportunitiesEditProps>();
    const { opportunity, companies, contacts, users, leadSources } = props;

    const form = useForm<OpportunityFormData>({
        resolver: zodResolver(opportunitySchema),
        // CRITICAL: Populate defaultValues from the opportunity prop
        defaultValues: {
            title: opportunity.title || '',
            description: opportunity.description || '',
            company_id: String(opportunity.company_id) || '',
            contact_id: opportunity.contact_id ? String(opportunity.contact_id) : '',
            assigned_user_id: opportunity.assigned_user_id ? String(opportunity.assigned_user_id) : '',
            source_id: opportunity.source_id ? String(opportunity.source_id) : '',
            value: opportunity.value ? Number(opportunity.value) : 0,
            stage: opportunity.stage,
            probability: opportunity.probability ?? 0,
            // Convert the date string from Laravel into a Date object for the calendar
            expected_close_date: opportunity.expected_close_date ? new Date(opportunity.expected_close_date) : undefined,
            notes: opportunity.notes || '',
            next_step_label: opportunity.next_step_label || '', // New field
            next_step_due_date: opportunity.next_step_due_date ? new Date(opportunity.next_step_due_date) : undefined, // New field
        },
    });

    // Handle form submission for updates
    const onSubmit = (data: OpportunityFormData) => {
        const postData = {
            ...data,
            expected_close_date: data.expected_close_date ? format(data.expected_close_date, 'yyyy-MM-dd') : null,
            company_id: Number(data.company_id),
            contact_id: data.contact_id ? Number(data.contact_id) : null,
            assigned_user_id: data.assigned_user_id ? Number(data.assigned_user_id) : null,
            source_id: data.source_id ? Number(data.source_id) : null,
        };
        // Use router.put for updates and pass the opportunity ID
        router.put(route('opportunities.update', opportunity.id), postData);
    };

    const onErrors = (errors: any) => {
        console.error('Form validation failed. Errors:', errors);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Opportunities', url: route('opportunities.index') }, { title: 'Edit' }]}>
            <Head title="Edit Opportunity" />
            <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onErrors)} className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="h-6 w-6" /> Edit Opportunity
                                </CardTitle>
                                <CardDescription>Update the details for "{opportunity.title}".</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {/* The form sections are identical to Create.tsx, they will now be pre-filled */}
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Primary Information</h3>
                                    <div className="space-y-4">
                                        <FormField name="title" control={form.control} render={({ field }) => (
                                            <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Website Redesign Project" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField name="company_id" control={form.control} render={({ field }) => (
                                            <FormItem className="flex flex-col"><FormLabel>Company</FormLabel>
                                                <Popover><PopoverTrigger asChild>
                                                    <FormControl><Button variant="outline" role="combobox" className={cn("w-full justify-between", !field.value && "text-muted-foreground")}>
                                                        {field.value ? companies.find((c) => String(c.id) === field.value)?.name : "Select a company"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button></FormControl>
                                                </PopoverTrigger><PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                        <Command><CommandInput placeholder="Search company..." /><CommandEmpty>No company found.</CommandEmpty><CommandGroup>
                                                            {companies.map((company) => (<CommandItem value={company.name} key={company.id} onSelect={() => { form.setValue("company_id", String(company.id)); }}>
                                                                <Check className={cn("mr-2 h-4 w-4", String(company.id) === field.value ? "opacity-100" : "opacity-0")} />{company.name}
                                                            </CommandItem>))}
                                                        </CommandGroup></Command>
                                                    </PopoverContent></Popover><FormMessage /></FormItem>
                                        )} />
                                        <FormField name="contact_id" control={form.control} render={({ field }) => (
                                            <FormItem><FormLabel>Primary Contact (Optional)</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a contact" /></SelectTrigger></FormControl><SelectContent>
                                                {contacts.map((contact) => (<SelectItem key={contact.id} value={String(contact.id)}>{contact.first_name} {contact.last_name}</SelectItem>))}
                                            </SelectContent></Select><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="text-lg font-medium mb-4">Deal Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField name="stage" control={form.control} render={({ field }) => (
                                            <FormItem><FormLabel>Stage</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a stage" /></SelectTrigger></FormControl><SelectContent>
                                                {opportunityStages.map(stage => (<SelectItem key={stage} value={stage}>{stage}</SelectItem>))}
                                            </SelectContent></Select><FormMessage /></FormItem>
                                        )} />
                                        <FormField name="value" control={form.control} render={({ field }) => (
                                            <FormItem><FormLabel>Value</FormLabel><div className="relative">
                                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <FormControl><Input type="number" step="0.01" placeholder="5000.00" className="pl-8" {...field} /></FormControl>
                                            </div><FormMessage /></FormItem>
                                        )} />
                                        <FormField name="probability" control={form.control} render={({ field }) => (
                                            <FormItem><FormLabel>Probability</FormLabel><div className="flex items-center gap-4">
                                                <FormControl><Slider value={[Number(field.value)]} max={100} step={5} onValueChange={(vals) => field.onChange(vals[0])} /></FormControl>
                                                <span className="text-sm font-medium w-16 text-right">{field.value}%</span>
                                            </div><FormMessage /></FormItem>
                                        )} />
                                        <FormField name="expected_close_date" control={form.control} render={({ field }) => (
                                            <FormItem className="flex flex-col"><FormLabel>Expected Close Date</FormLabel><Popover>
                                                <PopoverTrigger asChild><FormControl><Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button></FormControl></PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                                </PopoverContent></Popover><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="text-lg font-medium mb-4">Attribution & Notes</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField name="assigned_user_id" control={form.control} render={({ field }) => (
                                            <FormItem><FormLabel>Assigned To (Optional)</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Assign to a user" /></SelectTrigger></FormControl><SelectContent>
                                                {users.map((user) => (<SelectItem key={user.id} value={String(user.id)}>{user.name}</SelectItem>))}
                                            </SelectContent></Select><FormMessage /></FormItem>
                                        )} />
                                        <FormField name="source_id" control={form.control} render={({ field }) => (
                                            <FormItem><FormLabel>Lead Source (Optional)</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a lead source" /></SelectTrigger></FormControl><SelectContent>
                                                {leadSources.map((source) => (<SelectItem key={source.id} value={String(source.id)}>{source.name}</SelectItem>))}
                                            </SelectContent></Select><FormMessage /></FormItem>
                                        )} />
                                        <div className="md:col-span-2">
                                            <FormField name="notes" control={form.control} render={({ field }) => (
                                                <FormItem><FormLabel>Notes (Optional)</FormLabel><FormControl><Textarea placeholder="Add any relevant notes, call logs, or next steps..." {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end space-x-4">
                                <Link href={route('opportunities.index')}><Button variant="outline" type="button">Cancel</Button></Link>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </Form>
            </div>
        </AppLayout>
    );
};

export default OpportunitiesEdit;
