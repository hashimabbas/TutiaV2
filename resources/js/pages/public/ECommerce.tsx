import React from 'react';
import { usePage } from '@inertiajs/react';
import ECommerceContent from './Partials/Services/ECommerceContent';
import PublicContactForm from './Partials/PublicContactForm'; // Assuming you use the full form on this page
import PublicLayout from './layouts/PublicLayout';
import ServicesPageHeader from './Partials/ServicesHeader';

export default function ECommerce(props: any) {
    const { auth, flash } = usePage().props;

    // Breadcrumbs data for the PageHeader
    const breadcrumbs = [
        { label: 'Home', url: route('home') },
        { label: 'Services' },
        { label: 'E-commerce' }
    ];

    return (
        <PublicLayout title="E-commerce" auth={auth} flash={flash}>

            {/* 1. PAGE HEADER */}
            <ServicesPageHeader title="E-commerce" breadcrumbs={breadcrumbs} />

            {/* 2. MAIN CONTENT */}
            <ECommerceContent />

            {/* 3. CONTACT SECTION (Re-used on single pages) */}
            <PublicContactForm />

            {/* 4. WHATSAPP CHAT (Often part of the main layout, but included here for full code compliance) */}
            <div className="whatsup-chat">
                <a href="https://wa.me/249912329449" target="_blank">
                    <img src="images/whatsapp-icon-.jpg" width="60px" height="60px" alt="whatsup-logo" />
                </a>
            </div>

        </PublicLayout>
    );
}
