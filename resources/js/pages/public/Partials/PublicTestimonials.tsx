import React from 'react';
import { Quote, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// --- Static Data Structure (Defined once) ---
const testimonialsData = [
    {
        id: 1,
        quote: "We have worked with Toutia for a long time and we rely on their efficiency and superior quality. They are true to their words in delivering the work on designated time which exhibits a mark of true professionalism. We really appreciated the way they give their best shot in offering their services, because it saves us a lot of time. Tutia has helped us keep a track on what our competitors were doing. Their team understands the client's needs and puts every possible effort in successfully performing the given task.",
        clientName: "BDR Group",
        clientTitle: "Procurement Partner",
        clientLogo: "/images/customers/bdr.png",
    },
    {
        id: 2,
        quote: "The professional relationship with our Tutia content team has proven to be beneficial beyond our expectations. The lines of communication with our Tutia project manager are always open and very effective, and the quality of work completed by the team is consistently of a high quality that meets our standards. There is no way we could easily manage the work volume required to keep our site current without the efforts of Tutia.",
        clientName: "ICRC (Intl. Committee of the Red Cross)",
        clientTitle: "IT Operations Team",
        clientLogo: "/images/customers/icrc.jpg",
    },
];

export default function PublicTestimonials() {
    return (
        <section className="py-24 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-tutia font-semibold tracking-wider uppercase text-sm mb-3 block">
                        Client Success Stories
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                        Trusted Voices
                    </h2>
                </div>

                {/* Modern Grid layout instead of Bootstrap row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                    {testimonialsData.map((testimonial) => (
                        <div key={testimonial.id} className="relative group">
                            {/* Decorative background glow that appears on hover */}
                            <div className="absolute -inset-0.5 bg-gradient-to-tr from-blue-500/20 to-tutia/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>

                            <Card className="relative h-full flex flex-col bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden z-10">
                                {/* Decorative top accent line */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-tutia" />

                                <CardContent className="p-8 sm:p-10 flex flex-col flex-grow">
                                    {/* Quote Icon */}
                                    <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 w-12 h-12 rounded-2xl flex items-center justify-center text-tutia group-hover:scale-110 transition-transform duration-300">
                                        <Quote className="h-6 w-6 stroke-[2.5]" />
                                    </div>

                                    {/* Quote Text */}
                                    <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-8 flex-grow">
                                        "{testimonial.quote}"
                                    </p>

                                    {/* Profile Footer */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-gray-100 dark:border-gray-700/60 mt-auto">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                <img
                                                    src={testimonial.clientLogo}
                                                    alt={testimonial.clientName}
                                                    className="w-10 h-10 object-contain"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white text-base">
                                                    {testimonial.clientName}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                                                    {testimonial.clientTitle}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-1 pl-14 sm:pl-0">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
