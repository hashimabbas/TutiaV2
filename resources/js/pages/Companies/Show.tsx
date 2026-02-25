import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Company, Contact, PageProps, User } from '@/types';
import { route } from 'ziggy-js';
import { Separator } from '@/components/ui/separator';
import { Briefcase, CalendarDays, Building, Globe, Linkedin, Mail, Users, Phone, DollarSign, Info, FileText, UserCircle } from 'lucide-react';
import { Wrench, PlusCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ActivityTimeline, { TimelineActivity } from '@/pages/Company/Partials/ActivityTimeline';

interface CompaniesShowProps {
    company: Company;
    activities: TimelineActivity[];
}

const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    try {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    } catch (e) {
        return '-';
    }
};

const formatCurrency = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined || value === '') return '-';
    const num = Number(value);
    if (isNaN(num)) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
};

interface DetailItemProps {
    icon?: React.ElementType;
    label: string;
    value?: React.ReactNode;
    className?: string;
    isLink?: boolean;
    href?: string;
}
const DetailItem: React.FC<DetailItemProps> = ({ icon: Icon, label, value, className, isLink, href }) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) return null;

    const content = isLink && href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
            {value}
        </a>
    ) : (
        value
    );

    return (
        <div className={`space-y-1 ${className}`}>
            <p className="text-sm font-medium text-muted-foreground flex items-center">
                {Icon && <Icon className="mr-2 h-4 w-4" />}
                {label}
            </p>
            {typeof content === 'string' || typeof content === 'number' ? (
                <p className="text-sm">{content}</p>
            ) : (
                content
            )}
        </div>
    );
};


const CompaniesShow: React.FC = () => {
    const { props } = usePage<PageProps & CompaniesShowProps>();
    const { company, activities } = props;
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        router.delete(route('companies.destroy', company.id), {
            onStart: () => setIsDeleting(true),
            onFinish: () => setIsDeleting(false),
        });
    };

    const breadcrumbs = [
        { title: 'Companies', href: route('companies.index') },
        { title: company.name }
    ];


    const getContactFullName = (contact: Contact): string => {
        return `${contact.first_name} ${contact.last_name ?? ''}`.trim();
    };

    // EFFICIENCY IMPROVEMENT: Check if the number of contacts is 10, which is the limit we set in the controller.
    // This implies there may be more contacts to view on a dedicated page.
    const hasMoreContacts = company.contacts && company.contacts.length === 10;
    const hasMoreCases = company.support_cases && company.support_cases.length === 10;

    // Helper to get case badge variant
    const getCaseBadgeVariant = (status: string) => {
        switch (status) {
            case 'New':
            case 'Open': return 'default';
            case 'In Progress': return 'secondary';
            case 'Resolved': return 'success'; // Assuming you have a success variant
            case 'Closed': return 'outline';
            case 'On Hold': return 'warning'; // Assuming you have a warning variant
            default: return 'outline';
        }
    };

    // Helper to get priority badge color for quick glance
    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'Critical': return 'text-red-500';
            case 'High': return 'text-orange-500';
            default: return 'text-muted-foreground';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Company - ${company.name}`} />

            <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
                <Card>
                    <CardHeader className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-semibold flex items-center">
                                <Building className="mr-3 h-7 w-7 text-primary" />
                                {company.name}
                            </CardTitle>
                            <CardDescription>
                                Company ID: {company.id} • Created on {formatDate(company.created_at)}.
                            </CardDescription>
                        </div>
                        <div className="flex space-x-2 self-start sm:self-center">
                            <Link href={route('companies.edit', company.id)}>
                                <Button variant="outline" size="sm">Edit</Button>
                            </Link>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" disabled={isDeleting}>
                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action will permanently delete "{company.name}".
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                            {isDeleting ? 'Deleting...' : 'Yes, delete'}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardHeader>
                    <Separator className="my-4" />
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                            <DetailItem icon={Globe} label="Website" value={company.website} isLink href={company.website?.startsWith('http') ? company.website : `//${company.website}`} />
                            <DetailItem icon={Phone} label="Phone Number" value={company.phone_number} />
                            <DetailItem icon={Mail} label="Company Email" value={company.email} isLink href={`mailto:${company.email}`} />
                            <DetailItem icon={Linkedin} label="LinkedIn" value={company.linkedin_url} isLink href={company.linkedin_url?.startsWith('http') ? company.linkedin_url : `//${company.linkedin_url}`} />

                            <DetailItem icon={Briefcase} label="Industry" value={company.industry} />
                            <DetailItem icon={Info} label="Company Type" value={company.type} />
                            <DetailItem icon={Users} label="Lead Source" value={company.source} />

                            <DetailItem icon={Users} label="# of Employees" value={company.number_of_employees?.toLocaleString() ?? '-'} />
                            <DetailItem icon={DollarSign} label="Annual Revenue" value={formatCurrency(company.annual_revenue)} />

                            <DetailItem
                                icon={UserCircle}
                                label="Assigned To"
                                value={company.assigned_user ? (
                                    <Link href={company.assigned_user.id ? route('users.show', company.assigned_user.id) : '#'} className="text-blue-600 hover:underline">
                                        {company.assigned_user.name}
                                    </Link>
                                ) : <span className="italic text-muted-foreground">Unassigned</span>}
                            />
                            <DetailItem icon={CalendarDays} label="Last Updated" value={formatDate(company.updated_at)} />

                            <div className="md:col-span-2 lg:col-span-3 space-y-1">
                                <p className="text-sm font-medium text-muted-foreground flex items-center">
                                    <Building className="mr-2 h-4 w-4" /> Address
                                </p>
                                <p className="text-sm whitespace-pre-line">{company.address || '-'}</p>
                            </div>

                            {company.description && (
                                <div className="md:col-span-2 lg:col-span-3 space-y-1">
                                    <p className="text-sm font-medium text-muted-foreground flex items-center">
                                        <FileText className="mr-2 h-4 w-4" /> Description / Notes
                                    </p>
                                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                                        {company.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Users className="mr-2 h-5 w-5 text-primary" />
                            Associated Contacts
                        </CardTitle>
                        <CardDescription>
                            {/* EFFICIENCY IMPROVEMENT: Update description based on limited data */}
                            {hasMoreContacts
                                ? `Showing the 10 most recently created contacts for ${company.name}.`
                                : `People associated with ${company.name}.`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {company.contacts && company.contacts.length > 0 ? (
                            <div className="border rounded-md overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead className="hidden sm:table-cell">Email</TableHead>
                                            <TableHead className="hidden md:table-cell">Phone</TableHead>
                                            <TableHead>Job Title</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {company.contacts.map((contact) => (
                                            <TableRow key={contact.id}>
                                                <TableCell className="font-medium">
                                                    <Link href={contact.id ? route('contacts.show', contact.id) : '#'} className="hover:underline">
                                                        {getContactFullName(contact)}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">{contact.email || '-'}</TableCell>
                                                <TableCell className="hidden md:table-cell">{contact.phone || '-'}</TableCell>
                                                <TableCell>{contact.job_title || '-'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No contacts found for this company.</p>
                        )}
                    </CardContent>
                    <CardFooter className="flex space-x-2">
                        <Link href={route('contacts.create', { company_id: company.id, company_name: company.name })}>
                            <Button variant="outline" size="sm">Add New Contact</Button>
                        </Link>
                        {/* EFFICIENCY IMPROVEMENT: Add a link to view all contacts if there are more than the preview amount */}
                        {hasMoreContacts && (
                            <Link href={route('contacts.index', { company_id: company.id })}>
                                <Button variant="secondary" size="sm">View All Contacts</Button>
                            </Link>
                        )}
                    </CardFooter>
                </Card>

                {/* --- NEW: ASSOCIATED SUPPORT CASES CARD --- */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Wrench className="mr-2 h-5 w-5 text-primary" />
                            Support Cases
                        </CardTitle>
                        <CardDescription>
                            {/* Update description based on limited data */}
                            {hasMoreCases
                                ? `Showing the 10 most recent support cases for ${company.name}.`
                                : `All support cases logged for ${company.name}.`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {company.support_cases && company.support_cases.length > 0 ? (
                            <div className="border rounded-md overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Reference / Subject</TableHead>
                                            <TableHead className="hidden sm:table-cell">Status</TableHead>
                                            <TableHead className="hidden md:table-cell">Priority</TableHead>
                                            <TableHead>Due Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {company.support_cases.map((caseItem) => (
                                            <TableRow key={caseItem.id}>
                                                <TableCell className="font-medium">
                                                    <Link href={caseItem.id ? route('support_cases.show', caseItem.id) : '#'} className="hover:underline">
                                                        {caseItem.subject}
                                                    </Link>
                                                    <div className="text-xs text-muted-foreground">{caseItem.reference_number}</div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell">
                                                    <Badge variant={getCaseBadgeVariant(caseItem.status)}>{caseItem.status}</Badge>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <span className={getPriorityColor(caseItem.priority)}>
                                                        {caseItem.priority}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(caseItem.due_date)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="text-sm text-muted-foreground flex items-center p-4 border rounded-md">
                                <AlertTriangle className="mr-2 h-4 w-4" /> No support cases found for this company.
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex space-x-2">
                        {/* Link to create a new case pre-linked to this company */}
                        <Link href={route('support_cases.create', { company_id: company.id, company_name: company.name })}>
                            <Button variant="outline" size="sm">Log New Case</Button>
                        </Link>
                        {hasMoreCases && (
                            <Link href={route('support_cases.index', { company_id: company.id })}>
                                <Button variant="secondary" size="sm">View All Cases</Button>
                            </Link>
                        )}
                    </CardFooter>
                </Card>
                {/* --- END NEW CARD --- */}
                {/* --- NEW: ACTIVITY TIMELINE CARD (Card 4) --- */}
                <ActivityTimeline activities={activities} />
                {/* --- END NEW CARD --- */}
            </div>
        </AppLayout>
    );
};

export default CompaniesShow;
