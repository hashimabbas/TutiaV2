import React, { useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types'; // Adjust path as needed
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner'; // Optional: For client-side feedback if needed

// Define props expected by the Edit component
interface Props {
    user: User; // The user data passed from the controller
    breadcrumbs: BreadcrumbItem[];
    errors: Record<string, string>; // Validation errors from Inertia
}

const UserEdit: React.FC<Props> = ({ user, breadcrumbs, errors: validationErrors }) => {

    // Use Inertia's useForm hook for form handling
    const { data, setData, patch, processing, errors, recentlySuccessful, reset } = useForm({
        name: user.name || '', // Initialize form data with user's current values
        email: user.email || '',
        password: '', // Only include if allowing password change on this form
        password_confirmation: '', // Required if using 'confirmed' validation rule
    });

    // Handle form submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Use PATCH method for updates via Inertia
        patch(route('users.update', { user: user.id }), {
            // Optional: Callbacks
            preserveScroll: true, // Keep scroll position after update
            onSuccess: () => {
                // Toast notification handled by backend flash message redirect usually
                // toast.success("User updated!");
            },
            onError: (err) => {
                // Errors are automatically populated in the 'errors' object
                console.error("Update Error:", err);
                toast.error("Failed to update user. Please check the form.");
            },
        });
    };

    // Optional: Reset form if successfully updated and user navigates away/back
    // useEffect(() => {
    //     if (recentlySuccessful) {
    //         reset(); // Reset form fields after successful update
    //     }
    // }, [recentlySuccessful, reset]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit User - ${user.name}`} />

            <div className="w-full max-w-2xl mx-auto"> {/* Center the card */}
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit User</CardTitle>
                            <CardDescription>Update the details for {user.name}.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    disabled={processing}
                                    className={errors.name ? 'border-destructive' : ''}
                                />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    disabled={processing}
                                    className={errors.email ? 'border-destructive' : ''}
                                />
                                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                            </div>

                            {/* --- Optional: Password Fields --- */}
                            {/* Uncomment if you want to allow password changes here */}
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password (leave blank to keep current)</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    className={errors.password ? 'border-destructive' : ''}
                                />
                                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">Confirm New Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    disabled={processing}
                                />
                                 // No specific error shown here usually, covered by 'password' error
                            </div>

                            {/* --- End Optional Password Fields --- */}

                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Link href={route('users.index')}>
                                <Button type="button" variant="outline" disabled={processing}>
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
};

export default UserEdit;
