import React from 'react';
import { Link } from '@inertiajs/react';

// Define the complete data structure for all 10 services
const servicesData = [
    {
        title: 'E-commerce',
        url: '/ecommerce',
        img: 'images/services/e-commerce-gee.png',
        desc: 'Matger-TUTIA electronically selling of products on online services or over the Internet with several types of payment ....',
        animation: 'e-commerce-animation',
    },
    {
        title: 'Bluk SMS',
        url: '/sms',
        img: 'images/services/sms-bluk-service.jpg',
        desc: 'Now in this competitive business TUTIA SMS marketing services has expanded it wings and started delivering efﬁcient ....',
        animation: 'sms-animation',
    },
    {
        title: 'Web Development',
        url: '/web',
        img: 'images/services/web-design.jpg',
        desc: 'We design static and dynamic websites for all fields according to high quality principles and standards ...',
        animation: 'web-animation',
    },
    {
        title: 'ICT Consultancey',
        url: '/ict',
        img: 'images/services/business-gbf.jpg',
        desc: 'Our information and communications technology(ICT) consultancey enusures technology not only meets the requirements of ...',
        animation: 'ict-animation',
    },
    {
        title: 'Connectivity Solution',
        url: '/connectivity',
        img: 'images/services/network-g.jpg',
        desc: 'We use the latest and most advanced mobile coverage solutions approved by service provider with all network ....',
        animation: 'connectivity-animation',
    },
    {
        title: 'Ticketing System',
        url: '/ticketing',
        img: 'images/services/tickting.png',
        desc: 'TUTIA ticketing system is software that automates your sales, marketing, operations, and ﬁnances. Our software ......',
        animation: 'ticketing-animation',
    },
    {
        title: 'Payment Gateway',
        url: '/payment',
        img: 'images/services/payment.jpg',
        desc: 'With TUTIA Payment gateway work with all major credit card networks, digital wallets, and ecommerce platforms ...',
        animation: 'payment-animation',
    },
    {
        title: 'VPN',
        url: '/vpn',
        img: 'images/services/vpn_safety.jpg',
        desc: 'Using TUTIA VPNs is extremely important for any modern business which has a ﬂexible and mobile workforce. As .......',
        animation: 'vpn-animation',
    },
    {
        title: 'ERP Systems',
        url: '/erp',
        img: 'images/services/erp.jpg',
        desc: 'Increase control over your business with software designed to grow with you. Streamline key ...',
        animation: 'erp-animation',
    },
    {
        title: 'Call Center',
        url: '/call_center',
        img: 'images/services/call-centre.jpg',
        desc: 'When a call center modernizes beyond phone calls to support digital channels, it’s even more critical to integrate .....',
        animation: 'call-animation',
    },
];

export default function PublicServiceCards() {
    // Helper to map Laravel's url() equivalent
    const url = (path: string) => `/${path.replace(/^\//, '')}`;

    return (
        // <!-- Event Start -->
        <div className="event">
            <div className="container">
                <div className="section-header text-center">
                    {/* Note: All original inline styles are removed and rely on CSS/classes */}
                    <p>Our Services</p>
                </div>

                {/*
                  The original HTML used four separate <div class="row"> blocks.
                  For simplicity and React performance, we will use one loop
                  and rely on Bootstrap's col-lg-4 to wrap items into rows of three.
                */}
                <div className="row">
                    {servicesData.map((service, index) => (
                        <div key={index} className="col-lg-4">
                            {/* ScrollReveal Animation Class applied here */}
                            <div className={`event-item ${service.animation}`}>
                                <img src={service.img} width="350" height="233.333" alt={service.title} />
                                <div className="event-content">
                                    <div className="event-text">
                                        <h3>{service.title}</h3>
                                        <p>{service.desc}</p>
                                        <Link className="btn btn-custom" href={url(service.url)}>More</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/*
                  NOTE: If you must retain the 4 separate <div class="row"> blocks
                  for specific animation grouping in ScrollReveal, you will need
                  to manually segment the servicesData array into groups of 3/3/3/1.
                */}
            </div>
        </div>
        // <!-- Event End -->
    );
}
