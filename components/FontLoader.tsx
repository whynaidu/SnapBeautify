'use client';

import { useEffect } from 'react';
import { getFontsToLoad } from '@/lib/constants/fonts';

export function FontLoader() {
    useEffect(() => {
        const fontsToLoad = getFontsToLoad();

        // Check if link already exists
        const existingLink = document.querySelector(`link[href*="fonts.googleapis.com"]`);
        if (existingLink) {
            return;
        }

        // Create a single Google Fonts URL with all fonts
        // Format: family=Font1:wght@weights&family=Font2:wght@weights
        const fontFamiliesParam = fontsToLoad.map(f => `family=${f}`).join('&');
        const googleFontsUrl = `https://fonts.googleapis.com/css2?${fontFamiliesParam}&display=swap`;

        console.log('Loading Google Fonts:', googleFontsUrl.substring(0, 150) + '...');

        // Create and append the link element
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = googleFontsUrl;

        // Add onload handler to confirm fonts are loaded
        link.onload = () => {
            console.log('Google Fonts loaded successfully');
        };

        link.onerror = () => {
            console.error('Failed to load Google Fonts');
        };

        document.head.appendChild(link);

        return () => {
            // Cleanup on unmount (optional, usually fonts stay loaded)
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }
        };
    }, []);

    return null;
}
