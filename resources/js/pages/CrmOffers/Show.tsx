import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type CrmOfferType, type OfferItemType, type BreadcrumbItem } from '@/types';

import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    DollarSign, Percent, CalendarDays, User, Building, Info,
    Trash2, Pencil
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { route } from 'ziggy-js';

interface CrmOffersShowProps {
    crmOffer: CrmOfferType & { items: OfferItemType[], company: any, contact: any, assigned_user: any };
    auth: { user: any };
}

const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    try {
        return format(parseISO(dateString), 'PPP');
    } catch (e) {
        return '-';
    }
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


const CrmOffersShow: React.FC<CrmOffersShowProps> = ({ crmOffer, auth }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        router.delete(route('crm.offers.destroy', { offer: crmOffer.id }), {
            onStart: () => setIsDeleting(true),
            onFinish: () => setIsDeleting(false),
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'CRM Offers', href: route('crm.offers.index') },
        { title: crmOffer.title }
    ];

    const subtotal = crmOffer.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price)), 0);
    const totalDiscount = crmOffer.items.reduce((sum, item) => sum + (
        Number(item.quantity) * Number(item.unit_price) * (Number(item.discount_percentage || 0) / 100)
    ), 0);
    const taxableAmount = subtotal - totalDiscount;
    const totalTax = crmOffer.items.reduce((sum, item) => {
        const itemQty = Number(item.quantity);
        const itemPrice = Number(item.unit_price);
        const itemDiscountPct = Number(item.discount_percentage || 0);
        const itemTaxRate = Number(item.tax_rate || 0);

        const baseItemPrice = itemQty * itemPrice;
        const itemDiscount = baseItemPrice * (itemDiscountPct / 100);
        const taxableItemPrice = baseItemPrice - itemDiscount;
        return sum + (taxableItemPrice * itemTaxRate);
    }, 0);
    const grandTotal = taxableAmount + totalTax;

    // Helper to format offer_type with fallback
    const formattedOfferType = crmOffer.offer_type
        ? crmOffer.offer_type.replace(/_/g, ' ').charAt(0).toUpperCase() + crmOffer.offer_type.replace(/_/g, ' ').slice(1)
        : 'Unknown Type'; // Fallback if offer_type is undefined/null

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`CRM Offer - ${crmOffer.title}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-start justify-between pb-3">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl">{crmOffer.title}
                                    <Badge variant={getStatusBadgeVariant(crmOffer.status)} className="ml-3 text-base capitalize">{crmOffer.status}</Badge>
                                </CardTitle>
                                <CardDescription className="text-base text-muted-foreground">
                                    {/* FIX: Use the formattedOfferType variable with the null check */}
                                    {formattedOfferType}
                                    • Value: {formatCurrency(crmOffer.value || grandTotal, crmOffer.currency)}
                                </CardDescription>
                            </div>
                            <div className="flex space-x-2">
                                {/* <Link href={route('crm.offers.edit', { offer: crmOffer.id })}>
                                    <Button variant="outline" size="sm"><Pencil className="h-4 w-4 mr-2" />Edit</Button>
                                </Link> */}
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm" disabled={isDeleting}><Trash2 className="h-4 w-4 mr-2" />Delete</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete CRM Offer</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Delete "{crmOffer.title}"? This action cannot be undone. This will permanently delete the CRM offer and all its associated data.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
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
                                    {crmOffer.company ? (<Link href={route('companies.show', crmOffer.company.id)} className="text-primary hover:underline">{crmOffer.company.name}</Link>) : '-'}
                                </DetailItem>
                                <DetailItem icon={User} label="Contact">
                                    {crmOffer.contact ? (<Link href={route('contacts.show', crmOffer.contact.id)} className="text-primary hover:underline">{crmOffer.contact.first_name} {crmOffer.contact.last_name}</Link>) : '-'}
                                </DetailItem>
                                <DetailItem icon={Percent} label="Probability">
                                    {crmOffer.probability ? `${crmOffer.probability}%` : '-'}
                                </DetailItem>
                                <DetailItem icon={CalendarDays} label="Expected Close Date">
                                    {formatDate(crmOffer.expected_close_date)}
                                </DetailItem>
                                <DetailItem icon={CalendarDays} label="Actual Close Date">
                                    {formatDate(crmOffer.actual_close_date)}
                                </DetailItem>
                                <DetailItem icon={Info} label="Assigned To">
                                    {crmOffer.assigned_user?.name || '-'}
                                </DetailItem>
                            </dl>

                            {/* Item List Table */}
                            <Separator />
                            <h3 className="text-lg font-medium flex items-center"><DollarSign className="mr-2 h-5 w-5" /> Line Items</h3>
                            <div className="border rounded-lg overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Service/Product</TableHead>
                                            <TableHead className="text-right">Unit Price</TableHead>
                                            <TableHead className="text-right">Qty</TableHead>
                                            <TableHead className="text-right">Disc (%)</TableHead>
                                            <TableHead className="text-right">Tax Rate</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {crmOffer.items.length > 0 ? (
                                            crmOffer.items.map((item, index) => (
                                                <TableRow key={item.id || index}>
                                                    <TableCell className="font-medium">
                                                        {item.service_name}
                                                        {item.description && <div className="text-xs text-muted-foreground">{item.description}</div>}
                                                    </TableCell>
                                                    <TableCell className="text-right">{formatCurrency(item.unit_price, crmOffer.currency)}</TableCell>
                                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                                    <TableCell className="text-right">{item.discount_percentage || 0}%</TableCell>
                                                    <TableCell className="text-right">{(Number(item.tax_rate || 0) * 100).toFixed(2)}%</TableCell>
                                                    <TableCell className="text-right font-semibold">{formatCurrency(item.total_price, crmOffer.currency)}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                                    No line items for this offer.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Total Summary */}
                            <div className="flex justify-end pt-4">
                                <div className="w-full max-w-xs space-y-1">
                                    <div className="flex justify-between font-normal text-sm">
                                        <span>Subtotal:</span>
                                        <span>{formatCurrency(subtotal, crmOffer.currency)}</span>
                                    </div>
                                    <div className="flex justify-between font-normal text-sm">
                                        <span>Item Discounts:</span>
                                        <span>-{formatCurrency(totalDiscount, crmOffer.currency)}</span>
                                    </div>
                                    <div className="flex justify-between font-normal text-sm">
                                        <span>Taxable Amount:</span>
                                        <span>{formatCurrency(taxableAmount, crmOffer.currency)}</span>
                                    </div>
                                    <div className="flex justify-between font-normal text-sm border-t pt-1">
                                        <span>Total Tax:</span>
                                        <span>{formatCurrency(totalTax, crmOffer.currency)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                                        <span>GRAND TOTAL:</span>
                                        <span>{formatCurrency(grandTotal, crmOffer.currency)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Descriptions/Notes */}
                            {(crmOffer.description || crmOffer.notes) && <Separator />}
                            {crmOffer.description && <div><h4 className="text-sm font-medium">Description (EN)</h4><p className="text-sm text-muted-foreground whitespace-pre-line">{crmOffer.description}</p></div>}
                            {crmOffer.description_ar && <div><h4 className="text-sm font-medium">الوصف (AR)</h4><p className="text-sm text-muted-foreground whitespace-pre-line">{crmOffer.description_ar}</p></div>}
                            {crmOffer.notes && <div><h4 className="text-sm font-medium">Internal Notes</h4><p className="text-sm text-muted-foreground whitespace-pre-line">{crmOffer.notes}</p></div>}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default CrmOffersShow;
