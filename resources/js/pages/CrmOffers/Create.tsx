import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    ProductCatalogItem,
    type CrmOfferType as CrmOffer, // Renamed from OfferType
    type OfferItemType,
    type CompanyType as Company,
    type ContactType as Contact,
    type UserType as User,
    type FlashMessageType as FlashMessages,
} from '@/types';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Keep Checkbox as a component, though not used for CrmOffer-specific fields currently.
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon, } from "@radix-ui/react-icons";
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { PlusCircle, Trash2 } from 'lucide-react';

interface Props {
    errors: Record<string, string>;
    flash?: FlashMessages;
    companies: Company[];
    contacts: Array<Contact & { company_id?: number }>;
    users: User[];
    statuses: string[];
    offerTypes: string[]; // CRM-specific offer types
    defaultCurrency?: string;
    products: ProductCatalogItem[];
}

interface CrmOfferFormData { // Renamed interface
    title: CrmOffer['title'];
    title_ar?: CrmOffer['title_ar'];
    description?: CrmOffer['description'];
    description_ar?: CrmOffer['description_ar'];
    status: CrmOffer['status'];
    value?: CrmOffer['value'];
    currency?: CrmOffer['currency'];
    probability?: CrmOffer['probability'];
    expected_close_date?: CrmOffer['expected_close_date'];
    actual_close_date?: CrmOffer['actual_close_date'];
    offer_type: CrmOffer['offer_type']; // Now only CRM types
    notes?: CrmOffer['notes'];
    company_id?: CrmOffer['company_id'];
    contact_id?: CrmOffer['contact_id'];
    assigned_user_id?: CrmOffer['assigned_user_id'];
    // Removed all promotion-specific fields (discount_percentage, start_date, end_date, is_active, image, code, usage_limit, user_usage_limit)
    items: OfferItemType[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'CRM Offers', href: route('crm.offers.index') }, // Updated route
    { title: 'Create CRM Offer' } // Updated title
];

const createEmptyOfferItem = (): OfferItemType => ({
    service_name: '', description: '', quantity: 1, unit_price: 0,
    discount_percentage: null, tax_rate: null, total_price: 0, product_id: null, // Set to null for numbers, not empty string
});

const CrmOffersCreate: React.FC<Props> = ({ // Renamed component
    errors: serverErrors, flash, companies, contacts: propContacts,
    users, statuses, offerTypes, defaultCurrency = 'SAR', products = [],
}) => {
    const allContacts = Array.isArray(propContacts) ? propContacts : [];

    const { data, setData, post, processing, errors, clearErrors, reset, transform } = useForm<CrmOfferFormData>({
        title: '', title_ar: '', description: '', description_ar: '',
        status: statuses.includes('draft') ? 'draft' : statuses[0] || '',
        value: null, currency: defaultCurrency, probability: null,
        expected_close_date: '', actual_close_date: '',
        offer_type: offerTypes.includes('quote') ? 'quote' : offerTypes[0] || '',
        notes: '', company_id: null, contact_id: null, assigned_user_id: null,
        items: [createEmptyOfferItem()],
    });

    const [filteredContacts, setFilteredContacts] = useState<Array<Contact & { company_id?: number }>>(allContacts);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    useEffect(() => {
        const currentAllContacts = Array.isArray(propContacts) ? propContacts : [];
        if (data.company_id) {
            const newFiltered = currentAllContacts.filter(c => c.company_id === data.company_id);
            setFilteredContacts(newFiltered);
            const currentContactIsValid = newFiltered.some(c => c.id === data.contact_id);
            if (data.contact_id !== null && !currentContactIsValid) {
                setData('contact_id', null);
            }
        } else {
            setFilteredContacts(currentAllContacts);
            if (data.contact_id !== null) {
                setData('contact_id', null);
            }
        }
    }, [data.company_id, propContacts, data.contact_id]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setData(name as keyof CrmOfferFormData, value as any); // Use as any for direct string/number assignment
        if (errors[name as keyof CrmOfferFormData]) clearErrors(name as keyof CrmOfferFormData);
    };

    const handleSelectChange = (name: keyof CrmOfferFormData, value: string | number | null) => {
        let processedValue: string | number | null = value;
        if (value === '') { processedValue = null; } // Handle empty string from Select as null
        setData(name, processedValue as any);
        if (errors[name]) clearErrors(name);
    };

    // No handleCheckboxChange needed for CrmOffer as it doesn't have `is_active`

    const handleItemChange = (index: number, field: keyof OfferItemType, value: string | number) => {
        setData(prevData => {
            const newItems = prevData.items.map((item, i) => {
                if (i === index) {
                    const updatedItem = { ...item };
                    // For numeric inputs that can be empty string, store as string, then parse for calculation
                    if (['quantity', 'unit_price'].includes(field as string)) {
                        (updatedItem as any)[field] = value === '' ? '' : String(value);
                    } else if (['discount_percentage', 'tax_rate'].includes(field as string)) {
                        (updatedItem as any)[field] = value === '' ? null : String(value); // Store null for empty
                    } else {
                        (updatedItem as any)[field] = value;
                    }

                    // Recalculate total_price for the item
                    const qtyStr = String(updatedItem.quantity);
                    const priceStr = String(updatedItem.unit_price);
                    const discStr = String(updatedItem.discount_percentage || '0');
                    const taxStr = String(updatedItem.tax_rate || '0');

                    const qty = parseFloat(qtyStr) || 0;
                    const price = parseFloat(priceStr) || 0;
                    const discountPercent = parseFloat(discStr) || 0;
                    const taxRate = parseFloat(taxStr) || 0;

                    const subTotal = qty * price;
                    const itemDiscount = (discountPercent > 0) ? (subTotal * (discountPercent / 100)) : 0;
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
        setData('items', [...data.items, createEmptyOfferItem()]);
    };

    const removeItem = (index: number) => {
        if (data.items.length <= 1) {
            toast.error("At least one item is required.");
            return;
        }
        const newItems = data.items.filter((_, i) => i !== index);
        setData('items', newItems);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        transform((data) => {
            // Transform items before sending: ensure numeric fields are numbers or null
            const itemsForSubmission = data.items.map(item => ({
                ...item,
                quantity: parseFloat(String(item.quantity)) || 0,
                unit_price: parseFloat(String(item.unit_price)) || 0,
                discount_percentage: item.discount_percentage ? parseFloat(String(item.discount_percentage)) : null,
                tax_rate: item.tax_rate ? parseFloat(String(item.tax_rate)) : null,
            }));

            return {
                ...data,
                items: itemsForSubmission,
                value: data.value ? parseFloat(String(data.value)) : null,
                probability: (data.probability !== null && data.probability !== undefined && (data.probability as any) !== '') ? parseInt(String(data.probability)) : null,
            };
        });

        post(route('crm.offers.store'), { // Updated route
            onSuccess: () => {
                toast.success('CRM Offer created successfully!');
                reset();
                setData('items', [createEmptyOfferItem()]); // Reset items after successful submission
            },
            onError: (formErrors) => {
                console.error("Form Errors:", formErrors);
                toast.error('Please correct the errors in the form.');
            }
        });
    };

    const findProduct = (id: string | number | null): ProductCatalogItem | undefined => {
        if (!id) return undefined;
        const numId = typeof id === 'string' ? parseInt(id) : id;
        return products.find(p => p.id === numId);
    };

    const handleItemProductSelect = (index: number, productId: string) => {
        const isCustom = productId === '_custom';
        const product = isCustom ? undefined : findProduct(productId);

        setData(prevData => {
            const newItems = prevData.items.map((item, i) => {
                if (i === index) {
                    const updatedItem = { ...item, product_id: isCustom ? null : Number(productId), };
                    if (product) {
                        updatedItem.service_name = product.name;
                        updatedItem.unit_price = product.unit_price.toString();
                        updatedItem.description = item.description || product.description;
                    } else if (isCustom) {
                        // Clear product-specific fields if switching to custom
                        updatedItem.service_name = ''; // Clear name
                        updatedItem.unit_price = '0'; // Clear price
                        updatedItem.description = ''; // Clear description
                    }

                    // Recalculate total_price for the item
                    const qty = parseFloat(String(updatedItem.quantity)) || 0;
                    const price = parseFloat(String(updatedItem.unit_price)) || 0;
                    const discountPercent = parseFloat(String(updatedItem.discount_percentage || '0')) || 0;
                    const taxRate = parseFloat(String(updatedItem.tax_rate || '0')) || 0;

                    const subTotal = qty * price;
                    const itemDiscount = (discountPercent > 0) ? (subTotal * (discountPercent / 100)) : 0;
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

    const currencyOptions = [
        { code: 'SDG', label: 'Sudanese Pound (SDG)' }, { code: 'EGP', label: 'Egyptian Pound(EGP)' },
        { code: 'OMR', label: 'Omani Rial (OMR)' }, { code: 'SAR', label: 'Saudi Riyal (SAR)' },
        { code: 'AED', label: 'UAE Dirham (AED)' }, { code: 'USD', label: 'US Dollar (USD)' },
        { code: 'EUR', label: 'Euro (EUR)' }, { code: 'GBP', label: 'British Pound (GBP)' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create CRM Offer" /> {/* Updated title */}
            <div className="py-12">
                <Card className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <CardHeader>
                        <CardTitle>Create New CRM Offer</CardTitle> {/* Updated title */}
                        <CardDescription>Fill in the details for the new sales offer, quote or proposal.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {Object.keys(serverErrors).length > 0 && Object.keys(errors).length === 0 && (
                            <Alert variant="destructive" className="mb-4">
                                <ExclamationTriangleIcon className="h-4 w-4" /><AlertTitle>Server Validation Error</AlertTitle>
                                <AlertDescription>
                                    There was an issue with your submission.
                                    <ul>{Object.values(serverErrors).map((err, i) => <li key={i}>- {err}</li>)}</ul>
                                </AlertDescription>
                            </Alert>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><Label htmlFor="title">Title (English) <span className="text-red-500">*</span></Label>
                                    <Input id="title" name="title" value={data.title} onChange={handleInputChange} required />
                                    {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
                                </div>
                                <div><Label htmlFor="title_ar">Title (Arabic)</Label>
                                    <Input id="title_ar" name="title_ar" value={data.title_ar || ''} onChange={handleInputChange} />
                                    {errors.title_ar && <p className="text-sm text-red-600 mt-1">{errors.title_ar}</p>}
                                </div>
                                <div><Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                                    <Select value={data.status} onValueChange={(value) => handleSelectChange('status', value)}>
                                        <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                        <SelectContent>
                                            {statuses.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-red-600 mt-1">{errors.status}</p>}
                                </div>
                                <div><Label htmlFor="offer_type">Offer Type <span className="text-red-500">*</span></Label>
                                    <Select value={data.offer_type} onValueChange={(value) => handleSelectChange('offer_type', value)}>
                                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                        <SelectContent>
                                            {offerTypes.map(t => <SelectItem key={t} value={t}>{t.replace(/_/g, ' ').charAt(0).toUpperCase() + t.replace(/_/g, ' ').slice(1)}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {errors.offer_type && <p className="text-sm text-red-600 mt-1">{errors.offer_type}</p>}
                                </div>
                            </div>
                            <Separator /><h3 className="text-lg font-medium">Associated Entities</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div><Label htmlFor="company_id">Company</Label>
                                    <Select value={data.company_id?.toString() || ''} onValueChange={(value) => handleSelectChange('company_id', value)}>
                                        <SelectTrigger><SelectValue placeholder="Select company (Optional)" /></SelectTrigger>
                                        <SelectContent>
                                            {companies.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {errors.company_id && <p className="text-sm text-red-600 mt-1">{errors.company_id}</p>}
                                </div>
                                <div><Label htmlFor="contact_id">Contact</Label>
                                    <Select value={data.contact_id?.toString() || ''} onValueChange={(value) => handleSelectChange('contact_id', value)} disabled={!data.company_id || !filteredContacts || filteredContacts.length === 0}>
                                        <SelectTrigger><SelectValue placeholder="Select contact (Optional)" /></SelectTrigger>
                                        <SelectContent>
                                            {/* No <SelectItem value=""> for Radix UI compliance; placeholder handles empty */}
                                            {filteredContacts && filteredContacts.length > 0 && (filteredContacts.map(c => (<SelectItem key={c.id} value={c.id.toString()}>{c.first_name} {c.last_name}</SelectItem>)))}
                                            {data.company_id && (!filteredContacts || filteredContacts.length === 0) && (<div className="px-2 py-1.5 text-sm text-muted-foreground">No contacts for selected company</div>)}
                                        </SelectContent>
                                    </Select>
                                    {errors.contact_id && <p className="text-sm text-red-600 mt-1">{errors.contact_id}</p>}
                                </div>
                                <div><Label htmlFor="assigned_user_id_select">Assigned To</Label>
                                    <Select value={data.assigned_user_id?.toString() || ''} onValueChange={(value) => handleSelectChange('assigned_user_id', value)}>
                                        <SelectTrigger id="assigned_user_id_select_trigger"><SelectValue placeholder="Select user (Optional)" /></SelectTrigger>
                                        <SelectContent>
                                            {users.map(u => <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    {errors.assigned_user_id && <p className="text-sm text-red-600 mt-1">{errors.assigned_user_id}</p>}
                                </div>
                            </div>
                            <Separator /><h3 className="text-lg font-medium">Offer Value & Timeline</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div><Label htmlFor="value">Value</Label>
                                    <Input id="value" name="value" type="number" step="0.01" value={data.value ?? ''} onChange={handleInputChange} placeholder="e.g., 1500.00" />
                                    {errors.value && <p className="text-sm text-red-600 mt-1">{errors.value}</p>}
                                </div>
                                <div><Label htmlFor="currency">Currency</Label>
                                    <Select value={data.currency} onValueChange={(val) => handleSelectChange('currency', val)}>
                                        <SelectTrigger><SelectValue placeholder="Select Currency" /></SelectTrigger>
                                        <SelectContent>
                                            {currencyOptions.map((curr) => (<SelectItem key={curr.code} value={curr.code}>{curr.label}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                    {errors.currency && <p className="text-sm text-red-600 mt-1">{errors.currency}</p>}
                                </div>
                                <div><Label htmlFor="probability">Probability (%)</Label>
                                    <Input id="probability" name="probability" type="number" min="0" max="100" value={data.probability ?? ''} onChange={handleInputChange} placeholder="e.g., 75" />
                                    {errors.probability && <p className="text-sm text-red-600 mt-1">{errors.probability}</p>}
                                </div>
                                <div><Label htmlFor="expected_close_date">Expected Close Date</Label>
                                    <Input id="expected_close_date" name="expected_close_date" type="date" value={data.expected_close_date || ''} onChange={handleInputChange} />
                                    {errors.expected_close_date && <p className="text-sm text-red-600 mt-1">{errors.expected_close_date}</p>}
                                </div>
                            </div>
                            <Separator />
                            <div><Label htmlFor="description">Description (English)</Label>
                                <Textarea id="description" name="description" value={data.description || ''} onChange={handleInputChange} rows={3} />
                                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                            </div>
                            <div><Label htmlFor="description_ar">Description (Arabic)</Label>
                                <Textarea id="description_ar" name="description_ar" value={data.description_ar || ''} onChange={handleInputChange} rows={3} />
                                {errors.description_ar && <p className="text-sm text-red-600 mt-1">{errors.description_ar}</p>}
                            </div>
                            <div><Label htmlFor="notes">Internal Notes</Label>
                                <Textarea id="notes" name="notes" value={data.notes || ''} onChange={handleInputChange} rows={3} />
                                {errors.notes && <p className="text-sm text-red-600 mt-1">{errors.notes}</p>}
                            </div>
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
                                            <div className="md:col-span-2"><Label htmlFor={`item-product-${index}`}>Select Product/Service</Label>
                                                <Select value={item.product_id?.toString() || '_custom'} onValueChange={(val) => handleItemProductSelect(index, val)}> {/* Default to _custom */}
                                                    <SelectTrigger id={`item-product-${index}`}><SelectValue placeholder="Select from catalog (Optional)" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="_custom">- Custom Item -</SelectItem>
                                                        {products.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name} ({p.sku})</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div><Label htmlFor={`item-service-${index}`}>Service/Product Name <span className="text-red-500">*</span></Label>
                                                <Input id={`item-service-${index}`} value={item.service_name} onChange={(e) => handleItemChange(index, 'service_name', e.target.value)} required={!item.product_id} disabled={!!item.product_id} />
                                                {errors[`items.${index}.service_name` as any] && <p className="text-sm text-red-600 mt-1">{errors[`items.${index}.service_name` as any]}</p>}
                                            </div>
                                            <div><Label htmlFor={`item-qty-${index}`}>Quantity <span className="text-red-500">*</span></Label>
                                                <Input id={`item-qty-${index}`} type="number" step="0.01" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} required />
                                                {errors[`items.${index}.quantity` as any] && <p className="text-sm text-red-600 mt-1">{errors[`items.${index}.quantity` as any]}</p>}
                                            </div>
                                            <div><Label htmlFor={`item-price-${index}`}>Unit Price <span className="text-red-500">*</span></Label>
                                                <Input id={`item-price-${index}`} type="number" step="0.01" value={item.unit_price} onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)} required disabled={!!item.product_id} />
                                                {errors[`items.${index}.unit_price` as any] && <p className="text-sm text-red-600 mt-1">{errors[`items.${index}.unit_price` as any]}</p>}
                                            </div>
                                            <div><Label htmlFor={`item-discount-${index}`}>Discount (%)</Label>
                                                <Input id={`item-discount-${index}`} type="number" step="0.01" min="0" max="100" value={item.discount_percentage ?? ''} onChange={(e) => handleItemChange(index, 'discount_percentage', e.target.value)} />
                                            </div>
                                            <div><Label htmlFor={`item-tax-${index}`}>Tax Rate (e.g., 0.15 for 15%)</Label>
                                                <Input id={`item-tax-${index}`} type="number" step="0.0001" min="0" max="1" value={item.tax_rate ?? ''} onChange={(e) => handleItemChange(index, 'tax_rate', e.target.value)} />
                                            </div>
                                            <div><Label>Total Item Price</Label>
                                                <Input value={item.total_price?.toFixed(2) || '0.00'} readOnly className="bg-gray-100 dark:bg-gray-700" />
                                            </div>
                                        </div>
                                        <div><Label htmlFor={`item-desc-${index}`}>Item Description</Label>
                                            <Textarea id={`item-desc-${index}`} value={item.description || ''} onChange={(e) => handleItemChange(index, 'description', e.target.value)} rows={2} />
                                        </div>
                                    </div>
                                ))}
                                {errors.items && typeof errors.items === 'string' && <p className="text-sm text-red-600 mt-1">{errors.items}</p>}
                            </div>
                            <div className="flex items-center justify-end gap-4 pt-4">
                                <Link href={route('crm.offers.index')}><Button type="button" variant="outline" disabled={processing}>Cancel</Button></Link>
                                <Button type="submit" disabled={processing}>{processing ? 'Creating...' : 'Create CRM Offer'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default CrmOffersCreate;
