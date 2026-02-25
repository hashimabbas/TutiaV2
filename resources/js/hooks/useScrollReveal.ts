import { useEffect } from 'react';

// Declare ScrollReveal type globally
declare global {
    interface Window {
        ScrollReveal: any;
    }
}

/**
 * Custom hook to re-initialize ALL ScrollReveal animations for the public pages.
 */
export const useScrollRevealAnimations = () => {
    useEffect(() => {
        if (typeof window.ScrollReveal === 'undefined') {
            console.warn(
                'ScrollReveal library is not loaded. Skipping animations.',
            );
            return;
        }

        const ScrollReveal = window.ScrollReveal;

        // 1. Initialize the primary instance
        const sr = ScrollReveal();

        // 2. CRUCIAL: Clear any inline styles left by a previous run on these elements
        // This prevents immediate re-animation on hot-reloads
        sr.clean();

        // 3. Define the common options - OPTIMIZED: Reduced duration and distance
        const defaultOptions = {
            duration: 1000,   // Reduced from 2000
            distance: '50px', // Reduced from 300px
            easing: 'ease-out',
            viewFactor: 0.1,  // Trigger earlier
            mobile: false,    // Disable on mobile for extra performance if needed
        };

        // 4. Run the combined reveal calls
        // Values Icons (Top)
        sr.reveal(
            '.trust-icon-animation, .commitment-icon-animation, .integrity-icon-animation, .result-icon-animation',
            {
                ...defaultOptions,
                origin: 'top',
                interval: 80,
            },
        );

        // Values Text (Bottom)
        sr.reveal(
            '.trust-animation, .commitment-animation, .integrity-animation, .result-animation',
            {
                ...defaultOptions,
                origin: 'bottom',
                interval: 80,
            },
        );

        // Service Cards
        sr.reveal('.event-item', {
            ...defaultOptions,
            origin: 'bottom',
            interval: 50, // Faster stagger
        });

        // About Tab
        sr.reveal('.about-tab', { ...defaultOptions, origin: 'top' });
    }, []);
};
