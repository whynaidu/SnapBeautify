import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
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
    TemplatePreset,
} from '@/types/editor';
import { calculateFrameOffsets } from '@/lib/canvas/layout';

const DEFAULT_STATE: EditorState & { mobileControlsOpen: boolean } = {
    originalImage: null,
    imageDataUrl: null,
    uncroppedImage: null,
    uncroppedImageDataUrl: null,
    mobileControlsOpen: false,
    backgroundType: 'gradient',
    backgroundColor: '#0ea5e9',
    gradientColors: ['#0ea5e9', '#8b5cf6'], // "Ocean" - Free tier gradient (index 1)
    gradientAngle: 135,
    meshGradientCSS: '',
    backgroundImage: null,
    textPatternText: 'WELCOME',
    textPatternColor: '#ffffff',
    textPatternOpacity: 0.1,
    textPatternPositions: ['center'], // Default to center only (legacy)
    textPatternRows: 1, // Default to 1 row
    textPatternFontFamily: 'system-ui, -apple-system, sans-serif',
    textPatternFontSize: 0.35, // 35% of canvas dimension
    textPatternFontWeight: 900,
    waveSplitFlipped: false, // Default: gradient on top, solid on bottom
    logoPatternImage: null,
    logoPatternOpacity: 0.3,
    logoPatternSize: 0.3, // 30% of canvas dimension
    logoPatternSpacing: 1.5, // 1.5x spacing between logos
    padding: 64, // Free tier preset
    shadowBlur: 20, // Free tier default (fixedShadowBlur)
    shadowOpacity: 50, // Free tier default (fixedShadowOpacity * 100)
    shadowColor: '#000000', // Default black (free tier)
    borderRadius: 12, // Free tier preset
    imageScale: 1.0, // Free tier: 100% is within 50-150% range
    rotation: 0,
    frameType: 'none', // Free tier
    frameColor: '#1f2937',
    aspectRatio: null,
    canvasWidth: 1600,
    canvasHeight: 900,
    textOverlays: [],
    selectedTextOverlayId: null,
    isCropping: false,
    cropArea: null,
    exportFormat: 'png', // Free tier
    exportScale: 2, // Free tier (1x or 2x)
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
        const padding = DEFAULT_STATE.padding;
        const imageScale = DEFAULT_STATE.imageScale;
        const frameType = get().frameType;

        // Calculate additional dimensions for frames using centralized function
        const frameOffsets = calculateFrameOffsets(frameType, imageScale);

        const width = Math.round(image.width * imageScale) + padding * 2 + frameOffsets.offsetX;
        const height = Math.round(image.height * imageScale) + padding * 2 + frameOffsets.offsetY;

        set({
            originalImage: image,
            imageDataUrl: dataUrl,
            imageScale: imageScale,
            padding: padding,
            canvasWidth: width,
            canvasHeight: height,
        });
    },

    clearImage: () => {
        // Reset all settings to defaults and clear the image
        get().resetToDefaults();
    },

    setBackgroundType: (type: BackgroundType) => set({ backgroundType: type }),

    setBackgroundColor: (color: string) =>
        set({ backgroundColor: color, backgroundType: 'solid' }),

    updateBackgroundColor: (color: string) =>
        set({ backgroundColor: color }),
        // Does NOT change backgroundType - for updating color in waveSplit

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
            // Does NOT change backgroundType - for updating gradients in text patterns and waveSplit
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

    setTextPatternRows: (rows: number) => set({ textPatternRows: Math.max(1, Math.min(12, rows)) }),

    setTextPatternFontFamily: (fontFamily: string) => set({ textPatternFontFamily: fontFamily }),

    setTextPatternFontSize: (size: number) => set({ textPatternFontSize: Math.max(0.1, Math.min(1.0, size)) }),

    setTextPatternFontWeight: (weight: number) => set({ textPatternFontWeight: Math.max(100, Math.min(900, weight)) }),

    toggleWaveSplitFlip: () => set((state) => ({ waveSplitFlipped: !state.waveSplitFlipped })),

    setLogoPattern: (image: HTMLImageElement) => set({ logoPatternImage: image, backgroundType: 'logoPattern' }),

    clearLogoPattern: () => set({ logoPatternImage: null }),

    setLogoPatternOpacity: (opacity: number) => set({ logoPatternOpacity: Math.max(0, Math.min(1, opacity)) }),

    setLogoPatternSize: (size: number) => set({ logoPatternSize: Math.max(0.1, Math.min(1.0, size)) }),

    setLogoPatternSpacing: (spacing: number) => set({ logoPatternSpacing: Math.max(1.0, Math.min(3.0, spacing)) }),

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

    duplicateTextOverlay: (id: string) => {
        const state = get();
        const originalOverlay = state.textOverlays.find(t => t.id === id);
        if (!originalOverlay) return;

        const newId = `text-${Date.now()}`;
        const duplicatedOverlay = {
            ...originalOverlay,
            id: newId,
            // Offset position slightly (5% down and right) so it's visible
            x: Math.min(originalOverlay.x + 5, 95),
            y: Math.min(originalOverlay.y + 5, 95),
        };

        set({
            textOverlays: [...state.textOverlays, duplicatedOverlay],
            selectedTextOverlayId: newId,
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
        const imageScale = state.imageScale;
        const frameOffsets = calculateFrameOffsets(frameType, imageScale);
        const width = Math.round(croppedImage.width * imageScale) + padding * 2 + frameOffsets.offsetX;
        const height = Math.round(croppedImage.height * imageScale) + padding * 2 + frameOffsets.offsetY;

        set({
            originalImage: croppedImage,
            imageDataUrl: croppedDataUrl,
            uncroppedImage: uncroppedImage,
            uncroppedImageDataUrl: uncroppedImageDataUrl,
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
        const imageScale = state.imageScale;
        const frameOffsets = calculateFrameOffsets(frameType, imageScale);
        const width = Math.round(state.uncroppedImage.width * imageScale) + padding * 2 + frameOffsets.offsetX;
        const height = Math.round(state.uncroppedImage.height * imageScale) + padding * 2 + frameOffsets.offsetY;

        set({
            originalImage: state.uncroppedImage,
            imageDataUrl: state.uncroppedImageDataUrl,
            uncroppedImage: null,
            uncroppedImageDataUrl: null,
            canvasWidth: width,
            canvasHeight: height,
        });
    },

    applyTemplate: (template: TemplatePreset) => {
        const state = get();
        const settings = template.settings;

        // Build the update object
        const updates: Partial<EditorState> = {
            backgroundType: settings.backgroundType,
        };

        // Apply background settings based on type
        if (settings.backgroundColor !== undefined) {
            updates.backgroundColor = settings.backgroundColor;
        }
        if (settings.gradientColors !== undefined) {
            updates.gradientColors = settings.gradientColors;
        }
        if (settings.gradientAngle !== undefined) {
            updates.gradientAngle = settings.gradientAngle;
        }
        if (settings.meshGradientCSS !== undefined) {
            updates.meshGradientCSS = settings.meshGradientCSS;
        }
        if (settings.textPatternText !== undefined) {
            updates.textPatternText = settings.textPatternText;
        }
        if (settings.textPatternColor !== undefined) {
            updates.textPatternColor = settings.textPatternColor;
        }
        if (settings.textPatternOpacity !== undefined) {
            updates.textPatternOpacity = settings.textPatternOpacity;
        }
        if (settings.textPatternPositions !== undefined) {
            updates.textPatternPositions = settings.textPatternPositions;
        }
        // Handle textPatternRows - if template has positions but no rows, use position mode (rows = 1)
        // If template explicitly sets rows, use that value
        if (settings.textPatternRows !== undefined) {
            updates.textPatternRows = settings.textPatternRows;
        } else if (settings.backgroundType === 'textPattern') {
            // Default to position mode (1 row) for text pattern templates without explicit rows
            updates.textPatternRows = 1;
        }
        if (settings.textPatternFontFamily !== undefined) {
            updates.textPatternFontFamily = settings.textPatternFontFamily;
        }
        if (settings.textPatternFontSize !== undefined) {
            updates.textPatternFontSize = settings.textPatternFontSize;
        }
        if (settings.textPatternFontWeight !== undefined) {
            updates.textPatternFontWeight = settings.textPatternFontWeight;
        }
        if (settings.waveSplitFlipped !== undefined) {
            updates.waveSplitFlipped = settings.waveSplitFlipped;
        }

        // Apply styling settings
        if (settings.padding !== undefined) {
            updates.padding = settings.padding;
        }
        if (settings.shadowBlur !== undefined) {
            updates.shadowBlur = settings.shadowBlur;
        }
        if (settings.shadowOpacity !== undefined) {
            updates.shadowOpacity = settings.shadowOpacity;
        }
        if (settings.borderRadius !== undefined) {
            updates.borderRadius = settings.borderRadius;
        }
        if (settings.imageScale !== undefined) {
            updates.imageScale = settings.imageScale;
        }

        // Apply text overlays - always reset to avoid old overlays persisting
        if (settings.textOverlays !== undefined && settings.textOverlays.length > 0) {
            const newOverlays = settings.textOverlays.map((overlay, index) => ({
                ...overlay,
                id: `text-${Date.now()}-${index}`,
            }));
            updates.textOverlays = newOverlays;
            updates.selectedTextOverlayId = newOverlays.length > 0 ? newOverlays[0].id : null;
        } else {
            // Clear any existing text overlays if template doesn't have any
            updates.textOverlays = [];
            updates.selectedTextOverlayId = null;
        }

        // Recalculate canvas dimensions if needed
        const finalUpdates = recalculateCanvasDimensions(state, updates);

        set(finalUpdates);
    },

    resetToDefaults: () => set(DEFAULT_STATE),

    // Mobile controls state
    mobileControlsOpen: false,
    setMobileControlsOpen: (open: boolean) => set({ mobileControlsOpen: open }),
}));

// ============================================================================
// OPTIMIZED SELECTORS
// Use these instead of destructuring the whole store to prevent unnecessary re-renders
// Example: const { backgroundType, backgroundColor } = useBackgroundState();
// ============================================================================

/** Selector for background-related state only */
export const useBackgroundState = () =>
    useEditorStore(
        useShallow((state) => ({
            backgroundType: state.backgroundType,
            backgroundColor: state.backgroundColor,
            gradientColors: state.gradientColors,
            gradientAngle: state.gradientAngle,
            meshGradientCSS: state.meshGradientCSS,
            textPatternText: state.textPatternText,
            textPatternColor: state.textPatternColor,
            textPatternOpacity: state.textPatternOpacity,
            textPatternPositions: state.textPatternPositions,
            textPatternRows: state.textPatternRows,
            textPatternFontFamily: state.textPatternFontFamily,
            textPatternFontSize: state.textPatternFontSize,
            textPatternFontWeight: state.textPatternFontWeight,
            waveSplitFlipped: state.waveSplitFlipped,
            logoPatternImage: state.logoPatternImage,
            logoPatternOpacity: state.logoPatternOpacity,
            logoPatternSize: state.logoPatternSize,
            logoPatternSpacing: state.logoPatternSpacing,
        }))
    );

/** Selector for background actions only */
export const useBackgroundActions = () =>
    useEditorStore(
        useShallow((state) => ({
            setBackgroundType: state.setBackgroundType,
            setBackgroundColor: state.setBackgroundColor,
            updateBackgroundColor: state.updateBackgroundColor,
            setGradient: state.setGradient,
            updateGradientColors: state.updateGradientColors,
            setMeshGradient: state.setMeshGradient,
            setTextPatternText: state.setTextPatternText,
            toggleTextPatternPosition: state.toggleTextPatternPosition,
            setTextPatternFontFamily: state.setTextPatternFontFamily,
            setTextPatternFontSize: state.setTextPatternFontSize,
            setTextPatternFontWeight: state.setTextPatternFontWeight,
            setTextPatternRows: state.setTextPatternRows,
            toggleWaveSplitFlip: state.toggleWaveSplitFlip,
            setLogoPattern: state.setLogoPattern,
            clearLogoPattern: state.clearLogoPattern,
            setLogoPatternOpacity: state.setLogoPatternOpacity,
            setLogoPatternSize: state.setLogoPatternSize,
            setLogoPatternSpacing: state.setLogoPatternSpacing,
        }))
    );

/** Selector for image-related state only */
export const useImageState = () =>
    useEditorStore(
        useShallow((state) => ({
            originalImage: state.originalImage,
            imageDataUrl: state.imageDataUrl,
            uncroppedImage: state.uncroppedImage,
            uncroppedImageDataUrl: state.uncroppedImageDataUrl,
            isCropping: state.isCropping,
            cropArea: state.cropArea,
        }))
    );

/** Selector for canvas dimensions */
export const useCanvasDimensions = () =>
    useEditorStore(
        useShallow((state) => ({
            canvasWidth: state.canvasWidth,
            canvasHeight: state.canvasHeight,
            aspectRatio: state.aspectRatio,
        }))
    );

/** Selector for export settings */
export const useExportSettings = () =>
    useEditorStore(
        useShallow((state) => ({
            exportFormat: state.exportFormat,
            exportScale: state.exportScale,
        }))
    );

/** Selector for export actions */
export const useExportActions = () =>
    useEditorStore(
        useShallow((state) => ({
            setExportFormat: state.setExportFormat,
            setExportScale: state.setExportScale,
        }))
    );

/** Selector for styling state (shadow, border, padding) */
export const useStylingState = () =>
    useEditorStore(
        useShallow((state) => ({
            padding: state.padding,
            shadowBlur: state.shadowBlur,
            shadowOpacity: state.shadowOpacity,
            shadowColor: state.shadowColor,
            borderRadius: state.borderRadius,
            imageScale: state.imageScale,
            rotation: state.rotation,
            frameType: state.frameType,
            frameColor: state.frameColor,
        }))
    );

/** Selector for text overlay state */
export const useTextOverlayState = () =>
    useEditorStore(
        useShallow((state) => ({
            textOverlays: state.textOverlays,
            selectedTextOverlayId: state.selectedTextOverlayId,
        }))
    );
