import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type OfferType, type OfferItemType, type BreadcrumbItem } from '@/types';

import {
    Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Percent, CalendarDays, User, Building, Info, MessageSquare, Code, Clock, Trash2, Pencil } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";


interface OffersShowProps {
    offer: OfferType & { items: OfferItemType[], company: any, contact: any, assigned_user: any };
    auth: { user: any };
}

// --- Helper Functions ---
const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    try {
        return format(parseISO(dateString), 'PPP');
    } catch (e) { return '-'; }
};

const formatCurrency = (value: string | number | null | undefined, currency?: string): string => {
    const num = Number(value);
    if (isNaN(num) || value === null || value === undefined) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'SAR' }).format(num);
};

const getStatusBadgeVariant = (status: string): BadgeProps['variant'] => {
    switch (status) {
        case 'accepted': return 'default';
        case 'proposed': return 'secondary';
        case 'rejected':
        case 'expired':
        case 'withdrawn': return 'destructive';
        default: return 'outline';
    }
};

const DetailItem: React.FC<{ icon: React.ElementType, label: string, children: React.ReactNode }> = ({ icon: Icon, label, children }) => (
    <div className="flex flex-col space-y-1">
        <dt className="text-sm font-medium text-muted-foreground flex items-center">
            <Icon className="mr-2 h-4 w-4" />
            {label}
        </dt>
        <dd className="text-base">
            {children || <span className="text-muted-foreground">-</span>}
        </dd>
    </div>
);
// --- End Helper Functions ---


const OffersShow: React.FC<OffersShowProps> = ({ offer, auth }) => {
    const imageUrl = offer.image ? `/storage/${offer.image}` : undefined;
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        router.delete(route('offers.destroy', offer.id), {
            onStart: () => setIsDeleting(true),
            onFinish: () => setIsDeleting(false),
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Offers', href: route('offers.index') },
        { title: offer.title }
    ];

    // Calculate totals for display
    const subtotal = offer.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price)), 0);
    const totalDiscount = offer.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price) * (Number(item.discount_percentage) / 100)), 0);
    const taxableTotal = subtotal - totalDiscount;
    // Simplified: tax calculation assumes a fixed tax rate or you need to re-implement tax math here.
    // For now, we'll just show the final item total.
    const grandTotal = offer.items.reduce((sum, item) => sum + Number(item.total_price), 0);


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Offer - ${offer.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-start justify-between pb-3">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl">{offer.title}
                                    <Badge variant={getStatusBadgeVariant(offer.status)} className="ml-3 text-base capitalize">{offer.status}</Badge>
                                </CardTitle>
                                <CardDescription className="text-base text-muted-foreground">{offer.offer_type} • Value: {formatCurrency(offer.value || grandTotal, offer.currency)}</CardDescription>
                            </div>
                            <div className="flex space-x-2">
                                <Link href={route('offers.edit', { offer: offer.id })}>
                                    <Button variant="outline" size="sm"><Pencil className="h-4 w-4 mr-2" />Edit</Button>
                                </Link>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild><Button variant="destructive" size="sm" disabled={isDeleting}><Trash2 className="h-4 w-4 mr-2" />Delete</Button></AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader><AlertDialogTitle>Delete Offer</AlertDialogTitle><AlertDialogDescription>Delete "{offer.title}"? This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                                                {isDeleting ? 'Deleting...' : 'Yes, delete'}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* CRM Details Grid */}
                            <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <DetailItem icon={Building} label="Company">
                                    {offer.company ? (<Link href={route('companies.show', offer.company.id)} className="text-primary hover:underline">{offer.company.name}</Link>) : '-'}
                                </DetailItem>
                                <DetailItem icon={User} label="Contact">
                                    {offer.contact ? (<Link href={route('contacts.show', offer.contact.id)} className="text-primary hover:underline">{offer.contact.first_name} {offer.contact.last_name}</Link>) : '-'}
                                </DetailItem>
                                <DetailItem icon={Percent} label="Probability">{offer.probability}%</DetailItem>
                                <DetailItem icon={CalendarDays} label="Expected Close Date">{formatDate(offer.expected_close_date)}</DetailItem>
                                <DetailItem icon={CalendarDays} label="Actual Close Date">{formatDate(offer.actual_close_date)}</DetailItem>
                                <DetailItem icon={Info} label="Assigned To">{offer.assigned_user?.name || '-'}</DetailItem>
                                {offer.code && <DetailItem icon={Code} label="Redemption Code">{offer.code}</DetailItem>}
                                {offer.is_active && <DetailItem icon={Clock} label="Active Period">
                                    {formatDate(offer.start_date)} to {formatDate(offer.end_date)}
                                </DetailItem>}
                            </dl>

                            {/* Item List Table */}
                            <Separator />
                            <h3 className="text-lg font-medium flex items-center"><DollarSign className="mr-2 h-5 w-5" /> Line Items</h3>
                            <div className="border rounded-lg overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Service/Product</TableHead>
                                            <TableHead className="text-right">Price</TableHead>
                                            <TableHead className="text-right">Qty</TableHead>
                                            <TableHead className="text-right">Disc (%)</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {offer.items.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">
                                                    {item.service_name}
                                                    {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
                                                </TableCell>
                                                <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                                                <TableCell className="text-right">{item.quantity}</TableCell>
                                                <TableCell className="text-right">{item.discount_percentage || 0}%</TableCell>
                                                <TableCell className="text-right font-semibold">{formatCurrency(item.total_price)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Total Summary */}
                            <div className="flex justify-end pt-4">
                                <div className="w-full max-w-xs space-y-1">
                                    <div className="flex justify-between font-normal text-sm"><span>Subtotal:</span><span>{formatCurrency(subtotal, offer.currency)}</span></div>
                                    <div className="flex justify-between font-normal text-sm"><span>Item Discounts:</span><span>-{formatCurrency(totalDiscount, offer.currency)}</span></div>
                                    <div className="flex justify-between font-normal text-sm border-t pt-1"><span>Taxable Total:</span><span>{formatCurrency(taxableTotal, offer.currency)}</span></div>
                                    <div className="flex justify-between font-bold text-lg border-t pt-2"><span>GRAND TOTAL:</span><span>{formatCurrency(grandTotal, offer.currency)}</span></div>
                                </div>
                            </div>

                            {/* Descriptions/Notes */}
                            {(offer.description || offer.notes) && <Separator />}
                            {offer.description && <div><h4 className="text-sm font-medium">Description (EN)</h4><p className="text-sm text-muted-foreground whitespace-pre-line">{offer.description}</p></div>}
                            {offer.description_ar && <div><h4 className="text-sm font-medium">الوصف (AR)</h4><p className="text-sm text-muted-foreground whitespace-pre-line">{offer.description_ar}</p></div>}
                            {offer.notes && <div><h4 className="text-sm font-medium">Internal Notes</h4><p className="text-sm text-muted-foreground whitespace-pre-line">{offer.notes}</p></div>}


                            {imageUrl && (
                                <div className="pt-4"><h4 className="text-sm font-medium mb-2">Promotional Image</h4>
                                    <img src={imageUrl} alt={offer.title} className="rounded-md object-cover max-h-64 border" />
                                </div>
                            )}

                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default OffersShow;
