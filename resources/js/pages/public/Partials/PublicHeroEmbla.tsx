import { Link, usePage } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import EmblaCarouselFade from 'embla-carousel-fade';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { Apple, Cpu, Smartphone } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { route } from 'ziggy-js';

// --- TS: Define types for safety ---
type ImageType = { src: string; alt: string };

// --- Define TUTIA images and content ---
const images: ImageType[] = [
    { src: '/images/workspace.jpg', alt: 'TUTIA Office Workspace' },
    { src: '/images/services/web-design.jpg', alt: 'Web Development Screen' },
    { src: '/images/services/network-g.jpg', alt: 'Connectivity Solution' },
];

const HERO_TITLE = 'TUTIA: Technology Solutions Built on Trust';
const HERO_SUBTITLE = 'Empowering Your Business with Reliable CRM, ICT, and Seamless Connectivity.';

// --- MAIN HERO COMPONENT ---
export default function PublicHeroEmbla(): JSX.Element {
    const {
        props: { auth },
    } = usePage();

    // --- Embla Carousel Setup ---
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [
        Autoplay({ delay: 5000, stopOnInteraction: false }),
        EmblaCarouselFade(),
    ]);

    const [selectedIndex, setSelectedIndex] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
    }, [emblaApi, onSelect]);

    const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring' as const,
                stiffness: 100,
                damping: 20,
            },
        },
    };

    return (
        <section className="relative overflow-hidden bg-white py-24 dark:bg-gray-950 sm:py-32 lg:py-40">
            {/* Background Decorative Elements - OPTIMIZED: Removed heavy infinite animations on large blurred elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute -top-[10%] -left-[10%] h-[600px] w-[600px] rounded-full bg-tutia/10 blur-[120px] dark:bg-tutia/5 will-change-[opacity]"
                />
                <div
                    className="absolute -bottom-[10%] -right-[10%] h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[120px] dark:bg-blue-500/5 will-change-[opacity]"
                />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] dark:invert" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-y-16 lg:grid-cols-2 lg:gap-x-16">
                    {/* LEFT COLUMN: CONTENT & CTAS */}
                    <motion.div
                        className="flex flex-col text-center lg:text-left"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants} className="mb-6 flex justify-center lg:justify-start">
                            <div className="inline-flex items-center gap-2 rounded-full border border-tutia/20 bg-tutia/5 px-4 py-1.5 text-sm font-medium text-tutia dark:border-tutia/30 dark:bg-tutia/10 dark:text-tutia-light">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tutia opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-tutia"></span>
                                </span>
                                Innovative Technology Partners
                            </div>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="text-balance text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl dark:text-white"
                        >
                            <span className="block" style={{ color: 'var(--color-tutia)' }}>
                                {HERO_TITLE.split(':')[0]}
                            </span>
                            <span className="mt-2 block bg-gradient-to-r from-blue-600 to-tutia bg-clip-text text-transparent">
                                {HERO_TITLE.split(':')[1]}
                            </span>
                        </motion.h1>

                        <motion.div variants={itemVariants} className="mt-8">
                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                Unlimited Trust. Unlimited Solutions.
                            </span>
                            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600 lg:mx-0 dark:text-gray-400">
                                {HERO_SUBTITLE}
                            </p>
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="mt-12 flex flex-wrap items-center justify-center gap-5 lg:justify-start"
                        >
                            <a
                                href="https://play.google.com/store/apps/details?id=com.nilogy.matgertutia"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-2xl border border-gray-200 bg-white/40 px-8 py-4 text-base font-bold text-gray-800 backdrop-blur-md transition-all hover:scale-105 hover:bg-white/60 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-800/40 dark:text-white dark:hover:bg-gray-800/60"
                            >
                                <Smartphone className="h-6 w-6 text-green-500 transition-transform group-hover:rotate-12" />
                                <div className="text-left">
                                    <span className="block text-xs font-normal opacity-70">Download on</span>
                                    <span className="block leading-none">Play Store</span>
                                </div>
                            </a>

                            <a
                                href="https://apps.apple.com/us/app/%D9%85%D8%AA%D8%AC%D8%B1-%D8%AA%D9%88%D8%AA%D9%8A%D8%A7-matger-tutia/id1460172160"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex items-center justify-center gap-3 overflow-hidden rounded-2xl border border-gray-200 bg-white/40 px-8 py-4 text-base font-bold text-gray-800 backdrop-blur-md transition-all hover:scale-105 hover:bg-white/60 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-800/40 dark:text-white dark:hover:bg-gray-800/60"
                            >
                                <Apple className="h-6 w-6 text-gray-900 transition-transform group-hover:rotate-12 dark:text-white" />
                                <div className="text-left">
                                    <span className="block text-xs font-normal opacity-70">Download on</span>
                                    <span className="block leading-none">App Store</span>
                                </div>
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* RIGHT COLUMN: EMBLA CAROUSEL */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, scale: 0.9, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        {/* Decorative Background for Carousel */}
                        <div className="absolute -inset-4 z-0 rounded-3xl bg-gradient-to-br from-tutia/10 via-blue-500/5 to-transparent blur-2xl dark:from-tutia/20" />

                        <div className="relative z-10 flex flex-col items-center gap-6">
                            <div
                                className="w-full overflow-hidden rounded-3xl border-8 border-white bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] dark:border-gray-900 dark:bg-gray-900 dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]"
                                ref={emblaRef}
                            >
                                <div className="flex touch-pan-y" style={{ backfaceVisibility: 'hidden' }}>
                                    {images.map((image, index) => (
                                        <div className="relative min-w-0 flex-[0_0_100%]" key={index}>
                                            <img
                                                src={image.src}
                                                alt={image.alt}
                                                className="aspect-[4/3] w-full object-cover sm:aspect-[16/10]"
                                                loading="lazy"
                                            />
                                            {/* Gradient overlay for depth */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Carousel pagination indicators */}
                            <div className="flex gap-3">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => scrollTo(index)}
                                        className={`h-2 transition-all duration-300 rounded-full ${selectedIndex === index ? 'w-10 bg-tutia' : 'w-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600'
                                            }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>

                            {/* Floating Tech Badge - OPTIMIZED: Removed infinite y-animation, using hover instead */}
                            <div
                                className="absolute -right-4 -top-8 flex flex-col items-center gap-2 rounded-2xl border border-white/50 bg-white/80 p-5 shadow-2xl backdrop-blur-xl transition-transform duration-500 hover:-translate-y-2 dark:border-gray-700/50 dark:bg-gray-800/80 lg:-right-8 lg:-top-16"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-tutia/10 text-tutia shadow-inner">
                                    <Cpu className="h-7 w-7" />
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-bold dark:text-white">Premium Quality</div>
                                    <div className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Sudanese Innovation</div>
                                </div>
                            </div>

                            {/* Small decorative "Live" dot */}
                            <div className="absolute -left-4 bottom-12 flex h-20 w-20 items-center justify-center rounded-full bg-white/40 shadow-lg backdrop-blur-md dark:bg-gray-800/40 lg:-left-12">
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] font-bold uppercase text-gray-500">Service</span>
                                    <span className="text-sm font-black text-tutia">UPTIME</span>
                                    <div className="mt-1 flex gap-0.5">
                                        {[1, 2, 3, 4].map(i => <div key={i} className="h-1 w-1 rounded-full bg-green-500" />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
