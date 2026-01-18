'use client';

import { useEffect } from 'react';
import { getFontsToLoad } from '@/lib/constants/fonts';

/**
 * FontLoader - Lazily loads Google Fonts for the editor
 *
 * Bundle optimization: Instead of loading 50+ font families (~200KB) on every page,
 * fonts are only loaded when the user enters the editor. This significantly
 * improves initial page load for landing page and other routes.
 */
export function FontLoader() {
    useEffect(() => {
        const fontsToLoad = getFontsToLoad();

        // Check if link already exists (prevents duplicate loads)
        const existingLink = document.querySelector(`link[href*="fonts.googleapis.com/css2"]`);
        if (existingLink) {
            return;
        }

        // Create a single Google Fonts URL with all fonts
        // Format: family=Font1:wght@weights&family=Font2:wght@weights
        const fontFamiliesParam = fontsToLoad.map(f => `family=${f}`).join('&');
        const googleFontsUrl = `https://fonts.googleapis.com/css2?${fontFamiliesParam}&display=swap`;

        // Create and append the link element with non-blocking load
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = googleFontsUrl;
        link.media = 'print'; // Load without blocking render
        link.onload = () => {
            link.media = 'all'; // Apply styles once loaded
        };

        document.head.appendChild(link);

        // Fonts persist in browser cache, no cleanup needed
    }, []);

    return null;
}
