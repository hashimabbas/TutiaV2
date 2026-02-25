import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { route } from 'ziggy-js';
import { Company, Contact as ContactType, User, PageProps } from '@/types';
import { formatDate } from 'date-fns';

const UNASSIGNED_VALUE = "__UNASSIGNED__";

interface ContactFormData {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    mobile_phone: string;
    job_title: string;
    department: string;
    company_id: string | null;
    linkedin_profile_url: string;
    description: string;
    source: string;
    status: string;
    assigned_user_id: string | null;
    next_followup_date: string | undefined; // <--- ADDED
    last_contacted_at?: string; // Display only, usually not editable directly here
}

interface ContactsEditProps {
    contact: ContactType;
    companies: Pick<Company, 'id' | 'name'>[];
    users: Pick<User, 'id' | 'name'>[];
    // statuses?: string[];
}

const ContactsEdit: React.FC = () => {
    const { props } = usePage<PageProps & ContactsEditProps>();
    const { contact, companies, users } = props;

    const { data, setData, put, processing, errors } = useForm<ContactFormData>({
        first_name: contact.first_name || '',
        last_name: contact.last_name ?? '',
        email: contact.email ?? '',
        phone: contact.phone ?? '',
        mobile_phone: contact.mobile_phone ?? '',
        job_title: contact.job_title ?? '',
        department: contact.department ?? '',
        company_id: contact.company_id ? String(contact.company_id) : null,
        linkedin_profile_url: contact.linkedin_profile_url ?? '',
        description: contact.description ?? '',
        source: contact.source ?? '',
        status: contact.status ?? '',
        assigned_user_id: contact.assigned_user_id ? String(contact.assigned_user_id) : null,
        next_followup_date: contact.next_followup_date ? formatDate(new Date(contact.next_followup_date), 'yyyy-MM-dd') : undefined, // <--- ADDED
        last_contacted_at: contact.last_contacted_at ?? undefined, // For display if needed
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const dataToSubmit = {
            ...data,
            company_id: data.company_id === UNASSIGNED_VALUE || data.company_id === '' ? null : Number(data.company_id),
            assigned_user_id: data.assigned_user_id === UNASSIGNED_VALUE || data.assigned_user_id === '' ? null : Number(data.assigned_user_id),
            // Don't submit last_contacted_at if it's not editable here
            next_followup_date: data.next_followup_date ? formatDate(new Date(data.next_followup_date), 'yyyy-MM-dd') : null, // <--- MODIFIED
        };
        delete (dataToSubmit as any).last_contacted_at;


        put(route('contacts.update', contact.id), {
            data: dataToSubmit,
            preserveScroll: true,
        });
    }

    const breadcrumbs = [
        { title: 'Contacts', href: route('contacts.index') },
        { title: contact.full_name || 'Contact', href: route('contacts.show', contact.id) },
        { title: 'Edit' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Contact - ${contact.full_name}`} />
            <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Contact: {contact.full_name}</CardTitle>
                        <CardDescription>Update the details. <span className="text-red-500">*</span> = required.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
                                <Input id="status" value={data.status} onChange={e => setData('status', e.target.value)} disabled={processing} className={errors.status ? 'border-red-500' : ''} />
                                {errors.status && <p className="text-sm text-red-600 mt-1">{errors.status}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="source">Source</Label>
                                <Input id="source" value={data.source} onChange={e => setData('source', e.target.value)} disabled={processing} className={errors.source ? 'border-red-500' : ''} />
                                {errors.source && <p className="text-sm text-red-600 mt-1">{errors.source}</p>}
                            </div>
                            {/* --- NEW FIELD: Next Follow-up Date --- */}
                            <div className="space-y-1">
                                <Label htmlFor="next_followup_date">Next Follow-up Date</Label>
                                {/* Note: The value must be in YYYY-MM-DD format for HTML date input */}
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
                            {/* Last Contacted At (Display Only) */}
                            {data.last_contacted_at && (
                                <div className="space-y-1 md:col-span-2">
                                    <Label>Last Contacted</Label>
                                    <p className="text-sm text-muted-foreground pt-2">
                                        {new Date(data.last_contacted_at).toLocaleString()}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-1 md:col-span-2">
                                <Label htmlFor="description">Description / Notes</Label>
                                <Textarea id="description" value={data.description} onChange={e => setData('description', e.target.value)} disabled={processing} rows={4} className={errors.description ? 'border-red-500' : ''} />
                                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2 pt-6">
                            <Link href={route('contacts.show', contact.id)}><Button type="button" variant="outline" disabled={processing}>Cancel</Button></Link>
                            <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save Changes'}</Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
};
export default ContactsEdit;
