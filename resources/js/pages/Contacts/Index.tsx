import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Contact, PaginatedResponse, Company, PageProps } from '@/types';
import { route } from 'ziggy-js';
import { MoreHorizontal, Info, Trash2, Edit, Eye, Download, Upload, X, CheckCircle, AlertTriangle } from "lucide-react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { pickBy } from 'lodash';

// Removed Shadcn Pagination imports

interface ContactsIndexProps {
    contacts: PaginatedResponse<Contact>;
    filters: {
        search?: string;
        status?: string;
        company_id?: string;
    };
    filterOptions: {
        companies: Pick<Company, 'id' | 'name'>[];
        statuses: string[];
    };
    // Flash message structure is necessary here
    flash: {
        success?: string;
        warning?: string;
        error?: string;
        info?: string;
        import_errors?: string[]; // Used for bulk import errors
    };
}

const CLEAR_FILTER_VALUE = 'all';

// Helper to parse HTML entities from pagination labels
function cleanPaginationLabel(label: string): string {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = label;
    const cleaned = tempDiv.textContent || tempDiv.innerText || "";
    if (cleaned.includes('Previous')) return '« Previous';
    if (cleaned.includes('Next')) return 'Next »';
    return cleaned;
}

const ContactsIndex: React.FC = () => {
    const { props } = usePage<PageProps & ContactsIndexProps>();
    const { contacts, filters, filterOptions, flash } = props;

    const [filterValues, setFilterValues] = useState(filters);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    // --- FLASH MESSAGE STATE/LOGIC ---
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        // Show alert if any flash message exists
        if (flash?.success || flash?.warning || flash?.error || flash?.info) {
            setShowAlert(true);
            const timer = setTimeout(() => setShowAlert(false), 8000); // Hide after 8 seconds
            return () => clearTimeout(timer);
        }
    }, [flash]);
    // --- END FLASH MESSAGE STATE/LOGIC ---

    useEffect(() => setFilterValues(filters), [filters]);

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        const actualValue = value === CLEAR_FILTER_VALUE ? '' : value;
        setFilterValues(prev => ({ ...prev, [key]: actualValue }));
    };

    const handleFilterSubmit = () => {
        const query = pickBy(filterValues);
        router.get(route('contacts.index'), query, { preserveState: true, preserveScroll: true });
    };

    const handleResetFilters = () => {
        setFilterValues({});
        router.get(route('contacts.index'));
    };

    const buildExportUrl = () => {
        const query = pickBy(filters);
        const queryString = new URLSearchParams(query as any).toString();
        return `${route('contacts.export')}?${queryString}`;
    };

    const handleDelete = (contactId: number) => {
        router.delete(route('contacts.destroy', contactId), {
            preserveScroll: true,
            onStart: () => setIsDeleting(contactId),
            onFinish: () => setIsDeleting(null),
        });
    };

    const getStatusBadgeVariant = (status?: string | null): "default" | "secondary" | "destructive" | "outline" => {
        switch (status?.toLowerCase()) {
            case 'new lead': return 'default';
            case 'contacted': return 'secondary';
            default: return 'outline';
        }
    };

    const isFiltersApplied = Object.values(filters).some(Boolean);
    const hasMultiplePages = contacts?.last_page && contacts.last_page > 1;

    return (
        <AppLayout breadcrumbs={[{ title: 'Contacts' }]}>
            <Head title="Contacts" />
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">

                {/* --- NEW: FLASH MESSAGE RENDERING BLOCK --- */}
                {showAlert && (flash.success || flash.warning || flash.error || flash.info) && (
                    <div className="fixed top-20 right-4 z-50 w-full max-w-sm">
                        <Alert
                            // Use destructive variant for error/warning, default otherwise
                            variant={flash.error || flash.warning ? "destructive" : "default"}
                            // Apply custom green styling for success if not a default component
                            className={flash.success ? "border-green-500 bg-green-50 text-green-700" : ""}
                        >
                            <div className="flex items-start">
                                {/* Choose icon based on message type */}
                                {flash.success && <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600" />}
                                {flash.warning && <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-yellow-600" />}
                                {flash.error && <X className="h-4 w-4 mr-2 mt-0.5 text-red-600" />}
                                <div className="flex-1">
                                    <AlertTitle className="font-bold">
                                        {flash.success ? "Success" : flash.warning ? "Warning" : flash.error ? "Error" : "Info"}
                                    </AlertTitle>
                                    <AlertDescription>
                                        {/* Display the main message */}
                                        {flash.success || flash.warning || flash.error || flash.info}

                                        {/* Display detailed import errors if they exist */}
                                        {flash.import_errors && flash.import_errors.length > 0 && (
                                            <ul className="mt-2 list-disc list-inside space-y-1 max-h-32 overflow-y-auto text-xs">
                                                {flash.import_errors.map((error, index) => (
                                                    // Note: You might need to adjust text color for dark mode compatibility here
                                                    <li key={index}>{error}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </AlertDescription>
                                </div>
                            </div>
                        </Alert>
                    </div>
                )}
                {/* --- END: FLASH MESSAGE RENDERING BLOCK --- */}

                <div className="sm:flex sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contacts</h1>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                        <a href={buildExportUrl()}>
                            <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Export</Button>
                        </a>
                        <Link href={route('contacts.import.form')}>
                            <Button variant="outline" size="sm"><Upload className="mr-2 h-4 w-4" /> Import</Button>
                        </Link>
                        <Link href={route('contacts.create')}>
                            <Button>Create Contact</Button>
                        </Link>
                    </div>
                </div>

                <Card>
                    <CardHeader><CardTitle>Filter Contacts</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Input
                            placeholder="Search name, email, company..."
                            value={filterValues.search || ''}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleFilterSubmit()}
                        />
                        <Select value={filterValues.company_id || CLEAR_FILTER_VALUE} onValueChange={(v) => handleFilterChange('company_id', v)}>
                            <SelectTrigger><SelectValue placeholder="Filter by Company" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value={CLEAR_FILTER_VALUE}>All Companies</SelectItem>
                                {filterOptions.companies.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={filterValues.status || CLEAR_FILTER_VALUE} onValueChange={(v) => handleFilterChange('status', v)}>
                            <SelectTrigger><SelectValue placeholder="Filter by Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value={CLEAR_FILTER_VALUE}>All Statuses</SelectItem>
                                {filterOptions.statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <div className="flex items-center space-x-2">
                            <Button onClick={handleFilterSubmit}>Filter</Button>
                            {isFiltersApplied && <Button variant="ghost" onClick={handleResetFilters} size="sm"><X className="h-4 w-4 mr-1" /> Reset</Button>}
                        </div>
                    </CardContent>
                </Card>

                {/* Data Table (retained) */}
                <div className="border rounded-lg overflow-x-auto shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead className="hidden sm:table-cell">Email</TableHead>
                                <TableHead className="hidden lg:table-cell">Company</TableHead>
                                <TableHead className="hidden md:table-cell">Status</TableHead>
                                <TableHead className="hidden xl:table-cell">Assigned To</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contacts.data.length > 0 ? (
                                contacts.data.map((contact) => (
                                    <TableRow key={contact.id} className="hover:bg-muted/50">
                                        <TableCell className="font-medium">
                                            <Link href={route('contacts.show', contact.id)} className="hover:underline text-primary">
                                                {contact.full_name}
                                            </Link>
                                            {contact.job_title && <p className="text-xs text-muted-foreground">{contact.job_title}</p>}
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">{contact.email || '-'}</TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            {contact.company?.id ? (
                                                <Link href={route('companies.show', contact.company.id)} className="hover:underline text-sm">
                                                    {contact.company.name}
                                                </Link>
                                            ) : <span className="text-sm text-muted-foreground">-</span>}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {contact.status ? (
                                                <Badge variant={getStatusBadgeVariant(contact.status)}>{contact.status}</Badge>
                                            ) : '-'}
                                        </TableCell>
                                        <TableCell className="hidden xl:table-cell">
                                            {contact.assigned_user?.name ? (
                                                contact.assigned_user.name
                                            ) : <span className="text-muted-foreground italic">Unassigned</span>}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <AlertDialog>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('contacts.show', contact.id)} className="flex items-center">
                                                                <Eye className="mr-2 h-4 w-4" /> View
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('contacts.edit', contact.id)} className="flex items-center">
                                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <AlertDialogTrigger asChild>
                                                            <DropdownMenuItem className="text-red-600 hover:!text-red-600 flex items-center">
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                            </DropdownMenuItem>
                                                        </AlertDialogTrigger>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Contact</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete "{contact.full_name}"? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel disabled={isDeleting === contact.id}>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(contact.id)}
                                                            disabled={isDeleting === contact.id}
                                                            className="bg-destructive  hover:bg-destructive/90"
                                                        >
                                                            {isDeleting === contact.id ? 'Deleting...' : 'Yes, delete'}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        {isFiltersApplied ? 'No contacts match your criteria.' : 'No contacts found.'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* --- Pagination Block (retained fix logic) --- */}
                {hasMultiplePages && (
                    <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between">
                        <p className="text-sm text-muted-foreground mb-4 md:mb-0">
                            Showing {contacts.from} to {contacts.to} of {contacts.total} contacts
                        </p>

                        <div className="flex items-center space-x-1">
                            {contacts.links.map((link, index) => {
                                const label = cleanPaginationLabel(link.label);

                                // Disabled link (Current page) or Previous/Next button on first/last page
                                if (!link.url || link.active) {
                                    return (
                                        <span
                                            key={index}
                                            className={`
                                                px-3 py-2 text-sm rounded-md
                                                ${link.active
                                                    ? 'bg-primary text-primary-foreground font-semibold pointer-events-none' // Active page styling
                                                    : 'text-muted-foreground opacity-50 cursor-not-allowed' // Disabled styling (Prev on page 1, Next on last page)
                                                }
                                            `}
                                            aria-disabled="true"
                                        >
                                            {label}
                                        </span>
                                    );
                                }

                                // Ellipsis
                                if (label === '...') {
                                    return (
                                        <span key={index} className="px-3 py-2 text-sm text-muted-foreground">
                                            {label}
                                        </span>
                                    );
                                }

                                // Active, clickable link (numbered or Previous/Next)
                                return (
                                    <Link
                                        key={index}
                                        href={link.url!}
                                        preserveScroll
                                        preserveState
                                        className={`
                                            px-3 py-2 text-sm rounded-md transition-colors duration-150 ease-in-out
                                            text-foreground hover:bg-accent/50 dark:hover:bg-accent
                                        `}
                                    >
                                        {label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
                {/* --- END Pagination Block --- */}
            </div>
        </AppLayout>
    );
};


export default ContactsIndex;
