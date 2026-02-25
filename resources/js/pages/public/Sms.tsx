import React from 'react';
import { usePage } from '@inertiajs/react';

import PublicContactForm from './Partials/PublicContactForm'; // Reused Contact Form
import PublicLayout from './layouts/PublicLayout';
import ServicesPageHeader from './Partials/ServicesHeader';
import BulkSMSContent from './Partials/Services/BulkSMSContent';

export default function Sms(props: any) {
    const { auth, flash } = usePage().props;

    // Breadcrumbs data for the PageHeader
    const breadcrumbs = [
        { label: 'Home', url: route('home') },
        { label: 'Services' },
        { label: 'Bluk SMS' }
    ];

    return (
        <PublicLayout title="Bulk SMS" auth={auth} flash={flash}>

            {/* 1. PAGE HEADER */}
            {/* NOTE: You may need to create a specific CSS rule for the 'sms' page header
               if its background image needs to be unique, otherwise it uses the default one. */}
            <ServicesPageHeader title="Bluk SMS" breadcrumbs={breadcrumbs} />

            {/* 2. MAIN CONTENT */}
            <BulkSMSContent />

            {/* 3. CONTACT SECTION */}
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
