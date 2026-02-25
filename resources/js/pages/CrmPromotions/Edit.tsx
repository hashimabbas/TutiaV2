// resources/js/Pages/CrmPromotions/Edit.tsx

import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Promotion as PromotionType, type FlashMessageType as FlashMessages } from '@/types';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { format } from 'date-fns'; // For formatting existing dates
import { route } from 'ziggy-js';

interface Props {
    promotion: PromotionType & { // Ensure dates are in correct format for datetime-local
        start_date: string | null;
        end_date: string | null;
    };
    errors: Record<string, string>;
    flash?: FlashMessages;
    defaultCurrency?: string;
}

interface PromotionFormData {
    _method: 'PUT'; // Important for Laravel's method spoofing
    title: PromotionType['title'];
    title_ar?: PromotionType['title_ar'];
    description?: PromotionType['description'];
    description_ar?: PromotionType['description_ar'];
    value?: PromotionType['value'];
    currency?: PromotionType['currency'];
    discount_percentage?: PromotionType['discount_percentage'];
    start_date?: string; // Will be "yyyy-MM-dd'T'HH:mm" for datetime-local
    end_date?: string;   // Will be "yyyy-MM-dd'T'HH:mm" for datetime-local
    is_active: PromotionType['is_active'];
    image: File | null;
    remove_image: boolean; // Flag to indicate old image deletion
    code?: PromotionType['code'];
    usage_limit?: PromotionType['usage_limit'];
    user_usage_limit?: PromotionType['user_usage_limit'];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Public Promotions', href: route('crm.promotions.index') },
    { title: 'Edit Promotion' }
];

const CrmPromotionsEdit: React.FC<Props> = ({ promotion, errors: serverErrors, flash, defaultCurrency = 'SAR' }) => {
    // Format dates for datetime-local input
    const formatDateTimeLocal = (dateString?: string | null) => {
        if (!dateString) return '';
        try {
            return format(new Date(dateString), "yyyy-MM-dd'T'HH:mm");
        } catch (e) {
            console.error("Error formatting date for datetime-local:", dateString, e);
            return '';
        }
    };

    const { data, setData, post, processing, errors, clearErrors, reset } = useForm<PromotionFormData>({
        _method: 'PUT',
        title: promotion.title || '',
        title_ar: promotion.title_ar || '',
        description: promotion.description || '',
        description_ar: promotion.description_ar || '',
        value: promotion.value ?? null, // Use ?? null to handle 0 correctly
        currency: promotion.currency || defaultCurrency,
        discount_percentage: promotion.discount_percentage ?? null,
        start_date: formatDateTimeLocal(promotion.start_date),
        end_date: formatDateTimeLocal(promotion.end_date),
        is_active: !!promotion.is_active, // Ensure boolean
        image: null, // File input is always null initially for editing
        remove_image: false, // Default to false
        code: promotion.code || '',
        usage_limit: promotion.usage_limit ?? null,
        user_usage_limit: promotion.user_usage_limit ?? null,
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setData(name as keyof PromotionFormData, value as any);
        if (errors[name as keyof PromotionFormData]) clearErrors(name as keyof PromotionFormData);
    };

    const handleSelectChange = (name: keyof PromotionFormData, value: string | number | null) => {
        let processedValue: string | number | null = value;
        if (value === '') {
            processedValue = null;
        }
        setData(name, processedValue as any);
        if (errors[name]) clearErrors(name);
    };

    const handleCheckboxChange = (name: keyof PromotionFormData, checked: boolean) => {
        setData(name, checked);
        if (errors[name]) clearErrors(name);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setData('image', file);
        if (errors.image) clearErrors('image');
        // If a new image is selected, we don't need to explicitly remove the old one
        if (file) setData('remove_image', false);
    };

    const handleRemoveImage = () => {
        setData('image', null); // Clear new image selection if any
        setData('remove_image', true); // Set flag to remove existing image on save
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const formDataToSubmit = {
            ...data,
            value: data.value !== null ? parseFloat(String(data.value)) : null,
            discount_percentage: data.discount_percentage !== null ? parseFloat(String(data.discount_percentage)) : null,
            usage_limit: data.usage_limit !== null ? parseInt(String(data.usage_limit)) : null,
            user_usage_limit: data.user_usage_limit !== null ? parseInt(String(data.user_usage_limit)) : null,
        };

        // Use post with FormData (which handles the image and _method: 'PUT')
        post(route('crm.promotions.update', promotion.id), {
            data: formDataToSubmit,
            forceFormData: true, // Ensure FormData is used for file upload
            onSuccess: () => {
                toast.success('Promotion updated successfully!');
            },
            onError: (formErrors) => {
                console.error("Form Errors:", formErrors);
                toast.error('Please correct the errors in the form.');
            }
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
            <Head title={`Edit Public Promotion - ${promotion.title}`} />

            <div className="py-12">
                <Card className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <CardHeader>
                        <CardTitle>Edit Public Promotion: {promotion.title}</CardTitle>
                        <CardDescription>Update the details for this public-facing promotion.</CardDescription>
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
                            {/* Basic Details */}
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
                            </div>

                            <Separator />
                            <h3 className="text-lg font-medium">Promotion Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="value">Original Price / Value</Label>
                                    <Input id="value" name="value" type="number" step="0.01" value={data.value ?? ''} onChange={handleInputChange} placeholder="e.g., 100.00" />
                                    {errors.value && <p className="text-sm text-red-600 mt-1">{errors.value}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="currency">Currency</Label>
                                    <Select value={data.currency} onValueChange={(val) => handleSelectChange('currency', val)}>
                                        <SelectTrigger><SelectValue placeholder="Select Currency" /></SelectTrigger>
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
                                    <Label htmlFor="discount_percentage">Discount Percentage (%)</Label>
                                    <Input id="discount_percentage" name="discount_percentage" type="number" step="0.01" min="0" max="100" value={data.discount_percentage ?? ''} onChange={handleInputChange} placeholder="e.g., 15" />
                                    {errors.discount_percentage && <p className="text-sm text-red-600 mt-1">{errors.discount_percentage}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="code">Redemption Code (Optional)</Label>
                                    <Input id="code" name="code" value={data.code || ''} onChange={handleInputChange} placeholder="e.g., SAVEBIG" />
                                    {errors.code && <p className="text-sm text-red-600 mt-1">{errors.code}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="usage_limit">Overall Usage Limit (Optional)</Label>
                                    <Input id="usage_limit" name="usage_limit" type="number" min="0" value={data.usage_limit ?? ''} onChange={handleInputChange} placeholder="e.g., 100" />
                                    {errors.usage_limit && <p className="text-sm text-red-600 mt-1">{errors.usage_limit}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="user_usage_limit">Per User Usage Limit (Optional)</Label>
                                    <Input id="user_usage_limit" name="user_usage_limit" type="number" min="0" value={data.user_usage_limit ?? ''} onChange={handleInputChange} placeholder="e.g., 1" />
                                    {errors.user_usage_limit && <p className="text-sm text-red-600 mt-1">{errors.user_usage_limit}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="start_date">Start Date & Time</Label>
                                    <Input id="start_date" name="start_date" type="datetime-local" value={data.start_date || ''} onChange={handleInputChange} />
                                    {errors.start_date && <p className="text-sm text-red-600 mt-1">{errors.start_date}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="end_date">End Date & Time</Label>
                                    <Input id="end_date" name="end_date" type="datetime-local" value={data.end_date || ''} onChange={handleInputChange} />
                                    {errors.end_date && <p className="text-sm text-red-600 mt-1">{errors.end_date}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="image">Promotional Image (Max 2MB)</Label>
                                    <Input type="file" id="image" name="image" onChange={handleFileChange} accept="image/*" />
                                    {errors.image && <p className="text-sm text-red-600 mt-1">{errors.image}</p>}

                                    {promotion.image && !data.image && !data.remove_image && (
                                        <div className="mt-2 flex items-center justify-between p-2 border rounded-md text-sm bg-gray-50 dark:bg-gray-700">
                                            <span>Current Image: <a href={`/storage/${promotion.image}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View</a></span>
                                            <Button type="button" variant="ghost" size="sm" onClick={handleRemoveImage} className="text-red-500 hover:text-red-700">Remove</Button>
                                        </div>
                                    )}
                                    {data.remove_image && <p className="text-sm text-yellow-600 mt-1">Image will be removed on save.</p>}
                                </div>
                                <div className="flex items-center space-x-2 pt-4">
                                    <Checkbox id="is_active" checked={data.is_active} onCheckedChange={(checked) => handleCheckboxChange('is_active', !!checked)} />
                                    <Label htmlFor="is_active">Is Active?</Label>
                                    {errors.is_active && <p className="text-sm text-red-600 mt-1">{errors.is_active}</p>}
                                </div>
                            </div>

                            <Separator />
                            {/* Descriptions */}
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

                            <div className="flex items-center justify-end gap-4 pt-4">
                                <Link href={route('crm.promotions.index')}>
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

export default CrmPromotionsEdit;
