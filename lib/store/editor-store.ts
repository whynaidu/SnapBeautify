import { create } from 'zustand';
import {
    BackgroundType,
    FrameType,
    //     ShadowSize, // Deprecated
    ExportFormat,
    ExportScale,
    EditorState,
    EditorActions,
} from '@/types/editor';

const DEFAULT_STATE: EditorState = {
    originalImage: null,
    imageDataUrl: null,
    backgroundType: 'gradient',
    backgroundColor: '#6366f1',
    gradientColors: ['#6366f1', '#8b5cf6'],
    gradientAngle: 135,
    meshGradientCSS: '',
    backgroundImage: null,
    padding: 64,
    shadowBlur: 20, // Default blur
    shadowOpacity: 50, // Default opacity %
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    imageScale: 1,
    rotation: 0,
    frameType: 'none',
    frameColor: '#1f2937',
    aspectRatio: null,
    canvasWidth: 1600,
    canvasHeight: 900,
    exportFormat: 'png',
    exportScale: 2,
};

export const useEditorStore = create<EditorState & EditorActions>((set, get) => ({
    ...DEFAULT_STATE,

    setImage: (image: HTMLImageElement, dataUrl: string) => {
        const padding = get().padding;
        const frameType = get().frameType;

        // Calculate additional dimensions for frames
        let frameOffsetY = 0;
        let frameOffsetX = 0;
        if (frameType === 'browser') frameOffsetY = 40;
        else if (frameType === 'macos') frameOffsetY = 32;
        else if (frameType === 'windows') frameOffsetY = 32;
        else if (frameType === 'iphone') { frameOffsetX = 32; frameOffsetY = 32; }
        else if (frameType === 'android') { frameOffsetX = 24; frameOffsetY = 24; }

        const width = image.width + padding * 2 + frameOffsetX;
        const height = image.height + padding * 2 + frameOffsetY;

        set({
            originalImage: image,
            imageDataUrl: dataUrl,
            imageScale: 1, // Reset scale for new image
            canvasWidth: width,
            canvasHeight: height,
        });
    },

    clearImage: () =>
        set({
            originalImage: null,
            imageDataUrl: null,
        }),

    setBackgroundType: (type: BackgroundType) => set({ backgroundType: type }),

    setBackgroundColor: (color: string) =>
        set({ backgroundColor: color, backgroundType: 'solid' }),

    setGradient: (colors: [string, string], angle = 135) =>
        set({
            gradientColors: colors,
            gradientAngle: angle,
            backgroundType: 'gradient',
        }),

    setMeshGradient: (css: string) =>
        set({ meshGradientCSS: css, backgroundType: 'mesh' }),

    setBackgroundImage: (url: string) =>
        set({ backgroundImage: url, backgroundType: 'image' }),

    setPadding: (padding: number) => {
        const image = get().originalImage;
        const frameType = get().frameType;

        let frameOffsetY = 0;
        let frameOffsetX = 0;
        if (frameType === 'browser') frameOffsetY = 40;
        else if (frameType === 'macos') frameOffsetY = 32;
        else if (frameType === 'windows') frameOffsetY = 32;
        else if (frameType === 'iphone') { frameOffsetX = 32; frameOffsetY = 32; }
        else if (frameType === 'android') { frameOffsetX = 24; frameOffsetY = 24; }

        if (image) {
            const updates: Partial<EditorState> = { padding };

            // Only update canvas dimensions if no fixed aspect ratio is set
            if (!get().aspectRatio) {
                const scale = get().imageScale;
                updates.canvasWidth = Math.round(image.width * scale) + padding * 2 + frameOffsetX;
                updates.canvasHeight = Math.round(image.height * scale) + padding * 2 + frameOffsetY;
            }

            set(updates);
        } else {
            set({ padding });
        }
    },

    setShadowBlur: (blur: number) => set({ shadowBlur: blur }),

    setShadowOpacity: (opacity: number) => set({ shadowOpacity: Math.max(0, Math.min(100, opacity)) }),

    setShadowColor: (color: string) => set({ shadowColor: color }),

    setBorderRadius: (radius: number) => set({ borderRadius: radius }),

    setFrameType: (frame: FrameType) => {
        const image = get().originalImage;
        const padding = get().padding;

        let frameOffsetY = 0;
        let frameOffsetX = 0;
        if (frame === 'browser') frameOffsetY = 40;
        else if (frame === 'macos') frameOffsetY = 32;
        else if (frame === 'windows') frameOffsetY = 32;
        else if (frame === 'iphone') { frameOffsetX = 32; frameOffsetY = 32; }
        else if (frame === 'android') { frameOffsetX = 24; frameOffsetY = 24; }

        if (image) {
            const updates: Partial<EditorState> = { frameType: frame };

            // Only update canvas dimensions if no fixed aspect ratio is set
            if (!get().aspectRatio) {
                const scale = get().imageScale;
                updates.canvasWidth = Math.round(image.width * scale) + padding * 2 + frameOffsetX;
                updates.canvasHeight = Math.round(image.height * scale) + padding * 2 + frameOffsetY;
            }

            set(updates);
        } else {
            set({ frameType: frame });
        }
    },

    setAspectRatio: (ratio: string | null) => set({ aspectRatio: ratio }),

    setExportFormat: (format: ExportFormat) => set({ exportFormat: format }),

    setExportScale: (scale: ExportScale) => set({ exportScale: scale }),

    setImageScale: (scale: number) => {
        const image = get().originalImage;
        const padding = get().padding;
        const frameType = get().frameType;

        let frameOffsetY = 0;
        let frameOffsetX = 0;
        if (frameType === 'browser') frameOffsetY = 40;
        else if (frameType === 'macos') frameOffsetY = 32;
        else if (frameType === 'windows') frameOffsetY = 32;
        else if (frameType === 'iphone') { frameOffsetX = 32; frameOffsetY = 32; }
        else if (frameType === 'android') { frameOffsetX = 24; frameOffsetY = 24; }

        const updates: Partial<EditorState> = { imageScale: scale };

        if (image && !get().aspectRatio) {
            updates.canvasWidth = Math.round(image.width * scale) + padding * 2 + frameOffsetX;
            updates.canvasHeight = Math.round(image.height * scale) + padding * 2 + frameOffsetY;
        }

        set(updates);
    },

    setRotation: (rotation: number) => set({ rotation: rotation }),

    resetToDefaults: () => set(DEFAULT_STATE),
}));
