import { ShadowSize, FrameType } from '@/types/editor';
import { SHADOW_PRESETS } from '@/lib/constants/shadows';

export interface RenderOptions {
    canvas: HTMLCanvasElement;
    image: HTMLImageElement;
    backgroundType: string;
    backgroundColor: string;
    gradientColors: [string, string];
    gradientAngle: number;
    meshGradientCSS?: string;
    padding: number;
    shadowSize: ShadowSize;
    shadowIntensity?: number; // 0-100 for custom shadow
    borderRadius: number;
    frameType: FrameType;
    scale?: number;
    imageScale?: number; // zoom 0.1 - 2.0
    rotation?: number;
    targetWidth?: number; // for aspect ratio presets
    targetHeight?: number; // for aspect ratio presets
}

export function renderCanvas(options: RenderOptions): void {
    const {
        canvas,
        image,
        backgroundType,
        backgroundColor,
        gradientColors,
        gradientAngle,
        meshGradientCSS,
        padding,
        shadowSize,
        shadowIntensity = 50,
        borderRadius,
        frameType,
        scale = 1,
        imageScale = 1,
        rotation = 0,
        targetWidth,
        targetHeight,
    } = options;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate frame offset
    let frameOffset = 0;
    if (frameType === 'browser') frameOffset = 40;
    else if (frameType === 'macos') frameOffset = 32;
    else if (frameType === 'windows') frameOffset = 32;

    // Calculate dimensions (apply imageScale to image)
    const scaledImgWidth = Math.round(image.width * imageScale);
    const scaledImgHeight = Math.round(image.height * imageScale);
    const defaultCanvasWidth = scaledImgWidth + padding * 2;
    const defaultCanvasHeight = scaledImgHeight + padding * 2 + frameOffset;

    // Use target dimensions if provided (for aspect ratio presets), otherwise use calculated
    const canvasWidth = targetWidth && targetWidth > 0 ? targetWidth : defaultCanvasWidth;
    const canvasHeight = targetHeight && targetHeight > 0 ? targetHeight : defaultCanvasHeight;

    // Set canvas size (accounting for export scale)
    canvas.width = canvasWidth * scale;
    canvas.height = canvasHeight * scale;

    // Scale context for high-DPI
    ctx.scale(scale, scale);

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw background
    drawBackground(ctx, canvasWidth, canvasHeight, {
        type: backgroundType,
        color: backgroundColor,
        gradientColors,
        gradientAngle,
        meshGradientCSS,
    });

    // Calculate image position (centered in canvas, accounting for frame)
    // When using aspect ratio presets, center the image in the available space
    const imgX = (canvasWidth - scaledImgWidth) / 2;
    const imgY = (canvasHeight - scaledImgHeight + frameOffset) / 2;

    // Adjusted dimensions for frame and shadow drawing
    const imgWidth = scaledImgWidth;
    const imgHeight = scaledImgHeight;

    // Determine effective border radius for screenshot
    // When using a frame, don't round the top corners (they connect to the frame)
    const effectiveTopRadius = frameType !== 'none' ? 0 : borderRadius;
    const effectiveBottomRadius = borderRadius;

    // Draw frame if needed
    if (frameType !== 'none') {
        drawFrame(ctx, imgX, imgY - frameOffset, imgWidth, imgHeight + frameOffset, frameType, borderRadius);
    }

    // Save context for potential rotation
    ctx.save();

    // Apply rotation if needed
    if (rotation !== 0) {
        const centerX = imgX + imgWidth / 2;
        const centerY = imgY + imgHeight / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-centerX, -centerY);
    }

    // Draw shadow with intensity
    const shadow = SHADOW_PRESETS[shadowSize];
    // Apply intensity multiplier (shadowIntensity ranges from 0-100, default 50)
    const intensityMultiplier = shadowIntensity / 50; // 1.0 at 50, 2.0 at 100, 0 at 0

    if (shadow.blur > 0 && intensityMultiplier > 0) {
        ctx.save();
        ctx.shadowColor = `rgba(0, 0, 0, ${Math.min(shadow.opacity * intensityMultiplier, 0.8)})`;
        ctx.shadowBlur = shadow.blur * intensityMultiplier;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = shadow.offsetY * intensityMultiplier;

        // Draw shadow shape (with appropriate corner radius)
        ctx.beginPath();
        roundedRectWithDifferentCorners(ctx, imgX, imgY, imgWidth, imgHeight, effectiveTopRadius, effectiveBottomRadius);
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fill();
        ctx.restore();
    }

    // Draw image with rounded corners (different for top vs bottom when frame is used)
    ctx.beginPath();
    roundedRectWithDifferentCorners(ctx, imgX, imgY, imgWidth, imgHeight, effectiveTopRadius, effectiveBottomRadius);
    ctx.clip();
    ctx.drawImage(image, imgX, imgY, imgWidth, imgHeight);

    ctx.restore();
}

function drawBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    options: {
        type: string;
        color: string;
        gradientColors: [string, string];
        gradientAngle: number;
        meshGradientCSS?: string;
    }
): void {
    const { type, color, gradientColors, gradientAngle, meshGradientCSS } = options;

    if (type === 'solid') {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, height);
    } else if (type === 'gradient') {
        // Calculate gradient points based on angle
        const angleRad = ((gradientAngle - 90) * Math.PI) / 180;
        const length = Math.sqrt(width * width + height * height) / 2;
        const centerX = width / 2;
        const centerY = height / 2;

        const x1 = centerX - Math.cos(angleRad) * length;
        const y1 = centerY - Math.sin(angleRad) * length;
        const x2 = centerX + Math.cos(angleRad) * length;
        const y2 = centerY + Math.sin(angleRad) * length;

        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, gradientColors[0]);
        gradient.addColorStop(1, gradientColors[1]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    } else if (type === 'mesh') {
        // Parse and render the mesh gradient based on the CSS
        drawMeshGradientFromCSS(ctx, width, height, meshGradientCSS || '');
    } else if (type === 'transparent') {
        // Draw checkered pattern to indicate transparency
        drawCheckerboard(ctx, width, height);
    }
}

// Parse mesh gradient CSS and render it on canvas
function drawMeshGradientFromCSS(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    css: string
): void {
    // Fill with dark base first
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    if (!css) return;

    // Parse radial-gradient entries from CSS
    // Format: radial-gradient(at X% Y%, #color 0px, transparent 50%)
    const gradientRegex = /radial-gradient\(at\s*([\d.]+)%?\s*([\d.]+)%?,\s*(#[a-fA-F0-9]+)\s*0px,\s*transparent\s*([\d.]+)%\)/g;

    let match;
    const gradients: Array<{ x: number; y: number; color: string; size: number }> = [];

    while ((match = gradientRegex.exec(css)) !== null) {
        gradients.push({
            x: parseFloat(match[1]) / 100,
            y: parseFloat(match[2]) / 100,
            color: match[3],
            size: parseFloat(match[4]) / 100,
        });
    }

    // If no gradients parsed, use a fallback mesh
    if (gradients.length === 0) {
        // Fallback to default Aurora-like mesh
        const fallbackColors = [
            { x: 0.4, y: 0.2, color: '#4f46e5' },
            { x: 0.8, y: 0.1, color: '#f472b6' },
            { x: 0.1, y: 0.5, color: '#0ea5e9' },
            { x: 0.9, y: 0.5, color: '#22c55e' },
            { x: 0.2, y: 0.9, color: '#f97316' },
            { x: 0.8, y: 0.9, color: '#8b5cf6' },
        ];

        fallbackColors.forEach(({ x, y, color }) => {
            const gradient = ctx.createRadialGradient(
                x * width,
                y * height,
                0,
                x * width,
                y * height,
                Math.max(width, height) * 0.5
            );
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, 'transparent');

            ctx.globalCompositeOperation = 'screen';
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        });
    } else {
        // Render parsed gradients
        gradients.forEach(({ x, y, color, size }) => {
            const gradient = ctx.createRadialGradient(
                x * width,
                y * height,
                0,
                x * width,
                y * height,
                Math.max(width, height) * size
            );
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, 'transparent');

            ctx.globalCompositeOperation = 'screen';
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        });
    }

    ctx.globalCompositeOperation = 'source-over';
}

function drawFrame(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    frameType: FrameType,
    borderRadius: number
): void {
    if (frameType === 'browser') {
        drawBrowserFrame(ctx, x, y, width, height, borderRadius);
    } else if (frameType === 'macos') {
        drawMacOSFrame(ctx, x, y, width, height, borderRadius);
    } else if (frameType === 'windows') {
        drawWindowsFrame(ctx, x, y, width, height, borderRadius);
    }
}

function drawBrowserFrame(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    borderRadius: number
): void {
    const titleBarHeight = 40;
    const radius = Math.max(borderRadius, 12);

    // Draw full frame background with rounded corners at top and bottom
    ctx.save();
    ctx.beginPath();
    // Top-left corner
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    // Top-right corner
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    // Right side down to bottom-right corner
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    // Bottom edge
    ctx.lineTo(x + radius, y + height);
    // Bottom-left corner
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    // Left side up to top-left
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = '#1f2937';
    ctx.fill();
    ctx.restore();

    // Draw traffic lights
    const dotY = y + titleBarHeight / 2;
    const dotStartX = x + 16;
    const dotRadius = 6;
    const dotSpacing = 20;

    // Red
    ctx.beginPath();
    ctx.arc(dotStartX, dotY, dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();

    // Yellow
    ctx.beginPath();
    ctx.arc(dotStartX + dotSpacing, dotY, dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#eab308';
    ctx.fill();

    // Green
    ctx.beginPath();
    ctx.arc(dotStartX + dotSpacing * 2, dotY, dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#22c55e';
    ctx.fill();

    // Draw URL bar
    const urlBarX = x + 80;
    const urlBarY = y + 10;
    const urlBarWidth = width - 160;
    const urlBarHeight = 20;

    ctx.beginPath();
    roundedRect(ctx, urlBarX, urlBarY, urlBarWidth, urlBarHeight, 6);
    ctx.fillStyle = '#374151';
    ctx.fill();
}

function drawMacOSFrame(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    borderRadius: number
): void {
    const titleBarHeight = 32;
    const radius = Math.max(borderRadius, 10);

    // Draw full frame background with rounded corners
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = '#27272a';
    ctx.fill();
    ctx.restore();

    // Draw traffic lights
    const dotY = y + titleBarHeight / 2;
    const dotStartX = x + 14;
    const dotRadius = 6;
    const dotSpacing = 20;

    // Red
    ctx.beginPath();
    ctx.arc(dotStartX, dotY, dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();

    // Yellow
    ctx.beginPath();
    ctx.arc(dotStartX + dotSpacing, dotY, dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#eab308';
    ctx.fill();

    // Green
    ctx.beginPath();
    ctx.arc(dotStartX + dotSpacing * 2, dotY, dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#22c55e';
    ctx.fill();
}

function drawWindowsFrame(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    borderRadius: number
): void {
    const titleBarHeight = 32;
    const radius = Math.max(borderRadius, 8);

    // Draw full frame background with rounded corners
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = '#1e1e1e';
    ctx.fill();
    ctx.restore();

    // Draw window controls on right side
    const controlY = y + titleBarHeight / 2;
    const controlSpacing = 46;
    const controlStartX = x + width - 44;

    // Close (X)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(controlStartX - 5, controlY - 5);
    ctx.lineTo(controlStartX + 5, controlY + 5);
    ctx.moveTo(controlStartX + 5, controlY - 5);
    ctx.lineTo(controlStartX - 5, controlY + 5);
    ctx.stroke();

    // Maximize
    ctx.strokeRect(controlStartX - controlSpacing - 5, controlY - 5, 10, 10);

    // Minimize
    ctx.beginPath();
    ctx.moveTo(controlStartX - controlSpacing * 2 - 5, controlY);
    ctx.lineTo(controlStartX - controlSpacing * 2 + 5, controlY);
    ctx.stroke();
}

// Helper for rounded rect with same radius on all corners
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

// Helper for rounded rect with different top/bottom radius (for frame integration)
function roundedRectWithDifferentCorners(
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

function drawCheckerboard(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const size = 10;
    for (let x = 0; x < width; x += size) {
        for (let y = 0; y < height; y += size) {
            ctx.fillStyle = (Math.floor(x / size) + Math.floor(y / size)) % 2 === 0 ? '#ffffff' : '#e5e5e5';
            ctx.fillRect(x, y, size, size);
        }
    }
}
