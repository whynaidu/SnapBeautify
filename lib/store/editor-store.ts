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
import { debounce } from '@/lib/utils/debounce';

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

/**
 * Helper function to recalculate canvas dimensions
 * This is debounced to prevent race conditions during rapid state changes
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

// Create debounced version of dimension recalculation (16ms = 60fps)
const debouncedRecalc = debounce((get: () => EditorState & EditorActions, set: (updates: Partial<EditorState>) => void) => {
    const state = get();
    const updates = recalculateCanvasDimensions(state, {});
    set(updates);
}, 16);

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

    setPadding: (padding: number) => {
        // Update padding immediately
        set({ padding });

        // Debounce dimension recalculation to prevent race conditions
        if (get().originalImage && !get().aspectRatio) {
            debouncedRecalc(get, set);
        }
    },

    setShadowBlur: (blur: number) => set({ shadowBlur: blur }),

    setShadowOpacity: (opacity: number) => set({ shadowOpacity: Math.max(0, Math.min(100, opacity)) }),

    setShadowColor: (color: string) => set({ shadowColor: color }),

    setBorderRadius: (radius: number) => set({ borderRadius: radius }),

    setFrameType: (frame: FrameType) => {
        // Update frame type immediately
        set({ frameType: frame });

        // Debounce dimension recalculation to prevent race conditions
        if (get().originalImage && !get().aspectRatio) {
            debouncedRecalc(get, set);
        }
    },

    setAspectRatio: (ratio: string | null) => set({ aspectRatio: ratio }),

    setExportFormat: (format: ExportFormat) => set({ exportFormat: format }),

    setExportScale: (scale: ExportScale) => set({ exportScale: scale }),

    setImageScale: (scale: number) => {
        // Update image scale immediately
        set({ imageScale: scale });

        // Debounce dimension recalculation to prevent race conditions
        if (get().originalImage && !get().aspectRatio) {
            debouncedRecalc(get, set);
        }
    },

    setRotation: (rotation: number) => set({ rotation: rotation }),

    resetToDefaults: () => set(DEFAULT_STATE),
}));
