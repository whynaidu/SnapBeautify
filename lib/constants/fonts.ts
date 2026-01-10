// Google Fonts organized by categories

export interface FontOption {
    name: string;
    fontFamily: string;
    weight?: string; // Google Fonts weight to load
}

export type FontCategory =
    | 'popular'
    | 'serif'
    | 'sans-serif'
    | 'display'
    | 'handwriting'
    | 'monospace';

export const FONT_CATEGORIES: Record<FontCategory, string> = {
    popular: 'Popular',
    'sans-serif': 'Sans Serif',
    serif: 'Serif',
    display: 'Display',
    handwriting: 'Handwriting',
    monospace: 'Monospace',
};

export const FONTS_BY_CATEGORY: Record<FontCategory, FontOption[]> = {
    popular: [
        { name: 'System UI', fontFamily: 'system-ui, -apple-system, sans-serif' },
        { name: 'Roboto', fontFamily: 'Roboto, sans-serif', weight: '100;300;400;500;700;900' },
        { name: 'Open Sans', fontFamily: '"Open Sans", sans-serif', weight: '300;400;500;600;700;800' },
        { name: 'Montserrat', fontFamily: 'Montserrat, sans-serif', weight: '100;200;300;400;500;600;700;800;900' },
        { name: 'Lato', fontFamily: 'Lato, sans-serif', weight: '100;300;400;700;900' },
        { name: 'Poppins', fontFamily: 'Poppins, sans-serif', weight: '100;200;300;400;500;600;700;800;900' },
        { name: 'Inter', fontFamily: 'Inter, sans-serif', weight: '100;200;300;400;500;600;700;800;900' },
        { name: 'Playfair Display', fontFamily: '"Playfair Display", serif', weight: '400;500;600;700;800;900' },
    ],
    'sans-serif': [
        { name: 'Roboto', fontFamily: 'Roboto, sans-serif', weight: '100;300;400;500;700;900' },
        { name: 'Open Sans', fontFamily: '"Open Sans", sans-serif', weight: '300;400;500;600;700;800' },
        { name: 'Montserrat', fontFamily: 'Montserrat, sans-serif', weight: '100;200;300;400;500;600;700;800;900' },
        { name: 'Lato', fontFamily: 'Lato, sans-serif', weight: '100;300;400;700;900' },
        { name: 'Poppins', fontFamily: 'Poppins, sans-serif', weight: '100;200;300;400;500;600;700;800;900' },
        { name: 'Inter', fontFamily: 'Inter, sans-serif', weight: '100;200;300;400;500;600;700;800;900' },
        { name: 'Raleway', fontFamily: 'Raleway, sans-serif', weight: '100;200;300;400;500;600;700;800;900' },
        { name: 'Nunito', fontFamily: 'Nunito, sans-serif', weight: '200;300;400;500;600;700;800;900' },
        { name: 'Ubuntu', fontFamily: 'Ubuntu, sans-serif', weight: '300;400;500;700' },
        { name: 'Work Sans', fontFamily: '"Work Sans", sans-serif', weight: '100;200;300;400;500;600;700;800;900' },
        { name: 'Rubik', fontFamily: 'Rubik, sans-serif', weight: '300;400;500;600;700;800;900' },
        { name: 'Quicksand', fontFamily: 'Quicksand, sans-serif', weight: '300;400;500;600;700' },
    ],
    serif: [
        { name: 'Playfair Display', fontFamily: '"Playfair Display", serif', weight: '400;500;600;700;800;900' },
        { name: 'Merriweather', fontFamily: 'Merriweather, serif', weight: '300;400;700;900' },
        { name: 'Lora', fontFamily: 'Lora, serif', weight: '400;500;600;700' },
        { name: 'PT Serif', fontFamily: '"PT Serif", serif', weight: '400;700' },
        { name: 'Crimson Text', fontFamily: '"Crimson Text", serif', weight: '400;600;700' },
        { name: 'EB Garamond', fontFamily: '"EB Garamond", serif', weight: '400;500;600;700;800' },
        { name: 'Libre Baskerville', fontFamily: '"Libre Baskerville", serif', weight: '400;700' },
        { name: 'Cormorant', fontFamily: 'Cormorant, serif', weight: '300;400;500;600;700' },
        { name: 'Cinzel', fontFamily: 'Cinzel, serif', weight: '400;500;600;700;800;900' },
        { name: 'Spectral', fontFamily: 'Spectral, serif', weight: '200;300;400;500;600;700;800' },
    ],
    display: [
        { name: 'Bebas Neue', fontFamily: '"Bebas Neue", sans-serif', weight: '400' },
        { name: 'Righteous', fontFamily: 'Righteous, sans-serif', weight: '400' },
        { name: 'Anton', fontFamily: 'Anton, sans-serif', weight: '400' },
        { name: 'Archivo Black', fontFamily: '"Archivo Black", sans-serif', weight: '400' },
        { name: 'Oswald', fontFamily: 'Oswald, sans-serif', weight: '200;300;400;500;600;700' },
        { name: 'Fredoka', fontFamily: 'Fredoka, sans-serif', weight: '300;400;500;600;700' },
        { name: 'Titan One', fontFamily: '"Titan One", sans-serif', weight: '400' },
        { name: 'Bungee', fontFamily: 'Bungee, sans-serif', weight: '400' },
        { name: 'Black Ops One', fontFamily: '"Black Ops One", sans-serif', weight: '400' },
        { name: 'Alfa Slab One', fontFamily: '"Alfa Slab One", sans-serif', weight: '400' },
        { name: 'Staatliches', fontFamily: 'Staatliches, sans-serif', weight: '400' },
        { name: 'Press Start 2P', fontFamily: '"Press Start 2P", monospace', weight: '400' },
        { name: 'Londrina Solid', fontFamily: '"Londrina Solid", sans-serif', weight: '100;300;400;900' },
    ],
    handwriting: [
        { name: 'Dancing Script', fontFamily: '"Dancing Script", cursive', weight: '400;500;600;700' },
        { name: 'Pacifico', fontFamily: 'Pacifico, cursive', weight: '400' },
        { name: 'Satisfy', fontFamily: 'Satisfy, cursive', weight: '400' },
        { name: 'Great Vibes', fontFamily: '"Great Vibes", cursive', weight: '400' },
        { name: 'Caveat', fontFamily: 'Caveat, cursive', weight: '400;500;600;700' },
        { name: 'Shadows Into Light', fontFamily: '"Shadows Into Light", cursive', weight: '400' },
        { name: 'Kalam', fontFamily: 'Kalam, cursive', weight: '300;400;700' },
        { name: 'Permanent Marker', fontFamily: '"Permanent Marker", cursive', weight: '400' },
        { name: 'Cookie', fontFamily: 'Cookie, cursive', weight: '400' },
        { name: 'Sacramento', fontFamily: 'Sacramento, cursive', weight: '400' },
    ],
    monospace: [
        { name: 'Roboto Mono', fontFamily: '"Roboto Mono", monospace', weight: '100;200;300;400;500;600;700' },
        { name: 'JetBrains Mono', fontFamily: '"JetBrains Mono", monospace', weight: '100;200;300;400;500;600;700;800' },
        { name: 'Fira Code', fontFamily: '"Fira Code", monospace', weight: '300;400;500;600;700' },
        { name: 'Source Code Pro', fontFamily: '"Source Code Pro", monospace', weight: '200;300;400;500;600;700;800;900' },
        { name: 'Space Mono', fontFamily: '"Space Mono", monospace', weight: '400;700' },
        { name: 'IBM Plex Mono', fontFamily: '"IBM Plex Mono", monospace', weight: '100;200;300;400;500;600;700' },
        { name: 'Courier Prime', fontFamily: '"Courier Prime", monospace', weight: '400;700' },
    ],
};

// Flatten all fonts for easy lookup
export const ALL_FONTS: FontOption[] = Object.values(FONTS_BY_CATEGORY).flat();

// Get font weights to load from Google Fonts
export function getFontsToLoad(): string[] {
    const fontsToLoad: string[] = [];

    ALL_FONTS.forEach(font => {
        // Skip system fonts
        if (font.fontFamily.includes('system-ui') || font.fontFamily.includes('-apple-system')) {
            return;
        }

        // Extract font name and create Google Fonts URL format
        const fontName = font.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
        const weights = font.weight || '400';
        fontsToLoad.push(`${fontName.replace(/ /g, '+')}:wght@${weights}`);
    });

    return fontsToLoad;
}
