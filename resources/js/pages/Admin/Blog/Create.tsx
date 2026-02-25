import React from 'react';
import { usePage } from '@inertiajs/react';
import BlogForm from './BlogForm';

const BlogCreate: React.FC = () => {
    const { props } = usePage();
    // Pass only required props to the form component
    return <BlogForm post={undefined} breadcrumbs={props.breadcrumbs} />;
}

export default BlogCreate;
