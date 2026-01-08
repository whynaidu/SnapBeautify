import { FrameType } from '@/types/editor';

export interface FrameConfig {
    name: string;
    type: FrameType;
    titleBarHeight: number;
    borderRadius: number;
    padding: number;
}

export const FRAME_CONFIGS: Record<FrameType, FrameConfig> = {
    none: {
        name: 'None',
        type: 'none',
        titleBarHeight: 0,
        borderRadius: 0,
        padding: 0,
    },
    browser: {
        name: 'Browser',
        type: 'browser',
        titleBarHeight: 32,
        borderRadius: 12,
        padding: 1,
    },
    macos: {
        name: 'macOS',
        type: 'macos',
        titleBarHeight: 32,
        borderRadius: 10,
        padding: 0,
    },
    windows: {
        name: 'Windows',
        type: 'windows',
        titleBarHeight: 32,
        borderRadius: 8,
        padding: 0,
    },
    iphone: {
        name: 'iPhone',
        type: 'iphone',
        titleBarHeight: 0, // No title bar, notch included in frame
        borderRadius: 73, // Outer device body radius
        padding: 12, // Thinner bezel thickness
    },
    android: {
        name: 'Android',
        type: 'android',
        titleBarHeight: 0, // No title bar, camera included in frame
        borderRadius: 42, // Outer device body radius (MagicUI)
        padding: 9, // Bezel thickness (MagicUI: SCREEN_X)
    },
};

export const ASPECT_RATIO_PRESETS = [
    { name: 'Free', value: null },
    { name: '16:9', value: '16:9', width: 16, height: 9 },
    { name: '4:3', value: '4:3', width: 4, height: 3 },
    { name: '1:1', value: '1:1', width: 1, height: 1 },
    { name: '9:16', value: '9:16', width: 9, height: 16 },
    { name: 'Twitter', value: 'twitter', width: 1600, height: 900 },
    { name: 'LinkedIn', value: 'linkedin', width: 1200, height: 628 },
    { name: 'Instagram', value: 'instagram', width: 1080, height: 1080 },
    { name: 'Story', value: 'story', width: 1080, height: 1920 },
];
