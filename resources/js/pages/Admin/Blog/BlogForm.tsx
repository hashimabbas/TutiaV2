// resources/js/Pages/Admin/Blog/BlogForm.tsx

import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// NOTE: Assuming you installed the tiptap dependencies and created TiptapEditor.tsx
import TiptapEditor from '@/components/RTE/TiptapEditor'; // <-- RTE Editor Import

interface Post {
    id: number;
    title: string;
    content: string;
    category: string | null;
    status: 'draft' | 'published' | 'archived';
    image: string | null;
    // Add other fields you need for initial data load
}

interface BlogFormProps {
    post?: Post; // For editing
    breadcrumbs: any;
}

const BlogForm: React.FC<BlogFormProps> = ({ post, breadcrumbs }) => {
    const isEditing = !!post;

    const { data, setData, post: savePost, put, processing, errors } = useForm({
        title: post?.title || '',
        content: post?.content || '',
        category: post?.category || '',
        status: post?.status || 'draft',
        image: null as File | null,
        _method: isEditing ? 'put' : '' as 'put' | '', // Spoofer for put
    });

    const handleSubmit = (e: React.FormFormEvent) => {
        e.preventDefault();

        const submitMethod = isEditing ? put : savePost;
        const url = isEditing ? route('blog.update', post.id) : route('blog.store');

        submitMethod(url, {
            // Inertia handles FormData creation automatically
            onSuccess: () => console.log('Post saved successfully'),
            onError: (err) => console.error(err),
            forceFormData: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? `Edit Post: ${post.title}` : "Create New Post"} />
            <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>{isEditing ? `Edit Post: ${post.title}` : "Create New Post"}</CardTitle>
                        <CardDescription>Manage your technical articles and news updates.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            {/* Title and Category */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="title">Title</Label>
                                    <Input id="title" value={data.title} onChange={e => setData('title', e.target.value)} disabled={processing} className={errors.title ? 'border-red-500' : ''} />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="category">Category</Label>
                                    <Input id="category" value={data.category} onChange={e => setData('category', e.target.value)} disabled={processing} />
                                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                                </div>
                            </div>

                            {/* Status and Featured Image */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={data.status} onValueChange={val => setData('status', val as any)} disabled={processing}>
                                        <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="image">Featured Image</Label>
                                    <Input type="file" id="image" accept="image/*" onChange={e => setData('image', e.target.files?.[0] || null)} disabled={processing} />
                                    {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                                    {post?.image && !data.image && <p className="text-xs text-muted-foreground">Current image exists.</p>}
                                </div>
                            </div>

                            {/* Content (Rich Text Area) */}
                            <div className="space-y-1">
                                <Label htmlFor="content">Content</Label>
                                {/* TIP: Tiptap is a controlled component, pass value and onChange */}
                                <TiptapEditor
                                    value={data.content}
                                    onChange={val => setData('content', val)}
                                    placeholder="Start writing your blog post content here..."
                                />
                                {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
                            </div>

                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2">
                            <Link href={route('blog.index')}><Button type="button" variant="outline" disabled={processing}>Cancel</Button></Link>
                            <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save Post'}</Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
};

// Export the component for Create/Edit pages to use
export default BlogForm;
