import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// --- Static Data ---
const customerLogos = [
    { src: '/images/customers/u.s.embassy.png', alt: 'U.S. Embassy' },
    { src: '/images/customers/biritish-conucil.png', alt: 'British Council' },
    { src: '/images/customers/inifinity.png', alt: 'Infinity' },
    { src: '/images/customers/icrc.jpg', alt: 'ICRC' },
    { src: '/images/customers/hyundai.png', alt: 'Hyundai' },
    { src: '/images/customers/nissan.png', alt: 'Nissan' },
    { src: '/images/customers/jac.png', alt: 'JAC' },
    { src: '/images/customers/sudia-cargo.png', alt: 'Saudia Cargo' },
    { src: '/images/customers/bdr.png', alt: 'BDR' },
    { src: '/images/customers/sanofi.png', alt: 'Sanofi' },
    { src: '/images/customers/faisal.jpg', alt: 'Faisal' },
    { src: '/images/customers/financial.jpg', alt: 'Financial' },
    { src: '/images/customers/bayan.jpg', alt: 'Bayan' },
    { src: '/images/customers/noor-pay.png', alt: 'Noor Pay' },
    { src: '/images/customers/daman-integrated-solutions.jpg', alt: 'Daman' },
    { src: '/images/customers/kbc.jpg', alt: 'KBC' },
    { src: '/images/customers/tad.png', alt: 'Tad' },
    { src: '/images/customers/takt.jpg', alt: 'Takt' },
    { src: '/images/customers/captial.png', alt: 'Capital' },
    { src: '/images/customers/sormed.jpg', alt: 'Sormed' },
    { src: '/images/customers/h.minister.jpg', alt: 'H. Minister' },
    { src: '/images/customers/tabi3i.png', alt: 'Tabi3i' },
    { src: '/images/customers/lenox.jpg', alt: 'Lenox' },
    { src: '/images/customers/khaish&more.jpg', alt: 'Khaish & More' },
    { src: '/images/customers/wain.jpg', alt: 'Wain' },
    { src: '/images/customers/haveing.jpg', alt: 'Haveing' },
    { src: '/images/customers/soloclass.png', alt: 'Soloclass' },
    { src: '/images/customers/mobipay.png', alt: 'Mobipay' },
    { src: '/images/customers/adeela.png', alt: 'Adeela' },
    { src: '/images/customers/awad.jpg', alt: 'Awad' },
    { src: '/images/customers/bajaj.png', alt: 'Bajaj' },
    { src: '/images/customers/miralbi.png', alt: 'Miralbi' },
    { src: '/images/customers/unity.png', alt: 'Unity' },
    { src: '/images/customers/connect.jpg', alt: 'Connect' },
    { src: '/images/customers/pure.jpg', alt: 'Pure' },
    { src: '/images/customers/sufian.jpg', alt: 'Sufian' },
    { src: '/images/customers/shaza.jpg', alt: 'Shaza' },
    { src: '/images/customers/london.jpg', alt: 'London' },
    { src: '/images/customers/seti.png', alt: 'Seti' },
    { src: '/images/customers/elnamama.jpg', alt: 'Elnamama' },
];

const partnerLogos = [
    { src: '/images/partner/bank-khartoum.png', alt: 'Bank of Khartoum' },
    { src: '/images/partner/connect.jpg', alt: 'Connect' },
    { src: '/images/partner/D.png', alt: 'D' },
    { src: '/images/partner/maestros.png', alt: 'Maestros' },
    { src: '/images/partner/next.jpg', alt: 'Next' },
    { src: '/images/partner/nilogy.png', alt: 'Nilogy' },
    { src: '/images/partner/trust.png', alt: 'Trust' },
    { src: '/images/partner/zolpay.png', alt: 'Zolpay' },
];

// --- LOGO CAROUSEL ITEM COMPONENT (Modern Flat UI) ---
const LogoCarouselItem = ({ src, alt, isPartner = false }: { src: string, alt: string, isPartner?: boolean }) => {
    return (
        <Card
            className={cn(
                "flex-shrink-0 w-32 md:w-48 h-20 md:h-28 flex items-center justify-center p-4 transition-all duration-300",
                "bg-white dark:bg-gray-800 border-none shadow-sm hover:shadow-md",
                "hover:-translate-y-1 cursor-pointer grayscale-[50%] hover:grayscale-0",
                isPartner ? 'bg-indigo-50/50 dark:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/40' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
            )}
        >
            <img
                src={src}
                alt={alt}
                loading="lazy"
                className="max-h-full max-w-full object-contain"
            />
        </Card>
    );
};

// --- INFINITE MARQUEE COMPONENT ---
const InfiniteMarquee = ({ items, isPartner = false, reverse = false, speed = 40 }: { items: any[], isPartner?: boolean, reverse?: boolean, speed?: number }) => {
    // Duplicate the array to create a seamless loop
    const doubledItems = [...items, ...items];

    return (
        <div className="relative flex overflow-hidden group w-full before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-16 before:bg-gradient-to-r before:from-white before:to-transparent before:content-[''] after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-16 after:bg-gradient-to-l after:from-white after:to-transparent after:content-[''] dark:before:from-gray-950 dark:after:from-gray-950">
            <motion.div
                animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
                transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: speed,
                }}
                className="flex gap-6 md:gap-8 w-max pl-6 md:pl-8 group-hover:[animation-play-state:paused]"
            >
                {doubledItems.map((item, index) => (
                    <LogoCarouselItem key={`${item.alt}-${index}`} src={item.src} alt={item.alt} isPartner={isPartner} />
                ))}
            </motion.div>
        </div>
    );
};

export default function PublicCustomerCarousels() {
    return (
        <section className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 1. CUSTOMER SECTION */}
                <div className="mb-24">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-tutia font-semibold tracking-wider uppercase text-sm mb-2 block">
                            Trusted By The Best
                        </span>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Our Customers
                        </h2>
                    </div>

                    {/* Top Row Marquee */}
                    <InfiniteMarquee items={customerLogos.slice(0, 20)} speed={45} />

                    <div className="h-6 md:h-8" />

                    {/* Bottom Row Marquee (reversing) */}
                    <InfiniteMarquee items={customerLogos.slice(20)} reverse speed={50} />
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent mb-24" />

                {/* 2. PARTNER SECTION */}
                <div>
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase text-sm mb-2 block">
                            Strong Alliances
                        </span>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Our Partners
                        </h2>
                    </div>

                    <InfiniteMarquee items={partnerLogos} isPartner speed={35} />
                </div>
            </div>
        </section>
    );
}
