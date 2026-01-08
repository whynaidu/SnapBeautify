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
    textPatternPositions?: TextPosition[];
    textPatternFontFamily?: string;
    textPatternFontSize?: number;
    textPatternFontWeight?: number;
    waveSplitFlipped?: boolean;
    logoPatternImage?: HTMLImageElement | null;
    logoPatternOpacity?: number;
    logoPatternSize?: number;
    logoPatternSpacing?: number;
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
 * Calculate text position based on position type (simplified to top/center/bottom)
 * Positions are spaced to prevent overlap when multiple are selected
 */
function calculateTextPosition(
    width: number,
    height: number,
    position: TextPosition
): { x: number; y: number; align: CanvasTextAlign; baseline: CanvasTextBaseline } {
    const positions: Record<TextPosition, { x: number; y: number; align: CanvasTextAlign; baseline: CanvasTextBaseline }> = {
        'top': { x: width / 2, y: height * 0.08, align: 'center', baseline: 'top' },
        'center': { x: width / 2, y: height / 2, align: 'center', baseline: 'middle' },
        'bottom': { x: width / 2, y: height * 0.92, align: 'center', baseline: 'bottom' },
    };

    return positions[position];
}

/**
 * Draw text pattern background (gradient with large text overlay at multiple positions)
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
    positions: TextPosition[] = ['center'],
    fontFamily: string = 'system-ui, -apple-system, sans-serif',
    fontSizeMultiplier: number = 0.35,
    fontWeight: number = 900
): void {
    // Draw gradient background first
    drawGradientBackground(ctx, width, height, gradientColors, gradientAngle);

    // Draw large text pattern overlay at each position
    ctx.save();

    // Dynamically reduce font size when multiple positions are selected to prevent overlap
    const positionScaleFactor = positions.length === 3 ? 0.7 : positions.length === 2 ? 0.85 : 1;
    const adjustedFontSizeMultiplier = fontSizeMultiplier * positionScaleFactor;

    // Calculate font size based on canvas dimensions
    const fontSize = Math.min(width, height) * adjustedFontSizeMultiplier;
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

    // Set text style with opacity
    const r = parseInt(textColor.slice(1, 3), 16);
    const g = parseInt(textColor.slice(3, 5), 16);
    const b = parseInt(textColor.slice(5, 7), 16);
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${textOpacity})`;

    // Calculate max width to prevent text clipping (96% of canvas width for less side padding)
    const maxWidth = width * 0.96;

    // Draw text at each selected position
    positions.forEach(position => {
        const pos = calculateTextPosition(width, height, position);
        ctx.textAlign = pos.align;
        ctx.textBaseline = pos.baseline;

        // Draw text with max width to prevent clipping
        ctx.fillText(text, pos.x, pos.y, maxWidth);
    });

    ctx.restore();
}

/**
 * Draw wave split background (half solid, half gradient with wave divider)
 */
export function drawWaveSplitBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    solidColor: string,
    gradientColors: [string, string],
    gradientAngle: number,
    flipped: boolean = false
): void {
    const midY = height / 2;

    // Draw solid color on entire canvas first
    ctx.fillStyle = solidColor;
    ctx.fillRect(0, 0, width, height);

    // Create smooth wave path using sine-like bezier curves
    ctx.save();
    ctx.beginPath();

    // Start from left edge at middle
    ctx.moveTo(0, midY);

    // Create smooth wave using bezier curves
    const waveCount = 2; // Number of complete wave cycles (reduced from 3 to 2)
    const waveWidth = width / waveCount;
    const waveHeight = 60; // Amplitude of the wave

    // Invert wave direction when flipped so it looks visually different
    const heightMultiplier = flipped ? -1 : 1;

    for (let i = 0; i < waveCount; i++) {
        const x0 = i * waveWidth;
        const x1 = x0 + waveWidth * 0.25;
        const x2 = x0 + waveWidth * 0.5;
        const x3 = x0 + waveWidth * 0.75;
        const x4 = (i + 1) * waveWidth;

        // First half of wave (going up when not flipped, down when flipped)
        ctx.bezierCurveTo(
            x1, midY - (waveHeight * heightMultiplier),
            x2, midY - (waveHeight * heightMultiplier),
            x2, midY
        );

        // Second half of wave (going down when not flipped, up when flipped)
        ctx.bezierCurveTo(
            x2, midY + (waveHeight * heightMultiplier),
            x3, midY + (waveHeight * heightMultiplier),
            x4, midY
        );
    }

    // Complete the path based on flip direction
    if (flipped) {
        // Gradient on bottom, solid on top
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
    } else {
        // Gradient on top, solid on bottom
        ctx.lineTo(width, 0);
        ctx.lineTo(0, 0);
    }
    ctx.closePath();

    // Fill with gradient
    const points = calculateGradientPoints(width, height, gradientAngle);
    const gradient = ctx.createLinearGradient(points.x1, points.y1, points.x2, points.y2);
    gradient.addColorStop(0, gradientColors[0]);
    gradient.addColorStop(1, gradientColors[1]);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.restore();
}

/**
 * Draw logo pattern background (gradient with repeating logo grid)
 */
export function drawLogoPattern(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    logo: HTMLImageElement,
    gradientColors: [string, string],
    gradientAngle: number,
    logoOpacity: number,
    logoSize: number,
    spacing: number = 1.5 // Spacing multiplier between logos
): void {
    // Draw gradient background first
    drawGradientBackground(ctx, width, height, gradientColors, gradientAngle);

    ctx.save();

    // Calculate logo dimensions based on canvas size
    const maxDimension = Math.min(width, height) * logoSize;
    const logoAspect = logo.width / logo.height;
    let logoWidth: number;
    let logoHeight: number;

    if (logoAspect > 1) {
        // Landscape logo
        logoWidth = maxDimension;
        logoHeight = maxDimension / logoAspect;
    } else {
        // Portrait or square logo
        logoHeight = maxDimension;
        logoWidth = maxDimension * logoAspect;
    }

    // Set opacity
    ctx.globalAlpha = logoOpacity;

    // Calculate spacing between logos
    const spacingX = logoWidth * spacing;
    const spacingY = logoHeight * spacing;

    // Calculate how many logos we need to cover the canvas (with some extra for edges)
    const cols = Math.ceil(width / spacingX) + 1;
    const rows = Math.ceil(height / spacingY) + 1;

    // Draw logo grid
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * spacingX - logoWidth / 2;
            const y = row * spacingY - logoHeight / 2;

            // Draw the logo
            ctx.drawImage(logo, x, y, logoWidth, logoHeight);
        }
    }

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
        textPatternPositions = ['center'],
        textPatternFontFamily = 'system-ui, -apple-system, sans-serif',
        textPatternFontSize = 0.35,
        textPatternFontWeight = 900,
        waveSplitFlipped = false,
        logoPatternImage = null,
        logoPatternOpacity = 0.3,
        logoPatternSize = 0.3,
        logoPatternSpacing = 1.5
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
                textPatternPositions,
                textPatternFontFamily,
                textPatternFontSize,
                textPatternFontWeight
            );
            break;

        case 'waveSplit':
            drawWaveSplitBackground(
                ctx,
                width,
                height,
                color,
                gradientColors,
                gradientAngle,
                waveSplitFlipped
            );
            break;

        case 'logoPattern':
            if (logoPatternImage) {
                drawLogoPattern(
                    ctx,
                    width,
                    height,
                    logoPatternImage,
                    gradientColors,
                    gradientAngle,
                    logoPatternOpacity,
                    logoPatternSize,
                    logoPatternSpacing
                );
            }
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
