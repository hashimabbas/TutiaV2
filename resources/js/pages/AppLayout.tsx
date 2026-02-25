// pages/AppLayout.tsx (or your actual layout file path)
import React, { useEffect } from 'react'; // Import useEffect
// Removed react-router-dom imports as Inertia handles routing
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import OfferList from './components/OfferList';
// import OfferDetail from './components/OfferDetail';

import { Head, Link, usePage, router } from '@inertiajs/react'; // Import usePage and router
import { Toaster } from '@/components/ui/sonner';
import axios from 'axios'; // Import axios (or use fetch)
import { route } from 'ziggy-js';

interface AppLayoutProps {
    children: React.ReactNode;
    title?: string;
    // You might receive auth data here if shared globally
    // auth?: { user: User };
}

// --- Visit Tracking Hook (or integrate directly) ---
const useVisitTracking = () => {
    const { url } = usePage();
    const lastTrackedUrl = React.useRef<string | null>(null);

    const trackVisit = (currentUrl: string) => {
        const referrerUrl = document.referrer;

        // Skip if we already tracked this URL in the current component lifecycle
        if (lastTrackedUrl.current === currentUrl) {
            return;
        }

        lastTrackedUrl.current = currentUrl;
        console.log(`Tracking visit: URL=${currentUrl}`);

        axios.post('/api/track-visit', {
            page_url: currentUrl,
            referrer_url: referrerUrl || null,
        })
            .catch(error => {
                console.error('Failed to track visit:', error.response?.data || error.message);
            });
    };

    useEffect(() => {
        // 1. Track initial page load
        trackVisit(window.location.href);

        // 2. Track subsequent Inertia navigation
        const removeFinishListener = router.on('finish', () => {
            // Ensure URL is updated in browser before tracking
            setTimeout(() => {
                trackVisit(window.location.href);
            }, 100);
        });

        return () => {
            removeFinishListener();
        };
    }, []); // Register listener once on mount
};

// --- End Visit Tracking Hook ---


const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {

    // Activate the visit tracking logic within the layout
    useVisitTracking();

    return (
        <>
            {/* Use the title prop passed by Inertia Page */}
            <Head title={title || 'Your App'} />
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900"> {/* Added dark mode basic bg */}
                <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    {/* Placeholder for your navigation */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="shrink-0 flex items-center">
                                    {/* Your Logo/Brand */}
                                    <Link href="/">
                                        <span className='text-xl font-semibold text-gray-800 dark:text-gray-200'>MyApp</span>
                                    </Link>
                                </div>
                                <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                    {/* Example Inertia Links */}
                                    <Link href={route('dashboard')} className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out">
                                        Dashboard
                                    </Link>
                                    <Link href={route('crm.offers.index')} className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out">
                                        Offers
                                    </Link>
                                    <Link href={route('messages.index')} className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out">
                                        Messages
                                    </Link>
                                    {/* Add other nav links */}
                                </div>
                            </div>
                            {/* Add Right side of Navbar (e.g., User Dropdown) here */}
                        </div>
                    </div>
                </nav>

                {/* Page Heading (Optional) */}
                {title && (
                    <header className="bg-white dark:bg-gray-800 shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                                {title} {/* Display title if provided */}
                            </h2>
                        </div>
                    </header>
                )}


                {/* Page Content */}
                {/* Removed explicit max-width/padding here as it's often handled by the child page component */}
                <main className="py-12">
                    {children} {/* Render the actual Page component here */}
                </main>

                <Toaster /> {/* For toast notifications */}
            </div>
        </>
    );
};

export default AppLayout;
