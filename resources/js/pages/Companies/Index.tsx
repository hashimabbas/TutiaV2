import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Company, PaginatedResponse, PageProps } from '@/types';
// Import only the necessary Shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { pickBy } from 'lodash';
import { Download, Upload, X, MoreHorizontal, CheckCircle, AlertTriangle } from "lucide-react";
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// NOTE: We rely on basic HTML table tags with Tailwind classes instead of Shadcn Table components

interface CompaniesIndexProps {
    companies: PaginatedResponse<Company>;
    filters: {
        search?: string;
        type?: string;
        industry?: string;
    };
    filterOptions: {
        industries: string[];
        types: string[];
    };
    flash: {
        success?: string;
        warning?: string;
        error?: string;
        info?: string;
        import_errors?: string[];
    };
}

// Helper to clean pagination labels (fixes &laquo;/&raquo; and other entities)
function cleanPaginationLabel(label: string): string {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = label;
    const cleaned = tempDiv.textContent || tempDiv.innerText || "";
    if (cleaned.includes('Previous')) return '« Previous';
    if (cleaned.includes('Next')) return 'Next »';
    return cleaned;
}

const CLEAR_FILTER_VALUE = 'all';

const CompaniesIndex: React.FC = () => {
    const { props } = usePage<PageProps & CompaniesIndexProps>();
    const { companies, filters, filterOptions, flash } = props;

    const [filterValues, setFilterValues] = useState(filters);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    // --- FLASH MESSAGE STATE/LOGIC (omitted for brevity) ---
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (flash?.success || flash?.warning || flash?.error || flash?.info) {
            setShowAlert(true);
            const timer = setTimeout(() => setShowAlert(false), 8000);
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
        router.get(route('companies.index'), query, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleResetFilters = () => {
        setFilterValues({});
        router.get(route('companies.index'));
    };

    const buildExportUrl = () => {
        const query = pickBy(filters);
        const queryString = new URLSearchParams(query as any).toString();
        return `${route('companies.export')}?${queryString}`;
    };

    const handleDelete = (companyId: number) => {
        router.delete(route('companies.destroy', companyId), {
            preserveScroll: true,
            onStart: () => setIsDeleting(companyId),
            onFinish: () => setIsDeleting(null),
        });
    };

    const isFiltersApplied = Object.values(filters).some(Boolean);


    return (
        <AppLayout breadcrumbs={[{ title: 'Companies', href: route('companies.index') }]}>
            <Head title="Companies" />

            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                {/* --- FLASH MESSAGE RENDERING BLOCK (omitted for brevity) --- */}
                {showAlert && (flash.success || flash.warning || flash.error || flash.info) && (
                    <div className="fixed top-20 right-4 z-50 w-full max-w-sm">
                        <Alert
                            variant={flash.error || flash.warning ? "destructive" : "default"}
                            className={flash.success ? "border-green-500 bg-green-50 text-green-700" : ""}
                        >
                            <div className="flex items-start">
                                {flash.success && <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600" />}
                                {flash.warning && <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-yellow-600" />}
                                {flash.error && <X className="h-4 w-4 mr-2 mt-0.5 text-red-600" />}
                                <div className="flex-1">
                                    <AlertTitle className="font-bold">
                                        {flash.success ? "Success" : flash.warning ? "Warning" : flash.error ? "Error" : "Info"}
                                    </AlertTitle>
                                    <AlertDescription>
                                        {flash.success || flash.warning || flash.error || flash.info}

                                        {flash.import_errors && flash.import_errors.length > 0 && (
                                            <ul className="mt-2 list-disc list-inside space-y-1 max-h-32 overflow-y-auto text-xs">
                                                {flash.import_errors.map((error, index) => (
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

                {/* Header with Title and Buttons (omitted for brevity) */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Companies</h1>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                        <a href={buildExportUrl()}>
                            <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Export</Button>
                        </a>
                        <Link href={route('companies.import.form')}>
                            <Button variant="outline" size="sm"><Upload className="mr-2 h-4 w-4" /> Import</Button>
                        </Link>
                        <Link href={route('companies.create')}>
                            <Button>Create Company</Button>
                        </Link>
                    </div>
                </div>

                {/* Filter Card (omitted for brevity) */}
                <Card>
                    <CardHeader><CardTitle>Filter & Search</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <Input
                            placeholder="Search by name, email..."
                            value={filterValues.search || ''}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleFilterSubmit()}
                        />
                        <Select
                            value={filterValues.industry || CLEAR_FILTER_VALUE}
                            onValueChange={(value) => handleFilterChange('industry', value)}
                        >
                            <SelectTrigger><SelectValue placeholder="Filter by Industry" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value={CLEAR_FILTER_VALUE}>All Industries</SelectItem>
                                {filterOptions.industries.map(opt => (
                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filterValues.type || CLEAR_FILTER_VALUE}
                            onValueChange={(value) => handleFilterChange('type', value)}
                        >
                            <SelectTrigger><SelectValue placeholder="Filter by Type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value={CLEAR_FILTER_VALUE}>All Types</SelectItem>
                                {filterOptions.types.map(opt => (
                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex items-center space-x-2">
                            <Button onClick={handleFilterSubmit}>Filter</Button>
                            {isFiltersApplied && (
                                <Button variant="ghost" onClick={handleResetFilters} size="sm">
                                    <X className="h-4 w-4 mr-1" /> Reset
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Data Table - using basic HTML table with Tailwind classes (omitted for brevity) */}
                <div className="border rounded-lg overflow-x-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 w-[20%]">Name</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 hidden sm:table-cell w-[25%]">Website</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 hidden md:table-cell w-[15%]">Phone</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 hidden lg:table-cell w-[15%]">Industry</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 hidden xl:table-cell w-[15%]">Assigned To</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 text-right"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {companies.data.length > 0 ? (
                                companies.data.map((company) => (
                                    <tr key={company.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 font-medium">
                                            <Link href={route('companies.show', company.id)} className="hover:underline">
                                                {company.name}
                                            </Link>
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 hidden sm:table-cell">
                                            {company.website ? (
                                                <a href={company.website.startsWith('http') ? company.website : `//${company.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-xs">
                                                    {company.website}
                                                </a>
                                            ) : ('-')}
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 hidden md:table-cell">{company.phone_number || '-'}</td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 hidden lg:table-cell">{company.industry || '-'}</td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 hidden xl:table-cell">
                                            {company.assigned_user ? company.assigned_user.name : <span className="text-muted-foreground italic">Unassigned</span>}
                                        </td>
                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right">
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
                                                            <Link href={route('companies.show', company.id)}>View</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route('companies.edit', company.id)}>Edit</Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <AlertDialogTrigger asChild>
                                                            <DropdownMenuItem className="text-red-600 hover:!text-red-600 hover:!bg-red-50 dark:hover:!bg-red-900/50">
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </AlertDialogTrigger>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the company
                                                            "{company.name}" and unlink its contacts.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel disabled={isDeleting === company.id}>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDelete(company.id)}
                                                            disabled={isDeleting === company.id}
                                                            className="bg-destructive  hover:bg-destructive/90"
                                                        >
                                                            {isDeleting === company.id ? 'Deleting...' : 'Yes, delete company'}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-4 h-24 text-center text-muted-foreground">
                                        {isFiltersApplied ? 'No companies match your criteria.' : 'No companies found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/*
                    *** FIX APPLIED: Removed all references to .meta and simplified to Tailwind links. ***
                */}
                {companies?.last_page && companies.last_page > 1 && (
                    <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between">
                        <p className="text-sm text-muted-foreground mb-4 md:mb-0">
                            Showing {companies.from} to {companies.to} of {companies.total} companies
                        </p>

                        <div className="flex items-center space-x-1">
                            {companies.links.map((link, index) => {
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
                {/* --- END FINAL FIX: Simple Tailwind Pagination --- */}
            </div>
        </AppLayout>
    );
};

export default CompaniesIndex;
