import React from 'react';
import { useOwlCarousel } from '@/hooks/useOwlCarousel'; // <-- IMPORT THE HOOK


export default function PublicHero() {

    // --- INITIALIZE CAROUSEL ---
    // The selector targets the class name you used in the JSX
    useOwlCarousel('.owl-carousel', {
        loop: true,
        margin: 10,
        nav: false,
        dots: true,
        autoplay: true, // Example settings
        items: 1,
        // Add all your specific Owl Carousel settings here
    });
    // --- END INITIALIZE CAROUSEL ---

    return (
        // <!-- Carousel Start -->
        <div className="carousel">
            <div className="container-fluid">
                {/*
                  NOTE: The 'owl-carousel' class requires an external JavaScript library
                  to initialize and run. This library must be loaded via your main
                  app.blade.php or loaded dynamically, and its initialization code
                  must be run once the component mounts (e.g., via a useEffect hook).
                */}
                <div className="owl-carousel">
                    <div className="carousel-item">
                        <div className="carousel-img">
                            <img src="images/workspace.jpg" alt="Image" />
                        </div>
                        <div className="carousel-text">
                            {/* In React, inline styles use camelCase and objects */}
                            <h1 style={{ fontSize: '2rem' }} className="hero-heading">TUTIA Trading Services</h1>
                            <p>
                                Unlimited Trust
                            </p>
                            <div className="carousel-btn">
                                <a className="btn btn-custom header-btn" href="https://play.google.com/store/apps/details?id=com.nilogy.matgertutia" target="_blank">
                                    {/* Removed space from inside the span */}
                                    <span >Matger Tutia</span>
                                    {/* Inline style converted to JSX format */}
                                    <i className="fab fa-android fa-2x " style={{ color: '#a4c639' }}></i>
                                </a>
                                <a className="btn btn-custom header-btn" href="https://apps.apple.com/us/app/%D9%85%D8%AA%D8%AC%D8%B1-%D8%AA%D9%88%D8%AA%D9%8A%D8%A7-matger-tutia/id1460172160" target="_blank">
                                    Matger Tutia
                                    <i className="fab fa-apple fa-2x"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        // <!-- Carousel End -->
    );
}
