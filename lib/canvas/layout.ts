/**
 * Layout Calculations for Canvas Rendering
 * Handles dimension calculations, frame offsets, and positioning
 */

import { FrameType } from '@/types/editor';
import { FRAME_OFFSETS } from '@/lib/constants/rendering';

export interface FrameOffsets {
    top: number;
    bottom: number;
    left: number;
    right: number;
    offsetX: number;
    offsetY: number;
}

export interface LayoutDimensions {
    canvasWidth: number;
    canvasHeight: number;
    scaledImgWidth: number;
    scaledImgHeight: number;
    contentX: number;
    contentY: number;
    contentWidth: number;
    contentHeight: number;
    imgX: number;
    imgY: number;
    imgWidth: number;
    imgHeight: number;
}

export interface BorderRadii {
    effectiveTopRadius: number;
    effectiveBottomRadius: number;
}

/**
 * Calculate frame offsets for a given frame type
 * Memoized for performance
 */
const frameOffsetsCache = new Map<string, FrameOffsets>();

export function calculateFrameOffsets(
    frameType: FrameType,
    imageScale: number = 1
): FrameOffsets {
    const cacheKey = `${frameType}-${imageScale}`;

    // Check cache first
    if (frameOffsetsCache.has(cacheKey)) {
        return frameOffsetsCache.get(cacheKey)!;
    }

    const baseOffsets = FRAME_OFFSETS[frameType];

    const result: FrameOffsets = {
        top: baseOffsets.top * (frameType === 'iphone' || frameType === 'android' ? imageScale : 1),
        bottom: baseOffsets.bottom * (frameType === 'iphone' || frameType === 'android' ? imageScale : 1),
        left: baseOffsets.left * (frameType === 'iphone' || frameType === 'android' ? imageScale : 1),
        right: baseOffsets.right * (frameType === 'iphone' || frameType === 'android' ? imageScale : 1),
        offsetX: 0,
        offsetY: 0,
    };

    result.offsetX = result.left + result.right;
    result.offsetY = result.top + result.bottom;

    // Cache the result
    frameOffsetsCache.set(cacheKey, result);

    return result;
}

/**
 * Calculate all layout dimensions
 */
export function calculateLayout(
    image: HTMLImageElement,
    frameType: FrameType,
    padding: number,
    imageScale: number,
    targetWidth?: number,
    targetHeight?: number
): LayoutDimensions {
    const frameOffsets = calculateFrameOffsets(frameType, imageScale);

    // Calculate scaled image dimensions
    const scaledImgWidth = Math.round(image.width * imageScale);
    const scaledImgHeight = Math.round(image.height * imageScale);

    // Calculate default canvas dimensions
    const defaultCanvasWidth = scaledImgWidth + padding * 2 + frameOffsets.offsetX;
    const defaultCanvasHeight = scaledImgHeight + padding * 2 + frameOffsets.offsetY;

    // Use target dimensions if provided (for aspect ratio presets)
    const canvasWidth = targetWidth && targetWidth > 0 ? targetWidth : defaultCanvasWidth;
    const canvasHeight = targetHeight && targetHeight > 0 ? targetHeight : defaultCanvasHeight;

    // Calculate content dimensions
    const contentWidth = scaledImgWidth + frameOffsets.offsetX;
    const contentHeight = scaledImgHeight + frameOffsets.offsetY;

    // Center the content in the canvas
    const contentX = (canvasWidth - contentWidth) / 2;
    const contentY = (canvasHeight - contentHeight) / 2;

    // Image position relative to content
    const imgX = contentX + frameOffsets.left;
    const imgY = contentY + frameOffsets.top;

    return {
        canvasWidth,
        canvasHeight,
        scaledImgWidth,
        scaledImgHeight,
        contentX,
        contentY,
        contentWidth,
        contentHeight,
        imgX,
        imgY,
        imgWidth: scaledImgWidth,
        imgHeight: scaledImgHeight,
    };
}

/**
 * Calculate effective border radii based on frame type
 */
export function calculateBorderRadii(
    frameType: FrameType,
    borderRadius: number,
    imageScale: number,
    contentWidth?: number,
    contentHeight?: number
): BorderRadii {
    if (frameType === 'iphone' || frameType === 'android') {
        // Phone frames have specific screen radii
        // MagicUI iPhone uses 55.75px screen radius in 433x882 space
        // Android uses 33px/25px elliptical radius in 378x830 space
        const PHONE_WIDTH = frameType === 'iphone' ? 433 : 378;
        const PHONE_HEIGHT = frameType === 'iphone' ? 882 : 830;
        const baseRadius = frameType === 'iphone' ? 55.75 : 33; // Use radiusX for Android

        // Calculate actual frame scale if dimensions provided
        let effectiveRadius = baseRadius * imageScale;
        if (contentWidth && contentHeight) {
            const frameScaleX = contentWidth / PHONE_WIDTH;
            const frameScaleY = contentHeight / PHONE_HEIGHT;
            const frameScale = Math.min(frameScaleX, frameScaleY);
            effectiveRadius = baseRadius * frameScale;
        }

        return {
            effectiveTopRadius: effectiveRadius,
            effectiveBottomRadius: effectiveRadius,
        };
    } else if (frameType !== 'none') {
        // Browser/Window frames: top is flat, bottom is rounded
        // Match frame minimum radii to prevent gaps
        let minRadius = 0;
        if (frameType === 'browser') minRadius = 12;
        else if (frameType === 'macos') minRadius = 10;
        else if (frameType === 'windows') minRadius = 8;

        return {
            effectiveTopRadius: 0,
            effectiveBottomRadius: Math.max(borderRadius, minRadius),
        };
    } else {
        // No frame: use border radius for all corners
        return {
            effectiveTopRadius: borderRadius,
            effectiveBottomRadius: borderRadius,
        };
    }
}

/**
 * Clear the frame offsets cache (useful for testing)
 */
export function clearLayoutCache(): void {
    frameOffsetsCache.clear();
}
