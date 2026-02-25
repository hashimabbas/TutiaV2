import React from 'react';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface PageHeaderProps {
    title: string;
    breadcrumbs: { label: string; url?: string }[];
    // NOTE: If you need to change the background image per page,
    // you'll need to pass a prop for that and adjust the style attribute.
}

export default function ServicesPageHeader({ title, breadcrumbs }: PageHeaderProps) {
    return (
        // <!-- Page Header Start -->
        <div className="page-header">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h2>{title}</h2>
                    </div>
                    <div className="col-12">
                        {breadcrumbs.map((item, index) => (
                            <React.Fragment key={index}>
                                {item.url ? (
                                    <Link href={item.url}>{item.label}</Link>
                                ) : (
                                    <a href="#">{item.label}</a> // Use <a> tag for non-Inertia link or placeholder
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
        // <!-- Page Header End -->
    );
}
