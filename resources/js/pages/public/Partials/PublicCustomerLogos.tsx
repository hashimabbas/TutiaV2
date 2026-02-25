import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Declare the external jQuery type globally (for the useEffect hook)
declare global { interface Window { jQuery: any; $: any; } }

// --- Static Data ---
// Note: This is the full list inferred from your original HTML
const customerLogos = [
    { src: 'images/customers/u.s.embassy.png', alt: 'U.S. Embassy' },
    { src: 'images/customers/biritish-conucil.png', alt: 'British Council' },
    { src: 'images/customers/inifinity.png', alt: 'Infinity' },
    { src: 'images/customers/icrc.jpg', alt: 'ICRC' },
    { src: 'images/customers/hyundai.png', alt: 'Hyundai' },
    { src: 'images/customers/nissan.png', alt: 'Nissan' },
    { src: 'images/customers/jac.png', alt: 'JAC' },
    { src: 'images/customers/sudia-cargo.png', alt: 'Saudia Cargo' },
    { src: 'images/customers/bdr.png', alt: 'BDR' },
    { src: 'images/customers/sanofi.png', alt: 'Sanofi' },
    { src: 'images/customers/faisal.jpg', alt: 'Faisal' },
    { src: 'images/customers/financial.jpg', alt: 'Financial' },
    { src: 'images/customers/bayan.jpg', alt: 'Bayan' },
    { src: 'images/customers/noor-pay.png', alt: 'Noor Pay' },
    { src: 'images/customers/daman-integrated-solutions.jpg', alt: 'Daman' },
    { src: 'images/customers/kbc.jpg', alt: 'KBC' },
    { src: 'images/customers/tad.png', alt: 'Tad' },
    { src: 'images/customers/takt.jpg', alt: 'Takt' },
    { src: 'images/customers/captial.png', alt: 'Capital' },
    { src: 'images/customers/sormed.jpg', alt: 'Sormed' },
    { src: 'images/customers/h.minister.jpg', alt: 'H. Minister' },
    { src: 'images/customers/tabi3i.png', alt: 'Tabi3i' },
    { src: 'images/customers/lenox.jpg', alt: 'Lenox' },
    { src: 'images/customers/khaish&more.jpg', alt: 'Khaish & More' },
    { src: 'images/customers/wain.jpg', alt: 'Wain' },
    { src: 'images/customers/haveing.jpg', alt: 'Haveing' },
    { src: 'images/customers/soloclass.png', alt: 'Soloclass' },
    { src: 'images/customers/mobipay.png', alt: 'Mobipay' },
    { src: 'images/customers/adeela.png', alt: 'Adeela' },
    { src: 'images/customers/awad.jpg', alt: 'Awad' },
    { src: 'images/customers/bajaj.png', alt: 'Bajaj' },
    { src: 'images/customers/miralbi.png', alt: 'Miralbi' },
    { src: 'images/customers/unity.png', alt: 'Unity' },
    { src: 'images/customers/connect.jpg', alt: 'Connect' },
    { src: 'images/customers/pure.jpg', alt: 'Pure' },
    { src: 'images/customers/sufian.jpg', alt: 'Sufian' },
    { src: 'images/customers/shaza.jpg', alt: 'Shaza' },
    { src: 'images/customers/london.jpg', alt: 'London' },
    { src: 'images/customers/seti.png', alt: 'Seti' },
    { src: 'images/customers/elnamama.jpg', alt: 'Elnamama' },
];

const partnerLogos = [
    { src: 'images/partner/bank-khartoum.png', alt: 'Bank of Khartoum' },
    { src: 'images/partner/connect.jpg', alt: 'Connect' },
    { src: 'images/partner/D.png', alt: 'D' },
    { src: 'images/partner/maestros.png', alt: 'Maestros' },
    { src: 'images/partner/next.jpg', alt: 'Next' },
    { src: 'images/partner/nilogy.png', alt: 'Nilogy' },
    // { src: 'images/partner/tradive.png', alt: 'Tradive' },
    { src: 'images/partner/trust.png', alt: 'Trust' },
    { src: 'images/partner/zolpay.png', alt: 'Zolpay' },
];

// --- LOGO CAROUSEL ITEM COMPONENT (Modern Flat UI) ---
const LogoCarouselItem = ({ src, alt, isPartner = false }: { src: string, alt: string, isPartner?: boolean }) => {
    return (
        <div className="causes-item group">
            <div className="causes-img">
                <Card
                    className={cn(
                        "h-28 w-full flex items-center justify-center border transition-transform duration-300 relative overflow-hidden cursor-grab",
                        "hover:scale-105",
                        "bg-white dark:bg-gray-800",
                        isPartner ? 'border-indigo-400 bg-indigo-100 dark:bg-indigo-900/50' : 'border-gray-200 dark:border-gray-700'
                    )}
                >
                    <img
                        data-src={src}
                        alt={alt}
                        className="owl-lazy max-h-full max-w-full object-contain transition-transform duration-500"
                    />
                </Card>
            </div>
        </div>
    );
};
// --- END LOGO CAROUSEL ITEM COMPONENT ---



// --- JAVASCRIPT INITIALIZATION LOGIC (Same as before) ---
const initializeCarousel = (selector: string, autoplay: boolean = true) => {
    // ... (Your standard initialization logic) ...
    if (typeof window === 'undefined' || typeof window.jQuery === 'undefined') {
        return;
    }

    const $ = window.jQuery;

    if ($(selector).hasClass('owl-loaded')) {
        $(selector).owlCarousel('destroy');
    }

    const options = {
        loop: true,
        margin: 30,
        nav: false,
        dots: true,
        autoplay: autoplay,
        autoplayTimeout: 5000, // Increased timeout
        smartSpeed: 800,
        lazyLoad: true, // Enable lazy loading
        mouseDrag: true,
        touchDrag: true,
        responsive: {
            0: { items: 2, margin: 10 },
            576: { items: 3, margin: 20 },
            992: { items: 5, margin: 30 }
        }
    };

    $(selector).owlCarousel(options);
};
// --- END JAVASCRIPT INITIALIZATION LOGIC ---


export default function PublicCustomerCarousels() {

    // --- JAVASCRIPT INITIALIZATION HOOK ---
    useEffect(() => {
        initializeCarousel('.customer-carousel', true);
        initializeCarousel('.partner-carousel', true);

        return () => {
            if (window.jQuery) {
                if (window.jQuery('.customer-carousel').hasClass('owl-loaded')) {
                    window.jQuery('.customer-carousel').owlCarousel('destroy');
                }
                if (window.jQuery('.partner-carousel').hasClass('owl-loaded')) {
                    window.jQuery('.partner-carousel').owlCarousel('destroy');
                }
            }
        };
    }, []);
    // --- END JAVASCRIPT INITIALIZATION HOOK ---



    return (
        <section className="bg-white py-20 dark:bg-gray-900">
            {/* 1. CUSTOMER START */}
            <div className="causes mb-20">
                <div className="container mx-auto px-4">
                    <div className="section-header text-center">
                        <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#2980b9' }}>Our Customer</p>
                    </div>
                    {/* Owl Carousel Structure */}
                    <div className="owl-carousel causes-carousel customer-carousel">
                        {customerLogos.map((item, index) => (
                            <LogoCarouselItem key={index} src={item.src} alt={item.alt} />
                        ))}
                    </div>
                </div>
            </div>
            {/* CUSTOMER END */}

            {/* 2. PARTNER START */}
            <div className="causes" style={{ marginTop: '50px' }}>
                <div className="container mx-auto px-4">
                    <div className="section-header text-center">
                        <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: '#2980b9' }}>Our Partner</p>
                    </div>
                    {/* Partner Carousel */}
                    <div className="owl-carousel causes-carousel partner-carousel">
                        {partnerLogos.map((item, index) => (
                            <LogoCarouselItem key={index} src={item.src} alt={item.alt} isPartner />
                        ))}
                    </div>
                </div>
            </div>
            {/* PARTNER END */}
        </section>
    );
}
