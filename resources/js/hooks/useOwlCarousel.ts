import { useEffect } from 'react';

// Declare jQuery/OwlCarousel type globally to satisfy TypeScript (if you use it)
// In your main types.d.ts or similar file:
// declare global { interface Window { jQuery: any; $: any; } }

/**
 * Custom hook to initialize Owl Carousel on a specified DOM element.
 * Assumes jQuery and Owl Carousel scripts are globally loaded (e.g., in app.blade.php).
 * @param selector The CSS selector for the carousel container (e.g., '.owl-carousel')
 * @param options The Owl Carousel configuration options
 */
export const useOwlCarousel = (selector: string, options: any = {}) => {
    // Stringify options to prevent infinite re-renders when object literals are passed
    const optionsString = JSON.stringify(options);

    useEffect(() => {
        // 1. Check if jQuery is loaded
        if (
            typeof window === 'undefined' ||
            typeof (window as any).jQuery === 'undefined'
        ) {
            console.warn(
                'jQuery is not loaded. Cannot initialize Owl Carousel.',
            );
            return;
        }

        const $ = (window as any).jQuery;
        const $carousel = $(selector);

        // 2. Check if the element exists and has not been initialized yet
        if (
            $carousel.length &&
            typeof $carousel.owlCarousel === 'function' &&
            !$carousel.data('owl.carousel')
        ) {
            // 3. Initialize the carousel
            $carousel.owlCarousel(options);
        }

        // 4. Cleanup function (destroy carousel when component unmounts)
        return () => {
            if ($carousel.data('owl.carousel')) {
                $carousel.owlCarousel('destroy');
                // Ensure data is removed so it can be re-initialized if needed
                $carousel.removeData('owl.carousel');
            }
        };
    }, [selector, optionsString]); // Use stringified options as dependency
};

