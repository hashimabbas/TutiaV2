import React, { useState } from 'react';
// Correct import including router
import { Head, Link, usePage, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout'; // Assuming layout path
import { type BreadcrumbItem } from '@/types'; // Assuming type path
import { User } from '@/types'; // Make sure User type is defined in your types file

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    // TableCaption, // Optional for card layout
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    // AlertDialogTrigger // We manage open state manually
} from '@/components/ui/alert-dialog';
import { Edit, Trash2, UserPlus } from 'lucide-react'; // Added UserPlus
import { toast } from 'sonner'; // Using sonner for notifications
import { format } from 'date-fns'; // For formatting dates

// Define the props structure coming from Inertia
interface Props {
    users: {
        data: User[]; // Assuming pagination, data is in 'data' key
        // Add other pagination properties if needed (links, meta)
    };
    breadcrumbs: BreadcrumbItem[];
    flash: { // For success/error messages from backend
        success?: string;
        error?: string;
    }
}

const UsersIndex: React.FC<Props> = ({ users, breadcrumbs }) => {
    // Extract users array from paginator if needed, otherwise use users directly if not paginated
    const userData = users.data ?? users; // Adjust based on pagination or not

    const [sorting, setSorting] = useState<SortingState>([]);
    const [userToDeleteId, setUserToDeleteId] = useState<number | null>(null);

    // Use Inertia's useForm for delete operation
    const { delete: destroy, processing: deleting } = useForm();

    // --- Delete Logic ---
    const handleDeleteClick = (userId: number) => {
        setUserToDeleteId(userId);
    };

    const cancelDelete = () => {
        setUserToDeleteId(null);
    };

    const confirmDelete = () => {
        if (userToDeleteId === null) return;

        destroy(route('users.destroy', { user: userToDeleteId }), {
            preserveScroll: true, // Keep scroll position
            onSuccess: () => {
                toast.success('User deleted successfully.');
                setUserToDeleteId(null); // Close dialog
            },
            onError: (errors) => {
                console.error("Delete Error:", errors);
                toast.error('Error deleting user. Please try again.');
                setUserToDeleteId(null); // Close dialog even on error
            },
        });
    };

    // --- Edit Logic ---
    const handleEditUser = (userId: number) => {
        // Use Inertia's router (now imported) to navigate to the edit page
        router.get(route('users.edit', { user: userId }));
    };

    // --- Tanstack Table Column Definition ---
    const columns: ColumnDef<User>[] = React.useMemo(() => [ // Memoize columns
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>, // Example styling
        },
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'email',
            header: 'Email',
        },
        {
            accessorKey: 'created_at',
            header: 'Created At',
            cell: ({ row }) => format(new Date(row.original.created_at), 'PPp') // Format date
        },
        {
            accessorKey: 'updated_at',
            header: 'Updated At',
            cell: ({ row }) => format(new Date(row.original.updated_at), 'PPp') // Format date
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Actions</div>, // Right align header
            // Cell rendering logic moved inside the main component's return for card layout access
            cell: ({ row }) => (
                // This content will be placed inside the responsive TableCell below
                <div className="flex gap-1 justify-end">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditUser(row.original.id)}
                        aria-label="Edit User"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(row.original.id)}
                        aria-label="Delete User"
                        className="text-destructive hover:text-destructive/80"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        },
    ], []); // Empty dependency array ensures columns are created once

    const table = useReactTable({
        data: userData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="w-full">
                <Card>
                    <CardHeader className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 pb-4">
                        <div>
                            <CardTitle>Users</CardTitle>
                            <CardDescription>Manage system users.</CardDescription>
                        </div>
                        {/* --- Create New User Button --- */}
                        <Link href={route('users.create')}>
                            <Button>
                                <UserPlus className="mr-2 h-4 w-4" /> Create New User
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {/* --- Responsive Table Container --- */}
                        <div className="w-full rounded-md border md:border-0">
                            <Table>
                                {/* --- Table Header (Hidden on Mobile) --- */}
                                <TableHeader className="hidden md:table-header-group">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <TableHead key={header.id} className="px-4 py-3"> {/* Adjust padding */}
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHeader>

                                {/* --- Table Body (Adapts to Card Layout) --- */}
                                <TableBody>
                                    {table.getRowModel().rows.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                data-state={row.getIsSelected() && 'selected'}
                                                // ** Mobile: block layout, border, padding **
                                                // ** Desktop: revert to table-row **
                                                className="block border-b p-4 mb-4 rounded-md shadow-sm md:table-row md:border-b-0 md:p-0 md:mb-0 md:shadow-none"
                                            >
                                                {row.getVisibleCells().map((cell) => {
                                                    // Get header text for data-label
                                                    const headerText = typeof cell.column.columnDef.header === 'string'
                                                        ? cell.column.columnDef.header
                                                        : cell.column.id; // Fallback to id if header is complex

                                                    return (
                                                        <TableCell
                                                            key={cell.id}
                                                            // Add data-label attribute
                                                            data-label={headerText === 'actions' ? '' : `${headerText}: `} // Add colon, hide for actions
                                                            // ** Apply responsive styles **
                                                            className={`flex justify-between items-center text-right md:table-cell md:text-left md:px-4 md:py-2
                                                                ${cell.column.id === 'actions' ? 'pt-3 md:pt-2' : ''} // Extra top padding for actions on mobile
                                                                before:content-[attr(data-label)] before:font-semibold before:text-left md:before:content-none // Show label on mobile
                                                            `}
                                                        >
                                                            {/* Wrap cell content in a span for flex alignment */}
                                                            <span className={cell.column.id === 'actions' ? 'ml-auto' : 'text-right md:text-left'}>
                                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                            </span>
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                                No users found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {/* Add Pagination Controls Here if using pagination */}
                    </CardContent>
                </Card>
            </div>

            {/* --- Alert Dialog for Delete Confirmation --- */}
            <AlertDialog open={userToDeleteId !== null} onOpenChange={(isOpen) => !isOpen && cancelDelete()}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={deleting} // Disable button while deleting
                            className="bg-destructive text-destructive-foreground text-white hover:bg-destructive/90" // Style as destructive action
                        >
                            {deleting ? 'Deleting...' : 'Delete User'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </AppLayout>
    );
};

export default UsersIndex;
