// resources/js/Pages/CrmPromotions/Create.tsx

import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
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
import { route } from 'ziggy-js';

interface Props {
    errors: Record<string, string>;
    flash?: FlashMessages;
    defaultCurrency?: string;
}

interface PromotionFormData {
    title: PromotionType['title'];
    title_ar?: PromotionType['title_ar'];
    description?: PromotionType['description'];
    description_ar?: PromotionType['description_ar'];
    value?: PromotionType['value'];
    currency?: PromotionType['currency'];
    discount_percentage?: PromotionType['discount_percentage'];
    start_date?: PromotionType['start_date'];
    end_date?: PromotionType['end_date'];
    is_active: PromotionType['is_active'];
    image: File | null;
    code?: PromotionType['code'];
    usage_limit?: PromotionType['usage_limit'];
    user_usage_limit?: PromotionType['user_usage_limit'];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Public Promotions', href: route('crm.promotions.index') },
    { title: 'Create Promotion' }
];

const CrmPromotionsCreate: React.FC<Props> = ({ errors: serverErrors, flash, defaultCurrency = 'SAR' }) => {
    const { data, setData, post, processing, errors, clearErrors, reset } = useForm<PromotionFormData>({
        title: '',
        title_ar: '',
        description: '',
        description_ar: '',
        value: null,
        currency: defaultCurrency,
        discount_percentage: null,
        start_date: '',
        end_date: '',
        is_active: true,
        image: null,
        code: '',
        usage_limit: null,
        user_usage_limit: null,
    });

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setData(name as keyof PromotionFormData, value as any); // Use as any for direct string/number assignment
        if (errors[name as keyof PromotionFormData]) clearErrors(name as keyof PromotionFormData);
    };

    const handleSelectChange = (name: keyof PromotionFormData, value: string | number | null) => {
        let processedValue: string | number | null = value;
        if (value === '') { // Handle empty string from Select as null
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
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // Convert numeric strings to numbers or null before submission
        const formDataToSubmit = {
            ...data,
            value: data.value !== null ? parseFloat(String(data.value)) : null,
            discount_percentage: data.discount_percentage !== null ? parseFloat(String(data.discount_percentage)) : null,
            usage_limit: data.usage_limit !== null ? parseInt(String(data.usage_limit)) : null,
            user_usage_limit: data.user_usage_limit !== null ? parseInt(String(data.user_usage_limit)) : null,
            // Dates are already handled by input type="datetime-local" or "date" to ISO strings
        };

        // For file uploads, Inertia.js requires sending data as FormData
        post(route('crm.promotions.store'), {
            data: formDataToSubmit, // Explicitly pass transformed data
            forceFormData: true, // Ensure FormData is used for file upload
            onSuccess: () => {
                toast.success('Promotion created successfully!');
                reset(); // Reset form fields
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
            <Head title="Create Public Promotion" />

            <div className="py-12">
                <Card className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <CardHeader>
                        <CardTitle>Create New Public Promotion</CardTitle>
                        <CardDescription>Fill in the details for a new public-facing promotion.</CardDescription>
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
                                    {processing ? 'Creating...' : 'Create Promotion'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default CrmPromotionsCreate;
