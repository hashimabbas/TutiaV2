// resources/js/pages/Cases/Index.tsx

import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, X, MoreHorizontal, Download, Filter } from "lucide-react";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PaginatedResponse, PageProps, SupportCase } from '@/types';
import { pickBy } from 'lodash';
import { route } from 'ziggy-js';

interface CasesIndexProps {
    cases: PaginatedResponse<SupportCase>;
    filters: {
        search?: string;
        status?: string;
        priority?: string;
    };
    filterOptions: {
        statuses: string[];
        priorities: string[];
    };
}

const CLEAR_FILTER_VALUE = 'all';

// Helper to determine badge color
const getCaseBadgeVariant = (status: string): BadgeProps['variant'] => {
    switch (status) {
        case 'New': return 'default';
        case 'Open': return 'secondary';
        case 'In Progress': return 'default';
        case 'Resolved': return 'success'; // Assuming you have a custom 'success' variant
        case 'Closed': return 'outline';
        case 'On Hold': return 'warning'; // Assuming you have a custom 'warning' variant
        default: return 'secondary';
    }
};

const CasesIndex: React.FC = () => {
    const { props } = usePage<PageProps & CasesIndexProps>();
    const { cases, filters, filterOptions } = props;

    const [filterValues, setFilterValues] = useState(filters);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    useEffect(() => setFilterValues(filters), [filters]);

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        const actualValue = value === CLEAR_FILTER_VALUE ? '' : value;
        setFilterValues(prev => ({ ...prev, [key]: actualValue }));
    };

    const handleFilterSubmit = () => {
        const query = pickBy(filterValues);
        router.get(route('support_cases.index'), query, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleResetFilters = () => {
        setFilterValues({});
        router.get(route('support_cases.index'));
    };

    const handleDelete = (caseId: number) => {
        router.delete(route('support_cases.destroy', caseId), {
            preserveScroll: true,
            onStart: () => setIsDeleting(caseId),
            onFinish: () => setIsDeleting(null),
        });
    };

    const isFiltersApplied = Object.values(filters).some(Boolean);

    return (
        <AppLayout breadcrumbs={[{ title: 'Support Cases', href: route('support_cases.index') }]}>
            <Head title="Support Cases" />

            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                {/* Header with Title and Buttons */}
                <div className="sm:flex sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Support Cases</h1>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                        <Link href={route('support_cases.create')}>
                            <Button><Plus className="mr-2 h-4 w-4" /> Create Case</Button>
                        </Link>
                    </div>
                </div>

                {/* Filter Card */}
                <Card>
                    <CardHeader><CardTitle className="flex items-center text-base"><Filter className="mr-2 h-4 w-4"/>Filter & Search</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <Input
                            placeholder="Search by subject, ref #, company..."
                            value={filterValues.search || ''}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleFilterSubmit()}
                        />
                        <Select value={filterValues.status || CLEAR_FILTER_VALUE} onValueChange={(v) => handleFilterChange('status', v)}>
                            <SelectTrigger><SelectValue placeholder="Filter by Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value={CLEAR_FILTER_VALUE}>All Statuses</SelectItem>
                                {filterOptions.statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={filterValues.priority || CLEAR_FILTER_VALUE} onValueChange={(v) => handleFilterChange('priority', v)}>
                            <SelectTrigger><SelectValue placeholder="Filter by Priority" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value={CLEAR_FILTER_VALUE}>All Priorities</SelectItem>
                                {filterOptions.priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <div className="flex items-center space-x-2">
                            <Button onClick={handleFilterSubmit}>Filter</Button>
                            {isFiltersApplied && (
                                <Button variant="ghost" onClick={handleResetFilters} size="sm"><X className="h-4 w-4 mr-1" /> Reset</Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Data Table */}
                <div className="border rounded-lg overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ref / Subject</TableHead>
                                <TableHead className="hidden sm:table-cell">Company</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="hidden md:table-cell">Priority</TableHead>
                                <TableHead className="hidden lg:table-cell">Assigned To</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cases.data.length > 0 ? (
                                cases.data.map((caseItem) => (
                                    <TableRow key={caseItem.id} className="hover:bg-muted/50">
                                        <TableCell className="font-medium">
                                            <Link href={route('support_cases.show', caseItem.id)} className="hover:underline">
                                                {caseItem.subject}
                                            </Link>
                                            <div className="text-xs text-muted-foreground">{caseItem.reference_number}</div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            {caseItem.company ? (
                                                <Link href={route('companies.show', caseItem.company.id)} className="hover:underline text-sm">
                                                    {caseItem.company.name}
                                                </Link>
                                            ) : ('-')}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getCaseBadgeVariant(caseItem.status)}>{caseItem.status}</Badge>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{caseItem.priority}</TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            {caseItem.assigned_user ? caseItem.assigned_user.name : <span className="text-muted-foreground italic">Unassigned</span>}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild><Link href={route('support_cases.show', caseItem.id)}>View</Link></DropdownMenuItem>
                                                    <DropdownMenuItem asChild><Link href={route('support_cases.edit', caseItem.id)}>Edit</Link></DropdownMenuItem>
                                                    {/* Add delete logic if needed */}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        {isFiltersApplied ? 'No cases match your criteria.' : 'No support cases found.'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                {/* Add Pagination Controls Here */}
            </div>
        </AppLayout>
    );
};

export default CasesIndex;
