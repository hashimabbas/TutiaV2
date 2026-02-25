import React from 'react';
import { usePage } from '@inertiajs/react';
import PublicContactForm from './Partials/PublicContactForm'; // Reused Contact Form
import PublicLayout from './layouts/PublicLayout';
import ServicesPageHeader from './Partials/ServicesHeader';
import VpnContent from './Partials/Services/VpnContent';

export default function Vpn(props: any) {
    const { auth, flash } = usePage().props;

    // Breadcrumbs data for the PageHeader
    const breadcrumbs = [
        { label: 'Home', url: route('home') },
        { label: 'Services' },
        { label: 'TUTIA VPN' }
    ];

    return (
        <PublicLayout title="TUTIA VPN" auth={auth} flash={flash}>

            {/* 1. PAGE HEADER */}
            <ServicesPageHeader title="TUTIA VPN" breadcrumbs={breadcrumbs} />

            {/* 2. MAIN CONTENT */}
            <VpnContent />

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
