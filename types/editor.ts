// Editor TypeScript Types

export type BackgroundType = 'solid' | 'gradient' | 'mesh' | 'image' | 'transparent' | 'textPattern';
export type FrameType = 'none' | 'browser' | 'macos' | 'windows' | 'iphone' | 'android';
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

    // Export
    exportFormat: ExportFormat;
    exportScale: ExportScale;
}

export interface EditorActions {
    setImage: (image: HTMLImageElement, dataUrl: string) => void;
    clearImage: () => void;
    setBackgroundType: (type: BackgroundType) => void;
    setBackgroundColor: (color: string) => void;
    setGradient: (colors: [string, string], angle?: number) => void;
    setMeshGradient: (css: string) => void;
    setBackgroundImage: (url: string) => void;
    setTextPattern: (text: string, colors: [string, string], angle: number, textColor: string, textOpacity: number) => void;
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
    resetToDefaults: () => void;
}
