import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    type BreadcrumbItem,
    ProductCatalogItem,
    type OfferType as Offer, // Renamed to avoid conflict with HTMLOfferElement, using OfferType from types
    type OfferItemType,
    type CompanyType as Company, // Use aliased CompanyType
    type ContactType as Contact, // Use aliased ContactType
    type UserType as User,       // Use aliased UserType
    type FlashMessageType as FlashMessages, // Use aliased FlashMessageType
} from '@/types';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircledIcon, ExclamationTriangleIcon, } from "@radix-ui/react-icons";
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { PlusCircle, Trash2 } from 'lucide-react';

interface Props {
    errors: Record<string, string>;
    flash?: FlashMessages;
    companies: Company[];
    // Ensure allContacts is always an array, even if empty
    contacts: Array<Contact & { company_id?: number }>;
    users: User[];
    statuses: string[];
    offerTypes: string[];
    defaultCurrency?: string;
    products: ProductCatalogItem[];
}

interface OfferFormData {
    title: Offer['title'];
    title_ar?: Offer['title_ar'];
    description?: Offer['description'];
    description_ar?: Offer['description_ar'];
    status: Offer['status'];
    value?: Offer['value'];
    currency?: Offer['currency'];
    probability?: Offer['probability'];
    expected_close_date?: Offer['expected_close_date'];
    actual_close_date?: Offer['actual_close_date'];
    offer_type: Offer['offer_type'];
    notes?: Offer['notes'];
    company_id?: Offer['company_id'];
    contact_id?: Offer['contact_id'];
    assigned_user_id?: Offer['assigned_user_id'];
    discount_percentage?: Offer['discount_percentage']; // Keep as string for form input
    start_date?: Offer['start_date'];
    end_date?: Offer['end_date'];
    is_active: Offer['is_active'];
    code?: Offer['code'];
    usage_limit?: Offer['usage_limit'];
    user_usage_limit?: Offer['user_usage_limit'];
    image: File | null;
    items: OfferItemType[];
}
interface ProductCatalogItem { // Minimal fields needed for the dropdown/logic
    id: number;
    name: string;
    description: string;
    unit_price: number;
    sku: string;
}

interface OffersCreateProps {
    // ... existing props ...
    defaultCurrency?: string;
    products: ProductCatalogItem[]; // <-- ADDED
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Offers', href: route('offers.index') },
    { title: 'Create Offer' }
];

const createEmptyOfferItem = (): OfferItemType => ({
    service_name: '',
    description: '',
    quantity: 1,
    unit_price: 0,
    discount_percentage: '', // Initialize as string for input
    tax_rate: '',           // Initialize as string for input
    total_price: 0,
    product_id: null,
});


const OffersCreate: React.FC<Props> = ({
    errors: serverErrors,
    flash,
    companies,
    contacts: propContacts, // Renamed prop to avoid confusion with state variable name
    users,
    statuses,
    offerTypes,
    defaultCurrency = 'SD',
    products = [],
}) => {
    // Ensure propContacts is always an array before using it
    const allContacts = Array.isArray(propContacts) ? propContacts : [];

    const { data, setData, post, processing, errors, recentlySuccessful, reset, clearErrors } = useForm<OfferFormData>({
        title: '',
        title_ar: '',
        description: '',
        description_ar: '',
        status: statuses.includes('draft') ? 'draft' : statuses[0] || '',
        value: null,
        currency: defaultCurrency,
        probability: null,
        expected_close_date: '',
        actual_close_date: '',
        offer_type: offerTypes.includes('quote') ? 'quote' : offerTypes[0] || '',
        notes: '',
        company_id: null,
        contact_id: null,
        assigned_user_id: null,
        discount_percentage: '',
        start_date: '',
        end_date: '',
        is_active: true,
        image: null,
        code: '',
        usage_limit: null,
        user_usage_limit: null,
        items: [createEmptyOfferItem()],
    });

    // Initialize filteredContacts with allContacts (which is now guaranteed to be an array)
    const [filteredContacts, setFilteredContacts] = useState<Array<Contact & { company_id?: number }>>(allContacts);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    // This useEffect is now safer because `allContacts` is guaranteed to be an array.
    useEffect(() => {
        const currentAllContacts = Array.isArray(propContacts) ? propContacts : []; // Make sure allContacts is an array

        if (data.company_id) {
            const newFiltered = currentAllContacts.filter(c => c.company_id === data.company_id);
            setFilteredContacts(newFiltered);

            // Only try to reset contact_id if it's not already null AND it's no longer valid
            const currentContactIsValid = newFiltered.some(c => c.id === data.contact_id);
            if (data.contact_id !== null && !currentContactIsValid) {
                setData('contact_id', null);
            }
        } else {
            // If no company is selected, show all contacts
            setFilteredContacts(currentAllContacts);
            // And if contact_id is set, clear it because no company is selected
            if (data.contact_id !== null) {
                setData('contact_id', null);
            }
        }
    }, [data.company_id, propContacts, data.contact_id]); // Changed allContacts to propContacts in dependency


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setData(name as keyof OfferFormData, value);
        if (errors[name as keyof OfferFormData]) clearErrors(name as keyof OfferFormData);
    };

    const handleSelectChange = (name: keyof OfferFormData, value: string | number | null) => {
        let processedValue = value;
        if (value === '') { // Handle empty string from Select as null
            processedValue = null;
        }
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

    const handleItemChange = (index: number, field: keyof OfferItemType, value: string | number) => {
        const newItems = data.items.map((item, i) => {
            if (i === index) {
                const updatedItem = { ...item };
                if (['quantity', 'unit_price', 'discount_percentage', 'discount_amount', 'tax_rate'].includes(field as string)) {
                    (updatedItem as any)[field] = value === '' ? '' : String(value); // Keep as string for input
                } else {
                    (updatedItem as any)[field] = value;
                }

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
        setData('items', newItems);
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
        // Transform items before sending: ensure numeric fields are numbers
        const itemsForSubmission = data.items.map(item => ({
            ...item,
            quantity: parseFloat(item.quantity as string) || 0,
            unit_price: parseFloat(item.unit_price as string) || 0,
            discount_percentage: item.discount_percentage ? parseFloat(item.discount_percentage as string) : null,
            tax_rate: item.tax_rate ? parseFloat(item.tax_rate as string) : null,
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


        post(route('offers.store'), {
            data: formDataToSubmit, // Explicitly pass transformed data if useForm doesn't auto-transform deeply
            onSuccess: () => {
                toast.success('Offer created successfully!');
                reset();
                setData('items', [createEmptyOfferItem()]);
            },
            onError: (formErrors) => {
                console.error("Form Errors:", formErrors);
                toast.error('Please correct the errors in the form.');
            }
        });
    };


    // --- NEW: Helper to find product by ID ---
    const findProduct = (id: string | number | null): ProductCatalogItem | undefined => {
        if (!id) return undefined;
        const numId = typeof id === 'string' ? parseInt(id) : id;
        return products.find(p => p.id === numId);
    };

    const handleItemProductSelect = (index: number, productId: string) => {
        // Check if the special "custom" value was selected
        const isCustom = productId === '_custom';

        // Find product only if it's not custom
        const product = isCustom ? undefined : findProduct(productId);

        const newItems = data.items.map((item, i) => {
            if (i === index) {
                const updatedItem = {
                    ...item,
                    // If custom, set to null; otherwise convert ID to number
                    product_id: isCustom ? null : Number(productId),
                };

                if (product) {
                    updatedItem.service_name = product.name;
                    updatedItem.unit_price = product.unit_price;
                    updatedItem.description = item.description || product.description;
                }

                return updatedItem;
            }
            return item;
        });

        setData('items', newItems);
        // Recalculate based on the new price (if set)
        handleItemChange(index, 'unit_price', newItems[index].unit_price);
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

    // ... (Rest of the component including JSX)
    // Ensure you use `OfferType as Offer` etc. in imports and type annotations if there's a global `Offer` type.
    // My previous OfferFormData used `Offer['title']` etc. This assumes Offer is the type from your types file.
    // If you aliased `type OfferType as Offer` in imports, then `Offer['title']` is correct.

    // Helper logic to derive boolean states for rendering
    const isPromotion = data.offer_type === 'promotion';
    const isQuoteOrProposal = ['quote', 'proposal', 'service_package'].includes(data.offer_type);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Offer" />

            <div className="py-12">
                <Card className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <CardHeader>
                        <CardTitle>Create New Offer</CardTitle>
                        <CardDescription>Fill in the details for the new sales offer or promotion.</CardDescription>
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
                            {/* Offer Details Section */}
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
                            {/* --- CONDITIONAL SECTION 1: Associated Entities --- */}
                            {isQuoteOrProposal && (
                                <>
                                    <Separator />
                                    <h3 className="text-lg font-medium">Associated Entities</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <Label htmlFor="company_id">Company</Label>
                                            <Select
                                                value={data.company_id?.toString() || ''}
                                                onValueChange={(value) => handleSelectChange('company_id', value)} // Pass value directly
                                            >
                                                <SelectTrigger><SelectValue placeholder="Select company (Optional)" /></SelectTrigger>
                                                <SelectContent>
                                                    {companies.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            {errors.company_id && <p className="text-sm text-red-600 mt-1">{errors.company_id}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="contact_id">Contact</Label>
                                            <Select
                                                value={data.contact_id?.toString() || ''}
                                                onValueChange={(value) => handleSelectChange('contact_id', value)} // Pass value directly
                                                disabled={!data.company_id || !filteredContacts || filteredContacts.length === 0}
                                            >
                                                <SelectTrigger><SelectValue placeholder="Select contact (Optional)" /></SelectTrigger>
                                                <SelectContent>
                                                    {filteredContacts && filteredContacts.length > 0 && (
                                                        filteredContacts.map(c => (
                                                            <SelectItem key={c.id} value={c.id.toString()}>
                                                                {c.first_name} {c.last_name}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                    {data.company_id && (!filteredContacts || filteredContacts.length === 0) && (
                                                        <div className="px-2 py-1.5 text-sm text-muted-foreground">No contacts for selected company</div>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            {errors.contact_id && <p className="text-sm text-red-600 mt-1">{errors.contact_id}</p>}
                                        </div>

                                        <div>
                                            <Label htmlFor="assigned_user_id_select">Assigned To</Label>
                                            <Select
                                                value={data.assigned_user_id?.toString() || ''}
                                                onValueChange={(value) => handleSelectChange('assigned_user_id', value)} // Pass value directly
                                            >
                                                <SelectTrigger id="assigned_user_id_select_trigger">
                                                    <SelectValue placeholder="Select user (Optional)" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {users.map(u => <SelectItem key={u.id} value={u.id.toString()}>{u.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            {errors.assigned_user_id && <p className="text-sm text-red-600 mt-1">{errors.assigned_user_id}</p>}
                                        </div>
                                    </div>

                                </>
                            )}
                            {/* --- END CONDITIONAL SECTION 1 --- */}
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
                                    <Select
                                        value={data.currency}
                                        onValueChange={(val) => handleSelectChange('currency', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {currencyOptions.map((curr) => (
                                                <SelectItem key={curr.code} value={curr.code}>
                                                    {curr.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.currency && <p className="text-sm text-red-600 mt-1">{errors.currency}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="probability">Probability (%)</Label>
                                    <Input id="probability" name="probability" type="number" min="0" max="100" value={data.probability ?? ''} onChange={handleInputChange} placeholder="e.g., 75" />
                                    {errors.probability && <p className="text-sm text-red-600 mt-1">{errors.probability}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="expected_close_date">Expected Close Date</Label>
                                    <Input id="expected_close_date" name="expected_close_date" type="date" value={data.expected_close_date || ''} onChange={handleInputChange} />
                                    {errors.expected_close_date && <p className="text-sm text-red-600 mt-1">{errors.expected_close_date}</p>}
                                </div>
                            </div>

                            {/* --- CONDITIONAL SECTION 2: Promotion Details --- */}
                            {isPromotion && (
                                <>
                                    <Separator />
                                    <h3 className="text-lg font-medium">Promotion Details (Optional)</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <Label htmlFor="discount_percentage">Overall Discount (%)</Label>
                                            <Input id="discount_percentage" name="discount_percentage" type="number" step="0.01" value={data.discount_percentage || ''} onChange={handleInputChange} />
                                            {errors.discount_percentage && <p className="text-sm text-red-600 mt-1">{errors.discount_percentage}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="code">Redemption Code</Label>
                                            <Input id="code" name="code" value={data.code || ''} onChange={handleInputChange} />
                                            {errors.code && <p className="text-sm text-red-600 mt-1">{errors.code}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="start_date">Promotion Start Date</Label>
                                            <Input id="start_date" name="start_date" type="datetime-local" value={data.start_date || ''} onChange={handleInputChange} />
                                            {errors.start_date && <p className="text-sm text-red-600 mt-1">{errors.start_date}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="end_date">Promotion End Date</Label>
                                            <Input id="end_date" name="end_date" type="datetime-local" value={data.end_date || ''} onChange={handleInputChange} />
                                            {errors.end_date && <p className="text-sm text-red-600 mt-1">{errors.end_date}</p>}
                                        </div>
                                        <div>
                                            <Label htmlFor="image">Promotional Image</Label>
                                            <Input type="file" id="image" name="image" onChange={handleFileChange} />
                                            {errors.image && <p className="text-sm text-red-600 mt-1">{errors.image}</p>}
                                        </div>
                                        <div className="flex items-center space-x-2 pt-4">
                                            <Checkbox id="is_active" checked={!!data.is_active} onCheckedChange={(checked) => handleCheckboxChange('is_active', !!checked)} />
                                            <Label htmlFor="is_active">Is Promotion Active?</Label>
                                            {errors.is_active && <p className="text-sm text-red-600 mt-1">{errors.is_active}</p>}
                                        </div>
                                    </div>
                                </>
                            )}
                            {/* --- END CONDITIONAL SECTION 2 --- */}

                            <Separator />
                            <div>
                                <Label htmlFor="description">Description (English)</Label>
                                <Textarea id="description" name="description" value={data.description || ''} onChange={handleInputChange} rows={3} />
                                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                            </div>
                            <div>
                                <Label htmlFor="description_ar">Description (Arabic)</Label>
                                <Textarea id="description_ar" name="description_ar" value={data.description_ar || ''} onChange={handleInputChange} rows={3} />
                                {errors.description_ar && <p className="text-sm text-red-600 mt-1">{errors.description_ar}</p>}
                            </div>
                            <div>
                                <Label htmlFor="notes">Internal Notes</Label>
                                <Textarea id="notes" name="notes" value={data.notes || ''} onChange={handleInputChange} rows={3} />
                                {errors.notes && <p className="text-sm text-red-600 mt-1">{errors.notes}</p>}
                            </div>


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
                                            {/* --- NEW: PRODUCT SELECT --- */}
                                            <div className="md:col-span-2">
                                                <Label htmlFor={`item-product-${index}`}>Select Product/Service</Label>
                                                <Select
                                                    value={item.product_id?.toString() || ''}
                                                    onValueChange={(val) => handleItemProductSelect(index, val)}
                                                >
                                                    <SelectTrigger id={`item-product-${index}`}><SelectValue placeholder="Select from catalog (Optional)" /></SelectTrigger>
                                                    <SelectContent>
                                                        {/* FIXED: Use a special string like "_custom" */}
                                                        <SelectItem value="_custom">- Custom Item -</SelectItem>
                                                        {products.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name} ({p.sku})</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            {/* --- END NEW: PRODUCT SELECT --- */}
                                            <div>
                                                <Label htmlFor={`item-service-${index}`}>Service/Product Name <span className="text-red-500">*</span></Label>
                                                <Input id={`item-service-${index}`} value={item.service_name} onChange={(e) => handleItemChange(index, 'service_name', e.target.value)} required />
                                                {errors[`items.${index}.service_name` as keyof OfferFormData] && <p className="text-sm text-red-600 mt-1">{errors[`items.${index}.service_name` as keyof OfferFormData]}</p>}
                                            </div>
                                            <div>
                                                <Label htmlFor={`item-qty-${index}`}>Quantity <span className="text-red-500">*</span></Label>
                                                <Input id={`item-qty-${index}`} type="number" step="0.01" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} required />
                                                {errors[`items.${index}.quantity` as keyof OfferFormData] && <p className="text-sm text-red-600 mt-1">{errors[`items.${index}.quantity` as keyof OfferFormData]}</p>}
                                            </div>
                                            <div>
                                                <Label htmlFor={`item-price-${index}`}>Unit Price <span className="text-red-500">*</span></Label>
                                                <Input id={`item-price-${index}`} type="number" step="0.01" value={item.unit_price} onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)} required />
                                                {errors[`items.${index}.unit_price` as keyof OfferFormData] && <p className="text-sm text-red-600 mt-1">{errors[`items.${index}.unit_price` as keyof OfferFormData]}</p>}
                                            </div>
                                            <div>
                                                <Label htmlFor={`item-discount-${index}`}>Discount (%)</Label>
                                                <Input id={`item-discount-${index}`} type="number" step="0.01" min="0" max="100" value={item.discount_percentage ?? ''} onChange={(e) => handleItemChange(index, 'discount_percentage', e.target.value)} />
                                            </div>
                                            <div>
                                                <Label htmlFor={`item-tax-${index}`}>Tax Rate (e.g., 0.15 for 15%)</Label>
                                                <Input id={`item-tax-${index}`} type="number" step="0.0001" min="0" max="1" value={item.tax_rate ?? ''} onChange={(e) => handleItemChange(index, 'tax_rate', e.target.value)} />
                                            </div>
                                            <div>
                                                <Label>Total Item Price</Label>
                                                <Input value={item.total_price?.toFixed(2) || '0.00'} readOnly className="bg-gray-100 dark:bg-gray-700" />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor={`item-desc-${index}`}>Item Description</Label>
                                            <Textarea id={`item-desc-${index}`} value={item.description || ''} onChange={(e) => handleItemChange(index, 'description', e.target.value)} rows={2} />
                                        </div>
                                    </div>
                                ))}
                                {errors.items && typeof errors.items === 'string' && <p className="text-sm text-red-600 mt-1">{errors.items}</p>}
                            </div>


                            <div className="flex items-center justify-end gap-4 pt-4">
                                <Link href={route('offers.index')}>
                                    <Button type="button" variant="outline" disabled={processing}>Cancel</Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Offer'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default OffersCreate;
