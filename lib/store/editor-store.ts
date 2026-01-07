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
import { calculateFrameOffsets } from '@/lib/canvas/layout';

const DEFAULT_STATE: EditorState = {
    originalImage: null,
    imageDataUrl: null,
    backgroundType: 'gradient',
    backgroundColor: '#6366f1',
    gradientColors: ['#6366f1', '#8b5cf6'],
    gradientAngle: 135,
    meshGradientCSS: '',
    backgroundImage: null,
    textPatternText: 'WELCOME',
    textPatternColor: '#ffffff',
    textPatternOpacity: 0.1,
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

/**
 * Helper function to recalculate canvas dimensions
 * Called immediately to prevent visual stuttering from delayed dimension updates
 */
const recalculateCanvasDimensions = (
    state: EditorState & EditorActions,
    updates: Partial<EditorState>
): Partial<EditorState> => {
    const image = state.originalImage;
    const aspectRatio = state.aspectRatio;

    // If no image or aspect ratio is set, don't recalculate
    if (!image || aspectRatio) {
        return updates;
    }

    const padding = updates.padding !== undefined ? updates.padding : state.padding;
    const frameType = updates.frameType !== undefined ? updates.frameType : state.frameType;
    const imageScale = updates.imageScale !== undefined ? updates.imageScale : state.imageScale;

    const frameOffsets = calculateFrameOffsets(frameType, imageScale);
    const canvasWidth = Math.round(image.width * imageScale) + padding * 2 + frameOffsets.offsetX;
    const canvasHeight = Math.round(image.height * imageScale) + padding * 2 + frameOffsets.offsetY;

    return {
        ...updates,
        canvasWidth,
        canvasHeight,
    };
};

export const useEditorStore = create<EditorState & EditorActions>((set, get) => ({
    ...DEFAULT_STATE,

    setImage: (image: HTMLImageElement, dataUrl: string) => {
        const padding = get().padding;
        const frameType = get().frameType;

        // Calculate additional dimensions for frames using centralized function
        const frameOffsets = calculateFrameOffsets(frameType, 1);

        const width = image.width + padding * 2 + frameOffsets.offsetX;
        const height = image.height + padding * 2 + frameOffsets.offsetY;

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

    setTextPattern: (text: string, colors: [string, string], angle: number, textColor: string, textOpacity: number) =>
        set({
            textPatternText: text,
            gradientColors: colors,
            gradientAngle: angle,
            textPatternColor: textColor,
            textPatternOpacity: textOpacity,
            backgroundType: 'textPattern',
        }),

    setPadding: (padding: number) => {
        const state = get();

        // Calculate dimensions immediately to prevent visual stuttering
        if (state.originalImage && !state.aspectRatio) {
            const updates = recalculateCanvasDimensions(state, { padding });
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
        const state = get();

        // Calculate dimensions immediately to prevent visual stuttering
        if (state.originalImage && !state.aspectRatio) {
            const updates = recalculateCanvasDimensions(state, { frameType: frame });
            set(updates);
        } else {
            set({ frameType: frame });
        }
    },

    setAspectRatio: (ratio: string | null) => set({ aspectRatio: ratio }),

    setExportFormat: (format: ExportFormat) => set({ exportFormat: format }),

    setExportScale: (scale: ExportScale) => set({ exportScale: scale }),

    setImageScale: (scale: number) => {
        const state = get();

        // Calculate dimensions immediately to prevent visual stuttering
        if (state.originalImage && !state.aspectRatio) {
            const updates = recalculateCanvasDimensions(state, { imageScale: scale });
            set(updates);
        } else {
            set({ imageScale: scale });
        }
    },

    setRotation: (rotation: number) => set({ rotation: rotation }),

    resetToDefaults: () => set(DEFAULT_STATE),
}));
