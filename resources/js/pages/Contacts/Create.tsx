import React, { useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { route } from 'ziggy-js';
import { Company, User, PageProps } from '@/types'; // Ensure User and PageProps are imported
import { formatDate } from 'date-fns';
import { useDuplicateCheck } from '@/hooks/useDuplicateCheck';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, LinkIcon, Loader2 } from 'lucide-react';

const UNASSIGNED_VALUE = "__UNASSIGNED__"; // For select placeholders

interface ContactFormData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    mobile_phone: string;
    job_title: string;
    department: string;
    company_id: string | null; // Keep as string for Select, handle conversion on submit
    linkedin_profile_url: string;
    description: string;
    source: string;
    status: string; // Could be a select if you have predefined statuses
    assigned_user_id: string | null; // Keep as string for Select
    // last_contacted_at is usually set by system, not manually on create
    next_followup_date: string | undefined;
}

interface ContactsCreateProps {
    companies: Pick<Company, 'id' | 'name'>[];
    users: Pick<User, 'id' | 'name'>[];
    preselected_company_id?: string | number | null; // For pre-selection
    // statuses?: string[]; // If you pass predefined statuses
}

const ContactsCreate: React.FC = () => {
    const { props } = usePage<PageProps & ContactsCreateProps>();
    const { companies, users, preselected_company_id } = props;

    const { data, setData, post, processing, errors, reset } = useForm<ContactFormData>({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        mobile_phone: '',
        job_title: '',
        department: '',
        company_id: preselected_company_id ? String(preselected_company_id) : null,
        linkedin_profile_url: '',
        description: '',
        source: '',
        status: '', // Default status or let user choose
        assigned_user_id: null,
        next_followup_date: undefined,
    });
    const { duplicates, isChecking, checkDuplicates } = useDuplicateCheck('contact');
    useEffect(() => {
        checkDuplicates({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone
        });
    }, [data.first_name, data.last_name, data.email, data.phone]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const dataToSubmit = {
            ...data,
            company_id: data.company_id === UNASSIGNED_VALUE || data.company_id === '' ? null : Number(data.company_id),
            assigned_user_id: data.assigned_user_id === UNASSIGNED_VALUE || data.assigned_user_id === '' ? null : Number(data.assigned_user_id),
            next_followup_date: data.next_followup_date ? formatDate(new Date(data.next_followup_date), 'yyyy-MM-dd') : null, // <--- ADDED
        };
        post(route('contacts.store'), {
            data: dataToSubmit, // Send modified data
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

    const breadcrumbs = [
        { title: 'Contacts', href: route('contacts.index') },
        { title: 'Create' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Contact" />
            <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Contact</CardTitle>
                        <CardDescription>Fill in the details. <span className="text-red-500">*</span> = required.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            {/* --- DUPLICATE ALERT --- */}
                            {(duplicates.length > 0 || isChecking) && (
                                <div className="md:col-span-2">
                                    <Alert variant="warning" className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
                                        <Info className="h-4 w-4" />
                                        <AlertTitle className="flex items-center">
                                            Potential Duplicate Found!
                                            {isChecking && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                                        </AlertTitle>
                                        <AlertDescription>
                                            We found {duplicates.length} existing record(s) matching your input.
                                            <ul className="mt-2 text-sm space-y-1">
                                                {duplicates.map(dup => (
                                                    <li key={dup.id} className="flex items-center">
                                                        <LinkIcon className="mr-2 h-3 w-3" />
                                                        <Link href={route('companies.show', dup.id)} className="font-semibold text-primary hover:underline">
                                                            {dup.name}
                                                        </Link>
                                                        <span className="ml-3 text-xs text-muted-foreground">
                                                            (Match on: {dup.matches.join(', ')})
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            )}
                            {/* --- END DUPLICATE ALERT --- */}
                            {/* Basic Info */}
                            <div className="space-y-1">
                                <Label htmlFor="first_name">First Name <span className="text-red-500">*</span></Label>
                                <Input id="first_name" value={data.first_name} onChange={e => setData('first_name', e.target.value)} disabled={processing} required className={errors.first_name ? 'border-red-500' : ''} />
                                {errors.first_name && <p className="text-sm text-red-600 mt-1">{errors.first_name}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input id="last_name" value={data.last_name} onChange={e => setData('last_name', e.target.value)} disabled={processing} className={errors.last_name ? 'border-red-500' : ''} />
                                {errors.last_name && <p className="text-sm text-red-600 mt-1">{errors.last_name}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} disabled={processing} className={errors.email ? 'border-red-500' : ''} />
                                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)} disabled={processing} className={errors.phone ? 'border-red-500' : ''} />
                                {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="mobile_phone">Mobile Phone</Label>
                                <Input id="mobile_phone" type="tel" value={data.mobile_phone} onChange={e => setData('mobile_phone', e.target.value)} disabled={processing} className={errors.mobile_phone ? 'border-red-500' : ''} />
                                {errors.mobile_phone && <p className="text-sm text-red-600 mt-1">{errors.mobile_phone}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="linkedin_profile_url">LinkedIn Profile URL</Label>
                                <Input id="linkedin_profile_url" type="url" value={data.linkedin_profile_url} onChange={e => setData('linkedin_profile_url', e.target.value)} disabled={processing} className={errors.linkedin_profile_url ? 'border-red-500' : ''} />
                                {errors.linkedin_profile_url && <p className="text-sm text-red-600 mt-1">{errors.linkedin_profile_url}</p>}
                            </div>

                            {/* Work Info */}
                            <div className="md:col-span-2"><hr className="my-2" /><h3 className="text-md font-semibold mb-2">Work Information</h3></div>
                            <div className="space-y-1">
                                <Label htmlFor="job_title">Job Title</Label>
                                <Input id="job_title" value={data.job_title} onChange={e => setData('job_title', e.target.value)} disabled={processing} className={errors.job_title ? 'border-red-500' : ''} />
                                {errors.job_title && <p className="text-sm text-red-600 mt-1">{errors.job_title}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="department">Department</Label>
                                <Input id="department" value={data.department} onChange={e => setData('department', e.target.value)} disabled={processing} className={errors.department ? 'border-red-500' : ''} />
                                {errors.department && <p className="text-sm text-red-600 mt-1">{errors.department}</p>}
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <Label htmlFor="company_id">Company</Label>
                                <Select
                                    value={data.company_id === null ? UNASSIGNED_VALUE : data.company_id}
                                    onValueChange={value => setData('company_id', value === UNASSIGNED_VALUE ? null : value)}
                                    disabled={processing}
                                >
                                    <SelectTrigger className={errors.company_id ? 'border-red-500' : ''}><SelectValue placeholder="Select a company" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={UNASSIGNED_VALUE}><em>- No Company -</em></SelectItem>
                                        {companies.map(company => <SelectItem key={company.id} value={String(company.id)}>{company.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {errors.company_id && <p className="text-sm text-red-600 mt-1">{errors.company_id}</p>}
                            </div>

                            {/* CRM Info */}
                            <div className="md:col-span-2"><hr className="my-2" /><h3 className="text-md font-semibold mb-2">CRM Information</h3></div>
                            <div className="space-y-1">
                                <Label htmlFor="status">Status</Label>
                                {/* TODO: Convert to Select if you have predefined statuses passed from controller */}
                                <Input id="status" placeholder="e.g., New Lead, Contacted" value={data.status} onChange={e => setData('status', e.target.value)} disabled={processing} className={errors.status ? 'border-red-500' : ''} />
                                {errors.status && <p className="text-sm text-red-600 mt-1">{errors.status}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="source">Source</Label>
                                <Input id="source" placeholder="e.g., LinkedIn, Referral" value={data.source} onChange={e => setData('source', e.target.value)} disabled={processing} className={errors.source ? 'border-red-500' : ''} />
                                {errors.source && <p className="text-sm text-red-600 mt-1">{errors.source}</p>}
                            </div>
                            {/* --- NEW FIELD: Next Follow-up Date --- */}
                            <div className="space-y-1 md:col-span-1">
                                <Label htmlFor="next_followup_date">Next Follow-up Date</Label>
                                <Input
                                    id="next_followup_date"
                                    type="date"
                                    value={data.next_followup_date || ''}
                                    onChange={e => setData('next_followup_date', e.target.value)}
                                    disabled={processing}
                                    className={errors.next_followup_date ? 'border-red-500' : ''}
                                />
                                {errors.next_followup_date && <p className="text-sm text-red-600 mt-1">{errors.next_followup_date}</p>}
                            </div>
                            {/* --- END NEW FIELD --- */}
                            <div className="space-y-1 md:col-span-2">
                                <Label htmlFor="assigned_user_id">Assigned To</Label>
                                <Select
                                    value={data.assigned_user_id === null ? UNASSIGNED_VALUE : data.assigned_user_id}
                                    onValueChange={value => setData('assigned_user_id', value === UNASSIGNED_VALUE ? null : value)}
                                    disabled={processing}
                                >
                                    <SelectTrigger className={errors.assigned_user_id ? 'border-red-500' : ''}><SelectValue placeholder="Select a user" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={UNASSIGNED_VALUE}><em>Unassigned</em></SelectItem>
                                        {users.map(user => <SelectItem key={user.id} value={String(user.id)}>{user.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {errors.assigned_user_id && <p className="text-sm text-red-600 mt-1">{errors.assigned_user_id}</p>}
                            </div>

                            <div className="space-y-1 md:col-span-2">
                                <Label htmlFor="description">Description / Notes</Label>
                                <Textarea id="description" value={data.description} onChange={e => setData('description', e.target.value)} disabled={processing} rows={4} className={errors.description ? 'border-red-500' : ''} />
                                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2 pt-6">
                            <Link href={route('contacts.index')}><Button type="button" variant="outline" disabled={processing}>Cancel</Button></Link>
                            <Button type="submit" disabled={processing}>{processing ? 'Creating...' : 'Create Contact'}</Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
};
export default ContactsCreate;
