import React from 'react';

// Define the static data structure for the values
const valuesData = [
    {
        title: 'Trust',
        img: 'images/values/trust.png',
        flaticon: 'flaticon-trust',
        desc: '"We know that trust must be earned, so we strive every day to act in ways to build up trust in our clients, ourselves and others."',
        animationClass: 'trust-icon-animation',
        textAnimationClass: 'trust-animation', // <-- Added to data structure
    },
    {
        title: 'Commitment',
        img: 'images/values/commitment.png',
        flaticon: '',
        desc: 'We recognize the importance of providing excellent services and creating an environment where commitment is part of the fabric of who we are!',
        animationClass: 'commitment-icon-animation',
        textAnimationClass: 'commitment-animation', // <-- Added to data structure
    },
    {
        title: 'Integrity',
        img: 'images/values/integration.png',
        flaticon: '',
        desc: 'We value our reputation and conduct our business with Integrity, honesty, and respect for each individual. We will be as open as we can be with our clients and our people',
        animationClass: 'integrity-icon-animation',
        textAnimationClass: 'integrity-animation', // <-- Added to data structure
    },
    {
        title: 'Result Orientation',
        img: 'images/values/stadistics.png',
        flaticon: '',
        desc: 'We seek to deliver excellent results and we ansure our clients and customers that our results will absolutely exceed their expectations',
        animationClass: 'result-icon-animation',
        textAnimationClass: 'result-animation', // <-- Added to data structure
    },
];


export default function PublicValues() {
    return (
        // <!-- Our Values Start -->
        <div className="service">
            <div className="container">
                <div className="section-header text-center">
                    <p className='h3' style={{ fontSize: "2rem", fontWeight: "700", color: "#2980b9" }}>Our Values</p>
                    <p className='h4' style={{ color: "#34495e", fontSize: "1.2rem" }}>Our values express the expectations of ourselves and others to identify how we conduct business decisions and action</p>
                </div>

                <div className="row">
                    {valuesData.map((value, index) => (
                        <div key={index} className="col-lg-4 col-md-6">
                            <div className="service-item">

                                {/* 1. ICON BLOCK (.service-icon) - Targets: [trust-icon-animation] */}
                                <div className="service-icon">
                                    <img
                                        src={value.img}
                                        className={value.animationClass} // <-- trust-icon-animation class added here
                                        alt={value.title}
                                        style={{ width: '60px', height: '60px', marginTop: '5px' }}
                                    />
                                    {value.flaticon && (
                                        <i className={value.flaticon} style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}></i>
                                    )}
                                </div>

                                {/* 2. TEXT BLOCK (.service-text) - Targets: [trust-animation] */}
                                {/* FIX: Add the textAnimationClass here to enable the second ScrollReveal rule */}
                                <div className={`service-text ${value.textAnimationClass}`}>
                                    <p className="h3">{value.title}</p>
                                    <p>{value.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        // <!-- Our Values End -->
    );
}
