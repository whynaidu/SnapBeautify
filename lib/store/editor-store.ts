import { create } from 'zustand';
import {
    BackgroundType,
    FrameType,
    ShadowSize,
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
    shadowSize: 'lg',
    shadowIntensity: 50,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
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

        // Calculate additional height for frames
        let frameOffset = 0;
        if (frameType === 'browser') frameOffset = 40;
        else if (frameType === 'macos') frameOffset = 32;
        else if (frameType === 'windows') frameOffset = 32;

        const width = image.width + padding * 2;
        const height = image.height + padding * 2 + frameOffset;

        set({
            originalImage: image,
            imageDataUrl: dataUrl,
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

        let frameOffset = 0;
        if (frameType === 'browser') frameOffset = 40;
        else if (frameType === 'macos') frameOffset = 32;
        else if (frameType === 'windows') frameOffset = 32;

        if (image) {
            const updates: Partial<EditorState> = { padding };

            // Only update canvas dimensions if no fixed aspect ratio is set
            if (!get().aspectRatio) {
                updates.canvasWidth = image.width + padding * 2;
                updates.canvasHeight = image.height + padding * 2 + frameOffset;
            }

            set(updates);
        } else {
            set({ padding });
        }
    },

    setShadowSize: (size: ShadowSize) => set({ shadowSize: size }),

    setShadowIntensity: (intensity: number) => set({ shadowIntensity: Math.max(0, Math.min(100, intensity)) }),

    setBorderRadius: (radius: number) => set({ borderRadius: radius }),

    setFrameType: (frame: FrameType) => {
        const image = get().originalImage;
        const padding = get().padding;

        let frameOffset = 0;
        if (frame === 'browser') frameOffset = 40;
        else if (frame === 'macos') frameOffset = 32;
        else if (frame === 'windows') frameOffset = 32;

        if (image) {
            const updates: Partial<EditorState> = { frameType: frame };

            // Only update canvas dimensions if no fixed aspect ratio is set
            if (!get().aspectRatio) {
                updates.canvasWidth = image.width + padding * 2;
                updates.canvasHeight = image.height + padding * 2 + frameOffset;
            }

            set(updates);
        } else {
            set({ frameType: frame });
        }
    },

    setAspectRatio: (ratio: string | null) => set({ aspectRatio: ratio }),

    setExportFormat: (format: ExportFormat) => set({ exportFormat: format }),

    setExportScale: (scale: ExportScale) => set({ exportScale: scale }),

    setImageScale: (scale: number) => set({ imageScale: scale }),

    setRotation: (rotation: number) => set({ rotation: rotation }),

    resetToDefaults: () => set(DEFAULT_STATE),
}));
