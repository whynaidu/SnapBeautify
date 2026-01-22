// Editor TypeScript Types

export type BackgroundType = 'solid' | 'gradient' | 'mesh' | 'image' | 'transparent' | 'textPattern' | 'waveSplit' | 'logoPattern';
export type FrameType = 'none' | 'browser' | 'macos' | 'windows' | 'iphone' | 'android' | 'instagram' | 'facebook' | 'twitter' | 'linkedin';
// export type ShadowSize = 'none' | 'sm' | 'md' | 'lg' | 'xl'; // Removed in favor of custom controls
export type ExportFormat = 'png' | 'jpeg' | 'webp';
export type ExportScale = 1 | 2 | 3 | 4;

export interface GradientPreset {
    name: string;
    colors: [string, string];
    angle: number;
}

export interface MeshGradient {
    name: string;
    css: string;
}

export interface TextPattern {
    name: string;
    text: string;
    colors: [string, string];
    angle: number;
    textColor: string;
    textOpacity: number;
}

export interface TemplatePreset {
    id: string;
    name: string;
    description: string;
    category: 'minimal' | 'vibrant' | 'professional' | 'creative' | 'wave' | 'text';
    preview: {
        backgroundType: BackgroundType;
        backgroundColor?: string;
        gradientColors?: [string, string];
        gradientAngle?: number;
        meshGradientCSS?: string;
        textPatternText?: string;
        textPatternPositions?: TextPosition[];
        waveSplitFlipped?: boolean;
    };
    settings: {
        backgroundType: BackgroundType;
        backgroundColor?: string;
        gradientColors?: [string, string];
        gradientAngle?: number;
        meshGradientCSS?: string;
        textPatternText?: string;
        textPatternColor?: string;
        textPatternOpacity?: number;
        textPatternPositions?: TextPosition[];
        textPatternRows?: number;
        textPatternFontFamily?: string;
        textPatternFontSize?: number;
        textPatternFontWeight?: number;
        waveSplitFlipped?: boolean;
        padding?: number;
        shadowBlur?: number;
        shadowOpacity?: number;
        borderRadius?: number;
        imageScale?: number;
        textOverlays?: Omit<TextOverlay, 'id'>[];
    };
}

export type TextPosition = 'top' | 'center' | 'bottom';

export interface TextOverlay {
    id: string;
    text: string;
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    color: string;
    fontSize: number; // pixels
    fontFamily: string;
    fontWeight: number; // 100-900
    useGradient?: boolean; // If true, use gradient colors instead of solid color
    gradientColors?: [string, string]; // Gradient colors [start, end]
    gradientAngle?: number; // Gradient angle in degrees
}

export interface CropArea {
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    width: number; // percentage 0-100
    height: number; // percentage 0-100
}

// export interface ShadowPreset {
//     blur: number;
//     spread: number;
//     offsetY: number;
//     opacity: number;
// }

export interface AspectRatioPreset {
    name: string;
    value: string | null; // null = free
    width?: number;
    height?: number;
}

export interface EditorState {
    // Image
    originalImage: HTMLImageElement | null;
    imageDataUrl: string | null;
    uncroppedImage: HTMLImageElement | null;
    uncroppedImageDataUrl: string | null;

    // Background
    backgroundType: BackgroundType;
    backgroundColor: string;
    gradientColors: [string, string];
    gradientAngle: number;
    meshGradientCSS: string;
    backgroundImage: string | null;
    textPatternText: string;
    textPatternColor: string;
    textPatternOpacity: number;
    textPatternPositions: TextPosition[]; // Array for multiple positions (legacy)
    textPatternRows: number; // Number of text rows to display (1-12)
    textPatternFontFamily: string;
    textPatternFontSize: number; // percentage 0.1 - 1.0
    textPatternFontWeight: number; // 100-900
    waveSplitFlipped: boolean; // If true, gradient on bottom, solid on top
    logoPatternImage: HTMLImageElement | null;
    logoPatternOpacity: number; // 0-1
    logoPatternSize: number; // percentage 0.1 - 1.0
    logoPatternSpacing: number; // spacing multiplier 1.0 - 3.0

    // Styling
    padding: number;
    shadowBlur: number; // 0-100
    shadowOpacity: number; // 0-100
    shadowColor: string; // HEX or RGBA
    borderRadius: number;
    imageScale: number;
    rotation: number;

    // Frame
    frameType: FrameType;
    frameColor: string;

    // Canvas
    aspectRatio: string | null;
    canvasWidth: number;
    canvasHeight: number;

    // Text Overlays
    textOverlays: TextOverlay[];
    selectedTextOverlayId: string | null;

    // Crop
    isCropping: boolean;
    cropArea: CropArea | null;

    // Export
    exportFormat: ExportFormat;
    exportScale: ExportScale;

    // Mobile UI
    mobileControlsOpen: boolean;
}

export interface EditorActions {
    setImage: (image: HTMLImageElement, dataUrl: string) => void;
    clearImage: () => void;
    setBackgroundType: (type: BackgroundType) => void;
    setBackgroundColor: (color: string) => void;
    updateBackgroundColor: (color: string) => void; // Updates color without changing background type
    setGradient: (colors: [string, string], angle?: number) => void;
    updateGradientColors: (colors: [string, string], angle?: number) => void; // Updates gradient without changing background type
    setMeshGradient: (css: string) => void;
    setBackgroundImage: (url: string) => void;
    setTextPattern: (text: string, colors: [string, string], angle: number, textColor: string, textOpacity: number) => void;
    setTextPatternText: (text: string) => void;
    toggleTextPatternPosition: (position: TextPosition) => void; // Toggle position in/out of array
    setTextPatternRows: (rows: number) => void;
    setTextPatternFontFamily: (fontFamily: string) => void;
    setTextPatternFontSize: (size: number) => void;
    setTextPatternFontWeight: (weight: number) => void;
    toggleWaveSplitFlip: () => void; // Toggle wave split orientation
    setLogoPattern: (image: HTMLImageElement) => void;
    clearLogoPattern: () => void;
    setLogoPatternOpacity: (opacity: number) => void;
    setLogoPatternSize: (size: number) => void;
    setLogoPatternSpacing: (spacing: number) => void;
    setPadding: (padding: number) => void;
    setShadowBlur: (blur: number) => void;
    setShadowOpacity: (opacity: number) => void;
    setShadowColor: (color: string) => void;
    setBorderRadius: (radius: number) => void;
    setFrameType: (frame: FrameType) => void;
    setAspectRatio: (ratio: string | null) => void;
    setExportFormat: (format: ExportFormat) => void;
    setExportScale: (scale: ExportScale) => void;
    setImageScale: (scale: number) => void;
    setRotation: (rotation: number) => void;
    addTextOverlay: () => void;
    duplicateTextOverlay: (id: string) => void;
    removeTextOverlay: (id: string) => void;
    selectTextOverlay: (id: string | null) => void;
    updateTextOverlay: (id: string, updates: Partial<Omit<TextOverlay, 'id'>>) => void;
    enterCropMode: () => void;
    exitCropMode: () => void;
    setCropArea: (area: CropArea) => void;
    applyCrop: () => Promise<void>;
    revertCrop: () => void;
    resetToDefaults: () => void;
    applyTemplate: (template: TemplatePreset) => void;
    setMobileControlsOpen: (open: boolean) => void;
}
