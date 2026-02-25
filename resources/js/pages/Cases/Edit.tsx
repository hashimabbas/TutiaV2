// resources/js/pages/Cases/Edit.tsx

import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
// ... (Import necessary components)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { route } from 'ziggy-js';
import { Company, Contact, User, PageProps, SupportCase } from '@/types';
import { format } from 'date-fns';

const UNASSIGNED_VALUE = "__UNASSIGNED__";

interface CaseFormData {
    subject: string;
    description: string;
    company_id: string;
    contact_id: string | null;
    assigned_user_id: string | null;
    status: string;
    priority: string;
    due_date: string;
    product_or_service: string;
}

interface CasesEditProps {
    case: SupportCase;
    companies: Pick<Company, 'id' | 'name'>[];
    contacts: Array<Pick<Contact, 'id' | 'first_name' | 'last_name' | 'company_id'>>;
    users: Pick<User, 'id' | 'name'>[];
    statuses: string[];
    priorities: string[];
}

const CasesEdit: React.FC = () => {
    const { props } = usePage<PageProps & CasesEditProps>();
    const { case: caseItem, companies, contacts, users, statuses, priorities, errors } = props;

    const { data, setData, put, processing, reset } = useForm<CaseFormData>({
        subject: caseItem.subject || '',
        description: caseItem.description ?? '',
        company_id: String(caseItem.company_id) || '',
        contact_id: String(caseItem.contact_id) || null,
        assigned_user_id: String(caseItem.assigned_user_id) || null,
        status: caseItem.status,
        priority: caseItem.priority,
        due_date: caseItem.due_date ? format(new Date(caseItem.due_date), 'yyyy-MM-dd') : '',
        product_or_service: caseItem.product_or_service ?? '',
    });

    const [filteredContacts, setFilteredContacts] = useState(contacts);

    useEffect(() => {
        const companyId = data.company_id ? parseInt(data.company_id) : null;
        if (companyId) {
            const newFiltered = contacts.filter(c => c.company_id === companyId);
            setFilteredContacts(newFiltered);
            // This logic is important for a smoother UX after changing company
            if (data.contact_id && !newFiltered.some(c => String(c.id) === data.contact_id)) {
                // If current contact is not in the new company, clear it
                setData('contact_id', null);
            }
        } else {
            setFilteredContacts(contacts);
        }
    }, [data.company_id, contacts, data.contact_id]);


    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const dataToSubmit = {
            ...data,
            company_id: data.company_id === UNASSIGNED_VALUE ? '' : data.company_id,
            contact_id: data.contact_id === UNASSIGNED_VALUE ? null : data.contact_id,
            assigned_user_id: data.assigned_user_id === UNASSIGNED_VALUE ? null : data.assigned_user_id,
        };
        put(route('support_cases.update', caseItem.id), {
            data: dataToSubmit as any,
            preserveScroll: true,
        });
    }

    const breadcrumbs = [
        { title: 'Support Cases', href: route('support_cases.index') },
        { title: caseItem.reference_number, href: route('support_cases.show', caseItem.id) },
        { title: 'Edit' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Case - ${caseItem.reference_number}`} />

            <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Support Case: {caseItem.reference_number}</CardTitle>
                        <CardDescription>Update the details for the case.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            {/* Company & Subject */}
                            <div className="space-y-1 md:col-span-2">
                                <Label htmlFor="subject">Subject *</Label>
                                <Input id="subject" value={data.subject} onChange={e => setData('subject', e.target.value)} disabled={processing} required className={errors.subject ? 'border-red-500' : ''} />
                                {errors.subject && <p className="text-sm text-red-600 mt-1">{errors.subject}</p>}
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <Label htmlFor="company_id">Company *</Label>
                                <Select
                                    value={data.company_id || UNASSIGNED_VALUE}
                                    onValueChange={value => setData('company_id', value === UNASSIGNED_VALUE ? '' : value)}
                                    disabled={processing}
                                >
                                    <SelectTrigger className={errors.company_id ? 'border-red-500' : ''}><SelectValue placeholder="Select a company" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={UNASSIGNED_VALUE}><em>- Select Company -</em></SelectItem>
                                        {companies.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {errors.company_id && <p className="text-sm text-red-600 mt-1">{errors.company_id}</p>}
                            </div>

                            {/* Contact & Product */}
                            <div className="space-y-1">
                                <Label htmlFor="contact_id">Contact Person (Optional)</Label>
                                <Select
                                    value={data.contact_id || UNASSIGNED_VALUE}
                                    onValueChange={value => setData('contact_id', value === UNASSIGNED_VALUE ? null : value)}
                                    disabled={processing || !data.company_id || filteredContacts.length === 0}
                                >
                                    <SelectTrigger className={errors.contact_id ? 'border-red-500' : ''}><SelectValue placeholder="Select contact" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={UNASSIGNED_VALUE}><em>- No Specific Contact -</em></SelectItem>
                                        {filteredContacts.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.first_name} {c.last_name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {errors.contact_id && <p className="text-sm text-red-600 mt-1">{errors.contact_id}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="product_or_service">Product/Service</Label>
                                <Input id="product_or_service" placeholder="e.g., ERP System, VPN" value={data.product_or_service} onChange={e => setData('product_or_service', e.target.value)} disabled={processing} className={errors.product_or_service ? 'border-red-500' : ''} />
                                {errors.product_or_service && <p className="text-sm text-red-600 mt-1">{errors.product_or_service}</p>}
                            </div>


                            {/* Status, Priority, Due Date, Assigned To */}
                            <div className="space-y-1">
                                <Label htmlFor="status">Status</Label>
                                <Select value={data.status} onValueChange={value => setData('status', value)} disabled={processing}>
                                    <SelectTrigger className={errors.status ? 'border-red-500' : ''}><SelectValue placeholder="Select status" /></SelectTrigger>
                                    <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                </Select>
                                {errors.status && <p className="text-sm text-red-600 mt-1">{errors.status}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="priority">Priority</Label>
                                <Select value={data.priority} onValueChange={value => setData('priority', value)} disabled={processing}>
                                    <SelectTrigger className={errors.priority ? 'border-red-500' : ''}><SelectValue placeholder="Select priority" /></SelectTrigger>
                                    <SelectContent>{priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                                </Select>
                                {errors.priority && <p className="text-sm text-red-600 mt-1">{errors.priority}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="due_date">Due Date</Label>
                                <Input id="due_date" type="date" value={data.due_date} onChange={e => setData('due_date', e.target.value)} disabled={processing} className={errors.due_date ? 'border-red-500' : ''} />
                                {errors.due_date && <p className="text-sm text-red-600 mt-1">{errors.due_date}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="assigned_user_id">Assigned To</Label>
                                <Select
                                    value={data.assigned_user_id || UNASSIGNED_VALUE}
                                    onValueChange={value => setData('assigned_user_id', value === UNASSIGNED_VALUE ? null : value)}
                                    disabled={processing}
                                >
                                    <SelectTrigger className={errors.assigned_user_id ? 'border-red-500' : ''}><SelectValue placeholder="Select assignee" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={UNASSIGNED_VALUE}><em>- Unassigned -</em></SelectItem>
                                        {users.map(u => <SelectItem key={u.id} value={String(u.id)}>{u.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {errors.assigned_user_id && <p className="text-sm text-red-600 mt-1">{errors.assigned_user_id}</p>}
                            </div>

                            {/* Description */}
                            <div className="space-y-1 md:col-span-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={data.description} onChange={e => setData('description', e.target.value)} disabled={processing} rows={4} className={errors.description ? 'border-red-500' : ''} />
                                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                            </div>

                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2 pt-6">
                            <Link href={route('support_cases.show', caseItem.id)}><Button type="button" variant="outline" disabled={processing}>Cancel</Button></Link>
                            <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save Changes'}</Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
};
export default CasesEdit;
