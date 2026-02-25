// resources/js/components/TutiaLogo.tsx

import { SVGAttributes } from 'react';
import { Link } from '@inertiajs/react';

export default function TutiaLogo(props: SVGAttributes<SVGElement>) {
    return (
        <Link href={route('home')} className="flex items-center space-x-2">
            <img
                src="/images/logo.jpg" // <-- Use the path to your main logo file
                alt="TUTIA Logo"
                // Use CSS classes or inline styles to control size
                style={{ height: '40px', width: '40px', borderRadius: '30px' }}
                {...props}
            />
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">TUTIA</span>
        </Link>
    );
}
