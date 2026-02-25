import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { route } from 'ziggy-js';

// Type for the form data
type LeadSourceFormData = {
    name: string;
    description: string;
}

const LeadSourceCreate: React.FC = () => {
    // Inertia form hook for creating
    const { data, setData, post, processing, errors, reset } = useForm<LeadSourceFormData>({
        name: '',
        description: '',
    });

    // Handler for form submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('leadSources.store'), {
            onSuccess: () => reset(), // Reset the form on successful creation
        });
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Lead Sources', href: route('leadSources.index') },
        { title: 'Create' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Lead Source" />

            <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>
                            <CardTitle>Create New Lead Source</CardTitle>
                            <CardDescription>
                                Add a new source to track where your leads come from.
                                Fields marked with <span className="text-red-500">*</span> are required.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={errors.name ? 'border-destructive' : ''}
                                    disabled={processing}
                                />
                                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className={errors.description ? 'border-destructive' : ''}
                                    disabled={processing}
                                    rows={3}
                                />
                                {errors.description && <p className="text-sm text-destructive mt-1">{errors.description}</p>}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2">
                            <Link href={route('leadSources.index')}>
                                <Button type="button" variant="outline" disabled={processing}>
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Source'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
};

export default LeadSourceCreate;
