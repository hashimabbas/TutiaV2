<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- Preconnect to external domains -->
        <link rel="preconnect" href="https://cdnjs.cloudflare.com">
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link rel="preconnect" href="https://unpkg.com">

        <!-- CSS Libraries -->
        <!-- <link href="{{ asset('css/bootstrap.min.css') }}" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet" media="print" onload="this.media='all'">
        <link href="{{ asset('lib/flaticon/font/flaticon.css') }}" rel="stylesheet">
        <link href="{{ asset('lib/animate/animate.min.css') }}" rel="stylesheet">
        <link href="{{ asset('lib/owlcarousel/assets/owl.carousel.min.css') }}" rel="stylesheet">
         -->
        <!-- Template Stylesheet -->
        <link href="{{ asset('css/style.css') }}" rel="stylesheet">
        {{-- Inline script to detect system dark mode preference and apply it immediately --}}

        <style>
        .header-btn
        {
            border: 2px solid #FDBE33 !important;
        }
        .header-btn:hover{
            box-shadow: inset 0 0 0 30px #FDBE33 !important;
        }
        @media(max-width: 767px)
        {
            .carousel .carousel-img
            {
                height: 500px !important;
            }
            .footer-in-phone{
                text-align: left !important;
            }
            .hero-heading
            {
                font-size: 1.5rem !important;
            }
            .about-img
            {
                display: none;
            }
            .carousel
            {
                margin-bottom: 0 !important;
            }
        }
    </style>
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600|oswald:400,500,600,700|cairo:400,500,600,700" rel="stylesheet" />
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia

        <!-- JavaScript Libraries -->
        <!-- Legacy scripts removed to avoid jQuery errors -->
        <script src="https://unpkg.com/scrollreveal" defer></script>

             <!--Start of Tawk.to Script-->
    <script type="text/javascript">
        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
        (function(){
        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        s1.async=true;
        s1.src='https://embed.tawk.to/625e75b47b967b11798b60ab/1g10fnink';
        s1.charset='UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1,s0);
        })();
    </script>
    </body>
</html>
