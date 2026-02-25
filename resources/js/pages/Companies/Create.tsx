import React, { useEffect } from 'react';
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
} from "@/components/ui/select"; // For dropdowns
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { route } from 'ziggy-js';
import { PageProps, User } from '@/types'; // Assuming User type is defined
import { Info, Loader2, Link as LinkIcon } from 'lucide-react'; // Added icons
import { useDuplicateCheck } from '@/hooks/useDuplicateCheck';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const UNASSIGNED_VALUE = "__UNASSIGNED__";

// Interface for the form data state
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
    number_of_employees: string; // Keep as string for input, backend will cast
    annual_revenue: string;      // Keep as string for input, backend will cast
    linkedin_url: string;
    assigned_user_id: string | null; // Store as string or null for select
}

// Props for this specific page, including users for the dropdown
interface CompaniesCreateProps {
    users: User[];
    leadSources: { id: number, name: string }[];
}

const CompaniesCreate: React.FC = () => {
    const { props } = usePage<PageProps & CompaniesCreateProps>();
    const { users, leadSources } = props;
    const { duplicates, isChecking, checkDuplicates } = useDuplicateCheck('company');
    const { data, setData, post, processing, errors, reset } = useForm<CompanyFormData>({
        name: '',
        website: '',
        address: '',
        phone_number: '',
        email: '',
        industry: '',
        type: '', // e.g., "Prospect", "Customer"
        lead_source_id: null,
        description: '',
        number_of_employees: '',
        annual_revenue: '',
        linkedin_url: '',
        assigned_user_id: null,
    });

    useEffect(() => {
        checkDuplicates({
            name: data.name,
            email: data.email,
            website: data.website
        });
    }, [data.name, data.email, data.website]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('companies.store'), {
            preserveScroll: true,
            onSuccess: () => reset(), // Reset form on success
        });
    }

    const breadcrumbs = [
        { title: 'Companies', href: route('companies.index') },
        { title: 'Create' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Company" />

            <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto"> {/* Increased max-width */}
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Company</CardTitle>
                        <CardDescription>
                            Fill in the details below. Fields marked with <span className="text-red-500">*</span> are required.
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"> {/* Grid for layout */}
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
                            {/* Column 1 */}
                            <div className="space-y-4">
                                {/* Name */}
                                <div className="space-y-1">
                                    <Label htmlFor="name">Company Name <span className="text-red-500">*</span></Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} disabled={processing} required className={errors.name ? 'border-red-500' : ''} />
                                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                                </div>

                                {/* Website */}
                                <div className="space-y-1">
                                    <Label htmlFor="website">Website</Label>
                                    <Input id="website" type="url" placeholder="https://example.com" value={data.website} onChange={(e) => setData('website', e.target.value)} disabled={processing} className={errors.website ? 'border-red-500' : ''} />
                                    {errors.website && <p className="text-sm text-red-600 mt-1">{errors.website}</p>}
                                </div>

                                {/* Phone Number */}
                                <div className="space-y-1">
                                    <Label htmlFor="phone_number">Phone Number</Label>
                                    <Input id="phone_number" value={data.phone_number} onChange={(e) => setData('phone_number', e.target.value)} disabled={processing} className={errors.phone_number ? 'border-red-500' : ''} />
                                    {errors.phone_number && <p className="text-sm text-red-600 mt-1">{errors.phone_number}</p>}
                                </div>

                                {/* Email */}
                                <div className="space-y-1">
                                    <Label htmlFor="email">Company Email</Label>
                                    <Input id="email" type="email" placeholder="info@example.com" value={data.email} onChange={(e) => setData('email', e.target.value)} disabled={processing} className={errors.email ? 'border-red-500' : ''} />
                                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                                </div>

                                {/* Industry */}
                                <div className="space-y-1">
                                    <Label htmlFor="industry">Industry</Label>
                                    <Input id="industry" value={data.industry} onChange={(e) => setData('industry', e.target.value)} disabled={processing} className={errors.industry ? 'border-red-500' : ''} />
                                    {errors.industry && <p className="text-sm text-red-600 mt-1">{errors.industry}</p>}
                                </div>

                                {/* LinkedIn URL */}
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
                                    {/* Consider using a Select component if you have predefined types */}
                                    <Input id="type" placeholder="e.g., Prospect, Customer, Partner" value={data.type} onChange={(e) => setData('type', e.target.value)} disabled={processing} className={errors.type ? 'border-red-500' : ''} />
                                    {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type}</p>}
                                </div>

                                {/* Source */}
                                {/* Source --> LEAD SOURCE DROPDOWN */}
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
                                            {leadSources.map(source => (
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
                                        // If data.assigned_user_id is null, use UNASSIGNED_VALUE for the Select component's value
                                        // to trigger the placeholder if no user is selected or to select the "Unassigned" option.
                                        // If a user ID is present, use that.
                                        value={data.assigned_user_id === null ? UNASSIGNED_VALUE : data.assigned_user_id}
                                        onValueChange={(value) => {
                                            // When the value changes, if it's our special UNASSIGNED_VALUE, set form data to null.
                                            // Otherwise, set it to the selected user ID string.
                                            setData('assigned_user_id', value === UNASSIGNED_VALUE ? null : value);
                                        }}
                                        disabled={processing}
                                    >
                                        <SelectTrigger className={errors.assigned_user_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select a user" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {/* Use the UNASSIGNED_VALUE for the "Unassigned" option */}
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

                            {/* Spanning full width for Address and Description */}
                            <div className="md:col-span-2 space-y-1">
                                <Label htmlFor="address">Address</Label>
                                <Textarea id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} disabled={processing} rows={3} className={errors.address ? 'border-red-500' : ''} />
                                {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
                            </div>

                            <div className="md:col-span-2 space-y-1">
                                <Label htmlFor="description">Description / Notes</Label>
                                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} disabled={processing} rows={4} className={errors.description ? 'border-red-500' : ''} />
                                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-end space-x-2 mt-6">
                            <Link href={route('companies.index')}>
                                <Button type="button" variant="outline" disabled={processing}>Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Company'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
};

export default CompaniesCreate;
