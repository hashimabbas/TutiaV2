import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from '@/components/ui/separator'; // Import Separator
import { Monitor } from 'lucide-react'; // Import Monitor icon
import { route } from 'ziggy-js';
import { Company, PageProps, User } from '@/types';

const UNASSIGNED_VALUE = "__UNASSIGNED__";

// Interface for the form data state (MATCHES THE NEW BACKEND SCHEMA)
interface CompanyFormData {
    name: string;
    website: string;
    address: string;
    phone_number: string;
    email: string;
    industry: string;
    type: string;
    lead_source_id: string | null;
    description: string;
    number_of_employees: string;
    annual_revenue: string;
    linkedin_url: string;
    assigned_user_id: string | null;


}

// Props for this specific page (UPDATED TO INCLUDE ALL FIELDS)
interface CompaniesEditProps {
    // Ensure new properties are on Company type for data access
    company: Company & {
        lead_source_id: number | null,
        erp_system: string | null,
        os_environment: string | null,
        network_vendor: string | null,
        technical_notes: string | null
    };
    users: User[];
    leadSources: { id: number, name: string }[]; // <-- ADDED
}

const CompaniesEdit: React.FC = () => {
    // 1. Destructure all props, including leadSources
    const { props } = usePage<PageProps & CompaniesEditProps>();
    const { company, users, leadSources } = props; // <-- leadSources is NOW Destructured

    // 2. FIX: Safely access leadSources and default to an empty array for mapping
    const finalLeadSources = leadSources || [];

    // 3. Initialize useForm data with current company values
    const { data, setData, put, processing, errors } = useForm<CompanyFormData>({
        name: company.name || '',
        website: company.website ?? '',
        address: company.address ?? '',
        phone_number: company.phone_number ?? '',
        email: company.email ?? '',
        industry: company.industry ?? '',
        type: company.type ?? '',

        // FIX 4: Correctly map lead_source_id
        lead_source_id: company.lead_source_id?.toString() ?? null,

        description: company.description ?? '',
        number_of_employees: company.number_of_employees?.toString() ?? '',
        annual_revenue: company.annual_revenue?.toString() ?? '',
        linkedin_url: company.linkedin_url ?? '',
        assigned_user_id: company.assigned_user_id?.toString() ?? null,


    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Convert Select values (string/null) back to the expected type for Laravel validation
        const dataToSubmit = {
            ...data,
            // Convert select values to Number or null
            lead_source_id: data.lead_source_id === UNASSIGNED_VALUE ? null : (data.lead_source_id ? Number(data.lead_source_id) : null),
            assigned_user_id: data.assigned_user_id === UNASSIGNED_VALUE ? null : (data.assigned_user_id ? Number(data.assigned_user_id) : null),
        } as any;

        put(route('companies.update', company.id), dataToSubmit, {
            preserveScroll: true,
        });
    }

    const breadcrumbs = [
        { title: 'Companies', href: route('companies.index') },
        { title: company.name, href: route('companies.show', company.id) },
        { title: 'Edit' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Company - ${company.name}`} />

            <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Company: {company.name}</CardTitle>
                        <CardDescription>
                            Update the details. Fields marked with <span className="text-red-500">*</span> are required.
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            {/* Column 1 (UNCHANGED) */}
                            <div className="space-y-4">
                                {/* Name, Website, Phone Number, Email, Industry, LinkedIn URL */}
                                <div className="space-y-1">
                                    <Label htmlFor="name">Company Name <span className="text-red-500">*</span></Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} disabled={processing} required className={errors.name ? 'border-red-500' : ''} />
                                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="website">Website</Label>
                                    <Input id="website" type="url" placeholder="https://example.com" value={data.website} onChange={(e) => setData('website', e.target.value)} disabled={processing} className={errors.website ? 'border-red-500' : ''} />
                                    {errors.website && <p className="text-sm text-red-600 mt-1">{errors.website}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="phone_number">Phone Number</Label>
                                    <Input id="phone_number" value={data.phone_number} onChange={(e) => setData('phone_number', e.target.value)} disabled={processing} className={errors.phone_number ? 'border-red-500' : ''} />
                                    {errors.phone_number && <p className="text-sm text-red-600 mt-1">{errors.phone_number}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="email">Company Email</Label>
                                    <Input id="email" type="email" placeholder="info@example.com" value={data.email} onChange={(e) => setData('email', e.target.value)} disabled={processing} className={errors.email ? 'border-red-500' : ''} />
                                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="industry">Industry</Label>
                                    <Input id="industry" value={data.industry} onChange={(e) => setData('industry', e.target.value)} disabled={processing} className={errors.industry ? 'border-red-500' : ''} />
                                    {errors.industry && <p className="text-sm text-red-600 mt-1">{errors.industry}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                                    <Input id="linkedin_url" type="url" placeholder="https://linkedin.com/company/example" value={data.linkedin_url} onChange={(e) => setData('linkedin_url', e.target.value)} disabled={processing} className={errors.linkedin_url ? 'border-red-500' : ''} />
                                    {errors.linkedin_url && <p className="text-sm text-red-600 mt-1">{errors.linkedin_url}</p>}
                                </div>
                            </div>

                            {/* Column 2 */}
                            <div className="space-y-4">
                                {/* Type */}
                                <div className="space-y-1">
                                    <Label htmlFor="type">Company Type</Label>
                                    <Input id="type" placeholder="e.g., Prospect, Customer" value={data.type} onChange={(e) => setData('type', e.target.value)} disabled={processing} className={errors.type ? 'border-red-500' : ''} />
                                    {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type}</p>}
                                </div>

                                {/* FIX 6: Lead Source DROPDOWN */}
                                <div className="space-y-1">
                                    <Label htmlFor="lead_source_id">Lead Source</Label>
                                    <Select
                                        value={data.lead_source_id === null ? UNASSIGNED_VALUE : data.lead_source_id}
                                        onValueChange={(value) => {
                                            setData('lead_source_id', value === UNASSIGNED_VALUE ? null : value);
                                        }}
                                        disabled={processing}
                                    >
                                        <SelectTrigger className={errors.lead_source_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select Lead Source" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={UNASSIGNED_VALUE}>
                                                <em>- Not Specified -</em>
                                            </SelectItem>
                                            {finalLeadSources.map(source => (
                                                <SelectItem key={source.id} value={String(source.id)}>
                                                    {source.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.lead_source_id && <p className="text-sm text-red-600 mt-1">{errors.lead_source_id}</p>}
                                </div>

                                {/* Number of Employees */}
                                <div className="space-y-1">
                                    <Label htmlFor="number_of_employees">Number of Employees</Label>
                                    <Input id="number_of_employees" type="number" value={data.number_of_employees} onChange={(e) => setData('number_of_employees', e.target.value)} disabled={processing} className={errors.number_of_employees ? 'border-red-500' : ''} />
                                    {errors.number_of_employees && <p className="text-sm text-red-600 mt-1">{errors.number_of_employees}</p>}
                                </div>

                                {/* Annual Revenue */}
                                <div className="space-y-1">
                                    <Label htmlFor="annual_revenue">Annual Revenue</Label>
                                    <Input id="annual_revenue" type="number" step="0.01" value={data.annual_revenue} onChange={(e) => setData('annual_revenue', e.target.value)} disabled={processing} className={errors.annual_revenue ? 'border-red-500' : ''} />
                                    {errors.annual_revenue && <p className="text-sm text-red-600 mt-1">{errors.annual_revenue}</p>}
                                </div>

                                {/* Assigned User */}
                                <div className="space-y-1">
                                    <Label htmlFor="assigned_user_id">Assigned To</Label>
                                    <Select
                                        value={data.assigned_user_id === null ? UNASSIGNED_VALUE : data.assigned_user_id}
                                        onValueChange={(value) => {
                                            setData('assigned_user_id', value === UNASSIGNED_VALUE ? null : value);
                                        }}
                                        disabled={processing}
                                    >
                                        <SelectTrigger className={errors.assigned_user_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select a user" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={UNASSIGNED_VALUE}>
                                                <em>Unassigned</em>
                                            </SelectItem>
                                            {users.map(user => (
                                                <SelectItem key={user.id} value={String(user.id)}>
                                                    {user.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.assigned_user_id && <p className="text-sm text-red-600 mt-1">{errors.assigned_user_id}</p>}
                                </div>
                            </div>

                            {/* Spanning full width for Address */}
                            <div className="md:col-span-2 space-y-1">
                                <Label htmlFor="address">Address</Label>
                                <Textarea id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} disabled={processing} rows={3} className={errors.address ? 'border-red-500' : ''} />
                                {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
                            </div>


                            {/* Spanning full width for Description / Notes (General) */}
                            <div className="md:col-span-2 space-y-1">
                                <Label htmlFor="description">Description / Notes (General)</Label>
                                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} disabled={processing} rows={4} className={errors.description ? 'border-red-500' : ''} />
                                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-end space-x-2 mt-6">
                            <Link href={route('companies.index')}>
                                <Button type="button" variant="outline" disabled={processing}>Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
};

export default CompaniesEdit;
