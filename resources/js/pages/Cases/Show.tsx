// resources/js/pages/Cases/Show.tsx

import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from "@/components/ui/button";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SupportCase, PageProps } from '@/types';
import { route } from 'ziggy-js';
import { Separator } from '@/components/ui/separator';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { FileText, Building2, User, CalendarDays, Hash, Briefcase, Clock, ArrowLeft, Trash2, Pencil, Users } from 'lucide-react';

interface CasesShowProps {
    case: SupportCase;
}

const formatDate = (dateString: string | null | undefined, includeTime: boolean = false): string => {
    if (!dateString) return '-';
    try {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: includeTime ? '2-digit' : undefined, minute: includeTime ? '2-digit' : undefined
        });
    } catch (e) {
        return '-';
    }
};

const getPriorityBadgeVariant = (priority: string): BadgeProps['variant'] => {
    switch (priority) {
        case 'Critical':
        case 'High': return 'destructive';
        case 'Medium': return 'default';
        case 'Low': return 'secondary';
        default: return 'outline';
    }
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


const CasesShow: React.FC = () => {
    const { props } = usePage<PageProps & CasesShowProps>();
    const { case: caseItem } = props;
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        router.delete(route('support_cases.destroy', caseItem.id), {
            onStart: () => setIsDeleting(true),
            onFinish: () => setIsDeleting(false),
        });
    };

    const breadcrumbs = [
        { title: 'Support Cases', href: route('support_cases.index') },
        { title: caseItem.reference_number }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Case - ${caseItem.reference_number}`} />

            <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
                {/* Header with actions */}
                <div className="flex items-center justify-between mb-6">
                    <Link href={route('support_cases.index')}>
                        <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Cases</Button>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <Link href={route('support_cases.edit', caseItem.id)}>
                            <Button><Pencil className="mr-2 h-4 w-4" /> Edit</Button>
                        </Link>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" disabled={isDeleting}><Trash2 className="mr-2 h-4 w-4" /> Delete</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader><AlertDialogTitle>Delete Case</AlertDialogTitle><AlertDialogDescription>Delete "{caseItem.reference_number}"? This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
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

                {/* Main Details Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            {caseItem.subject}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 text-base">
                            <Badge variant="secondary"><Hash className="mr-1 h-3 w-3" />{caseItem.reference_number}</Badge>
                            <Badge variant={getPriorityBadgeVariant(caseItem.priority)}>{caseItem.priority}</Badge>
                            <Badge variant="default">{caseItem.status}</Badge>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
                            <DetailItem icon={Building2} label="Company">
                                {caseItem.company ? (<Link href={route('companies.show', caseItem.company.id)} className="text-primary hover:underline">{caseItem.company.name}</Link>) : null}
                            </DetailItem>
                            <DetailItem icon={User} label="Contact Person">
                                {caseItem.contact ? (<Link href={route('contacts.show', caseItem.contact.id)} className="text-primary hover:underline">{caseItem.contact.first_name} {caseItem.contact.last_name}</Link>) : null}
                            </DetailItem>
                            <DetailItem icon={Briefcase} label="Product/Service">
                                {caseItem.product_or_service}
                            </DetailItem>

                            <DetailItem icon={Users} label="Assigned To">
                                {caseItem.assigned_user?.name}
                            </DetailItem>
                            <DetailItem icon={CalendarDays} label="Due Date">
                                {formatDate(caseItem.due_date)}
                            </DetailItem>
                            <DetailItem icon={Clock} label="Resolution Date">
                                {formatDate(caseItem.resolution_date)}
                            </DetailItem>

                            <DetailItem icon={User} label="Created By">
                                {caseItem.created_by?.name}
                            </DetailItem>
                            <DetailItem icon={CalendarDays} label="Created On">
                                {formatDate(caseItem.created_at, true)}
                            </DetailItem>
                            <DetailItem icon={CalendarDays} label="Last Updated">
                                {formatDate(caseItem.updated_at, true)}
                            </DetailItem>
                        </dl>

                        <Separator />

                        {caseItem.description && (
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium flex items-center"><FileText className="mr-2 h-5 w-5" />Description</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap">{caseItem.description}</p>
                            </div>
                        )}

                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default CasesShow;
