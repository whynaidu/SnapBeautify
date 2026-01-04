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
        titleBarHeight: 40,
        borderRadius: 12,
        padding: 0,
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
        titleBarHeight: 0,
        borderRadius: 44,
        padding: 12,
    },
    android: {
        name: 'Android',
        type: 'android',
        titleBarHeight: 0,
        borderRadius: 20,
        padding: 8,
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
