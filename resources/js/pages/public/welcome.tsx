import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import PublicLayout from './layouts/PublicLayout';
const PublicAbout = React.lazy(() => import('./Partials/PublicAbout'));
const PublicValues = React.lazy(() => import('./Partials/PublicValues'));
const PublicServiceCards = React.lazy(() => import('./Partials/PublicServiceCards'));
const PublicCustomerCarousels = React.lazy(() => import('./Partials/PublicCustomerLogos'));
const PublicTestimonials = React.lazy(() => import('./Partials/PublicTestimonials'));
const PublicContactForm = React.lazy(() => import('./Partials/PublicContactForm'));
import { useScrollRevealAnimations } from '@/hooks/useScrollReveal';
import PublicHeroEmbla from './Partials/PublicHeroEmbla';


export default function Welcome(props: any) {
    const { auth, flash } = usePage().props;

    // --- INTEGRATE SCROLLREVEAL ---
    useScrollRevealAnimations();
    // --- END INTEGRATE SCROLLREVEAL ---
    // Helper to map Laravel's url() equivalent
    const url = (path: string) => `/${path.replace(/^\//, '')}`;

    return (
        <PublicLayout title="Home" auth={auth} flash={flash}>
            {/* 1. HERO / CAROUSEL SECTION */}
            <PublicHeroEmbla />
            <React.Suspense fallback={<div className="h-20 flex items-center justify-center p-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tutia"></div></div>}>
                {/* 2. ABOUT START */}
                <PublicAbout />
                {/* ABOUT END */}

                {/* 3. Our (VALUES) START */}
                <PublicValues />
                {/* Our VALUES END */}

                {/* 4. EVENT (SERVICES) START */}
                <PublicServiceCards />
                {/* EVENT END */}

                {/* 5. CUSTOMER START */}
                <div className="causes">
                    <PublicCustomerCarousels />
                </div>
                {/* CUSTOMER END */}

                {/* 6. PARTNER START */}
                <div className="causes" style={{ marginTop: '167px' }}>
                    {/* ... (Your Partner Carousel JSX converted) ... */}
                </div>
                {/* PARTNER END */}

                {/* 7. TESTIMONIAL START */}
                <PublicTestimonials />
                {/* TESTIMONIAL END */}

                {/* 8. CONTACT START (Should link to the Contact Page) */}
                <PublicContactForm />
                {/* CONTACT END */}
            </React.Suspense>

            {/* --- Whatsup Chat (Often global in layout, but kept here for compliance) --- */}
            <div className="whatsup-chat">
                <a href="https://wa.me/249912329449" target="_blank">
                    <img src="images/whatsapp-icon-.jpg" width="60px" height="60px" alt="whatsup-logo" />
                </a>
            </div>
            {/* --- End Whatsup Chat --- */}

        </PublicLayout>
    );
}
