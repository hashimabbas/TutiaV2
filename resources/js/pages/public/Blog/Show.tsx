import React from 'react';
import { Head, usePage } from '@inertiajs/react';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import PublicLayout from '../layouts/PublicLayout';
import ServicesPageHeader from '../Partials/ServicesHeader';

interface Post {
    title: string;
    content: string;
    image: string | null;
    user: { name: string };
    published_at: string;
}

interface PostsPublicShowProps {
    post: Post;
}

const PublicBlogShow: React.FC = () => {
    const { props } = usePage<PostsPublicShowProps & { auth: any, flash: any }>().props;
    const { post, auth, flash } = props;

    const breadcrumbs = [
        { label: 'Home', url: route('home') },
        { label: 'Blog', url: route('blog.public.index') },
        { label: post.title }
    ];

    return (
        <PublicLayout title={post.title} auth={auth} flash={flash}>
            <ServicesPageHeader title={post.title} breadcrumbs={breadcrumbs} />

            <div className="py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-3xl font-bold">{post.title}</CardTitle>
                            <div className="flex items-center space-x-6 text-sm">
                                <span className="flex items-center text-muted-foreground"><User className="h-4 w-4 mr-1" /> Posted by: {post.user.name}</span>
                                <span className="flex items-center text-muted-foreground"><Clock className="h-4 w-4 mr-1" /> Published: {new Date(post.published_at).toLocaleDateString()}</span>
                            </div>
                        </CardHeader>
                        <Separator />
                        <CardContent className="space-y-6 pt-6">
                            {post.image && (
                                <div className="w-full h-80 overflow-hidden mb-6 rounded-lg">
                                    <img
                                        src={`/storage/${post.image}`}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Post Content */}
                            <div
                                className="prose max-w-none dark:prose-invert"
                                // DANGER: Using dangerouslySetInnerHTML is required for displaying RTE content,
                                // but requires sanitization in a real app if users are untrusted.
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PublicLayout>
    );
};

export default PublicBlogShow;
