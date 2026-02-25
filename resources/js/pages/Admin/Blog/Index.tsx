import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import {
    Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Eye, MoreHorizontal, Info } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { SimpleLink } from '@/types'; // Assuming SimpleLink type exists

// Assuming these types are available in '@/types'
interface Post {
    id: number;
    title: string;
    slug: string;
    status: 'draft' | 'published' | 'archived';
    category: string | null;
    user: { name: string };
    published_at: string | null;
    created_at: string;
}
interface PostsIndexProps {
    posts: {
        data: Post[],
        meta: { total: number, per_page: number, last_page: number, links: SimpleLink[] },
        links: SimpleLink[]
    };
    breadcrumbs: any;
    flash: { success?: string; error?: string; };
}

const PostsIndex: React.FC = () => {
    const { props } = usePage<PostsIndexProps>();
    const { posts, breadcrumbs, flash } = props;
    const [postToDelete, setPostToDelete] = useState<number | null>(null);
    const { delete: destroy, processing } = useForm({});

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const getStatusVariant = (status: Post['status']) => {
        if (status === 'published') return 'default';
        if (status === 'draft') return 'secondary';
        return 'outline';
    };

    const handleDelete = (postId: number) => {
        destroy(route('blog.destroy', postId), {
            preserveScroll: true,
            onSuccess: () => setPostToDelete(null),
            onError: (errors) => { console.error(errors); toast.error('Failed to delete post.'); setPostToDelete(null); }
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Blog Management', href: route('blog.index') }]}>
            <Head title="Blog Posts" />
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Manage Blog Posts</CardTitle>
                        <Link href={route('blog.create')}>
                            <Button><Plus className="mr-2 h-4 w-4" /> New Post</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Author</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className='hidden md:table-cell'>Published Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {posts.data.length > 0 ? (
                                        posts.data.map(post => (
                                            <TableRow key={post.id}>
                                                <TableCell className="font-medium">
                                                    {post.title}
                                                </TableCell>
                                                <TableCell>{post.user.name}</TableCell>
                                                <TableCell>{post.category || '-'}</TableCell>
                                                <TableCell><Badge variant={getStatusVariant(post.status)}>{post.status}</Badge></TableCell>
                                                <TableCell className='hidden md:table-cell'>{post.published_at ? new Date(post.published_at).toLocaleDateString() : 'N/A'}</TableCell>
                                                <TableCell className="text-right">
                                                    <AlertDialog>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem asChild>
                                                                    <a href={route('blog.public.show', post.slug)} target="_blank" rel="noopener noreferrer" className='flex items-center'><Eye className="mr-2 h-4 w-4" /> View Public</a>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem asChild><Link href={route('blog.edit', post.id)} className='flex items-center'><Pencil className="mr-2 h-4 w-4" /> Edit</Link></DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <AlertDialogTrigger asChild><DropdownMenuItem onSelect={e => { e.preventDefault(); setPostToDelete(post.id); }} className='text-red-500 flex items-center'><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem></AlertDialogTrigger>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader><AlertDialogTitle>Delete Post</AlertDialogTitle><AlertDialogDescription>Delete "{post.title}"? This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDelete(postToDelete!)} disabled={processing} className="bg-destructive hover:bg-destructive/90">Yes, delete</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow><TableCell colSpan={6} className="h-24 text-center">No posts found.</TableCell></TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {/* Pagination component would go here */}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default PostsIndex;
