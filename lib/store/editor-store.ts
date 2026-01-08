import { create } from 'zustand';
import {
    BackgroundType,
    FrameType,
    //     ShadowSize, // Deprecated
    ExportFormat,
    ExportScale,
    EditorState,
    EditorActions,
    TextPosition,
    TextOverlay,
    CropArea,
} from '@/types/editor';
import { calculateFrameOffsets } from '@/lib/canvas/layout';

const DEFAULT_STATE: EditorState = {
    originalImage: null,
    imageDataUrl: null,
    uncroppedImage: null,
    uncroppedImageDataUrl: null,
    backgroundType: 'gradient',
    backgroundColor: '#6366f1',
    gradientColors: ['#6366f1', '#8b5cf6'],
    gradientAngle: 135,
    meshGradientCSS: '',
    backgroundImage: null,
    textPatternText: 'WELCOME',
    textPatternColor: '#ffffff',
    textPatternOpacity: 0.1,
    textPatternPositions: ['center'], // Default to center only
    textPatternFontFamily: 'system-ui, -apple-system, sans-serif',
    textPatternFontSize: 0.35, // 35% of canvas dimension
    textPatternFontWeight: 900,
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
    textOverlays: [],
    selectedTextOverlayId: null,
    isCropping: false,
    cropArea: null,
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
            uncroppedImage: null,
            uncroppedImageDataUrl: null,
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

    updateGradientColors: (colors: [string, string], angle = 135) =>
        set({
            gradientColors: colors,
            gradientAngle: angle,
            // Does NOT change backgroundType - for updating gradients in text patterns
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

    setTextPatternText: (text: string) => set({ textPatternText: text }),

    toggleTextPatternPosition: (position: TextPosition) => {
        const current = get().textPatternPositions;
        const newPositions = current.includes(position)
            ? current.filter(p => p !== position) // Remove if already selected
            : [...current, position]; // Add if not selected

        // Ensure at least one position is always selected
        if (newPositions.length === 0) {
            return;
        }

        set({ textPatternPositions: newPositions });
    },

    setTextPatternFontFamily: (fontFamily: string) => set({ textPatternFontFamily: fontFamily }),

    setTextPatternFontSize: (size: number) => set({ textPatternFontSize: Math.max(0.1, Math.min(1.0, size)) }),

    setTextPatternFontWeight: (weight: number) => set({ textPatternFontWeight: Math.max(100, Math.min(900, weight)) }),

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

    addTextOverlay: () => {
        const id = `text-${Date.now()}`;
        const newOverlay = {
            id,
            text: 'Your Text',
            x: 50, // center
            y: 50, // center
            color: '#ffffff',
            fontSize: 48,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontWeight: 700,
        };
        set({
            textOverlays: [...get().textOverlays, newOverlay],
            selectedTextOverlayId: id,
        });
    },

    removeTextOverlay: (id: string) => {
        const state = get();
        set({
            textOverlays: state.textOverlays.filter(t => t.id !== id),
            selectedTextOverlayId: state.selectedTextOverlayId === id ? null : state.selectedTextOverlayId,
        });
    },

    selectTextOverlay: (id: string | null) => set({ selectedTextOverlayId: id }),

    updateTextOverlay: (id: string, updates: Partial<Omit<TextOverlay, 'id'>>) => {
        set({
            textOverlays: get().textOverlays.map(overlay =>
                overlay.id === id ? { ...overlay, ...updates } : overlay
            ),
        });
    },

    enterCropMode: () => {
        const state = get();
        if (!state.originalImage) return;

        // Initialize crop area to cover the entire image (with 10% padding)
        set({
            isCropping: true,
            cropArea: {
                x: 10,
                y: 10,
                width: 80,
                height: 80,
            },
        });
    },

    exitCropMode: () => {
        set({
            isCropping: false,
            cropArea: null,
        });
    },

    setCropArea: (area: CropArea) => {
        set({ cropArea: area });
    },

    applyCrop: async () => {
        const state = get();
        if (!state.originalImage || !state.cropArea) return;

        // Store the original uncropped image before cropping (if not already stored)
        const uncroppedImage = state.uncroppedImage || state.originalImage;
        const uncroppedImageDataUrl = state.uncroppedImageDataUrl || state.imageDataUrl;

        // Create a temporary canvas to crop the image
        const tempCanvas = document.createElement('canvas');
        const ctx = tempCanvas.getContext('2d');
        if (!ctx) return;

        const img = state.originalImage;
        const crop = state.cropArea;

        // Calculate pixel coordinates from percentages
        const cropX = (crop.x / 100) * img.width;
        const cropY = (crop.y / 100) * img.height;
        const cropWidth = (crop.width / 100) * img.width;
        const cropHeight = (crop.height / 100) * img.height;

        // Set canvas size to cropped dimensions
        tempCanvas.width = cropWidth;
        tempCanvas.height = cropHeight;

        // Draw the cropped portion
        ctx.drawImage(
            img,
            cropX, cropY, cropWidth, cropHeight,
            0, 0, cropWidth, cropHeight
        );

        // Convert to data URL
        const croppedDataUrl = tempCanvas.toDataURL('image/png');

        // Create new image from cropped data
        const croppedImage = new Image();
        await new Promise<void>((resolve, reject) => {
            croppedImage.onload = () => resolve();
            croppedImage.onerror = () => reject(new Error('Failed to load cropped image'));
            croppedImage.src = croppedDataUrl;
        });

        // Update the store with the cropped image
        const padding = state.padding;
        const frameType = state.frameType;
        const frameOffsets = calculateFrameOffsets(frameType, 1);
        const width = croppedImage.width + padding * 2 + frameOffsets.offsetX;
        const height = croppedImage.height + padding * 2 + frameOffsets.offsetY;

        set({
            originalImage: croppedImage,
            imageDataUrl: croppedDataUrl,
            uncroppedImage: uncroppedImage,
            uncroppedImageDataUrl: uncroppedImageDataUrl,
            imageScale: 1,
            canvasWidth: width,
            canvasHeight: height,
            isCropping: false,
            cropArea: null,
        });
    },

    revertCrop: () => {
        const state = get();
        if (!state.uncroppedImage || !state.uncroppedImageDataUrl) return;

        // Restore the original uncropped image
        const padding = state.padding;
        const frameType = state.frameType;
        const frameOffsets = calculateFrameOffsets(frameType, 1);
        const width = state.uncroppedImage.width + padding * 2 + frameOffsets.offsetX;
        const height = state.uncroppedImage.height + padding * 2 + frameOffsets.offsetY;

        set({
            originalImage: state.uncroppedImage,
            imageDataUrl: state.uncroppedImageDataUrl,
            uncroppedImage: null,
            uncroppedImageDataUrl: null,
            imageScale: 1,
            canvasWidth: width,
            canvasHeight: height,
        });
    },

    resetToDefaults: () => set(DEFAULT_STATE),
}));
