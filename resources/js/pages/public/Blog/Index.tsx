import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, User, ArrowRight } from 'lucide-react';
import PublicLayout from '../layouts/PublicLayout';
import ServicesPageHeader from '../Partials/ServicesHeader';

interface PostsPublicIndexProps {
    posts: { data: Post[], meta: any, links: any };
}
interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    image: string | null;
    user: { name: string };
    published_at: string;
    category: string | null;
}

const PublicBlogIndex: React.FC = () => {
    // Helper to truncate HTML/Rich Text Content
    const getExcerpt = (htmlContent: string, maxLength: number = 150) => {
        const text = htmlContent.replace(/<[^>]*>?/gm, ''); // Strip HTML tags
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };
    // FIX: Access properties directly from usePage().props with a fallback/check
    const { props } = usePage();

    // Safely pull the objects, using a default empty object/array if not present
    const posts = (props as any).posts || { data: [], meta: {}, links: {} };
    const breadcrumbs = (props as any).breadcrumbs || [];
    const flash = (props as any).flash;
    const auth = (props as any).auth;

    // Note: We avoid destructuring from { props } = usePage<...>() and then const { posts } = props;
    // Instead, we access the objects directly from the props variable.

    const [postToDelete, setPostToDelete] = useState<number | null>(null);
    const { delete: destroy, processing } = useForm({});

    return (
        <PublicLayout title="Tech Blog" auth={auth} flash={flash}>
            <ServicesPageHeader title="Tech News & Insights" breadcrumbs={breadcrumbs} />

            <div className="py-12">
                <div className="container mx-auto px-4">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {posts.data.length > 0 ? (
                                    posts.data.map((post) => (
                                        <Card key={post.id} className="overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-2xl">
                                            {post.image && (
                                                <div className="relative h-48 overflow-hidden">
                                                    <img
                                                        src={`/storage/${post.image}`}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                                    />
                                                </div>
                                            )}
                                            <CardHeader className="pt-4 pb-2">
                                                <CardTitle className="text-xl text-primary hover:text-indigo-600 transition-colors">
                                                    <Link href={route('blog.public.show', post.slug)}>
                                                        {post.title}
                                                    </Link>
                                                </CardTitle>
                                                <CardDescription className="flex items-center space-x-4 text-xs">
                                                    <span className="flex items-center text-muted-foreground"><User className="h-3 w-3 mr-1" /> {post.user.name}</span>
                                                    <span className="flex items-center text-muted-foreground"><Clock className="h-3 w-3 mr-1" /> {new Date(post.published_at).toLocaleDateString()}</span>
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="pb-4">
                                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                    {getExcerpt(post.content)}
                                                </p>
                                            </CardContent>
                                            <CardFooter>
                                                <Link href={route('blog.public.show', post.slug)}>
                                                    <Button variant="link" className="p-0 text-primary hover:text-indigo-600">
                                                        Read More <ArrowRight className="h-4 w-4 ml-2" />
                                                    </Button>
                                                </Link>
                                            </CardFooter>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="col-span-3 text-center py-10"><p className='text-muted-foreground'>No articles published yet.</p></div>
                                )}
                            </div>
                        </div>
                        {/* You would add pagination rendering here if needed */}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default PublicBlogIndex;
