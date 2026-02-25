import React, { useEffect } from 'react'; // <-- IMPORT useEffect
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js'; // Use route helper

interface PublicNavProps {
    auth: { user: any | null };
}

const initializeBootstrapCollapse = () => {
    if (typeof window.jQuery === 'undefined' || typeof (window.jQuery.fn as any).collapse === 'undefined') {
        console.warn("Bootstrap JS is not fully loaded. Navbar toggle will not work.");
        return;
    }
    const $ = window.jQuery;

    // 1. Manually initialize the collapse functionality for the toggler button
    // This re-attaches the Bootstrap JS event handler to the button's data-toggle/data-target.
    // It's safe to call this multiple times.
    $('[data-toggle="collapse"]').each(function () {
        const target = $(this).data('target');
        // Check if the target exists before attempting to initialize
        if ($(target).length) {
            $(this).off('click').on('click', function (e) {
                e.preventDefault();
                $(target).collapse('toggle');
            });
        }
    });
};


export default function PublicNav({ auth }: PublicNavProps) {
    // Re-initialize Bootstrap Collapse logic whenever this component mounts
    useEffect(() => {
        initializeBootstrapCollapse();
    }, []);

    // Helper to use Laravel's url() equivalent
    const url = (path: string) => `/${path.replace(/^\//, '')}`;

    // Check if the user is authenticated (to show CRM link)
    const isAuthenticated = !!auth.user;

    return (
        <div className="navbar navbar-expand-lg bg-dark navbar-dark">
            <div className="container-fluid">
                {/* Logo and Brand */}
                <Link href={route('home')} style={{ fontSize: '1.8rem' }} className="navbar-brand">
                    <img src="images/logo.png" alt="Logo" width="40px" height="40px" style={{ borderRadius: '30px' }} />
                </Link>
                <button
                    type="button"
                    className="navbar-toggler"
                    // CRITICAL: We rely on data-toggle="collapse" and data-target="#navbarCollapse"
                    // for the JS above to target the correct element.
                    data-toggle="collapse"
                    data-target="#navbarCollapse"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                    <div className="navbar-nav ml-auto">
                        <Link href={route('home')} className="nav-item nav-link">Home</Link>

                        {/* Services Dropdown (Converted to React structure) */}
                        <div className="nav-item dropdown">
                            <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">Services</a>
                            <div className="dropdown-menu">
                                <Link href={url('/ecommerce')} className="dropdown-item">E-Commerce</Link>
                                <Link href={url('/sms')} className="dropdown-item">Bulk SMS</Link>
                                <Link href={url('/web')} className="dropdown-item">Web Development</Link>
                                <Link href={url('/connectivity')} className="dropdown-item">Connectivity Solution</Link>
                                <Link href={url('/ict')} className="dropdown-item">ICT Consulting</Link>
                                <Link href={url('/call_center')} className="dropdown-item">Call Center</Link>
                                <Link href={url('/ticketing')} className="dropdown-item">Ticketing System</Link>
                                <Link href={url('/vpn')} className="dropdown-item">VPN</Link>
                                <Link href={url('/payment')} className="dropdown-item">Payment Gateway</Link>
                                <Link href={url('/erp')} className="dropdown-item">ERP System</Link>
                            </div>
                        </div>

                        <Link href={route('offers.show.offers')} className="nav-item nav-link">Offers</Link>
                        <Link href={route('contact')} className="nav-item nav-link">Contact</Link>
                        {/* CRM LOGIN/DASHBOARD LINK */}
                        {/* {isAuthenticated ? (
                            <Link href={route('dashboard')} className="nav-item nav-link header-btn ml-lg-3">
                                CRM Dashboard
                            </Link>
                        ) : (
                            <Link href={route('login')} className="nav-item nav-link header-btn ml-lg-3">
                                CRM Login
                            </Link>
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    );
}
