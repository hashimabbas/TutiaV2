import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
}

function cleanPaginationLabel(label: string): string {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = label;
    return tempDiv.textContent || tempDiv.innerText || "";
}

export const Pagination: React.FC<PaginationProps> = ({ links }) => {
    if (links.length <= 3) {
        return null;
    }

    return (
        <div className="flex items-center justify-center space-x-1">
            {links.map((link, index) => (
                <Button
                    key={index}
                    asChild
                    variant={link.active ? "default" : "outline"}
                    size="sm"
                    disabled={!link.url}
                    className={cn(!link.url && "cursor-not-allowed opacity-50")}
                >
                    {link.url ? (
                        <Link href={link.url} preserveScroll preserveState>
                            {cleanPaginationLabel(link.label)}
                        </Link>
                    ) : (
                        <span>{cleanPaginationLabel(link.label)}</span>
                    )}
                </Button>
            ))}
        </div>
    );
};
