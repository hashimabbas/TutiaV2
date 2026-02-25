import React, { useState } from 'react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { Offer } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
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

interface Props {
    offers: Offer[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const OffersIndex: React.FC<Props> = ({ offers }) => {
    const { auth } = usePage().props;
    const [offerToDelete, setOfferToDelete] = useState<number | null>(null);
    const { delete: destroy, processing, reset } = useForm({});

    const handleDelete = (offerId: number) => {
        setOfferToDelete(offerId);
    };

    const confirmDelete = () => {
        if (offerToDelete !== null) {
            destroy(route('offers.destroy', { offer: offerToDelete }), {
                onSuccess: () => {
                    setOfferToDelete(null);
                    reset();
                },
                onError: () => {
                    setOfferToDelete(null);
                    reset();
                }
            });
        }
    };

    const cancelDelete = () => {
        setOfferToDelete(null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Offers" />

            <div className="w-full">
                <div className="flex items-center py-4">
                    <Card>
                        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 pb-4">
                            <div>
                                <CardTitle>Offers</CardTitle>
                                <CardDescription>Manage your offers here.</CardDescription>
                            </div>
                            <Link href={route('offers.create')}>
                                <Button>Create New Offer</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {/* Responsive Table Container */}
                            <div className="rounded-md border">
                                <Table>
                                    <TableCaption>A list of your offers.</TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="px-4 py-2">Title</TableHead>
                                            <TableHead className="px-4 py-2">Description</TableHead>
                                            <TableHead className="px-4 py-2">Discount</TableHead>
                                            <TableHead className="px-4 py-2">Start Date</TableHead>
                                            <TableHead className="px-4 py-2">End Date</TableHead>
                                            <TableHead className="px-4 py-2">Active</TableHead>
                                            <TableHead className="px-4 py-2">Usage Limit</TableHead>
                                            <TableHead className="px-4 py-2">Usage Count</TableHead>
                                            <TableHead className="px-4 py-2">Image</TableHead>
                                            <TableHead className="px-4 py-2 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {offers.map((offer) => (
                                            <TableRow key={offer.id}>
                                                <TableCell className="px-4 py-2">{offer.title}</TableCell>
                                                <TableCell className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                                                    {offer.description}
                                                </TableCell>
                                                <TableCell className="px-4 py-2">
                                                    {offer.discount_percentage
                                                        ? `${offer.discount_percentage}%`
                                                        : offer.discount_amount
                                                            ? `$${offer.discount_amount}`
                                                            : 'N/A'}
                                                </TableCell>
                                                <TableCell className="px-4 py-2">{offer.start_date ? format(new Date(offer.start_date), 'PPP') : 'N/A'}</TableCell>
                                                <TableCell className="px-4 py-2">{offer.end_date ? format(new Date(offer.end_date), 'PPP') : 'N/A'}</TableCell>
                                                <TableCell className="px-4 py-2">
                                                    <Badge variant={offer.is_active ? 'success' : 'destructive'}>
                                                        {offer.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-4 py-2">{offer.usage_limit ?? 'Unlimited'}</TableCell>
                                                <TableCell className="px-4 py-2">{offer.usage_count}</TableCell>
                                                <TableCell className="px-4 py-2">
                                                    {offer.image ? (
                                                        <img
                                                            src={`/storage/${offer.image}`}
                                                            alt={offer.title}
                                                            className="h-8 w-auto object-cover rounded"
                                                        />
                                                    ) : (
                                                        'No Image'
                                                    )}
                                                </TableCell>
                                                <TableCell className="px-4 py-2 text-right">
                                                    <div className="flex gap-2 justify-end">
                                                        <Link href={route('offers.show', { offer: offer.id })}>
                                                            <Button variant="ghost" size="icon">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('offers.edit', { offer: offer.id })}>
                                                            <Button variant="ghost" size="icon">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(offer.id)}>
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will permanently delete the offer and remove its data from our servers.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel onClick={cancelDelete}>
                                                                        Cancel
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction disabled={processing} onClick={confirmDelete}>
                                                                        {processing ? 'Deleting...' : 'Delete'}
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default OffersIndex;
