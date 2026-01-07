/**
 * Canvas Helper Utilities
 * Common drawing functions and utilities
 */

/**
 * Draw rounded rectangle with same radius on all corners
 */
export function roundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
): void {
    const r = Math.min(radius, width / 2, height / 2);

    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

/**
 * Apply rotation transform to context
 */
export function applyRotation(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    rotation: number
): void {
    if (rotation === 0) return;

    const centerX = x + width / 2;
    const centerY = y + height / 2;

    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);
}

/**
 * Initialize canvas for rendering
 */
export function initializeCanvas(
    canvas: HTMLCanvasElement,
    width: number,
    height: number,
    scale: number
): CanvasRenderingContext2D | null {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set canvas size (accounting for export scale)
    canvas.width = width * scale;
    canvas.height = height * scale;

    // Scale context for high-DPI
    ctx.scale(scale, scale);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    return ctx;
}

/**
 * Clip image to rounded rectangle and draw
 */
export function drawClippedImage(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    topRadius: number,
    bottomRadius: number
): void {
    ctx.save();

    // Create clipping path
    ctx.beginPath();

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
    ctx.clip();

    // Draw image
    ctx.drawImage(image, x, y, width, height);

    ctx.restore();
}
