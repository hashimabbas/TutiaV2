import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, useForm, router } from '@inertiajs/react'; // Import router
import { Offer, type BreadcrumbItem, PaginatedData, FlashMessages, User } from '@/types'; // Use PaginatedData
import AppLayout from '@/layouts/app-layout';
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash2, Search, X } from 'lucide-react'; // Added Search, X
import { format, parseISO } from 'date-fns'; // parseISO for robust date parsing
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { Input } from '@/components/ui/input'; // For search input
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // For filters
import { Pagination } from '@/components/ui/pagination';
import { Label } from '@/components/ui/label';


interface Props {
    offers: PaginatedData<Offer>; // Use PaginatedData
    filters: { // From controller: request()->only(...)
        search?: string;
        status?: string;
        assigned_user_id?: string;
    };
    statuses: string[]; // e.g., ['draft', 'proposed', ...] from controller
    users: User[]; // For assigned user filter
    flash?: FlashMessages;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Offers', href: route('offers.index') }
];

const OffersIndex: React.FC<Props> = ({ offers, filters, statuses, users, flash }) => {
    const [offerToDelete, setOfferToDelete] = useState<number | null>(null);
    const { delete: destroy, processing } = useForm({});

    // --- Search and Filter State ---
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedUser, setSelectedUser] = useState(filters.assigned_user_id || '');


    const handleFilterChange = () => {
        router.get(route('offers.index'), {
            search: searchQuery,
            status: selectedStatus,
            assigned_user_id: selectedUser,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setSearchQuery('');
        setSelectedStatus('');
        setSelectedUser('');
        router.get(route('offers.index'), {}, { // Empty object to clear query params
            preserveState: true,
            replace: true,
        });
    };

    useEffect(() => {
        // Optional: Debounce search or apply filters on explicit button click
        // For simplicity, this example might refetch on every change if not careful.
        // A dedicated "Apply Filters" button or debounce is better.
        // For now, we rely on manual trigger or an "Apply Filters" button.
    }, [searchQuery, selectedStatus, selectedUser]);


    const handleDeleteClick = (offerId: number) => setOfferToDelete(offerId);

    const confirmDelete = () => {
        if (offerToDelete === null) return;
        destroy(route('offers.destroy', offerToDelete), {
            preserveScroll: true,
            onSuccess: () => {
                setOfferToDelete(null);
                toast.success(flash?.success || 'Offer deleted successfully.');
            },
            onError: (errors) => {
                setOfferToDelete(null);
                console.error("Delete Error:", errors);
                toast.error(flash?.error || 'Failed to delete offer. Please try again.');
            },
        });
    };

    const cancelDelete = () => setOfferToDelete(null);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

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
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode || 'USD' }).format(value);
        // Adjust 'en-US' and default currency as needed
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Offers" />

            <div className="w-full py-6 md:py-12">
                <Card className="max-w-full mx-auto"> {/* Use max-w-full for wider tables */}
                    <CardHeader className="pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0">
                            <div>
                                <CardTitle>Offers</CardTitle>
                                <CardDescription>Manage your sales offers, quotes, and proposals.</CardDescription>
                            </div>
                            <Link href={route('offers.create')}>
                                <Button>Create New Offer</Button>
                            </Link>
                        </div>
                        {/* --- Filter Section --- */}
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
                                    onValueChange={(value) => {
                                        // value will be the selected item's value, or undefined if cleared (depends on Radix version/behavior for clearing)
                                        // For now, assume it's the item value or an empty string if a "clear" option existed
                                        setSelectedStatus(value || ''); // Set to empty string if value is null/undefined
                                    }}
                                >
                                    <SelectTrigger id="status-filter">
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* No explicit "All Statuses" item with empty value */}
                                        {/* The placeholder handles the "All" case when selectedStatus is "" */}
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
                                    onValueChange={(value) => {
                                        setSelectedUser(value || '');
                                    }}
                                >
                                    <SelectTrigger id="user-filter">
                                        <SelectValue placeholder="All Users" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {/* No explicit "All Users" item with empty value */}
                                        {users.map(user => (
                                            <SelectItem key={user.id} value={user.id.toString()}>
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex space-x-2">
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
                                    {offers.data.length > 0 ? (
                                        offers.data.map((offer) => (
                                            <TableRow key={offer.id} className="hover:bg-muted/50">
                                                <TableCell className="font-medium">
                                                    <Link href={route('offers.show', offer.id)} className="hover:underline">
                                                        {offer.title}
                                                    </Link>
                                                    <div className="text-xs text-muted-foreground">{offer.offer_type}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={
                                                        offer.status === 'accepted' ? 'success' :
                                                            offer.status === 'rejected' || offer.status === 'expired' ? 'destructive' :
                                                                offer.status === 'proposed' ? 'default' : // 'default' or a specific blue/yellow
                                                                    'outline' // for 'draft' or others
                                                    }>
                                                        {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {offer.company ? (
                                                        <Link href={route('companies.show', offer.company.id)} className="hover:underline">
                                                            {offer.company.name}
                                                        </Link>
                                                    ) : 'N/A'}
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    {formatCurrency(offer.value, offer.currency)}
                                                </TableCell>
                                                <TableCell className="hidden xl:table-cell">
                                                    {formatDate(offer.expected_close_date)}
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    {offer.assigned_user ? offer.assigned_user.name : 'N/A'}
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {offer.is_active ?
                                                        <Badge variant="success">Active Promo</Badge> :
                                                        offer.offer_type === 'promotion' ? <Badge variant="outline">Inactive Promo</Badge> : ''
                                                    }
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex gap-1 justify-end">
                                                        <Link href={route('offers.show', offer.id)}>
                                                            <Button variant="outline" size="icon" className="h-8 w-8">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('offers.edit', offer.id)}>
                                                            <Button variant="outline" size="icon" className="h-8 w-8">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDeleteClick(offer.id)}>
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
                                                No offers found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="mt-4">
                            <Pagination links={offers.links} />
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
                                This action cannot be undone. This will permanently delete the offer and all its associated data.
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

export default OffersIndex;
