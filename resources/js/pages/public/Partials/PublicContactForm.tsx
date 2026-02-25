import React from 'react';
import { useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface PublicContactFormProps {
    // We expect the global flash errors to be passed down or accessed via usePage()
    // For this partial, we'll access it directly via usePage to keep the signature clean
}

export default function PublicContactForm() {
    // NOTE: This component assumes you are using the full /contact page route
    // which handles the Blade view to Inertia render.

    // The controller expects: name, email, phone, message, attachment
    const { data, setData, post, errors, processing } = useForm({
        name: '',
        email: '',
        phone: '', // Optional
        message: '', // Used for the main textarea content
        attachment: null as File | null, // Used for file upload
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // The action="{{url('/create/message')}}" is now mapped to route('contact.store')
        // We use the direct form data post, as the controller expects multipart/form-data
        post(route('contact.store'), {
            forceFormData: true,
            onSuccess: () => {
                // Flash message handled by the layout component after redirect
                console.log('Message sent successfully!');
                // You can reset fields if needed: reset('name', 'email', 'phone', 'message', 'attachment');
            },
            onError: (err) => {
                console.error('Validation failed:', err);
                // Errors are automatically available via the `errors` object
            },
        });
    };

    return (
        // <!-- Contact Start -->
        <div className="contact">
            <div className="container">
                <div className="section-header text-center">
                    {/* Note: Original inline style preserved */}
                    <p style={{ margin: 0, fontSize: '45px', fontWeight: 700, color: '#2980b9' }}>Contact Us</p>
                </div>

                {/* Image Section (to be pulled up by contact-form's negative margin) */}
                <div className="contact-img">
                    <img src="images/laptop-g90.jpg" alt="Image" />
                </div>

                {/* Form Section (The main floating block) */}
                <div className="contact-form">
                    <div id="success"></div> {/* Placeholder for old JS success message */}

                    {/* CRITICAL: ADD enctype="multipart/form-data" for file uploads */}
                    <form name="sentMessage" onSubmit={handleSubmit} id="contactForm" encType="multipart/form-data" noValidate>
                        {/* CSRF Token is included automatically by Inertia/Laravel on POST */}

                        {/* Note: We rely on the parent layout to display the general flash/success messages.
                           Individual field errors are handled by the `errors` object. */}

                        {/* Name */}
                        <div className="control-group">
                            <input
                                type="text" className="form-control" name="name" id="name" placeholder="Your Name" required
                                value={data.name} onChange={e => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-danger" style={{ marginTop: '5px' }}>{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div className="control-group">
                            <input
                                type="email" className="form-control" name="email" id="email" placeholder="Your Email" required
                                value={data.email} onChange={e => setData('email', e.target.value)}
                            />
                            {errors.email && <p className="text-danger" style={{ marginTop: '5px' }}>{errors.email}</p>}
                        </div>

                        {/* Phone (Used the field from your final controller setup) */}
                        <div className="control-group">
                            <input
                                type="text" className="form-control" name="phone" id="phone" placeholder="Your Phone (Optional)"
                                value={data.phone} onChange={e => setData('phone', e.target.value)}
                            />
                            {errors.phone && <p className="text-danger" style={{ marginTop: '5px' }}>{errors.phone}</p>}
                        </div>

                        {/* Attachment (The file input) */}
                        <div className="control-group">
                            <label htmlFor="attachment" style={{ fontSize: '0.9rem', color: '#666', display: 'block', marginBottom: '5px' }}>Attach File (Optional)</label>
                            <input
                                type="file" className="form-control" name="attachment" id="attachment"
                                style={{ paddingTop: '10px', paddingBottom: '30px' }}
                                onChange={e => setData('attachment', e.target.files?.[0] || null)}
                            />
                            {errors.attachment && <p className="text-danger" style={{ marginTop: '5px' }}>{errors.attachment}</p>}
                        </div>


                        {/* Message (using 'message' name to match final controller) */}
                        <div className="control-group">
                            <textarea
                                className="form-control" id="message" name="message" placeholder="Message" required
                                value={data.message} onChange={e => setData('message', e.target.value)}
                            ></textarea>
                            {errors.message && <p className="text-danger" style={{ marginTop: '5px' }}>{errors.message}</p>}
                        </div>

                        <div>
                            <button className="btn btn-custom" type="submit" id="sendMessageButton" disabled={processing}>
                                {processing ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        // <!-- Contact End -->
    );
}
