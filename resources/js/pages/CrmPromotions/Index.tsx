// resources/js/Pages/CrmPromotions/Index.tsx

import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Promotion as PromotionType, type BreadcrumbItem, PaginatedData, FlashMessages } from '@/types';
import AppLayout from '@/layouts/app-layout';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash2, Search, X, PlusCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Label } from '@/components/ui/label';
import { route } from 'ziggy-js';

interface Props {
    promotions: PaginatedData<PromotionType>; // Receiving promotions data
    filters: { search?: string; };
    flash?: FlashMessages;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Public Promotions', href: route('crm.promotions.index') }
];

const CrmPromotionsIndex: React.FC<Props> = ({ promotions, filters, flash }) => {
    const [promotionToDelete, setPromotionToDelete] = useState<number | null>(null);
    const { delete: destroy, processing } = useForm({});

    const [searchQuery, setSearchQuery] = useState(filters.search || '');

    const handleFilterChange = () => {
        router.get(route('crm.promotions.index'), {
            search: searchQuery,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setSearchQuery('');
        router.get(route('crm.promotions.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleDeleteClick = (promotionId: number) => setPromotionToDelete(promotionId);

    const confirmDelete = () => {
        if (promotionToDelete === null) return;
        destroy(route('crm.promotions.destroy', promotionToDelete), {
            preserveScroll: true,
            onSuccess: () => {
                setPromotionToDelete(null);
                toast.success(flash?.success || 'Promotion deleted successfully.');
            },
            onError: (errors) => {
                setPromotionToDelete(null);
                console.error("Delete Error:", errors);
                toast.error(flash?.error || 'Failed to delete promotion. Please try again.');
            },
        });
    };

    const cancelDelete = () => setPromotionToDelete(null);

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return 'N/A';
        try {
            return format(parseISO(dateString), 'PP');
        } catch (e) {
            return dateString;
        }
    };

    const formatCurrency = (value?: number | null, currencyCode?: string) => {
        if (value === null || value === undefined) return 'N/A';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode || 'SAR' }).format(value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Public Promotions" />

            <div className="w-full py-6 md:py-12">
                <Card className="max-w-full mx-auto">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
                            <div>
                                <CardTitle>Public Promotions</CardTitle>
                                <CardDescription>Manage promotions visible on your public website.</CardDescription>
                            </div>
                            <Link href={route('crm.promotions.create')}>
                                <Button>
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Create New Promotion
                                </Button>
                            </Link>
                        </div>
                        {/* --- Filter Section --- */}
                        <div className="mt-4 flex gap-4 items-end">
                            <div className="flex-grow">
                                <Label htmlFor="search">Search</Label>
                                <Input
                                    id="search"
                                    type="text"
                                    placeholder="Search title, description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex space-x-2">
                                <Button onClick={handleFilterChange}>
                                    <Search className="h-4 w-4 mr-2" /> Apply
                                </Button>
                                <Button onClick={resetFilters} variant="outline">
                                    <X className="h-4 w-4 mr-2" /> Reset
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full rounded-md border md:border-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <TableHead>Title</TableHead>
                                        <TableHead className="hidden md:table-cell">Status</TableHead>
                                        <TableHead className="hidden lg:table-cell">Discount</TableHead>
                                        <TableHead className="hidden xl:table-cell">Start Date</TableHead>
                                        <TableHead className="hidden xl:table-cell">End Date</TableHead>
                                        <TableHead className="hidden md:table-cell">Code</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {promotions.data.length > 0 ? (
                                        promotions.data.map((promotion) => (
                                            <TableRow key={promotion.id} className="hover:bg-muted/50">
                                                <TableCell className="font-medium">
                                                    {promotion.title}
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <Badge variant={promotion.is_active ? 'success' : 'outline'}>
                                                        {promotion.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    {promotion.discount_percentage ? `${promotion.discount_percentage}% OFF` : 'N/A'}
                                                </TableCell>
                                                <TableCell className="hidden xl:table-cell">
                                                    {formatDate(promotion.start_date)}
                                                </TableCell>
                                                <TableCell className="hidden xl:table-cell">
                                                    {formatDate(promotion.end_date)}
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {promotion.code || 'N/A'}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex gap-1 justify-end">
                                                        {/* Optional: Add a show page if needed for a single CRM promo view without editing */}
                                                        {/* <Link href={route('crm.promotions.show', promotion.id)}>
                                                            <Button variant="outline" size="icon" className="h-8 w-8">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link> */}
                                                        <Link href={route('crm.promotions.edit', promotion.id)}>
                                                            <Button variant="outline" size="icon" className="h-8 w-8">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDeleteClick(promotion.id)}>
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                                No public promotions found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="mt-4">
                            <Pagination links={promotions.links} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {promotionToDelete !== null && (
                <AlertDialog open={promotionToDelete !== null} onOpenChange={(isOpen) => !isOpen && cancelDelete()}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the promotion.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={cancelDelete} disabled={processing}>Cancel</AlertDialogCancel>
                            <AlertDialogAction disabled={processing} onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                                {processing ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </AppLayout>
    );
};

export default CrmPromotionsIndex;
