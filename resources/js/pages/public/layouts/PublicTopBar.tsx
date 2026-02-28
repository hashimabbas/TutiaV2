import React from 'react';
import { Link } from '@inertiajs/react';

export default function PublicTopBar() {
    return (
        <div className="top-bar d-none d-md-block" style={{ backgroundColor: "#603a38" }}>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-8">
                        <div className="top-bar-left">
                            <div className="text">
                                <i className="fa fa-phone-alt"></i>
                                <p>+249912329449</p>
                            </div>
                            <div className="text">
                                <i className="fa fa-envelope"></i>
                                <p>info@tutiasd.com</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="top-bar-right">
                            <div className="social">
                                <a href="https://www.linkedin.com/in/tutia-sudan-003625356/" target="_blank"><i className="fab fa-linkedin-in"></i></a>
                                <a href="https://web.facebook.com/TUTIA.Sd" target="_blank"><i className="fab fa-facebook-f"></i></a>
                                <a href="https://play.google.com/store/apps/details?id=com.nilogy.matgertutia" target="_blank"><i className="fab fa-android"></i></a>
                                <a href="https://apps.apple.com/us/app/%D9%85%D8%AA%D8%AC%D8%B1-%D8%AA%D9%88%D8%AA%D9%8A%D8%A7-matger-tutia/id1460172160" target="_blank"><i className="fab fa-apple"></i></a>
                                <a href=" https://www.instagram.com/tutia_sudan/" target="_blank"><i className="fab fa-instagram"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
