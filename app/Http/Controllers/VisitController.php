<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Visit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; // Optional logging

class VisitController extends Controller
{
    public function store(Request $request)
    {
        // Basic validation
        $validated = $request->validate([
            'page_url' => 'required|string|max:2048',
            'referrer_url' => 'nullable|string|max:2048',
            // Don't pass IP/UserAgent from client - get it server-side
        ]);

        try {
            Visit::create([
                'user_id' => Auth::id(), // Get logged-in user ID (null if guest)
                // ** PRIVACY: Anonymize IP! Never store raw IPs directly long-term unless absolutely necessary and legally compliant **
                // Example: Hashing (one-way)
                // 'ip_address' => hash('sha256', $request->ip() . config('app.key')), // Hash with salt
                // Example: Anonymization (e.g., remove last octet for IPv4)
                'ip_address' => $this->anonymizeIp($request->ip()),
                'user_agent' => $request->userAgent(),
                'page_url' => $validated['page_url'],
                'referrer_url' => $validated['referrer_url'],
                'session_id' => $request->session()->getId(), // Get session ID
            ]);

            return response()->json(['message' => 'Visit tracked.'], 201);

        } catch (\Exception $e) {
            Log::error('Failed to track visit: ' . $e->getMessage());
            // Fail silently on the frontend usually
            return response()->json(['message' => 'Failed to track visit.'], 500);
        }
    }

    // Simple IP Anonymization Example (Adjust as needed)
    private function anonymizeIp(?string $ip): ?string
    {
        if (!$ip) {
            return null;
        }
        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            // Remove last octet for IPv4
            return substr($ip, 0, strrpos($ip, '.')) . '.0';
        } elseif (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
            // Basic IPv6 anonymization (e.g., zero out last 80 bits) - Needs careful implementation
            // This is a simplified example
            $parts = explode(':', $ip);
            if(count($parts) > 4) {
                 // Keep first 4 segments (64 bits), zero out the rest
                 return implode(':', array_slice($parts, 0, 4)) . '::';
            }
           return $ip; // Or a more robust method
        }
        return null; // Not a valid IP
    }
}
