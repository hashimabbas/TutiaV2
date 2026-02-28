import React from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Send, Phone, Mail, MapPin, Paperclip } from 'lucide-react';

interface PublicContactFormProps {
    // Expected to receive flash via layout/page
}

export default function PublicContactForm() {
    const { data, setData, post, errors, processing, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        message: '',
        attachment: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('contact.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <section className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden" id="contact">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[40rem] h-[40rem] rounded-full bg-blue-50 dark:bg-blue-900/10 blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-tutia font-semibold tracking-wider uppercase text-sm mb-3 block">
                        Get In Touch
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
                        Let's Talk Business.
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Have a project in mind? We'd love to hear about it. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 items-stretch max-w-6xl mx-auto">

                    {/* Left Info Card */}
                    <div className="lg:col-span-2 bg-gradient-to-br from-tutia to-blue-700 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl" />

                        <div className="relative z-10 space-y-12">
                            <div>
                                <h3 className="text-2xl text-white font-bold mb-2">Contact Information</h3>
                                <p className="text-blue-100 text-sm">Fill out the form and our team will get back to you within 24 hours.</p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4 group">
                                    <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                                        <Phone className="w-5 h-5 text-blue-100" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg hover:text-blue-200 transition-colors cursor-pointer">+249912329449</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                                        <Mail className="w-5 h-5 text-blue-100" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg hover:text-blue-200 transition-colors cursor-pointer">info@tutiasd.com</p>
                                        <p className="text-blue-200 text-sm">Reach out anytime</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                                        <MapPin className="w-5 h-5 text-blue-100" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg">Khartoum, Sudan</p>
                                        <p className="text-blue-200 text-sm">Visit our headquarters</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Form Card */}
                    <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-100 dark:border-gray-700/60 p-10 lg:p-12">
                        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data" noValidate>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name Input */}
                                <div className="space-y-1">
                                    <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder="John Doe"
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-tutia focus:ring-2 focus:ring-tutia/20 outline-none transition-all dark:text-white"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        required
                                    />
                                    {errors.name && <p className="text-sm text-red-500 mt-1 ml-1">{errors.name}</p>}
                                </div>

                                {/* Email Input */}
                                <div className="space-y-1">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="john@example.com"
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-tutia focus:ring-2 focus:ring-tutia/20 outline-none transition-all dark:text-white"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        required
                                    />
                                    {errors.email && <p className="text-sm text-red-500 mt-1 ml-1">{errors.email}</p>}
                                </div>
                            </div>

                            {/* Phone Input */}
                            <div className="space-y-1">
                                <label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Phone Number <span className="text-gray-400 font-normal">(Optional)</span></label>
                                <input
                                    type="tel"
                                    id="phone"
                                    placeholder="+249 XXXXXXXX"
                                    className="w-full h-12 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-tutia focus:ring-2 focus:ring-tutia/20 outline-none transition-all dark:text-white"
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                />
                                {errors.phone && <p className="text-sm text-red-500 mt-1 ml-1">{errors.phone}</p>}
                            </div>

                            {/* Message Textarea */}
                            <div className="space-y-1">
                                <label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Message</label>
                                <textarea
                                    id="message"
                                    placeholder="Briefly describe your requirements..."
                                    rows={4}
                                    className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-tutia focus:ring-2 focus:ring-tutia/20 outline-none transition-all resize-none dark:text-white"
                                    value={data.message}
                                    onChange={e => setData('message', e.target.value)}
                                    required
                                />
                                {errors.message && <p className="text-sm text-red-500 mt-1 ml-1">{errors.message}</p>}
                            </div>

                            {/* Attachment Input */}
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1 block mb-2">Attach Document <span className="text-gray-400 font-normal">(Optional)</span></label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="attachment"
                                        className="hidden"
                                        onChange={e => setData('attachment', e.target.files?.[0] || null)}
                                    />
                                    <label
                                        htmlFor="attachment"
                                        className="flex items-center gap-3 w-full h-12 px-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors text-sm text-gray-500 dark:text-gray-400"
                                    >
                                        <Paperclip className="w-4 h-4" />
                                        <span className="truncate">
                                            {data.attachment ? data.attachment.name : 'Choose a file or drop it here...'}
                                        </span>
                                    </label>
                                </div>
                                {errors.attachment && <p className="text-sm text-red-500 mt-1 ml-1">{errors.attachment}</p>}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full h-14 rounded-xl bg-tutia hover:bg-blue-600 text-white font-bold text-lg flex items-center justify-center gap-2 transition-all 
                                        disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-tutia/20 active:scale-[0.98]"
                            >
                                {processing ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Message
                                        <Send className="w-5 h-5 -mt-0.5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
