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
    const { auth, flash } = usePage<any>().props;

    // --- INTEGRATE SCROLLREVEAL ---
    useScrollRevealAnimations();
    // --- END INTEGRATE SCROLLREVEAL ---
    // Helper to map Laravel's url() equivalent
    const url = (path: string) => `/${path.replace(/^\//, '')}`;

    return (
        <PublicLayout title="Home" auth={auth} flash={flash}>
            {/* 1. HERO / CAROUSEL SECTION */}
            <PublicHeroEmbla />
            <React.Suspense fallback={<div className="h-40 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tutia"></div></div>}>
                {/* 2. ABOUT */}
                <PublicAbout />

                {/* 3. CORE VALUES */}
                <PublicValues />

                {/* 4. SERVICES */}
                <PublicServiceCards />

                {/* 5. CUSTOMERS & PARTNERS */}
                <PublicCustomerCarousels />

                {/* 6. TESTIMONIALS */}
                <PublicTestimonials />

                {/* 7. CONTACT */}
                <PublicContactForm />
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
