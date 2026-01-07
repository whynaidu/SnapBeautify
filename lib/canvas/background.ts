/**
 * Background Rendering for Canvas
 * Handles solid colors, gradients, mesh gradients, and transparency patterns
 */

import { MESH_GRADIENT, CHECKERBOARD } from '@/lib/constants/rendering';

import type { TextPosition } from '@/types/editor';

export interface BackgroundOptions {
    type: string;
    color: string;
    gradientColors: [string, string];
    gradientAngle: number;
    meshGradientCSS?: string;
    textPatternText?: string;
    textPatternColor?: string;
    textPatternOpacity?: number;
    textPatternPosition?: TextPosition;
}

export interface GradientPoints {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

/**
 * Cache for gradient calculations (memoization)
 */
const gradientCache = new Map<string, GradientPoints>();

/**
 * Calculate gradient points based on angle (memoized for performance)
 */
export function calculateGradientPoints(
    width: number,
    height: number,
    angle: number
): GradientPoints {
    const cacheKey = `${width}x${height}@${angle}`;

    // Check cache first
    if (gradientCache.has(cacheKey)) {
        return gradientCache.get(cacheKey)!;
    }

    // Calculate gradient direction
    const angleRad = ((angle - 90) * Math.PI) / 180;
    const length = Math.sqrt(width * width + height * height) / 2;
    const centerX = width / 2;
    const centerY = height / 2;

    const result: GradientPoints = {
        x1: centerX - Math.cos(angleRad) * length,
        y1: centerY - Math.sin(angleRad) * length,
        x2: centerX + Math.cos(angleRad) * length,
        y2: centerY + Math.sin(angleRad) * length,
    };

    // Cache the result
    gradientCache.set(cacheKey, result);

    return result;
}

/**
 * Draw solid color background
 */
export function drawSolidBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    color: string
): void {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
}

/**
 * Draw linear gradient background
 */
export function drawGradientBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    colors: [string, string],
    angle: number
): void {
    const points = calculateGradientPoints(width, height, angle);

    const gradient = ctx.createLinearGradient(
        points.x1,
        points.y1,
        points.x2,
        points.y2
    );

    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
}

/**
 * Parse mesh gradient CSS
 */
interface MeshGradientPoint {
    x: number;
    y: number;
    color: string;
    size: number;
}

function parseMeshGradientCSS(css: string): MeshGradientPoint[] {
    if (!css) return [];

    // Format: radial-gradient(at X% Y%, #color 0px, transparent SIZE%)
    const gradientRegex = /radial-gradient\(at\s*([\d.]+)%?\s*([\d.]+)%?,\s*(#[a-fA-F0-9]+)\s*0px,\s*transparent\s*([\d.]+)%\)/g;

    const gradients: MeshGradientPoint[] = [];
    let match;

    while ((match = gradientRegex.exec(css)) !== null) {
        gradients.push({
            x: parseFloat(match[1]) / 100,
            y: parseFloat(match[2]) / 100,
            color: match[3],
            size: parseFloat(match[4]) / 100,
        });
    }

    return gradients;
}

/**
 * Draw mesh gradient background
 */
export function drawMeshGradient(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    meshCSS?: string
): void {
    // Base color
    ctx.fillStyle = MESH_GRADIENT.BASE_COLOR;
    ctx.fillRect(0, 0, width, height);

    const gradients = meshCSS ? parseMeshGradientCSS(meshCSS) : [];

    // Use fallback colors if no gradients parsed
    const points = gradients.length > 0 ? gradients : MESH_GRADIENT.FALLBACK_COLORS.map(p => ({
        ...p,
        size: MESH_GRADIENT.DEFAULT_SIZE,
    }));

    // Render each radial gradient
    points.forEach(({ x, y, color, size }) => {
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

        ctx.globalCompositeOperation = MESH_GRADIENT.COMPOSITE_OPERATION as GlobalCompositeOperation;
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    });

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
}

/**
 * Calculate text position based on position type
 */
function calculateTextPosition(
    width: number,
    height: number,
    position: TextPosition
): { x: number; y: number; align: CanvasTextAlign; baseline: CanvasTextBaseline } {
    const positions: Record<TextPosition, { x: number; y: number; align: CanvasTextAlign; baseline: CanvasTextBaseline }> = {
        'top-left': { x: width * 0.1, y: height * 0.15, align: 'left', baseline: 'top' },
        'top-center': { x: width / 2, y: height * 0.15, align: 'center', baseline: 'top' },
        'top-right': { x: width * 0.9, y: height * 0.15, align: 'right', baseline: 'top' },
        'center-left': { x: width * 0.1, y: height / 2, align: 'left', baseline: 'middle' },
        'center': { x: width / 2, y: height / 2, align: 'center', baseline: 'middle' },
        'center-right': { x: width * 0.9, y: height / 2, align: 'right', baseline: 'middle' },
        'bottom-left': { x: width * 0.1, y: height * 0.85, align: 'left', baseline: 'bottom' },
        'bottom-center': { x: width / 2, y: height * 0.85, align: 'center', baseline: 'bottom' },
        'bottom-right': { x: width * 0.9, y: height * 0.85, align: 'right', baseline: 'bottom' },
    };

    return positions[position];
}

/**
 * Draw text pattern background (gradient with large text overlay)
 */
export function drawTextPattern(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    text: string,
    gradientColors: [string, string],
    gradientAngle: number,
    textColor: string,
    textOpacity: number,
    position: TextPosition = 'center'
): void {
    // Draw gradient background first
    drawGradientBackground(ctx, width, height, gradientColors, gradientAngle);

    // Draw large text pattern overlay
    ctx.save();

    // Calculate font size based on canvas dimensions
    const fontSize = Math.min(width, height) * 0.35;
    ctx.font = `900 ${fontSize}px system-ui, -apple-system, sans-serif`;

    // Calculate position
    const pos = calculateTextPosition(width, height, position);
    ctx.textAlign = pos.align;
    ctx.textBaseline = pos.baseline;

    // Set text style with opacity
    const r = parseInt(textColor.slice(1, 3), 16);
    const g = parseInt(textColor.slice(3, 5), 16);
    const b = parseInt(textColor.slice(5, 7), 16);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${textOpacity})`;

    // Draw text at calculated position
    ctx.fillText(text, pos.x, pos.y);

    ctx.restore();
}

/**
 * Draw checkerboard pattern (for transparency)
 */
export function drawCheckerboard(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
): void {
    const size = CHECKERBOARD.TILE_SIZE;

    for (let x = 0; x < width; x += size) {
        for (let y = 0; y < height; y += size) {
            const isEven = (Math.floor(x / size) + Math.floor(y / size)) % 2 === 0;
            ctx.fillStyle = isEven ? CHECKERBOARD.COLOR_LIGHT : CHECKERBOARD.COLOR_DARK;
            ctx.fillRect(x, y, size, size);
        }
    }
}

/**
 * Main background drawing function
 */
export function drawBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    options: BackgroundOptions
): void {
    const {
        type,
        color,
        gradientColors,
        gradientAngle,
        meshGradientCSS,
        textPatternText = 'WELCOME',
        textPatternColor = '#ffffff',
        textPatternOpacity = 0.1,
        textPatternPosition = 'center'
    } = options;

    switch (type) {
        case 'solid':
            drawSolidBackground(ctx, width, height, color);
            break;

        case 'gradient':
            drawGradientBackground(ctx, width, height, gradientColors, gradientAngle);
            break;

        case 'mesh':
            drawMeshGradient(ctx, width, height, meshGradientCSS);
            break;

        case 'textPattern':
            drawTextPattern(
                ctx,
                width,
                height,
                textPatternText,
                gradientColors,
                gradientAngle,
                textPatternColor,
                textPatternOpacity,
                textPatternPosition
            );
            break;

        case 'transparent':
            drawCheckerboard(ctx, width, height);
            break;

        default:
            // Fallback to solid color
            drawSolidBackground(ctx, width, height, color);
    }
}

/**
 * Clear gradient cache (useful for memory management)
 */
export function clearGradientCache(): void {
    gradientCache.clear();
}
