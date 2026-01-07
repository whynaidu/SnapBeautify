/**
 * Shadow Rendering for Canvas
 * Handles drop shadow effects with customizable blur, opacity, and color
 */

import { SHADOW } from '@/lib/constants/rendering';

export interface ShadowOptions {
    blur: number;
    opacity: number;
    color: string;
}

/**
 * Draw rounded rectangle with different corner radii (top vs bottom)
 * Used for shadow and image clipping
 */
export function roundedRectWithDifferentCorners(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    topRadius: number,
    bottomRadius: number
): void {
    const topR = Math.min(topRadius, width / 2, height / 2);
    const bottomR = Math.min(bottomRadius, width / 2, height / 2);

    ctx.moveTo(x + topR, y);
    ctx.lineTo(x + width - topR, y);

    if (topR > 0) {
        ctx.quadraticCurveTo(x + width, y, x + width, y + topR);
    }

    ctx.lineTo(x + width, y + height - bottomR);

    if (bottomR > 0) {
        ctx.quadraticCurveTo(x + width, y + height, x + width - bottomR, y + height);
    }

    ctx.lineTo(x + bottomR, y + height);

    if (bottomR > 0) {
        ctx.quadraticCurveTo(x, y + height, x, y + height - bottomR);
    }

    ctx.lineTo(x, y + topR);

    if (topR > 0) {
        ctx.quadraticCurveTo(x, y, x + topR, y);
    }

    ctx.closePath();
}

/**
 * Draw shadow behind an element
 */
export function drawShadow(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    topRadius: number,
    bottomRadius: number,
    options: ShadowOptions
): void {
    const { blur, opacity, color } = options;

    if (blur === 0 || opacity === 0) {
        return; // No shadow to draw
    }

    ctx.save();

    // Configure shadow properties
    ctx.shadowColor = color;
    ctx.shadowBlur = blur * SHADOW.BLUR_MULTIPLIER; // Matches CSS convention
    ctx.shadowOffsetY = blur * SHADOW.OFFSET_RATIO; // Creates realistic bottom shadow
    ctx.shadowOffsetX = 0;

    // Apply opacity to the entire shadow operation
    ctx.globalAlpha = opacity / 100;

    // Draw the shape that casts the shadow
    ctx.beginPath();
    roundedRectWithDifferentCorners(ctx, x, y, width, height, topRadius, bottomRadius);
    ctx.fillStyle = color; // Shape fill color (image will be drawn on top)
    ctx.fill();

    ctx.restore();
}
