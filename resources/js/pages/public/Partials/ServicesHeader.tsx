import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
    title: string;
    breadcrumbs: { label: string; url?: string }[];
}

export default function ServicesPageHeader({ title, breadcrumbs }: PageHeaderProps) {
    const { i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    return (
        // <!-- Page Header Start -->
        <div className="page-header" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="container">
                <div className="row">
                    <div className={cn(
                        "col-12",
                        isRtl ? "text-right" : "text-left"
                    )}>
                        <h2 className="font-oswald">{title}</h2>
                    </div>
                    <div className={cn(
                        "col-12",
                        isRtl ? "text-right" : "text-left"
                    )}>
                        {breadcrumbs.map((item, index) => (
                            <React.Fragment key={index}>
                                {item.url ? (
                                    <Link href={item.url}>{item.label}</Link>
                                ) : (
                                    <span>{item.label}</span>
                                )}
                                {index < breadcrumbs.length - 1 && (
                                    <span className="mx-2">{isRtl ? '/' : '/'}</span>
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
