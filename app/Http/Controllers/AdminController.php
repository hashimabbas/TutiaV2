<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User; // Ensure User model is imported
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Mail; // Import Mail facade
use App\Mail\AdminLoginOtpMail; // Import your Mailable
use Illuminate\Validation\ValidationException; // Import ValidationException
use Carbon\Carbon; // Import Carbon
use Illuminate\Support\Facades\Hash; // Import Hash facade for password checking
use Illuminate\Support\Facades\Log;

class AdminController extends Controller
{
    public function dashboard(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'message' => 'Welcome to the Admin Dashboard!'
        ]);
    }

    public function showEmailLoginForm(Request $request): \Inertia\Response
    {
        return Inertia::render('Admin/Auth/LoginAdmin', [
            'email' => $request->email ?? null,
            'otpSent' => (bool)session('otpSent', false),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
            'errors' => $request->session()->get('errors') ? $request->session()->get('errors')->getBag('default')->toArray() : [],
        ]);
    }

    /**
     * Handle the request to send OTP to admin email.
     */
    public function sendEmailOtp(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // Verify password
        if (!$user || !Auth::guard('web')->attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        $otp = rand(100000, 999999);
        $user->otp_code = $otp;
        $user->otp_expires_at = Carbon::now()->addMinutes(5);
        $user->save();

        // --- ACTUAL EMAIL SENDING with robust error handling ---
        try {
            // Use YOUR existing Mailable class
            Mail::to($user->email)->send(new AdminLoginOtpMail($otp));
            Log::info("Admin OTP email successfully initiated for {$user->email}. OTP: {$otp}");
        } catch (\Exception $e) {
            Log::error("Failed to send Admin OTP email to {$user->email}: " . $e->getMessage(), ['exception' => $e, 'otp' => $otp, 'mail_config' => config('mail.mailers.smtp')]);
            // Flash an error message to the user if email sending fails
            return redirect()->route('login')->with('error', 'فشل إرسال رمز التحقق عبر البريد الإلكتروني: ' . $e->getMessage()); // Show the error for debugging
        }
        // --- End ACTUAL EMAIL SENDING ---

        $request->session()->flash('email_for_otp', $user->email);

        return redirect()->route('admin_show_email_otp_form')->with([
            'success' => 'رمز التحقق (OTP) تم إرساله إلى بريدك الإلكتروني بنجاح.',
            // No need to pass 'email' here as a flash, it's stored in session('email_for_otp')
        ])->withViewData(['otpSent' => true]);
    }

    /**
     * Show the admin OTP verification form.
     */
    public function showEmailOtpForm(Request $request): \Inertia\Response
    {
        $email = $request->email ?? session('email_for_otp');

        if (empty($email)) {
            Log::warning('No email context found for admin OTP verification form. Redirecting to login.');
            return redirect()->route('login')->with('error', 'الرجاء إدخال بريدك الإلكتروني أولاً.');
        }

        return Inertia::render('Admin/Auth/LoginAdmin', [
            'email' => $email, // Pass the resolved email
            'otpSent' => (bool)session('otpSent', true),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
            'errors' => $request->session()->get('errors') ? $request->session()->get('errors')->getBag('default')->toArray() : [],
        ]);
    }

    /**
     * Verify the admin OTP.
     */
    public function verifyEmailOtp(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp_code' => 'required|string|digits:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || $user->otp_code !== $request->otp_code || Carbon::now()->gt($user->otp_expires_at)) {
            throw ValidationException::withMessages([
                'otp_code' => 'رمز التحقق غير صحيح أو منتهي الصلاحية.',
            ]);
        }

        // Clear OTP
        $user->otp_code = null;
        $user->otp_expires_at = null;
        $user->save();

        Auth::guard('web')->login($user);

        return redirect()->route('dashboard')->with('success', 'تم تسجيل الدخول بنجاح!');
    }
    // /**
    //  * Show the admin login form (email & password input).
    //  */
    // public function showEmailLoginForm() // Renamed from login()
    // {
    //     return view('admin.login');
    // }

    // /**
    //  * Handle submission of email & password, then send OTP if credentials are correct.
    //  */
    // public function sendEmailOtp(Request $request): RedirectResponse
    // {
    //     $request->validate([
    //         'email' => 'required|email|exists:users,email',
    //         'password' => 'required|string', // Add password validation
    //     ]);

    //     $user = User::where('email', $request->email)->first();

    //     // --- NEW: Verify password first ---
    //     if (!$user || !Hash::check($request->password, $user->password)) {
    //         throw ValidationException::withMessages([
    //             'email' => ['The provided credentials do not match our records.'], // Generic error for security
    //         ]);
    //     }
    //     // --- END NEW ---

    //     // Credentials are correct, proceed to generate and send OTP
    //     $otp = $user->generateOtp();

    //     try {
    //         Mail::to($user->email)->send(new AdminLoginOtpMail($otp));
    //     } catch (\Exception $e) {
    //         \Log::error("Failed to send Admin login OTP email to {$user->email}: " . $e->getMessage());
    //         return back()->with('error', 'Failed to send OTP email. Please try again.');
    //     }

    //     // Redirect to OTP verification form, passing email via session
    //     return redirect()->route('admin_show_email_otp_form')->with('email', $user->email)->with('success', 'OTP sent to your email.');
    // }

    // /**
    //  * Show the form for admin to enter OTP.
    //  */
    // public function showEmailOtpForm(Request $request)
    // {
    //     $email = $request->session()->get('email') ?? $request->input('email');
    //     if (!$email) {
    //         return redirect()->route('login')->with('error', 'Please re-enter your email to get an OTP.');
    //     }
    //     return view('admin.verify-otp', ['email' => $email]);
    // }

    // /**
    //  * Handle submission of OTP for verification and admin login.
    //  */
    // public function verifyEmailOtp(Request $request): RedirectResponse
    // {
    //     $request->validate([
    //         'email' => 'required|email|exists:users,email',
    //         'otp_code' => 'required|string|digits:6',
    //     ]);

    //     $user = User::where('email', $request->email)->first();

    //     if (!$user) {
    //         throw ValidationException::withMessages(['email' => 'User not found.']);
    //     }

    //     if (!$user->verifyOtp($request->otp_code)) {
    //         throw ValidationException::withMessages(['otp_code' => 'Invalid or expired OTP.']);
    //     }

    //     // OTP is valid, clear it and log in the admin
    //     $user->clearOtp();
    //     Auth::guard('web')->login($user);

    //     $request->session()->regenerate();

    //     return redirect()->route('admin_dashboard')->with('success', 'Logged in successfully!');
    // }

    /**
     * Log the admin out of the application.
     */
    public function logout(): RedirectResponse
    {
        Auth::guard('web')->logout();

        session()->invalidate();
        session()->regenerateToken();

        return redirect()->route('home')->with('success', 'Logged out successfully.');
    }
}
