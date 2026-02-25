import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import { type User, type BreadcrumbItem, type PaginatedResponse, SimpleLink } from '@/types';
import AppLayout from '@/layouts/app-layout';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, FileText, Phone, Mail, User as UserIcon, ChevronDown, ChevronUp, Download } from 'lucide-react'; // Added ChevronDown/Up, Download
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    // AlertDialogTrigger removed as we trigger programmatically
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from '@/lib/utils';
import { route } from 'ziggy-js';

// Assuming ziggy setup for route() helper
// import route from 'ziggy-js';

interface MessageType {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    attachment: string | null;
    attachment_url: string | null;
    created_at: string;
    created_at_iso: string;
}

interface Props {
    messages: {
        data: MessageType[];
        links: { first: string | null; last: string | null; prev: string | null; next: string | null; };
        meta: {
            current_page: number;
            from: number | null;
            last_page: number;
            links: SimpleLink[];
            path: string;
            per_page: number;
            to: number | null;
            total: number;
        };
    };
    auth: { user: User; };
    flash?: { success?: string; error?: string; };
    breadcrumbs: BreadcrumbItem[];
    filters: { search?: string; status?: string; };
}

const AdminMessagesIndex: React.FC<Props> = ({ messages, auth, flash, breadcrumbs, filters }) => {
    const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
    const [expandedMessageId, setExpandedMessageId] = useState<number | null>(null); // State for expanded message
    const { delete: destroy, processing } = useForm({});

    // --- Toggle Message Expansion ---
    const toggleMessageExpansion = (messageId: number) => {
        setExpandedMessageId(prevId => (prevId === messageId ? null : messageId));
    };

    // --- Delete Handlers ---
    const handleDeleteClick = (messageId: number) => setMessageToDelete(messageId);

    const confirmDelete = () => {
        if (messageToDelete === null) return;

        // Use Ziggy route helper for robustness (assuming you imported route helper)
        destroy(route('messages.destroy', { message: messageToDelete }), {
            preserveScroll: true,
            // REMOVE preserveState: false, it forces a full page reload and is usually unnecessary here
            onSuccess: () => {
                toast.success('Message deleted successfully.');
                setMessageToDelete(null);
                if (expandedMessageId === messageToDelete) {
                    setExpandedMessageId(null);
                }
            },
            onError: (errors) => {
                console.error("Delete error:", errors);
                const errorMsg = Object.values(errors).join(' ') || 'Failed to delete message.';
                toast.error(errorMsg);
                setMessageToDelete(null);
            },
        });
    };

    const cancelDelete = () => setMessageToDelete(null);
    // --- ---

    // --- Flash Message Handling ---
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);
    // --- ---

    // --- Utility to truncate text ---
    const truncateText = (text: string, maxLength: number = 50): string => {
        if (!text) return '';
        return text.length <= maxLength ? text : text.substring(0, maxLength) + '...';
    };
    // --- ---

    const columnsCount = 6; // Update this if you change the number of columns

    // Helper to construct the export URL
    const buildExportUrl = () => {
        // You would add filtering logic here if needed, but for now, it's a simple route
        return route('messages.export');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Messages" />
            <TooltipProvider>
                <div className="w-full py-6 md:py-12">
                    <Card className="max-w-7xl mx-auto">
                        <CardHeader>
                            <CardTitle>Contact Messages</CardTitle>
                            <div className="flex items-center space-x-2">
                                {/* --- NEW: EXPORT BUTTON --- */}
                                <a href={buildExportUrl()}>
                                    <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
                                </a>
                                {/* --- END NEW: EXPORT BUTTON --- */}
                            </div>
                            <CardDescription>
                                View and manage messages received. Total: {messages?.meta?.total ?? 0} messages.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Responsive table wrapper */}
                            <div className="w-full rounded-md border md:border-0">
                                <Table>
                                    {/* Hide header on mobile, rely on data-label */}
                                    <TableHeader>
                                        <TableRow className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted md:table-row hidden">
                                            <TableHead className="px-4 py-3 md:table-cell">Sender</TableHead>
                                            <TableHead className="px-4 py-3 md:table-cell">Email</TableHead>
                                            <TableHead className="px-4 py-3 hidden lg:table-cell">Phone</TableHead>
                                            <TableHead className="px-4 py-3 md:table-cell">Message Snippet</TableHead>
                                            <TableHead className="px-4 py-3 hidden lg:table-cell">Received</TableHead>
                                            <TableHead className="px-4 py-3 text-right md:table-cell">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {messages && messages.data.length > 0 ? (
                                            messages.data.map((message) => (
                                                // Use React Fragment to group main row and expanded row
                                                <React.Fragment key={message.id}>
                                                    <TableRow
                                                        // Mobile Card styling
                                                        className="block border-b p-4 mb-4 rounded-md shadow-sm bg-background md:table-row md:border-b-0 md:p-0 md:mb-0 md:shadow-none hover:bg-muted/50 data-[state=selected]:bg-muted"
                                                    >
                                                        {/* Sender */}
                                                        <TableCell
                                                            data-label="Sender:"
                                                            className="flex justify-between items-center text-right font-medium md:table-cell md:text-left md:font-normal md:px-4 md:py-3 before:content-[attr(data-label)] before:font-semibold before:text-left md:before:content-none"
                                                        >
                                                            <span className='flex items-center gap-2'>
                                                                <UserIcon className="h-4 w-4 text-muted-foreground hidden md:inline-block" /> {message.name}
                                                            </span>
                                                        </TableCell>

                                                        {/* Email */}
                                                        <TableCell
                                                            data-label="Email:"
                                                            className="flex justify-between items-center text-right md:table-cell md:text-left md:px-4 md:py-3 before:content-[attr(data-label)] before:font-semibold before:text-left md:before:content-none"
                                                        >
                                                            <a href={`mailto:${message.email}`} className="hover:underline flex items-center gap-1">
                                                                <Mail className="h-4 w-4 text-muted-foreground hidden md:inline-block" /> {message.email}
                                                            </a>
                                                        </TableCell>

                                                        {/* Phone (Hidden below lg) */}
                                                        <TableCell
                                                            data-label="Phone:"
                                                            className="hidden justify-between items-center text-right lg:table-cell md:text-left md:px-4 md:py-3 before:content-[attr(data-label)] before:font-semibold before:text-left md:before:content-none"
                                                        >
                                                            {message.phone ? (
                                                                <span className="flex items-center gap-1">
                                                                    <Phone className="h-4 w-4 text-muted-foreground hidden md:inline-block" /> {message.phone}
                                                                </span>
                                                            ) : (
                                                                <span className="text-muted-foreground italic">N/A</span>
                                                            )}
                                                        </TableCell>

                                                        {/* Message Snippet */}
                                                        <TableCell
                                                            data-label="Message:"
                                                            className="flex justify-between items-center text-right md:table-cell md:text-left md:px-4 md:py-3 before:content-[attr(data-label)] before:font-semibold before:text-left md:before:content-none"
                                                        >
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div className='flex items-center gap-1'>
                                                                        {message.attachment_url && <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0 hidden md:inline-block" />}
                                                                        {truncateText(message.message, 60)}
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="top" align="start">
                                                                    <p className='max-w-xs break-words'>{message.message}</p>
                                                                    {message.attachment_url && <Badge variant="secondary" className="mt-2">Has Attachment</Badge>}
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TableCell>

                                                        {/* Received (Hidden below lg) */}
                                                        <TableCell
                                                            data-label="Received:"
                                                            className="hidden justify-between items-center text-right lg:table-cell md:text-left md:px-4 md:py-3 before:content-[attr(data-label)] before:font-semibold before:text-left md:before:content-none"
                                                        >
                                                            <Tooltip>
                                                                <TooltipTrigger>{message.created_at}</TooltipTrigger>
                                                                <TooltipContent>{new Date(message.created_at_iso).toLocaleString()}</TooltipContent>
                                                            </Tooltip>
                                                        </TableCell>

                                                        {/* Actions */}
                                                        <TableCell
                                                            data-label="Actions:"
                                                            className="flex justify-end items-center pt-3 md:pt-0 md:table-cell md:text-right md:px-4 md:py-3 before:content-[attr(data-label)] before:font-semibold before:text-left before:self-center md:before:content-none"
                                                        >
                                                            <div className="flex gap-1 justify-end">
                                                                {/* Toggle Message Button */}
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleMessageExpansion(message.id)}>
                                                                            {expandedMessageId === message.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                                            <span className="sr-only">{expandedMessageId === message.id ? 'Hide Message' : 'Show Message'}</span>
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>{expandedMessageId === message.id ? 'Hide Full Message' : 'Show Full Message'}</TooltipContent>
                                                                </Tooltip>

                                                                {/* Attachment Button */}
                                                                {message.attachment_url && (
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <a href={message.attachment_url} target="_blank" rel="noopener noreferrer" download>
                                                                                <Button variant="outline" size="icon" className="h-8 w-8">
                                                                                    <Download className="h-4 w-4" />
                                                                                    <span className="sr-only">Download Attachment</span>
                                                                                </Button>
                                                                            </a>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Download Attachment</TooltipContent>
                                                                    </Tooltip>
                                                                )}

                                                                {/* Delete Button */}
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteClick(message.id)} disabled={processing && messageToDelete === message.id}>
                                                                            <Trash2 className="h-4 w-4 text-red-600" />
                                                                            <span className="sr-only">Delete Message</span>
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>Delete Message</TooltipContent>
                                                                </Tooltip>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>

                                                    {/* --- Expanded Message Row --- */}
                                                    {expandedMessageId === message.id && (
                                                        <TableRow className="bg-muted/20 dark:bg-muted/40 md:bg-transparent">
                                                            {/* Use md:bg-transparent to only apply bg on mobile "card" view */}
                                                            <TableCell
                                                                // Span all columns
                                                                colSpan={columnsCount}
                                                                // Override mobile styles and add padding/whitespace handling
                                                                className="p-4 !text-left !before:content-none whitespace-pre-wrap break-words border-t md:border-t-0 md:border-b"
                                                            >
                                                                <p className="text-sm text-foreground">{message.message}</p>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </React.Fragment>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={columnsCount} className="h-24 text-center">
                                                    No messages found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* --- Pagination --- */}
                            <div className="mt-6 flex justify-center">
                                {messages && messages.meta && messages.meta.links && messages.meta.links.length > 3 && (
                                    <Pagination>
                                        <PaginationContent>
                                            {messages.meta.links.map((link: SimpleLink, index: number) => {
                                                if (index === 0) { // Previous
                                                    return (
                                                        <PaginationItem key={`prev-${index}`}>
                                                            <PaginationPrevious
                                                                href={link.url ?? '#'}
                                                                onClick={(e) => { e.preventDefault(); if (link.url) router.visit(link.url, { preserveState: true, preserveScroll: true }); }}
                                                                aria-disabled={!link.url} className={!link.url ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                                                        </PaginationItem>
                                                    );
                                                }
                                                if (index === messages.meta.links.length - 1) { // Next
                                                    return (
                                                        <PaginationItem key={`next-${index}`}>
                                                            <PaginationNext
                                                                href={link.url ?? '#'}
                                                                onClick={(e) => { e.preventDefault(); if (link.url) router.visit(link.url, { preserveState: true, preserveScroll: true }); }}
                                                                aria-disabled={!link.url} className={!link.url ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                                                        </PaginationItem>
                                                    );
                                                }
                                                if (link.label === '...') { // Ellipsis
                                                    return <PaginationItem key={`ellipsis-${index}`}><PaginationEllipsis /></PaginationItem>;
                                                }
                                                // Page Number
                                                return (
                                                    <PaginationItem key={`page-${link.label}-${index}`}>
                                                        <PaginationLink
                                                            href={link.url ?? '#'}
                                                            onClick={(e) => { e.preventDefault(); if (link.url && !link.active) router.visit(link.url, { preserveState: true, preserveScroll: true }); }}
                                                            isActive={link.active} aria-current={link.active ? 'page' : undefined}
                                                            className={cn(link.active ? "cursor-default" : "cursor-pointer hover:bg-accent hover:text-accent-foreground", !link.url && !link.active ? "pointer-events-none opacity-50" : "")}
                                                        >
                                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            })}
                                        </PaginationContent>
                                    </Pagination>
                                )}
                            </div>
                            {/* --- End Pagination --- */}

                        </CardContent>
                    </Card>
                </div>

                {/* --- Alert Dialog for Delete Confirmation --- */}
                {messageToDelete !== null && (
                    <AlertDialog open={messageToDelete !== null} onOpenChange={(isOpen) => !isOpen && cancelDelete()}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the message from
                                    <strong className='px-1'>"{messages?.data?.find(m => m.id === messageToDelete)?.name ?? 'this sender'}"</strong>.
                                    Any associated attachments will also be deleted.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={cancelDelete} disabled={processing}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    disabled={processing} onClick={confirmDelete} // <-- Call the robust confirmDelete function
                                    className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
                                >
                                    {processing ? 'Deleting...' : 'Yes, delete message'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
                {/* --- End Alert Dialog --- */}
            </TooltipProvider>
        </AppLayout>
    );
};

export default AdminMessagesIndex;
