// resources/js/Pages/Admin/Auth/LoginAdmin.tsx

import React, { useState, useEffect } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import { LoaderCircle, Send, CheckCircle, RotateCcw, XCircle, Lock } from 'lucide-react'; // Added Lock icon
import AppLogo from '@/components/app-logo'; // Ensure your AppLogo component is correct
import { Input } from "@/components/ui/input";
import InputError from "@/components/input-error";

// Props Interface to receive data from the controller
interface LoginAdminProps {
    email?: string;
    otpSent?: boolean; // Direct prop from Inertia::render
    flash: {
        success?: string;
        error?: string;
    };
    errors: { // Specific error keys for admin login
        email?: string;
        password?: string;
        otp_code?: string;
        global?: string; // For general errors
    };
}

export default function LoginAdmin() {
    const { props } = usePage<LoginAdminProps>();
    const { email: initialEmail, otpSent: initialOtpSent } = props;

    const [step, setStep] = useState(initialOtpSent ? 2 : 1);

    const sendOtpForm = useForm({
        email: initialEmail || "",
        password: "", // Add password field
    });

    const verifyOtpForm = useForm({
        email: initialEmail || "",
        otp_code: "", // Match backend's expected parameter name
    });

    // Effect to handle state transition and data synchronization
    useEffect(() => {
        // console.log('LoginAdmin.tsx useEffect triggered:');
        // console.log('  initialEmail:', initialEmail);
        // console.log('  initialOtpSent:', initialOtpSent);
        // console.log('  Current step state:', step);

        if (initialEmail) {
            sendOtpForm.setData('email', initialEmail);
            verifyOtpForm.setData('email', initialEmail);
        }

        if (initialOtpSent === true && step === 1) {
            // console.log('Transitioning to Step 2 because initialOtpSent is true.');
            setStep(2);
            verifyOtpForm.setData('email', initialEmail || "");
        } else if (initialOtpSent === false && step === 2) {
            // console.log('OTP sending failed, resetting to Step 1.');
            setStep(1);
        }
    }, [initialEmail, initialOtpSent, step]);


    // Step 1 Submission Handler (Email & Password)
    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        sendOtpForm.post(route("admin_send_email_otp"), {
            preserveScroll: true,
            onSuccess: (page) => {
                const newProps = page.props as unknown as LoginAdminProps;
                // console.log('onSuccess callback received page.props (from backend Inertia::render):', newProps);
                if (newProps.flash?.success && newProps.otpSent === true) {
                    setStep(2);
                    verifyOtpForm.setData('email', sendOtpForm.data.email);
                }
            },
            onError: (errors) => {
                console.error('Frontend onError during sendOtp:', errors);
            }
        });
    };

    // Step 2 Submission Handler (OTP Verification)
    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        verifyOtpForm.post(route("admin_verify_email_otp"), {
            preserveScroll: true,
            onSuccess: () => {
                // Controller redirects to dashboard on success.
            },
            onError: (errors) => {
                console.error('Frontend onError during verifyOtp:', errors);
            }
        });
    };

    // Error and Message display logic (using flash for clarity)
    const successMessage = props.flash?.success;
    const errorMessage = props.flash?.error || props.errors.global;

    return (
        <>
            <Head title="Admin Login" />
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-100 p-4 sm:p-6">
                <div className="mb-8">
                    {/* Your logo - adjust size as needed */}
                    <img
                        src="/logo-transparent.png"
                        alt="Tutia Logo"
                        width={150}
                        height={150}
                        className="object-contain"
                    />
                </div>

                <div className="w-full max-w-md p-8 sm:p-10 space-y-8 bg-white rounded-3xl shadow-2xl border border-gray-100 transform hover:scale-105 transition-all duration-300 ease-in-out">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-extrabold text-gray-900 leading-tight">
                            Sign in to your Admin Account
                        </h2>
                        <p className="text-sm text-gray-600">
                            {step === 1 ? "Enter your credentials to receive a login OTP." : `An OTP has been sent to your email: ${verifyOtpForm.data.email}`}
                        </p>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex justify-center items-center gap-2 mb-6">
                        <span className={`flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm ${step === 1 ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-600'}`}>1</span>
                        <div className={`h-1 w-12 rounded-full ${step === 2 ? 'bg-indigo-400' : 'bg-gray-300'}`} />
                        <span className={`flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm ${step === 2 ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-600'}`}>2</span>
                    </div>

                    {successMessage && (
                        <div className="flex items-center justify-center gap-3 bg-green-50 text-green-800 text-sm p-3 rounded-xl border border-green-200">
                            <CheckCircle className="h-5 w-5" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="flex items-center justify-center gap-3 bg-red-50 text-red-800 text-sm p-3 rounded-xl border border-red-200">
                            <XCircle className="h-5 w-5" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleSendOtp} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="sr-only">Email address</label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full px-4 py-2.5 border border-gray-300 rounded-t-lg shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-base transition-all duration-200"
                                    placeholder="Email address"
                                    value={sendOtpForm.data.email}
                                    onChange={(e) => sendOtpForm.setData("email", e.target.value)}
                                />
                                <InputError message={sendOtpForm.errors.email} />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none block w-full px-4 py-2.5 border border-gray-300 rounded-b-lg shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-base transition-all duration-200"
                                    placeholder="Password"
                                    value={sendOtpForm.data.password}
                                    onChange={(e) => sendOtpForm.setData("password", e.target.value)}
                                />
                                <InputError message={sendOtpForm.errors.password} />
                            </div>

                            <button
                                type="submit"
                                disabled={sendOtpForm.processing}
                                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                            >
                                {sendOtpForm.processing ? <LoaderCircle className="h-5 w-5 animate-spin mr-2" /> : <Lock className="h-5 w-5 mr-2" />}
                                Login & Get OTP
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyOtp} className="space-y-6">
                            <input type="hidden" name="email" value={verifyOtpForm.data.email} />
                            <div>
                                <label
                                    htmlFor="otp_code"
                                    className="block text-sm font-medium text-gray-700 mb-2 text-center"
                                >
                                    Enter OTP
                                </label>
                                <div className="mt-1">
                                    <Input
                                        id="otp_code"
                                        name="otp_code"
                                        type="text"
                                        maxLength="6"
                                        required
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        className="appearance-none block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-base transition-all duration-200 text-center tracking-wider"
                                        placeholder="••••••"
                                        value={verifyOtpForm.data.otp_code}
                                        onChange={(e) => verifyOtpForm.setData("otp_code", e.target.value)}
                                    />
                                </div>
                                <InputError message={verifyOtpForm.errors.otp_code} />
                            </div>

                            <button
                                type="submit"
                                disabled={verifyOtpForm.processing}
                                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                            >
                                {verifyOtpForm.processing ? <LoaderCircle className="h-5 w-5 animate-spin mr-2" /> : <CheckCircle className="h-5 w-5 mr-2" />}
                                Verify OTP
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setStep(1);
                                    sendOtpForm.reset('password'); // Reset only password field
                                    verifyOtpForm.reset('otp_code'); // Reset only OTP field
                                }}
                                disabled={verifyOtpForm.processing}
                                className="w-full flex justify-center items-center mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                            >
                                <RotateCcw className="h-4 w-4 mr-2" /> Change Email / Resend OTP
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}
