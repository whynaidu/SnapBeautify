/**
 * Rendering Constants
 * Centralized constants for canvas rendering and image processing
 */

import { FrameType } from '@/types/editor';

/**
 * Image Loading Constants
 */
export const IMAGE_LOADING = {
    TIMEOUT_MS: 10000, // 10 seconds - Android content URIs can be slow
    RETRY_DELAY_MS: 300,
    MAX_RETRIES: 2,
} as const;

/**
 * File Validation Constants
 */
export const FILE_VALIDATION = {
    MAX_SIZE_BYTES: 50 * 1024 * 1024, // 50MB
    MIN_SUSPICIOUS_SIZE_BYTES: 1000, // Potential image bomb detection
    ALLOWED_TYPES: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'] as const,
} as const;

/**
 * Shadow Rendering Constants
 */
export const SHADOW = {
    BLUR_MULTIPLIER: 2, // Matches CSS blur-radius convention
    OFFSET_RATIO: 0.5, // Creates realistic bottom shadow
    DEFAULT_BLUR: 20,
    DEFAULT_OPACITY: 50, // Percentage
    DEFAULT_COLOR: 'rgba(0, 0, 0, 0.5)',
} as const;

/**
 * Frame Dimensions
 * Frame offsets for different device types
 */
export const FRAME_OFFSETS: Record<FrameType, { x: number; y: number; top: number; bottom: number; left: number; right: number }> = {
    none: { x: 0, y: 0, top: 0, bottom: 0, left: 0, right: 0 },
    browser: { x: 0, y: 40, top: 40, bottom: 0, left: 0, right: 0 },
    macos: { x: 0, y: 32, top: 32, bottom: 0, left: 0, right: 0 },
    windows: { x: 0, y: 32, top: 32, bottom: 0, left: 0, right: 0 },
    iphone: { x: 32, y: 32, top: 16, bottom: 16, left: 16, right: 16 },
    android: { x: 24, y: 24, top: 12, bottom: 12, left: 12, right: 12 },
} as const;

/**
 * Browser Frame Constants
 */
export const BROWSER_FRAME = {
    TITLE_BAR_HEIGHT: 40,
    MIN_BORDER_RADIUS: 12,
    DOT_RADIUS: 6,
    DOT_SPACING: 20,
    DOT_START_X: 16,
    URL_BAR: {
        X_OFFSET: 80,
        Y_OFFSET: 10,
        WIDTH_OFFSET: 160, // Subtracted from total width
        HEIGHT: 20,
        BORDER_RADIUS: 6,
    },
    COLORS: {
        BACKGROUND: '#1f2937',
        URL_BAR: '#374151',
        RED_DOT: '#ef4444',
        YELLOW_DOT: '#eab308',
        GREEN_DOT: '#22c55e',
    },
} as const;

/**
 * macOS Frame Constants
 */
export const MACOS_FRAME = {
    TITLE_BAR_HEIGHT: 32,
    MIN_BORDER_RADIUS: 10,
    DOT_RADIUS: 6,
    DOT_SPACING: 20,
    DOT_START_X: 14,
    COLORS: {
        BACKGROUND: '#27272a',
        RED_DOT: '#ef4444',
        YELLOW_DOT: '#eab308',
        GREEN_DOT: '#22c55e',
    },
} as const;

/**
 * Windows Frame Constants
 */
export const WINDOWS_FRAME = {
    TITLE_BAR_HEIGHT: 32,
    MIN_BORDER_RADIUS: 8,
    CONTROL_SPACING: 46,
    CONTROL_START_X_OFFSET: 44,
    CONTROL_SIZE: 10,
    LINE_WIDTH: 1.5,
    COLORS: {
        BACKGROUND: '#1e1e1e',
        CONTROLS: '#ffffff',
    },
} as const;

/**
 * iPhone Frame Constants
 */
export const IPHONE_FRAME = {
    BORDER_RADIUS: 32,
    SCREEN_RADIUS: 24,
    BUTTON: {
        WIDTH: 3,
        VOLUME_UP_Y: 100,
        VOLUME_DOWN_OFFSET: 50, // Added to VOLUME_UP_Y
        POWER_Y: 100,
        POWER_HEIGHT: 60,
    },
    DYNAMIC_ISLAND: {
        MAX_WIDTH: 120, // iPhone 14 Pro Dynamic Island spec
        WIDTH_RATIO: 0.35, // Maintains proportions across sizes
        HEIGHT: 35,
        TOP_OFFSET: 12,
        BORDER_RADIUS: 18,
    },
    COLORS: {
        BODY: '#000000',
        STROKE: '#333333',
        BUTTON: '#111111',
        ISLAND: '#000000',
    },
    STROKE_WIDTH: 2,
} as const;

/**
 * Android Frame Constants
 */
export const ANDROID_FRAME = {
    BORDER_RADIUS: 24,
    SCREEN_RADIUS: 18,
    BUTTON: {
        WIDTH: 3,
        POWER_Y: 80,
        POWER_HEIGHT: 40,
        VOLUME_Y_OFFSET: 55, // Added to POWER_Y + POWER_HEIGHT
        VOLUME_HEIGHT: 80,
    },
    CAMERA_DOT: {
        SIZE: 12,
        TOP_OFFSET: 18,
    },
    COLORS: {
        BODY: '#121212',
        STROKE: '#333333',
        BUTTON: '#161616',
        CAMERA: '#000000',
    },
    STROKE_WIDTH: 2,
} as const;

/**
 * Mesh Gradient Constants
 */
export const MESH_GRADIENT = {
    BASE_COLOR: '#0f172a',
    DEFAULT_SIZE: 0.5, // Percentage of canvas
    FALLBACK_COLORS: [
        { x: 0.4, y: 0.2, color: '#4f46e5' },
        { x: 0.8, y: 0.1, color: '#f472b6' },
        { x: 0.1, y: 0.5, color: '#0ea5e9' },
        { x: 0.9, y: 0.5, color: '#22c55e' },
        { x: 0.2, y: 0.9, color: '#f97316' },
        { x: 0.8, y: 0.9, color: '#8b5cf6' },
    ],
    COMPOSITE_OPERATION: 'screen',
} as const;

/**
 * Checkerboard Pattern Constants (for transparency)
 */
export const CHECKERBOARD = {
    TILE_SIZE: 10,
    COLOR_LIGHT: '#ffffff',
    COLOR_DARK: '#e5e5e5',
} as const;

/**
 * Export Constants
 */
export const EXPORT = {
    DEFAULT_QUALITY: 0.92, // JPEG/WebP quality
    SCALES: [1, 2, 3, 4] as const,
    DEFAULT_SCALE: 2,
    DEFAULT_FORMAT: 'png' as const,
} as const;

/**
 * Canvas Pool Constants
 */
export const CANVAS_POOL = {
    MAX_SIZE: 5,
    MAX_IDLE_TIME_MS: 30000, // 30 seconds
    CLEANUP_INTERVAL_MS: 30000, // 30 seconds
} as const;

/**
 * Performance Constants
 */
export const PERFORMANCE = {
    RENDER_DELAY_MS: 0, // Small delay before heavy canvas operation
    CLEANUP_DELAY_MS: 100, // Delay before cleanup operations
    EXPORT_TIMEOUT_MS: 30000, // 30 seconds max for export operations
} as const;

/**
 * Touch Target Sizes (Accessibility)
 */
export const TOUCH_TARGETS = {
    IOS_MIN: 44, // iOS minimum touch target
    ANDROID_MIN: 48, // Android minimum touch target
    RECOMMENDED: 48, // Recommended for all platforms
} as const;

/**
 * Default Canvas Dimensions
 */
export const CANVAS_DEFAULTS = {
    WIDTH: 1600,
    HEIGHT: 900,
    PADDING: 64,
    BORDER_RADIUS: 12,
} as const;
