import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { format } from 'date-fns';
import {
    ArrowLeft, Briefcase, Building2, Calendar as CalendarIcon, DollarSign, FileText, Info,
    MessageSquare, Pencil, Percent, Trash2, User as UserIcon, Users
} from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { PageProps, Opportunity } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Props for this specific page
interface ShowProps {
    opportunity: Opportunity;
}

// Helper to format currency
const formatCurrency = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined) return '-';
    const num = Number(value);
    if (isNaN(num)) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
};

// Helper to determine badge color based on stage
const getStageBadgeVariant = (stage?: Opportunity['stage']): BadgeProps['variant'] => {
    if (!stage) return 'secondary';
    if (stage.includes('Won')) return 'default'; // Success (shadcn primary)
    if (stage.includes('Lost')) return 'destructive'; // Danger
    return 'secondary'; // Neutral
};

// Reusable component for displaying a detail item
const DetailItem: React.FC<{ icon: React.ElementType, label: string, children: React.ReactNode }> = ({ icon: Icon, label, children }) => (
    <div className="flex flex-col space-y-1">
        <dt className="text-sm font-medium text-muted-foreground flex items-center">
            <Icon className="mr-2 h-4 w-4" />
            {label}
        </dt>
        <dd className="text-base sm:text-lg">
            {children || <span className="text-muted-foreground">-</span>}
        </dd>
    </div>
);


const OpportunitiesShow: React.FC = () => {
    const { props } = usePage<PageProps & ShowProps>();
    const { opportunity, flash } = props;

    const [isDeleting, setIsDeleting] = useState(false);
    const [showFlash, setShowFlash] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleDelete = () => {
        router.delete(route('opportunities.destroy', opportunity.id), {
            onStart: () => setIsDeleting(true),
            onFinish: () => setIsDeleting(false),
            // On success, Inertia will automatically take us to the index page.
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Opportunities', url: route('opportunities.index') }, { title: opportunity.title }]}>
            <Head title={opportunity.title} />

            <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                {/* Header with actions */}
                <div className="flex items-center justify-between mb-6">
                    <Link href={route('opportunities.index')}>
                        <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Opportunities</Button>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <Link href={route('opportunities.edit', opportunity.id)}>
                            <Button><Pencil className="mr-2 h-4 w-4" /> Edit</Button>
                        </Link>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" disabled={isDeleting}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Opportunity</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete "{opportunity.title}"? This action cannot be undone.
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
                </div>

                {/* Flash Message */}
                {showFlash && flash?.success && (
                    <Alert className="mb-4 border-green-500 text-green-700">
                        <Info className="h-4 w-4 !text-green-700" />
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                {/* Main Details Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-6 w-6" /> {opportunity.title}
                        </CardTitle>
                        {opportunity.company && (
                            <CardDescription>
                                Opportunity with <Link href={route('companies.show', opportunity.company.id)} className="font-medium text-primary hover:underline">{opportunity.company.name}</Link>
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                            <DetailItem icon={Building2} label="Company">
                                {opportunity.company ? (
                                    <Link href={route('companies.show', opportunity.company.id)} className="text-primary hover:underline">{opportunity.company.name}</Link>
                                ) : null}
                            </DetailItem>
                            <DetailItem icon={UserIcon} label="Primary Contact">
                                {opportunity.contact ? (
                                    <Link href={route('contacts.show', opportunity.contact.id)} className="text-primary hover:underline">{opportunity.contact.first_name} {opportunity.contact.last_name}</Link>
                                ) : null}
                            </DetailItem>
                            <DetailItem icon={DollarSign} label="Value">
                                {formatCurrency(opportunity.value)}
                            </DetailItem>
                            <DetailItem icon={Info} label="Stage">
                                <Badge variant={getStageBadgeVariant(opportunity.stage)}>{opportunity.stage}</Badge>
                            </DetailItem>
                            <DetailItem icon={Percent} label="Probability">
                                {opportunity.probability}%
                            </DetailItem>
                            <DetailItem icon={CalendarIcon} label="Expected Close Date">
                                {opportunity.expected_close_date ? format(new Date(opportunity.expected_close_date), 'PPP') : null}
                            </DetailItem>
                            {/* --- ADDED NEXT STEP DETAILS --- */}
                            <DetailItem icon={Info} label="Next Step">
                                {opportunity.next_step_label}
                            </DetailItem>
                            <DetailItem icon={CalendarIcon} label="Next Step Due">
                                {opportunity.next_step_due_date ? format(new Date(opportunity.next_step_due_date), 'PPP') : null}
                            </DetailItem>
                            {/* --- END ADDED DETAILS --- */}
                            <DetailItem icon={Users} label="Assigned To">
                                {opportunity.assignedUser?.name}
                            </DetailItem>
                            <DetailItem icon={MessageSquare} label="Lead Source">
                                {opportunity.source?.name}
                            </DetailItem>

                        </dl>

                        {(opportunity.description || opportunity.notes) && <Separator />}

                        {opportunity.description && (
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium">Description</h3>
                                <p className="text-muted-foreground">{opportunity.description}</p>
                            </div>
                        )}

                        {opportunity.notes && (
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium">Notes</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap">{opportunity.notes}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default OpportunitiesShow;
