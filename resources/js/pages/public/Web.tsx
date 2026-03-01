import React from 'react';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import PublicContactForm from './Partials/PublicContactForm'; // Reused Contact Form
import PublicLayout from './layouts/PublicLayout';
import ServicesPageHeader from './Partials/ServicesHeader';
import WebDevContent from './Partials/Services/WebDevContent';

export default function Web(props: any) {
    const { auth, flash } = usePage().props;
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    // Breadcrumbs data for the PageHeader
    const breadcrumbs = [
        { label: t('Home'), url: route('home') },
        { label: t('Services') },
        { label: t('Web Development') }
    ];

    return (
        <PublicLayout title={t("Web Development")} auth={auth} flash={flash}>

            {/* 1. PAGE HEADER */}
            <ServicesPageHeader title={t("Web Development")} breadcrumbs={breadcrumbs} />

            {/* 2. MAIN CONTENT */}
            <WebDevContent />

            {/* 3. CONTACT SECTION */}
            <PublicContactForm />

            {/* 4. WHATSAPP CHAT */}
            <div className="whatsup-chat" style={{ [isRtl ? 'left' : 'right']: '20px' }}>
                <a href="https://wa.me/249912329449" target="_blank">
                    <img src="images/whatsapp-icon-.jpg" width="60px" height="60px" alt="whatsup-logo" />
                </a>
            </div>

        </PublicLayout>
    );
}
