import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight, DatabaseZap } from 'lucide-react';
import InfographicCard from './InfographicCard';
import { cn } from '@/lib/utils';
import { route } from 'ziggy-js';

// Image Placeholder (The ship/containers image from the original)
const ILLUSTRATION_IMAGE = "/images/morpho-ship-illustration.png";
// NOTE: You would use your own high-quality illustration or a placeholder here.

export default function PublicHeroInfographic(): JSX.Element {

    return (
        <section className="bg-white dark:bg-gray-900 py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 items-center gap-y-16 lg:grid-cols-2 lg:gap-x-24">

                    {/* LEFT COLUMN: CONTENT & CTAS */}
                    <div className="text-center lg:text-left">
                        <div className="animate-in fade-in slide-in-from-top-10 duration-700">

                            {/* Headings - Using large, bold Tailwind classes to simulate the heavy font */}
                            <h1 className="text-5xl font-extrabold text-[#2980b9] tracking-tight sm:text-6xl lg:text-7xl dark:text-white">
                                Modern Digital <br />
                                <span className="text-4xl text-gray-800 dark:text-gray-200">
                                    Consulting Solutions
                                </span>
                            </h1>
                            <p className="mt-6 max-w-xl text-lg text-gray-700 lg:mx-0 dark:text-gray-300">
                                TUTIA is the leading Sudanese company specializing in advanced ICT and E-commerce solutions, empowering our clients with the highest levels of security, efficiency, and market growth based on a foundation of trust.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:justify-start animate-in fade-in duration-700 delay-300">

                            {/* CTA 1: Contact Us (Bold and Primary) */}
                            <Link
                                href={route('contact')}
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#00A896] px-8 py-4 text-base font-semibold text-white shadow-xl transition hover:bg-[#008f80] focus:outline-none focus:ring-4 focus:ring-[#00A896]/50"
                            >
                                Contact Us
                                <ChevronRight className="h-5 w-5" />
                            </Link>

                            {/* CTA 2: Discover Solutions (Secondary/Outline) */}
                            <Link
                                href={route('offers.show.offers')}
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 border-gray-300 bg-white px-8 py-4 text-base font-semibold text-gray-800 shadow-md transition hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                            >
                                <DatabaseZap className="h-5 w-5 text-[#2980b9]" />
                                Discover Our Solutions
                            </Link>
                        </div>
                    </div>



                    {/* RIGHT COLUMN: INFOGRAPHIC + ILLUSTRATION */}
                    <div className="relative flex justify-center lg:justify-end animate-in fade-in duration-1000 delay-200">
                        {/* Static Illustration (Container Ship Placeholder) */}
                        {/* We rely on the infographic to overlay the image, as in the original */}
                        <div className="relative w-full max-w-md">
                            <img
                                src={ILLUSTRATION_IMAGE}
                                alt="Illustration of Smart Supply Chain"
                                className="w-full h-auto opacity-0" // Hide the placeholder image if using InfographicCard only
                            />

                            {/* Infographic Card (Positioned to simulate the dashboard pop-up) */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:translate-x-0 lg:-right-10 lg:top-1/4">
                                <InfographicCard />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
