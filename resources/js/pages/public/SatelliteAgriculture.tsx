import React from 'react';
import { usePage } from '@inertiajs/react';

import PublicContactForm from './Partials/PublicContactForm';
import PublicLayout from './layouts/PublicLayout';
import ServicesPageHeader from './Partials/ServicesHeader';
import SatelliteAgricultureContent from './Partials/Services/SatelliteAgricultureContent';

export default function SatelliteAgriculture(props: any) {
  const { auth, flash } = usePage<{ auth: any; flash: any }>().props;

  const breadcrumbs = [
    { label: 'Home', url: route('home') },
    { label: 'Services' },
    { label: 'Satellite Agriculture' }
  ];

  return (
    <PublicLayout title="Satellite Agriculture" auth={auth} flash={flash}>

      {/* 1. PAGE HEADER */}
      <ServicesPageHeader title="Satellite-Based Earth Agriculture" breadcrumbs={breadcrumbs} />

      {/* 2. MAIN CONTENT */}
      <SatelliteAgricultureContent />

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
