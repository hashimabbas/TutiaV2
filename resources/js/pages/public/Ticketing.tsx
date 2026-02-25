import React from 'react';
import { usePage } from '@inertiajs/react';

import PublicContactForm from './Partials/PublicContactForm'; // Reused Contact Form
import PublicLayout from './layouts/PublicLayout';
import ServicesPageHeader from './Partials/ServicesHeader';
import TicketingContent from './Partials/Services/TicketingContent';

export default function Ticketing(props: any) {
    const { auth, flash } = usePage().props;

    // Breadcrumbs data for the PageHeader
    const breadcrumbs = [
        { label: 'Home', url: route('home') },
        { label: 'Services' },
        { label: 'Ticketing System' }
    ];

    return (
        <PublicLayout title="Ticketing System" auth={auth} flash={flash}>

            {/* 1. PAGE HEADER */}
            <ServicesPageHeader title="Ticketing System" breadcrumbs={breadcrumbs} />

            {/* 2. MAIN CONTENT */}
            <TicketingContent />

            {/* 3. CONTACT SECTION */}
            <PublicContactForm />

            {/* 4. WHATSAPP CHAT */}
            <div className="whatsup-chat">
                <a href="https://wa.me/249912329449" target="_blank">
                    <img src="images/whatsapp-icon-.jpg" width="60px" height="60px" alt="whatsup-logo" />
                </a>
            </div>

        </PublicLayout>
    );
}
