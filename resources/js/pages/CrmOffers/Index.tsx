import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { CrmOfferType, type BreadcrumbItem, PaginatedData, FlashMessageType, User } from '@/types';
import AppLayout from '@/layouts/app-layout';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash2, Search, X, PlusCircle } from 'lucide-react'; // Added PlusCircle for Create button
import { format, parseISO } from 'date-fns';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination } from '@/components/pagination';
import { Label } from '@/components/ui/label';


interface Props {
    crmOffers: PaginatedData<CrmOfferType>; // Changed prop name and type
    filters: { // From controller: request()->only(...)
        search?: string;
        status?: string;
        assigned_user_id?: string;
        offer_type?: string; // Kept for CRM offer types
    };
    statuses: string[]; // e.g., ['draft', 'proposed', ...] from controller
    offerTypes: string[]; // CRM-specific offer types
    users: User[]; // For assigned user filter
    flash?: FlashMessageType;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'CRM Offers', href: route('crm.offers.index') } // Updated route
];

const CrmOffersIndex: React.FC<Props> = ({ crmOffers, filters, statuses, users, offerTypes, flash }) => { // Updated prop name
    const [offerToDelete, setOfferToDelete] = useState<number | null>(null);
    const { delete: destroy, processing } = useForm({});

    // --- Search and Filter State ---
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedUser, setSelectedUser] = useState(filters.assigned_user_id || '');
    const [selectedOfferType, setSelectedOfferType] = useState(filters.offer_type || ''); // For CRM types


    const handleFilterChange = () => {
        router.get(route('crm.offers.index'), { // Updated route
            search: searchQuery,
            status: selectedStatus,
            assigned_user_id: selectedUser,
            offer_type: selectedOfferType,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedStatus('');
        setSelectedUser('');
        setSelectedOfferType('');
        router.get(route('crm.offers.index'), {}, { // Updated route (empty object to clear all filters)
            preserveState: true,
            replace: true,
        });
    };

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleDeleteClick = (offerId: number) => setOfferToDelete(offerId);

    const confirmDelete = () => {
        if (offerToDelete === null) return;
        destroy(route('crm.offers.destroy', { offer: offerToDelete }), { // Pass { offer: offerToDelete }
            preserveScroll: true,
            onSuccess: () => {
                setOfferToDelete(null);
                toast.success(flash?.success || 'CRM Offer deleted successfully.');
            },
            onError: (errors) => {
                setOfferToDelete(null);
                console.error("Delete Error:", errors);
                toast.error(flash?.error || 'Failed to delete CRM offer. Please try again.');
            },
        });
    };

    const cancelDelete = () => setOfferToDelete(null);

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return 'N/A';
        try {
            return format(parseISO(dateString), 'PP'); // PP is like 'Sep 10, 2021'
        } catch (e) {
            return dateString; // Fallback if parsing fails
        }
    };

    const formatCurrency = (value?: number | null, currencyCode?: string) => {
        if (value === null || value === undefined) return 'N/A';
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode || 'SAR' }).format(value);
        // Adjust 'en-US' and default currency as needed
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="CRM Offers" /> {/* Updated title */}

            <div className="w-full py-6 md:py-12">
                <Card className="max-w-full mx-auto"> {/* Use max-w-full for wider tables */}
                    <CardHeader className="pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
                            <div>
                                <CardTitle>CRM Offers</CardTitle> {/* Updated title */}
                                <CardDescription>Manage your customer-specific sales offers, quotes, and proposals.</CardDescription>
                            </div>
                            <Link href={route('crm.offers.create')}> {/* Updated route */}
                                <Button>
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Create New CRM Offer
                                </Button> {/* Updated button text */}
                            </Link>
                        </div>
                        {/* --- Filter Section --- */}
                        {/* Using grid-cols-4 now, assuming 4 filter controls + 2 buttons, might need adjustment */}
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            <div>
                                <Label htmlFor="search">Search</Label>
                                <Input
                                    id="search"
                                    type="text"
                                    placeholder="Search title, company..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <Label htmlFor="status-filter">Status</Label>
                                <Select
                                    value={selectedStatus} // Controlled component
                                    onValueChange={(value) => setSelectedStatus(value || '')} // Set to empty string if value is null/undefined
                                >
                                    <SelectTrigger id="status-filter">
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* Removed <SelectItem value="">All Statuses</SelectItem> as placeholder handles this */}
                                        {statuses.map(status => (
                                            <SelectItem key={status} value={status}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="user-filter">Assigned To</Label>
                                <Select
                                    value={selectedUser}
                                    onValueChange={(value) => setSelectedUser(value || '')}
                                >
                                    <SelectTrigger id="user-filter">
                                        <SelectValue placeholder="All Users" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* Removed <SelectItem value="">All Users</SelectItem> as placeholder handles this */}
                                        {users.map(user => (
                                            <SelectItem key={user.id} value={user.id.toString()}>
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="offer-type-filter">Offer Type</Label>
                                <Select
                                    value={selectedOfferType}
                                    onValueChange={(value) => setSelectedOfferType(value || '')}
                                >
                                    <SelectTrigger id="offer-type-filter">
                                        <SelectValue placeholder="All Offer Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* Removed <SelectItem value="">All Offer Types</SelectItem> as placeholder handles this */}
                                        {offerTypes.map(type => (
                                            <SelectItem key={type} value={type}>
                                                {type.replace(/_/g, ' ').charAt(0).toUpperCase() + type.replace(/_/g, ' ').slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex space-x-2 lg:col-span-4 justify-end"> {/* Adjusted column span and alignment for buttons */}
                                <Button onClick={handleFilterChange} className="w-full md:w-auto">
                                    <Search className="h-4 w-4 mr-2" /> Apply
                                </Button>
                                <Button onClick={resetFilters} variant="outline" className="w-full md:w-auto">
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
                                        <TableHead>Status</TableHead>
                                        <TableHead className="hidden md:table-cell">Company</TableHead>
                                        <TableHead className="hidden lg:table-cell">Value</TableHead>
                                        <TableHead className="hidden xl:table-cell">Expected Close</TableHead>
                                        <TableHead className="hidden lg:table-cell">Assigned To</TableHead>
                                        <TableHead className="hidden md:table-cell">Type</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {crmOffers.data.length > 0 ? ( // Updated prop name
                                        crmOffers.data.map((crmOffer) => ( // Updated variable name
                                            <TableRow key={crmOffer.id} className="hover:bg-muted/50">
                                                <TableCell className="font-medium">
                                                    <Link href={route('crm.offers.show', { offer: crmOffer.id })} className="hover:underline"> {/* Pass { offer: crmOffer.id } */}
                                                        {crmOffer.title}
                                                    </Link>
                                                    <div className="text-xs text-muted-foreground">{crmOffer.offer_type}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        crmOffer.status === 'accepted' ? 'default' :
                                                            crmOffer.status === 'rejected' || crmOffer.status === 'expired' ? 'destructive' :
                                                                crmOffer.status === 'proposed' ? 'secondary' : // 'default' or a specific blue/yellow
                                                                    'outline' // for 'draft' or others
                                                    }>
                                                        {crmOffer.status.charAt(0).toUpperCase() + crmOffer.status.slice(1)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {crmOffer.company ? (
                                                        <Link href={route('companies.show', crmOffer.company.id)} className="hover:underline">
                                                            {crmOffer.company.name}
                                                        </Link>
                                                    ) : 'N/A'}
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    {formatCurrency(crmOffer.value, crmOffer.currency)}
                                                </TableCell>
                                                <TableCell className="hidden xl:table-cell">
                                                    {formatDate(crmOffer.expected_close_date)}
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    {crmOffer.assigned_user ? crmOffer.assigned_user.name : 'N/A'}
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {crmOffer.offer_type.charAt(0).toUpperCase() + crmOffer.offer_type.slice(1)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex gap-1 justify-end">
                                                        <Link href={route('crm.offers.show', { offer: crmOffer.id })}> {/* Pass { offer: crmOffer.id } */}
                                                            <Button variant="outline" size="icon" className="h-8 w-8">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('crm.offers.edit', { offer: crmOffer.id })}> {/* Pass { offer: crmOffer.id } */}
                                                            <Button variant="outline" size="icon" className="h-8 w-8">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDeleteClick(crmOffer.id)}>
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            {/* AlertDialogContent is now managed by the single dialog instance below */}
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                                No CRM offers found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="mt-4">
                            <Pagination links={crmOffers.links} /> {/* Updated prop name */}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {offerToDelete !== null && (
                <AlertDialog open={offerToDelete !== null} onOpenChange={(isOpen) => !isOpen && cancelDelete()}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the CRM offer and all its associated data.
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

export default CrmOffersIndex;
