import React from 'react';
import { Quote, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// --- Static Data Structure (Defined once) ---
const testimonialsData = [
    {
        id: 1,
        quote: "We have worked with Toutia for a long time and we rely on their efficiency and superior quality. They are true to their words in delivering the work on designated time which exhibits a mark of true professionalism. We really appreciated the way they give their best shot in offering their services, because it saves us a lot of time. Tutia has helped us keep a track on what our competitors were doing. Their team understands the client's needs and puts every possible effort in successfully performing the given task.",
        clientName: "BDR Group",
        clientTitle: "Procurement Partner",
        clientLogo: "images/customers/bdr.png",
    },
    {
        id: 2,
        quote: "The professional relationship with our Tutia content team has proven to be beneficial beyond our expectations. The lines of communication with our Tutia project manager are always open and very effective, and the quality of work completed by the team is consistently of a high quality that meets our standards. There is no way we could easily manage the work volume required to keep our site current without the efforts of Tutia.",
        clientName: "ICRC (Intl. Committee of the Red Cross)",
        clientTitle: "IT Operations Team",
        clientLogo: "images/customers/icrc.jpg",
    },
];

export default function PublicTestimonials() {

    return (
        // <!-- Testimonial Start -->
        <div className="testimonial py-20 bg-gray-100 dark:bg-gray-800">
            <div className="container">
                <div className="section-header text-center mb-16">
                    <p className="text-sm font-semibold mb-1" style={{ color: "rgb(41, 128, 185)" }}>What Our Clients Say</p>
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">Trusted Voices</h2>
                </div>

                {/* Responsive Grid for Side-by-Side Cards */}
                <div className="row justify-content-center"> {/* Use Bootstrap row for grid setup */}
                    {testimonialsData.map((testimonial) => (
                        <div key={testimonial.id} className="col-lg-6 col-md-10 mb-4">
                            <Card className="h-full border-t-4 border-primary shadow-xl transition-all duration-300 hover:shadow-2xl">
                                <CardContent className="p-6 space-y-4">

                                    {/* Quote Icon */}
                                    <Quote className="h-6 w-6 text-primary/70" />

                                    {/* Quote Text */}
                                    <p className="text-base italic text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        "{testimonial.quote}"
                                    </p>

                                    {/* Profile Footer */}
                                    <div className="flex items-start space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex-none">
                                            {/* Logo/Image */}
                                            <img
                                                src={testimonial.clientLogo}
                                                alt={testimonial.clientName}
                                                className="w-24 h-12 object-contain"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                                {testimonial.clientName}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {testimonial.clientTitle}
                                            </p>
                                        </div>
                                        <div className="flex-none flex pt-1">
                                            {/* Rating Placeholder */}
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                    </div>

                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        // <!-- Testimonial End -->
    );
}
