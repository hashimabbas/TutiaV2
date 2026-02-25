import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from "@/components/ui/button";
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Contact as ContactType, Company, User, PageProps } from '@/types';
import { route } from 'ziggy-js';
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Building, UserCircle, Briefcase, Linkedin, FileText, CalendarDays, Users, Info, BadgeHelp, Tag } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { formatDate } from 'date-fns';

interface ContactsShowProps {
    contact: ContactType; // company and assignedUser should be eager loaded by controller
}

// DetailItem Helper from Company/Show.tsx, slightly adapted
interface DetailItemProps {
    icon?: React.ElementType;
    label: string;
    value?: React.ReactNode;
    className?: string;
    isLink?: boolean;
    href?: string;
    hideIfEmpty?: boolean;
}
const DetailItem: React.FC<DetailItemProps> = ({ icon: Icon, label, value, className, isLink, href, hideIfEmpty = true }) => {
    if (hideIfEmpty && (!value || (typeof value === 'string' && value.trim() === ''))) return null;

    const content = isLink && href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
            {value}
        </a>
    ) : (
        value
    );

    return (
        <div className={`space-y-0.5 ${className}`}> {/* Reduced space-y */}
            <p className="text-xs font-medium text-muted-foreground flex items-center">
                {Icon && <Icon className="mr-1.5 h-3.5 w-3.5" />}
                {label}
            </p>
            {typeof content === 'string' || typeof content === 'number' ? (
                <p className="text-sm">{content || '-'}</p>
            ) : (
                content || <p className="text-sm text-muted-foreground">-</p> // Fallback for empty ReactNode
            )}
        </div>
    );
};

const ContactsShow: React.FC = () => {
    const { props } = usePage<PageProps & ContactsShowProps>();
    const { contact } = props;
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route('contacts.destroy', contact.id), {
            preserveScroll: true,
            onFinish: () => setIsDeleting(false),
        });
    };

    const breadcrumbs = [
        { title: 'Contacts', href: route('contacts.index') },
        { title: contact.full_name || 'Contact Details' }
    ];

    const getStatusBadgeVariant = (status?: string | null): "default" | "secondary" | "destructive" | "outline" => {
        switch (status?.toLowerCase()) {
            case 'new lead': return 'default';
            case 'contacted': return 'secondary';
            case 'qualified': return 'default';
            case 'nurturing': return 'outline';
            case 'do not contact': return 'destructive';
            default: return 'outline';
        }
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Contact - ${contact.full_name}`} />
            <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
                <Card>
                    <CardHeader className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-semibold flex items-center">
                                <UserCircle className="mr-3 h-7 w-7 text-primary" />
                                {contact.full_name}
                            </CardTitle>
                            <CardDescription>
                                {contact.job_title}{contact.job_title && contact.company ? ' at ' : ''}
                                {contact.company && (
                                    <Link href={route('companies.show', contact.company.id)} className="hover:underline">
                                        {contact.company.name}
                                    </Link>
                                )}
                                {!contact.job_title && !contact.company && 'Contact Details'}
                            </CardDescription>
                        </div>
                        <div className="flex space-x-2 self-start sm:self-center">
                            <Link href={route('contacts.edit', contact.id)}><Button variant="outline" size="sm">Edit</Button></Link>
                            <AlertDialog>
                                <AlertDialogTrigger asChild><Button variant="destructive" size="sm" disabled={isDeleting}>{isDeleting ? 'Deleting...' : 'Delete'}</Button></AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader><AlertDialogTitle>Delete Contact</AlertDialogTitle><AlertDialogDescription>Delete "{contact.full_name}"? This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{isDeleting ? 'Deleting...' : 'Yes, delete'}</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardHeader>
                    <Separator className="my-4" />
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                            <DetailItem icon={Mail} label="Email" value={contact.email} isLink href={`mailto:${contact.email}`} />
                            <DetailItem icon={Phone} label="Main Phone" value={contact.phone} isLink href={`tel:${contact.phone}`} />
                            <DetailItem icon={Phone} label="Mobile Phone" value={contact.mobile_phone} isLink href={`tel:${contact.mobile_phone}`} />
                            <DetailItem icon={Linkedin} label="LinkedIn" value={contact.linkedin_profile_url} isLink href={contact.linkedin_profile_url} />

                            <DetailItem icon={Building} label="Company" value={contact.company?.name} isLink={!!contact.company} href={contact.company ? route('companies.show', contact.company.id) : undefined} />
                            <DetailItem icon={Briefcase} label="Job Title" value={contact.job_title} />
                            <DetailItem icon={Users} label="Department" value={contact.department} />

                            <DetailItem
                                icon={Tag}
                                label="Status"
                                value={contact.status ? <Badge variant={getStatusBadgeVariant(contact.status)}>{contact.status}</Badge> : '-'}
                                hideIfEmpty={false}
                            />
                            <DetailItem icon={BadgeHelp} label="Source" value={contact.source} />
                            {/* --- ADDED NEXT FOLLOW-UP DETAIL --- */}
                            <DetailItem icon={CalendarDays} label="Next Follow-up">
                                {contact.next_followup_date ? formatDate(contact.next_followup_date) : '-'}
                            </DetailItem>
                            {/* --- END ADDED DETAIL --- */}
                            <DetailItem
                                icon={UserCircle}
                                label="Assigned To"
                                value={contact.assigned_user ? (
                                    <Link href={contact.assigned_user.id ? '#' : '#'} className="text-blue-600 hover:underline"> {/* Replace # with users.show if you have it */}
                                        {contact.assigned_user.name}
                                    </Link>
                                ) : <span className="italic text-muted-foreground">Unassigned</span>}
                                hideIfEmpty={false}
                            />
                            <DetailItem icon={CalendarDays} label="Last Contacted" value={contact.last_contacted_at ? new Date(contact.last_contacted_at).toLocaleString() : '-'} />

                            {contact.description && (
                                <div className="md:col-span-2 lg:col-span-3 space-y-1 pt-2">
                                    <p className="text-xs font-medium text-muted-foreground flex items-center"><FileText className="mr-1.5 h-3.5 w-3.5" />Description / Notes</p>
                                    <p className="text-sm text-muted-foreground whitespace-pre-line">{contact.description}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="text-xs text-muted-foreground pt-4 border-t">
                        Created: {new Date(contact.created_at).toLocaleString()} • Last Updated: {new Date(contact.updated_at).toLocaleString()}
                    </CardFooter>
                </Card>

                {/* Placeholder for Future Sections (Offers/Deals, Activities for this Contact) */}
            </div>
        </AppLayout>
    );
};
export default ContactsShow;
