import React, { useState } from 'react';
import { cn } from '@/lib/utils';

// Define the static content structure
const aboutContent = {
    about: "TUTIA is leading Sudanese company providing information technology services consulting , implementing and support. It envisioned and instigated the adoption of the flexible technology practices to operate efficiently and produce more value. \nAt Tutia we live by a set of values that drive our daily behavior and enable us to achieve our vision and goals.",
    mission: "We will continue to challenge ourselves and set new performance standards by investing in the future of our Customers and seeking knowledge and innovation in order to exceed expectations in serving our community.",
    vision: "Our Vision To remain the Preferred ICT & Trading Company in Sudan, leading the Technology Market Growth in Sudan and expanding in the region within adjacent countries, driving economic prosperity, and providing the highest Value for all our stakeholders through operational excellence.",
};

const PARALLAX_IMAGE_CLASS = 'about-img-bg';

export default function PublicAbout() {
    const [activeTab, setActiveTab] = useState<'about' | 'mission' | 'vision'>('about');

    const handleTabClick = (tab: 'about' | 'mission' | 'vision') => (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent default link behavior
        setActiveTab(tab);
    };

    return (
        // <!-- About Start -->
        <div className="about">
            <div className="container">
                <div className="row align-items-center">

                    {/* Left Column: Image */}
                    <div className="col-lg-6">
                        {/*
                          The image is now loaded via the CSS class 'about-img-bg'.
                          The height is set by the CSS class 'about-img'.
                          No inline styles used.
                        */}
                        <div
                            className={cn("about-img", PARALLAX_IMAGE_CLASS)}
                        ></div>
                    </div>

                    {/* Right Column: Text and Tabs */}
                    <div className="col-lg-6">
                        {/* Note: The original HTML had style="margin: 50px 0;" here, which we retain as a final clean up: */}
                        <div className="section-header text-tutia" style={{ margin: '50px 0' }}>
                            <p className="h3">About Us</p>
                        </div>

                        <div className="about-tab">
                            {/* Tab Navigation (nav-pills) */}
                            <ul className="nav nav-pills nav-justified">
                                <li className="nav-item">
                                    <a
                                        className={cn("nav-link", { 'active': activeTab === 'about' })}
                                        href="#tab-content-1"
                                        onClick={handleTabClick('about')}
                                    >
                                        About
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className={cn("nav-link", { 'active': activeTab === 'mission' })}
                                        href="#tab-content-2"
                                        onClick={handleTabClick('mission')}
                                    >
                                        Mission
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className={cn("nav-link", { 'active': activeTab === 'vision' })}
                                        href="#tab-content-3"
                                        onClick={handleTabClick('vision')}
                                    >
                                        Vision
                                    </a>
                                </li>
                            </ul>

                            {/* Tab Content */}
                            <div className="tab-content">
                                {/* About Content */}
                                <div
                                    id="tab-content-1"
                                    className={cn("container tab-pane", { 'active show': activeTab === 'about' })}
                                >
                                    {aboutContent.about.split('\n').map((line, index) => (
                                        <React.Fragment key={index}>
                                            {line}
                                            {index < aboutContent.about.split('\n').length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </div>

                                {/* Mission Content */}
                                <div
                                    id="tab-content-2"
                                    className={cn("container tab-pane", { 'active show': activeTab === 'mission', 'fade': activeTab !== 'mission' })}
                                >
                                    {aboutContent.mission}
                                </div>

                                {/* Vision Content */}
                                <div
                                    id="tab-content-3"
                                    className={cn("container tab-pane", { 'active show': activeTab === 'vision', 'fade': activeTab !== 'vision' })}
                                >
                                    {aboutContent.vision}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        // <!-- About End -->
    );
}
