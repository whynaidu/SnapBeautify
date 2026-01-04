import { ShadowSize, ShadowPreset } from '@/types/editor';

// Enhanced shadow presets with more visible defaults
export const SHADOW_PRESETS: Record<ShadowSize, ShadowPreset> = {
    none: { blur: 0, spread: 0, offsetY: 0, opacity: 0 },
    sm: { blur: 15, spread: 0, offsetY: 6, opacity: 0.2 },
    md: { blur: 30, spread: 0, offsetY: 12, opacity: 0.3 },
    lg: { blur: 50, spread: 0, offsetY: 20, opacity: 0.4 },
    xl: { blur: 80, spread: 0, offsetY: 30, opacity: 0.5 },
};

export const SHADOW_OPTIONS: { value: ShadowSize; label: string }[] = [
    { value: 'none', label: 'None' },
    { value: 'sm', label: 'S' },
    { value: 'md', label: 'M' },
    { value: 'lg', label: 'L' },
    { value: 'xl', label: 'XL' },
];
