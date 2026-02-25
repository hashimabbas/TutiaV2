import React, { ReactNode, useEffect } from 'react'; // <-- IMPORT useEffect
import { Head, Link } from '@inertiajs/react';
import PublicNav from './PublicNav';
import PublicFooter from './PublicFooter';
import PublicTopBar from './PublicTopBar';
import Navbar from './Navbar';

// Define Props for Auth status and possible flash message
interface PublicLayoutProps {
    auth: { user: any | null }; // Assuming 'user' might be present if auth middleware runs
    flash: { success?: string; error?: string };
    children: ReactNode;
    title?: string;
}

// Map the static CSS/Library links into an array for Inertia's <Head>
const publicAssetPaths = [
    // Global CSS
    'css/bootstrap.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css',
    'lib/flaticon/font/flaticon.css',
    'lib/animate/animate.min.css',
    'lib/owlcarousel/assets/owl.carousel.min.css',
    'css/style.css',
];

export default function PublicLayout({ children, title, auth, flash }: PublicLayoutProps) {
    useEffect(() => {
        // --- JAVASCRIPT FIX TO ENSURE NAV IS VISIBLE ---
        // If jQuery is loaded (which it should be in your setup), use the Bootstrap JS collapse method.
        // If not, force the 'navbarCollapse' element to show by removing the 'collapse' class.
        if (typeof window !== 'undefined') {
            const navElement = document.getElementById('navbarCollapse');
            if (navElement) {
                // Ensure the menu is visible on non-mobile by removing the 'collapse' class
                navElement.classList.remove('collapse');

                // If you are using jQuery, the ideal way is:
                // if (typeof (window as any).jQuery !== 'undefined') {
                //     (window as any).jQuery('#navbarCollapse').collapse('show');
                // }
            }
        }
    }, []); // Run only once on mount
    return (
        <>
            <Head>
                {/* Dynamic Title */}
                <title>{title ? `${title} | Tutia` : 'Tutia'}</title>

                {/* Static Meta Tags */}
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="csrf-token" content={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
                <meta content="TUTIA is leading Sudanese company providing information technology services consulting , implementing and support. It envisioned and instigated the adoption of the flexible technology practices to operate efficiently and produce more value" name="description" />
                <link href="/images/logo.jpg" rel="icon" />

                {/* CSS Imports (Inertia handles <link> tags here) */}
                {publicAssetPaths.map(href => (
                    <link key={href} href={href} rel="stylesheet" />
                ))}

                {/* Inline Styles (Moved from HTML) */}
                <style>{`
                    .header-btn { border: 2px solid #FDBE33 !important; }
                    .header-btn:hover { box-shadow: inset 0 0 0 30px #FDBE33 !important; }
                    @media(max-width: 767px) {
                        .carousel .carousel-img { height: 500px !important; }
                        .footer-in-phone { text-align: left !important; }
                        .hero-heading { font-size: 1.5rem !important; }
                        .about-img { display: none; }
                        .carousel { margin-bottom: 0 !important; }
                    }
                `}</style>
            </Head>

            <>
                {/* --- Session Messages --- */}
                {flash.success && (
                    <div className="alert alert-success text-center" style={{ fontSize: '2rem' }} role="alert">
                        {flash.success}
                    </div>
                )}
                {/* --- End Session Messages --- */}

                <PublicTopBar />
                {/* <PublicNav auth={auth} /> */}
                <Navbar />

                <main>
                    {children}
                </main>

                <PublicFooter />

                {/* --- JavaScript Libraries (External Scripts) --- */}
                {/* NOTE: If these scripts need to run React context, they must be wrapped or initialized correctly.
                   For now, they are placed at the end of the body as in the original HTML.
                   You would typically load them via Laravel's asset pipeline or <script> tags in app.blade.php.
                   For this conversion, we assume they are globally available or handled externally.
                */}

                {/* Tawk.to Script (Placeholder/Should be managed by a custom script file) */}
                {/* <div dangerouslySetInnerHTML={{ __html: TAWK_TO_SCRIPT_STRING }} /> */}

            </>
        </>
    );
}
