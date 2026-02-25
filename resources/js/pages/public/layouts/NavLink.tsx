// resources/js/Components/NavLink.tsx

// 1. Import the specific props type from Inertia
import { Link, usePage, type InertiaLinkProps } from '@inertiajs/react';
import clsx from 'clsx';

// 2. Extend InertiaLinkProps instead of HTMLAttributes
interface NavLinkProps extends InertiaLinkProps {
    active?: boolean;
}

export function NavLink({ href, className, children, active, ...props }: NavLinkProps) {
    const { url } = usePage();
    // Use the passed 'active' prop if it exists, otherwise determine automatically
    const isActive = active === true || (active !== false && url.startsWith(href));

    return (
        <Link
            href={href}
            className={clsx(
                'inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none',
                isActive
                    ? 'border-b-2 border-indigo-400 text-gray-900 dark:text-gray-100'
                    : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-300',
                className,
            )}
            {...props}
        >
            {children}
        </Link>
    );
}
