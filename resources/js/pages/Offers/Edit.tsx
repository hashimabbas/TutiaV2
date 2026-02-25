import React, { useState, useEffect, useMemo } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    type OfferType,
    type OfferItemType,
    type CompanyType,
    type ContactType,
    type UserType,
    type FlashMessageType,
} from '@/types';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircledIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { PlusCircle, Trash2, Monitor } from 'lucide-react'; // Added Monitor icon
import { route } from 'ziggy-js';
import { format } from 'date-fns';

// --- Interface Definitions (Must match data from Controller) ---
interface ProductCatalogItem {
    id: number;
    name: string;
    description: string;
    unit_price: number;
    sku: string;
}

interface OffersEditProps {
    errors: Record<string, string>;
    flash?: FlashMessageType;
    offer: OfferType & { items: OfferItemType[] }; // Ensure items are included
    companies: CompanyType[];
    contacts: Array<ContactType & { company_id?: number }>;
    users: UserType[];
    statuses: string[];
    offerTypes: string[];
    defaultCurrency?: string;
    products: ProductCatalogItem[];
}

interface OfferFormData {
    _method: 'PUT'; // Spoofer for PUT request
    title: string;
    title_ar: string;
    description: string;
    description_ar: string;
    status: string;
    value: string; // Keep as string for input
    currency: string;
    probability: string; // Keep as string for input
    expected_close_date: string;
    actual_close_date: string;
    offer_type: string;
    notes: string;
    company_id: string | null;
    contact_id: string | null;
    assigned_user_id: string | null;
    discount_percentage: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    image: File | null;
    remove_image: boolean; // Flag to indicate old image deletion
    code: string;
    usage_limit: string;
    user_usage_limit: string;
    items: OfferItemType[];
}

const UNASSIGNED_VALUE = "__UNASSIGNED__";


const OffersEdit: React.FC = () => {
    const { props } = usePage<OffersEditProps>();
    const { offer, errors: serverErrors, flash, companies, contacts: propContacts, users, statuses, offerTypes, products } = props;

    // Ensure propContacts is always an array
    const allContacts = Array.isArray(propContacts) ? propContacts : [];

    // --- FORM INITIALIZATION ---
    const { data, setData, post, processing, errors, recentlySuccessful, clearErrors, reset } = useForm<OfferFormData>({
        _method: 'PUT',
        title: offer.title || '',
        title_ar: offer.title_ar || '',
        description: offer.description || '',
        description_ar: offer.description_ar || '',
        status: offer.status || statuses[0],
        value: offer.value?.toString() || '',
        currency: offer.currency || props.defaultCurrency || 'SAR',
        probability: offer.probability?.toString() || '',
        expected_close_date: offer.expected_close_date ? format(new Date(offer.expected_close_date), 'yyyy-MM-dd') : '',
        actual_close_date: offer.actual_close_date ? format(new Date(offer.actual_close_date), 'yyyy-MM-dd') : '',
        offer_type: offer.offer_type || offerTypes[0],
        notes: offer.notes || '',
        company_id: offer.company_id?.toString() || null,
        contact_id: offer.contact_id?.toString() || null,
        assigned_user_id: offer.assigned_user_id?.toString() || null,
        discount_percentage: offer.discount_percentage?.toString() || '',
        start_date: offer.start_date ? format(new Date(offer.start_date), "yyyy-MM-dd'T'HH:mm") : '', // datetime-local format
        end_date: offer.end_date ? format(new Date(offer.end_date), "yyyy-MM-dd'T'HH:mm") : '',       // datetime-local format
        is_active: !!offer.is_active,
        image: null,
        remove_image: false, // Default to false
        code: offer.code || '',
        usage_limit: offer.usage_limit?.toString() || '',
        user_usage_limit: offer.user_usage_limit?.toString() || '',
        items: offer.items.map(item => ({
            ...item,
            unit_price: item.unit_price?.toString() || '0',
            quantity: item.quantity?.toString() || '1',
            discount_percentage: item.discount_percentage?.toString() || '',
            tax_rate: item.tax_rate?.toString() || '',
            product_id: item.product_id ? String(item.product_id) : null,
        })),
    });

    const [filteredContacts, setFilteredContacts] = useState<Array<ContactType & { company_id?: number }>>(allContacts);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    // Filter Contacts by selected Company
    useEffect(() => {
        const currentAllContacts = Array.isArray(propContacts) ? propContacts : [];
        if (data.company_id) {
            const newFiltered = currentAllContacts.filter(c => String(c.company_id) === data.company_id);
            setFilteredContacts(newFiltered);
            // ... contact reset logic (omitted for brevity)
        } else {
            setFilteredContacts(currentAllContacts);
        }
    }, [data.company_id, propContacts, data.contact_id]);

    // --- ITEM AND CALCULATION LOGIC (Copied from Create.tsx) ---
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setData(name as keyof OfferFormData, value);
        if (errors[name as keyof OfferFormData]) clearErrors(name as keyof OfferFormData);
    };

    const handleSelectChange = (name: keyof OfferFormData, value: string | number | null) => {
        let processedValue = value;
        if (value === '') { processedValue = null; }
        setData(name, processedValue as any);
        if (errors[name]) clearErrors(name);
    };

    const handleCheckboxChange = (name: keyof OfferFormData, checked: boolean) => {
        setData(name, checked);
        if (errors[name]) clearErrors(name);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setData('image', file);
        if (errors.image) clearErrors('image');
    };

    // Helper to find product by ID
    const findProduct = (id: string | number | null): ProductCatalogItem | undefined => {
        if (!id) return undefined;
        const numId = typeof id === 'string' ? parseInt(id) : id;
        return products.find(p => p.id === numId);
    };

    const handleItemChange = (index: number, field: keyof OfferItemType, value: string | number) => {
        const newItems = data.items.map((item, i) => {
            if (i === index) {
                const updatedItem = { ...item };
                if (['quantity', 'unit_price', 'discount_percentage', 'discount_amount', 'tax_rate'].includes(field as string)) {
                    (updatedItem as any)[field] = value === '' ? '' : String(value);
                } else {
                    (updatedItem as any)[field] = value;
                }

                // --- CALCULATION LOGIC ---
                const qty = parseFloat(updatedItem.quantity as string) || 0;
                const price = parseFloat(updatedItem.unit_price as string) || 0;
                const discountPercent = parseFloat(updatedItem.discount_percentage as string) || 0;
                const taxRate = parseFloat(updatedItem.tax_rate as string) || 0;

                let subTotal = qty * price;
                let itemDiscount = (discountPercent > 0) ? (subTotal * (discountPercent / 100)) : 0;
                const taxableAmount = subTotal - itemDiscount;
                const taxAmount = taxableAmount * taxRate;
                updatedItem.total_price = taxableAmount + taxAmount;
                // --- END CALCULATION LOGIC ---

                return updatedItem;
            }
            return item;
        });
        setData('items', newItems);
    };

    const handleItemProductSelect = (index: number, productId: string) => {
        const isCustom = productId === '_custom';
        const product = isCustom ? undefined : findProduct(productId);

        setData(prevData => {
            const newItems = prevData.items.map((item, i) => {
                if (i === index) {
                    const updatedItem = {
                        ...item,
                        product_id: isCustom ? null : Number(productId),
                    };

                    if (product) {
                        updatedItem.service_name = product.name;
                        updatedItem.unit_price = product.unit_price;
                        updatedItem.description = item.description || product.description;
                    } else if (isCustom) {
                        // Reset auto-filled fields when switching to custom
                        updatedItem.service_name = updatedItem.service_name || '';
                        updatedItem.unit_price = updatedItem.unit_price || 0;
                    }

                    // Recalculate total
                    const qty = parseFloat(updatedItem.quantity as string) || 0;
                    const price = parseFloat(updatedItem.unit_price as string) || 0;
                    const discountPercent = parseFloat(updatedItem.discount_percentage as string) || 0;
                    const taxRate = parseFloat(updatedItem.tax_rate as string) || 0;

                    let subTotal = qty * price;
                    let itemDiscount = (discountPercent > 0) ? (subTotal * (discountPercent / 100)) : 0;
                    const taxableAmount = subTotal - itemDiscount;
                    const taxAmount = taxableAmount * taxRate;
                    updatedItem.total_price = taxableAmount + taxAmount;

                    return updatedItem;
                }
                return item;
            });

            return { ...prevData, items: newItems };
        });
    };


    const addItem = () => {
        const emptyItem: OfferItemType = {
            service_name: '',
            description: '',
            quantity: 1,
            unit_price: 0,
            discount_percentage: '',
            tax_rate: '',
            total_price: 0,
            product_id: null,
        };
        setData('items', [...data.items, emptyItem]);
    };

    const removeItem = (index: number) => {
        if (data.items.length <= 1) {
            toast.error("At least one item is required.");
            return;
        }
        const newItems = data.items.filter((_, i) => i !== index);
        setData('items', newItems);
    };
    // --- END ITEM AND CALCULATION LOGIC ---


    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // Transform items before sending: ensure numeric fields are numbers
        const itemsForSubmission = data.items.map(item => ({
            ...item,
            quantity: parseFloat(item.quantity as string) || 0,
            unit_price: parseFloat(item.unit_price as string) || 0,
            discount_percentage: item.discount_percentage ? parseFloat(item.discount_percentage as string) : null,
            tax_rate: item.tax_rate ? parseFloat(item.tax_rate as string) : null,
            product_id: item.product_id === null ? null : Number(item.product_id), // Ensure it's null or number
        }));

        const formDataToSubmit = {
            ...data,
            items: itemsForSubmission,
            discount_percentage: data.discount_percentage ? parseFloat(data.discount_percentage as string) : null,
            value: data.value ? parseFloat(data.value as string) : null,
            probability: data.probability ? parseInt(data.probability as string) : null,
            usage_limit: data.usage_limit ? parseInt(data.usage_limit as string) : null,
            user_usage_limit: data.user_usage_limit ? parseInt(data.user_usage_limit as string) : null,
        };

        // Use post with FormData (which handles the image and _method: 'PUT')
        post(route('offers.update', offer.id), {
            data: formDataToSubmit,
            onSuccess: () => {
                toast.success('Offer updated successfully!');
            },
            onError: (formErrors) => {
                console.error("Form Errors:", formErrors);
                toast.error('Please correct the errors in the form.');
            }
        });
    };

    const currencyOptions = [
        { code: 'SDG', label: 'Sudanese Pound (SDG)' },
        { code: 'EGP', label: 'Egyptian Pound(EGP)' },
        { code: 'OMR', label: 'Omani Rial (OMR)' },
        { code: 'SAR', label: 'Saudi Riyal (SAR)' },
        { code: 'AED', label: 'UAE Dirham (AED)' },
        { code: 'USD', label: 'US Dollar (USD)' },
        { code: 'EUR', label: 'Euro (EUR)' },
        { code: 'GBP', label: 'British Pound (GBP)' },
    ];


    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Offers', href: route('offers.index') },
        { title: 'Edit Offer' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Offer - ${offer.title}`} />

            <div className="py-12">
                <Card className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <CardHeader>
                        <CardTitle>Edit Offer: {offer.title}</CardTitle>
                        <CardDescription>Update the details and line items for this offer.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {Object.keys(serverErrors).length > 0 && Object.keys(errors).length === 0 && (
                            <Alert variant="destructive" className="mb-4">
                                <ExclamationTriangleIcon className="h-4 w-4" />
                                <AlertTitle>Server Validation Error</AlertTitle>
                                <AlertDescription>
                                    There was an issue with your submission.
                                    <ul>{Object.values(serverErrors).map((err, i) => <li key={i}>- {err}</li>)}</ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Offer Details Section (General) */}
                            {/* ... (Identical to Create.tsx) ... */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="title">Title (English) <span className="text-red-500">*</span></Label>
                                    <Input id="title" name="title" value={data.title} onChange={handleInputChange} required />
                                    {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="title_ar">Title (Arabic)</Label>
                                    <Input id="title_ar" name="title_ar" value={data.title_ar || ''} onChange={handleInputChange} />
                                    {errors.title_ar && <p className="text-sm text-red-600 mt-1">{errors.title_ar}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                                    <Select value={data.status} onValueChange={(value) => handleSelectChange('status', value)}>
                                        <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                        <SelectContent>
                                            {statuses.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-red-600 mt-1">{errors.status}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="offer_type">Offer Type <span className="text-red-500">*</span></Label>
                                    <Select value={data.offer_type} onValueChange={(value) => handleSelectChange('offer_type', value)}>
                                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                        <SelectContent>
                                            {offerTypes.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, ' ').charAt(0).toUpperCase() + t.replace(/_/g, ' ').slice(1)}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {errors.offer_type && <p className="text-sm text-red-600 mt-1">{errors.offer_type}</p>}
                                </div>
                            </div>

                            {/* Associated Entities Section */}
                            <Separator />
                            <h3 className="text-lg font-medium">Associated Entities</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* ... Company, Contact, Assigned To Selects (identical to Create.tsx) ... */}
                            </div>

                            {/* Offer Value & Timeline Section */}
                            <Separator />
                            <h3 className="text-lg font-medium">Offer Value & Timeline</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <Label htmlFor="value">Value</Label>
                                    <Input id="value" name="value" type="number" step="0.01" value={data.value ?? ''} onChange={handleInputChange} placeholder="e.g., 1500.00" />
                                    {errors.value && <p className="text-sm text-red-600 mt-1">{errors.value}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="currency">Currency</Label>
                                    <Select value={data.currency} onValueChange={(val) => handleSelectChange('currency', val)}>
                                        <SelectTrigger><SelectValue placeholder="Select Currency" /></SelectTrigger>
                                        <SelectContent>
                                            {currencyOptions.map((curr) => (<SelectItem key={curr.code} value={curr.code}>{curr.label}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                    {errors.currency && <p className="text-sm text-red-600 mt-1">{errors.currency}</p>}
                                </div>
                                {/* ... Probability and Expected Close Date ... */}
                            </div>

                            {/* Promotion Details Section */}
                            <Separator />
                            <h3 className="text-lg font-medium">Promotion Details (Optional)</h3>
                            {/* ... (identical to Create.tsx) ... */}

                            {/* Descriptions/Notes */}
                            <Separator />
                            {/* ... (identical to Create.tsx) ... */}

                            {/* Offer Items Section */}
                            <Separator />
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-medium">Offer Items / Services</h3>
                                    <Button type="button" variant="outline" size="sm" onClick={addItem}>
                                        <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                                    </Button>
                                </div>

                                {data.items.map((item, index) => (
                                    <div key={index} className="p-4 border rounded-md mb-4 space-y-3 bg-slate-50 dark:bg-slate-800">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold">Item #{index + 1}</p>
                                            {data.items.length > 1 && (
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {/* --- PRODUCT SELECT --- */}
                                            <div className="md:col-span-2">
                                                <Label htmlFor={`item-product-${index}`}>Select Product/Service</Label>
                                                <Select
                                                    value={item.product_id?.toString() || '_custom'}
                                                    onValueChange={(val) => handleItemProductSelect(index, val)}
                                                >
                                                    <SelectTrigger id={`item-product-${index}`}><SelectValue placeholder="Select from catalog (Optional)" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="_custom">- Custom Item -</SelectItem>
                                                        {/* Use logical AND to ensure products is non-null/non-undefined */}
                                                        {products && products.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name} ({p.sku})</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            {/* --- END PRODUCT SELECT --- */}
                                            <div>
                                                <Label htmlFor={`item-service-${index}`}>Service/Product Name <span className="text-red-500">*</span></Label>
                                                <Input
                                                    id={`item-service-${index}`}
                                                    value={item.service_name}
                                                    onChange={(e) => handleItemChange(index, 'service_name', e.target.value)}
                                                    required={!item.product_id}
                                                    disabled={!!item.product_id} // Disable if product is selected
                                                />
                                                {errors[`items.${index}.service_name` as keyof OfferFormData] && <p className="text-sm text-red-600 mt-1">{errors[`items.${index}.service_name` as keyof OfferFormData]}</p>}
                                            </div>
                                            <div>
                                                <Label htmlFor={`item-qty-${index}`}>Quantity <span className="text-red-500">*</span></Label>
                                                <Input id={`item-qty-${index}`} type="number" step="0.01" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} required />
                                                {errors[`items.${index}.quantity` as keyof OfferFormData] && <p className="text-sm text-red-600 mt-1">{errors[`items.${index}.quantity` as keyof OfferFormData]}</p>}
                                            </div>
                                            <div>
                                                <Label htmlFor={`item-price-${index}`}>Unit Price <span className="text-red-500">*</span></Label>
                                                <Input
                                                    id={`item-price-${index}`}
                                                    type="number" step="0.01"
                                                    value={item.unit_price}
                                                    onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                                                    required
                                                    disabled={!!item.product_id} // Disable if product is selected
                                                />
                                                {errors[`items.${index}.unit_price` as keyof OfferFormData] && <p className="text-sm text-red-600 mt-1">{errors[`items.${index}.unit_price` as keyof OfferFormData]}</p>}
                                            </div>
                                            {/* ... rest of item fields (Discount, Tax, Total) ... */}
                                        </div>
                                        <div>
                                            <Label htmlFor={`item-desc-${index}`}>Item Description</Label>
                                            <Textarea id={`item-desc-${index}`} value={item.description || ''} onChange={(e) => handleItemChange(index, 'description', e.target.value)} rows={2} />
                                        </div>
                                    </div>
                                ))}
                                {errors.items && typeof errors.items === 'string' && <p className="text-sm text-red-600 mt-1">{errors.items}</p>}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-4 pt-4">
                                <Link href={route('offers.index')}>
                                    <Button type="button" variant="outline" disabled={processing}>Cancel</Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default OffersEdit;
