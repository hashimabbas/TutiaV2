import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageProps, LeadSource } from '@/types';
import { route } from 'ziggy-js';
import { Plus, Pencil, Trash2, Info, AlertTriangle } from "lucide-react";
import { Input } from '@/components/ui/input';


// Props for this page, received from LeadSourceController@index
interface LeadSourcesIndexProps {
    leadSources: LeadSource[];
}

// Type for the form data
type LeadSourceFormData = {
    id: number | null;
    name: string;
    description: string;
}

const LeadSourcesIndex: React.FC = () => {
    const { props } = usePage<PageProps & LeadSourcesIndexProps>();
    const { leadSources, flash } = props;

    // State for managing the create/edit modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    // State for managing flash messages
    const [showFlash, setShowFlash] = useState(false);

    // Inertia form hook for creating and editing
    const { data, setData, post, put, processing, errors, reset } = useForm<LeadSourceFormData>({
        id: null,
        name: '',
        description: '',
    });

    // Effect to show flash messages for 5 seconds
    useEffect(() => {
        if (flash?.success || flash?.error) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Handlers for opening the modal
    const openCreateModal = () => {
        reset(); // Clear form data
        setModalMode('create');
        setIsModalOpen(true);
    };

    const openEditModal = (source: LeadSource) => {
        // Set form data to the source being edited
        setData({
            id: source.id,
            name: source.name,
            description: source.description || '',
        });
        setModalMode('edit');
        setIsModalOpen(true);
    };

    // Handler for form submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false); // Close modal on success
                reset(); // Reset form
            },
        };
        if (modalMode === 'edit') {
            put(route('leadSources.update', data.id), options);
        } else {
            post(route('leadSources.store'), options);
        }
    };

    // Handler for deleting a source
    const handleDelete = (sourceId: number) => {
        // Inertia's router can be used for simple deletes
        // We don't need a separate useForm hook for this
        router.delete(route('leadSources.destroy', sourceId), {
            preserveScroll: true,
        });
    };

    const breadcrumbs = [
        { title: 'Dashboard', href: route('dashboard') },
        { title: 'Lead Sources' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lead Sources" />

            <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                {/* Flash Messages */}
                {showFlash && flash?.success && (
                    <Alert className="mb-4 border-green-500 text-green-700">
                        <Info className="h-4 w-4 !text-green-700" />
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}
                {showFlash && flash?.error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{flash.error}</AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Manage Lead Sources</CardTitle>
                            <CardDescription>Add, edit, or remove sources for your leads and opportunities.</CardDescription>
                        </div>
                        <Button onClick={openCreateModal}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Source
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-md">
                            <ul className="divide-y divide-border">
                                {leadSources.length > 0 ? leadSources.map(source => (
                                    <li key={source.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                                        <div className="flex-1">
                                            <p className="font-semibold">{source.name}</p>
                                            {source.description && <p className="text-sm text-muted-foreground">{source.description}</p>}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => openEditModal(source)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the source "{source.name}".
                                                            You cannot delete a source if it's currently assigned to any leads.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDelete(source.id)} className="bg-destructive hover:bg-destructive/90">
                                                            Yes, delete source
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </li>
                                )) : (
                                    <li className="p-6 text-center text-muted-foreground">
                                        No lead sources found. Create one to get started.
                                    </li>
                                )}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* --- Create / Edit Modal Dialog --- */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>{modalMode === 'edit' ? 'Edit Lead Source' : 'Create New Lead Source'}</DialogTitle>
                            <DialogDescription>
                                {modalMode === 'edit' ? 'Make changes to the source here.' : 'Add a new source to track where your leads come from.'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={errors.name ? 'border-destructive' : ''}
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className={errors.description ? 'border-destructive' : ''}
                                />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Save Source'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
};

export default LeadSourcesIndex;
