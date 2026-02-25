import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout'; // Adjust path if needed
import { type BreadcrumbItem } from '@/types'; // Adjust path if needed
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
import { toast } from 'sonner'; // Optional

// Define props expected by the Create component
interface Props {
    breadcrumbs: BreadcrumbItem[];
    errors: Record<string, string>; // Validation errors from Inertia (on failed submission)
}

const UserCreate: React.FC<Props> = ({ breadcrumbs, errors: validationErrors }) => {

    // Use Inertia's useForm hook for form handling
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '', // Required field for 'confirmed' validation rule
    });

    // Handle form submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Use POST method for creating resources via Inertia
        post(route('users.store'), {
            // Optional: Callbacks
            preserveScroll: true, // Keep scroll if validation fails
            onSuccess: () => {
                // Reset form fields after successful creation (optional, as redirect usually happens)
                // reset();
                // Backend redirect handles navigation and flash message usually
                // toast.success("User created successfully!");
            },
            onError: (err) => {
                // Errors are automatically populated in the 'errors' object
                console.error("Create Error:", err);
                toast.error("Failed to create user. Please check the form.");
                // Clear password fields on validation error for security
                reset('password', 'password_confirmation');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create New User" />

            <div className="w-full max-w-2xl mx-auto"> {/* Center the card */}
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New User</CardTitle>
                            <CardDescription>Enter the details for the new user.</CardDescription>
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
                                    autoFocus // Focus the first field
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

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    disabled={processing}
                                    className={errors.password ? 'border-destructive' : ''}
                                />
                                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                            </div>

                            {/* Password Confirmation Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                    disabled={processing}
                                    // No specific error shown here usually, covered by 'password.confirmed' error
                                    className={errors.password ? 'border-destructive' : ''} // Highlight if password has error
                                />
                                {/* Password confirmation errors are usually attached to the 'password' field */}
                            </div>

                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Link href={route('users.index')}>
                                <Button type="button" variant="outline" disabled={processing}>
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create User'}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
};

export default UserCreate;
