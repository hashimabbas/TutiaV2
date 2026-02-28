import React from 'react';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js'; // Use route helper

export default function PublicFooter() {
    // Helper to use Laravel's url() equivalent
    const url = (path: string) => `/${path.replace(/^\//, '')}`;

    return (
        <div className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-6">
                        <div className="footer-contact">
                            <h2>Contact Info</h2>
                            {/* ... contact details ... */}
                            <p><i className="fa fa-map-marker-alt"></i>Khartoum - Sudan| P.O Box: 77003</p>
                            <p><i className="fa fa-phone-alt"></i><a href="tel:+249912329449" style={{ color: '#FFF' }}>+249912329449</a></p>
                            <p><i className="fa fa-phone-alt"></i><a href="tel:+249965502009" style={{ color: '#FFF' }}>+249965502009</a></p>
                            <p><a href="mailto: info@tutiasd.com" target="_blank" style={{ color: '#FFF' }} rel="noopener noreferrer"><i className="fa fa-envelope"></i>info@tutiasd.com</a></p>
                            <div className="footer-social">
                                {/* ... social links ... */}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="footer-link">
                            <h2>Popular Links</h2>
                            <Link href={route('contact')} >Contact Us</Link>
                            <a href="https://apps.apple.com/us/app/%D9%85%D8%AA%D8%AC%D8%B1-%D8%AA%D9%88%D8%AA%D9%8A%D8%A7-matger-tutia/id1460172160" target="_blank">Matger Tutia Apple App</a>
                            <a href="https://play.google.com/store/apps/details?id=com.nilogy.matgertutia" target="_blank">Matger Tutia Android App</a>
                            <a href="http://sms.matger-tutia.com/" target="_blank">SMS-Matger-TUTIA</a>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div className="footer-link">
                            <h2>Popular Services</h2>
                            <Link href={url('/satellite-agriculture')}>Satellite Agriculture</Link>
                            <a href="https://matger-tutia.com/">Matger-TUTIA</a>
                            <a href="http://sms.matger-tutia.com/">Bulk SMS</a>
                            <Link href={url('/web')}>Web Development</Link>
                            <Link href={url('/ict')}>ICT Consultancey</Link>
                            <Link href={url('/connectivity')}>Connectivity Solution</Link>
                            <Link href={url('/erp')}>ERP Systems</Link>
                            <Link href={url('/call_center')}>Call Center</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container copyright">
                <div className="row">
                    <div className="col-md-6">
                        {/* Note: date('Y') must be passed as a prop or hardcoded in pure React */}
                        <p className="footer-in-phone"><a href="/">TUTIA</a> All Right Reserved &copy; {new Date().getFullYear()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
