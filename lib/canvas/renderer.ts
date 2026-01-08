/**
 * Canvas Renderer - Main Orchestration
 * Coordinates all rendering modules to produce final output
 */

import { FrameType, TextPosition, TextOverlay } from '@/types/editor';
import { calculateLayout, calculateBorderRadii } from './layout';
import { drawBackground, BackgroundOptions } from './background';
import { drawShadow, ShadowOptions } from './shadow';
import { initializeCanvas, applyRotation, drawClippedImage } from './helpers';
import { drawFrame, drawFrameOverlay } from './frames';

export interface RenderOptions {
    canvas: HTMLCanvasElement;
    image: HTMLImageElement;
    backgroundType: string;
    backgroundColor: string;
    gradientColors: [string, string];
    gradientAngle: number;
    meshGradientCSS?: string;
    textPatternText?: string;
    textPatternColor?: string;
    textPatternOpacity?: number;
    textPatternPositions?: TextPosition[];
    textPatternFontFamily?: string;
    textPatternFontSize?: number;
    textPatternFontWeight?: number;
    padding: number;
    shadowBlur?: number;
    shadowOpacity?: number;
    shadowColor?: string;
    borderRadius: number;
    frameType: FrameType;
    scale?: number;
    imageScale?: number; // zoom 0.1 - 2.0
    rotation?: number;
    targetWidth?: number; // for aspect ratio presets
    targetHeight?: number; // for aspect ratio presets
    textOverlays?: TextOverlay[];
}

/**
 * Main render function - orchestrates all rendering steps
 */
export function renderCanvas(options: RenderOptions): void {
    const {
        canvas,
        image,
        backgroundType,
        backgroundColor,
        gradientColors,
        gradientAngle,
        meshGradientCSS,
        textPatternText,
        textPatternColor,
        textPatternOpacity,
        textPatternPositions,
        textPatternFontFamily,
        textPatternFontSize,
        textPatternFontWeight,
        padding,
        shadowBlur = 20,
        shadowOpacity = 50,
        shadowColor = 'rgba(0, 0, 0, 0.5)',
        borderRadius,
        frameType,
        scale = 1,
        imageScale = 1,
        rotation = 0,
        targetWidth,
        targetHeight,
        textOverlays = [],
    } = options;

    // Initialize canvas and get context
    const ctx = initializeCanvas(canvas, 0, 0, scale); // Dimensions set below
    if (!ctx) return;

    // Calculate layout dimensions
    const layout = calculateLayout(
        image,
        frameType,
        padding,
        imageScale,
        targetWidth,
        targetHeight
    );

    // Set canvas size
    canvas.width = layout.canvasWidth * scale;
    canvas.height = layout.canvasHeight * scale;
    ctx.scale(scale, scale);
    ctx.clearRect(0, 0, layout.canvasWidth, layout.canvasHeight);

    // Draw background
    const backgroundOptions: BackgroundOptions = {
        type: backgroundType,
        color: backgroundColor,
        gradientColors,
        textPatternText,
        textPatternColor,
        textPatternOpacity,
        textPatternPositions,
        textPatternFontFamily,
        textPatternFontSize,
        textPatternFontWeight,
        gradientAngle,
        meshGradientCSS,
    };
    drawBackground(ctx, layout.canvasWidth, layout.canvasHeight, backgroundOptions);

    // Calculate effective border radii
    const radii = calculateBorderRadii(frameType, borderRadius, imageScale);

    // Draw frame if needed
    if (frameType !== 'none') {
        drawFrame(
            ctx,
            layout.contentX,
            layout.contentY,
            layout.contentWidth,
            layout.contentHeight,
            frameType,
            borderRadius,
            imageScale
        );
    }

    // Save context for rotation
    ctx.save();

    // Apply rotation if needed
    applyRotation(
        ctx,
        layout.imgX,
        layout.imgY,
        layout.imgWidth,
        layout.imgHeight,
        rotation
    );

    // Draw shadow
    if (shadowBlur > 0 && shadowOpacity > 0) {
        const shadowOptions: ShadowOptions = {
            blur: shadowBlur,
            opacity: shadowOpacity,
            color: shadowColor,
        };
        drawShadow(
            ctx,
            layout.imgX,
            layout.imgY,
            layout.imgWidth,
            layout.imgHeight,
            radii.effectiveTopRadius,
            radii.effectiveBottomRadius,
            shadowOptions
        );
    }

    // Draw clipped image with rounded corners
    drawClippedImage(
        ctx,
        image,
        layout.imgX,
        layout.imgY,
        layout.imgWidth,
        layout.imgHeight,
        radii.effectiveTopRadius,
        radii.effectiveBottomRadius
    );

    ctx.restore();

    // Draw frame overlay (Dynamic Island, Camera Dot) on top of image
    if (frameType === 'iphone' || frameType === 'android') {
        drawFrameOverlay(
            ctx,
            layout.contentX,
            layout.contentY,
            layout.contentWidth,
            layout.contentHeight,
            frameType,
            imageScale
        );
    }

    // Draw text overlays on top of everything
    if (textOverlays && textOverlays.length > 0) {
        ctx.save();
        textOverlays.forEach((overlay) => {
            const x = (layout.canvasWidth * overlay.x) / 100;
            const y = (layout.canvasHeight * overlay.y) / 100;

            ctx.font = `${overlay.fontWeight} ${overlay.fontSize}px ${overlay.fontFamily}`;
            ctx.fillStyle = overlay.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Add text shadow for better readability
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 2;

            ctx.fillText(overlay.text, x, y);

            // Reset shadow
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        });
        ctx.restore();
    }
}
