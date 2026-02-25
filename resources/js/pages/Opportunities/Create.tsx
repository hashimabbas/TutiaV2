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
import { PageProps, Company, Contact, User, LeadSource } from '@/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
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
import SearchableCombobox from '@/components/SearchableCombobox';

// --- Schema and Types remain the same ---
interface OpportunitiesCreateProps {
    companies: Company[];
    contacts: Contact[];
    users: User[];
    leadSources: LeadSource[];
}


const OpportunitiesCreate: React.FC = () => {
    const { props } = usePage<PageProps & OpportunitiesCreateProps>();
    const { companies, contacts, users, leadSources } = props;


    const form = useForm<OpportunityFormData>({
        resolver: zodResolver(opportunitySchema),
        defaultValues: {
            title: '',
            description: '',
            company_id: '',
            contact_id: '',
            assigned_user_id: '',
            source_id: '',
            value: undefined, // Use undefined for optional number fields
            stage: 'New Lead', // Default to 'New Lead'
            probability: 0,
            notes: '',
            next_step_label: '',
            next_step_due_date: undefined,
        },
    });


    const onSubmit = (data: OpportunityFormData) => {
        console.log('Form submission is valid. Data:', data);
        const postData = {
            ...data,
            // Format date for backend if it exists
            expected_close_date: data.expected_close_date ? format(data.expected_close_date, 'yyyy-MM-dd') : null,
            company_id: Number(data.company_id),
            contact_id: data.contact_id ? Number(data.contact_id) : null,
            assigned_user_id: data.assigned_user_id ? Number(data.assigned_user_id) : null,
            source_id: data.source_id ? Number(data.source_id) : null,
        };
        router.post(route('opportunities.store'), postData);
    };

    const onErrors = (errors: any) => {
        console.error('Form validation failed. Errors:', errors);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Opportunities', url: route('opportunities.index') }, { title: 'Create' }]}>
            <Head title="Create Opportunity" />
            <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onErrors)} className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="h-6 w-6" /> Create New Opportunity
                                </CardTitle>
                                <CardDescription>Fill in the details below to add a new sales opportunity to your pipeline.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                {/* SECTION 1: PRIMARY INFO */}
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Primary Information</h3>
                                    <div className="space-y-4">
                                        <FormField name="title" control={form.control} render={({ field }) => (
                                            <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Website Redesign Project" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField name="company_id" control={form.control} render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Company</FormLabel>
                                                <SearchableCombobox
                                                    apiRouteName="api.search.companies"
                                                    placeholder="Select a company"
                                                    formFieldName={field.name}
                                                    // Initial value can be passed if needed on edit forms, but not needed on create
                                                    onSelect={(id) => {
                                                        // This handles form value set by the component itself.
                                                        // Use field.onChange if you need to trigger external RHF events.
                                                        // We assume the component handles RHF value setting via setValue.
                                                        // We pass a function to update the RHF value directly.
                                                        field.onChange(id ? String(id) : '');
                                                    }}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        {/* --- REPLACED CONTACT DROPDOWN WITH SEARCHABLECOMBOBOX --- */}
                                        <FormField name="contact_id" control={form.control} render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Primary Contact (Optional)</FormLabel>
                                                <SearchableCombobox
                                                    apiRouteName="api.search.contacts"
                                                    placeholder="Select a contact"
                                                    formFieldName={field.name}
                                                    onSelect={(id) => field.onChange(id ? String(id) : '')}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                </div>

                                <Separator />

                                {/* SECTION 2: DEAL DETAILS */}
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

                                                <FormControl><Input type="number" step="0.01" placeholder="$5000.00" className="pl-8" {...field} /></FormControl>
                                            </div><FormMessage /></FormItem>
                                        )} />
                                        <FormField name="probability" control={form.control} render={({ field }) => (
                                            <FormItem><FormLabel>Probability</FormLabel><div className="flex items-center gap-4">
                                                <FormControl><Slider defaultValue={[0]} max={100} step={5} onValueChange={(vals) => field.onChange(vals[0])} /></FormControl>
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

                                {/* --- NEW SECTION: NEXT STEP --- */}
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Next Step (Manual Override)</h3>
                                    <div className="space-y-4">
                                        <FormField name="next_step_label" control={form.control} render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Next Step / Activity</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Schedule Q&A Call" {...field} />
                                                </FormControl>
                                                <FormDescription>This field is auto-set by some stage changes (e.g., Proposal Sent).</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                        <FormField name="next_step_due_date" control={form.control} render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Next Step Due Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </div>
                                </div>
                                {/* --- END NEW SECTION --- */}

                                <Separator />

                                {/* SECTION 3: ATTRIBUTION & NOTES */}
                                <div>
                                    <h3 className="text-lg font-medium mb-4">Attribution & Notes</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField name="assigned_user_id" control={form.control} render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Assigned To (Optional)</FormLabel>
                                                <SearchableCombobox
                                                    apiRouteName="api.search.users"
                                                    placeholder="Assign to a user"
                                                    formFieldName={field.name}
                                                    onSelect={(id) => field.onChange(id ? String(id) : '')}
                                                />
                                                <FormMessage />
                                            </FormItem>
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
                                    Create Opportunity
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </Form>
            </div>
        </AppLayout>
    );
};

export default OpportunitiesCreate;
