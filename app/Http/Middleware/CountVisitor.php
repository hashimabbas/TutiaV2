<?php
namespace App\Http\Middleware;

use App\Models\Visitor;
use Closure;
use Illuminate\Http\Request;

class CountVisitor
{
    public function handle(Request $request, Closure $next)
    {
        // --- OPTIMIZATION: Only count once per session per day ---
        if ($request->session()->has('visitor_counted_' . today()->toDateString())) {
            return $next($request);
        }

        $ip = $request->ip();
        
        // Skip geolocation on localhost for faster development
        if ($ip === '127.0.0.1' || $ip === '::1') {
             if (Visitor::where('created_at', today())->where('ip', $ip)->count() < 1) {
                Visitor::create([
                    'page_name' => $request->path(),
                    'ip' => $ip,
                ]);
            }
            $request->session()->put('visitor_counted_' . today()->toDateString(), true);
            return $next($request);
        }

        try {
            // Geolocation lookups can be slow/blocking. 
            // Ideally this should be queued or use a local database (MaxMind).
            $data = \Stevebauman\Location\Facades\Location::get($ip);

            if ($data != null) {
                if (Visitor::where('created_at', today())->where('ip', $ip)->count() < 1) {
                    Visitor::create([
                        'page_name' => $request->path(),
                        'ip' => $ip,
                        'countryName' => $data->countryName,
                        'countryCode' => $data->countryCode,
                        'regionCode' => $data->regionCode,
                        'regionName' => $data->regionName,
                        'cityName' => $data->cityName,
                        'zipCode' => $data->zipCode,
                        'latitude' => $data->latitude,
                        'longitude' => $data->longitude,
                        'areaCode' => $data->areaCode,
                        'timezone' => $data->timezone,
                    ]);
                }
            } else {
                if (Visitor::where('created_at', today())->where('ip', $ip)->count() < 1) {
                    Visitor::create([
                        'page_name' => $request->path(),
                        'ip' => $ip,
                    ]);
                }
            }
        } catch (\Exception $e) {
            // Log or ignore if geolocation fails
            \Log::warning("Geolocation failed in CountVisitor for IP: " . $ip);
        }

        $request->session()->put('visitor_counted_' . today()->toDateString(), true);

        return $next($request);
    }
}
