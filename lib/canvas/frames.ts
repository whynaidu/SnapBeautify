/**
 * Frame Rendering for Canvas
 * Handles browser, macOS, Windows, iPhone, and Android frame mockups
 */

import { FrameType } from '@/types/editor';
import { roundedRect } from './helpers';
import { BROWSER_FRAME } from '@/lib/constants/rendering';

/**
 * Draw frame around content based on frame type
 */
export function drawFrame(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    frameType: FrameType,
    borderRadius: number,
    scale: number = 1
): void {
    switch (frameType) {
        case 'browser':
            drawBrowserFrame(ctx, x, y, width, height, borderRadius);
            break;
        case 'macos':
            drawMacOSFrame(ctx, x, y, width, height, borderRadius);
            break;
        case 'windows':
            drawWindowsFrame(ctx, x, y, width, height, borderRadius);
            break;
        case 'iphone':
            drawiPhoneFrame(ctx, x, y, width, height, borderRadius, scale);
            break;
        case 'android':
            drawAndroidFrame(ctx, x, y, width, height, borderRadius, scale);
            break;
    }
}

/**
 * Draw frame overlay elements (Notch, Camera Dot)
 * These must be drawn on top of the image
 */
export function drawFrameOverlay(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    frameType: string,
    scale: number
): void {
    const safeScale = Math.max(scale, 0.1);

    if (frameType === 'iphone') {
        // Draw iPhone notch/Dynamic Island on top of image
        drawiPhoneNotchOverlay(ctx, x, y, width, height, safeScale);
    } else if (frameType === 'android') {
        // Draw Android camera overlay
        drawAndroidCameraOverlay(ctx, x, y, width, height, safeScale);
    }
}

/**
 * Draw browser frame with title bar
 */
function drawBrowserFrame(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    borderRadius: number
): void {
    const titleBarHeight = BROWSER_FRAME.TITLE_BAR_HEIGHT;

    ctx.save();

    // Draw frame background
    ctx.fillStyle = BROWSER_FRAME.COLORS.BACKGROUND;
    ctx.beginPath();
    roundedRect(ctx, x, y, width, height, borderRadius);
    ctx.fill();

    // Draw title bar
    ctx.fillStyle = BROWSER_FRAME.COLORS.BACKGROUND;
    ctx.beginPath();
    roundedRect(ctx, x, y, width, titleBarHeight, borderRadius);
    ctx.fill();

    // Draw traffic light dots
    const dotY = y + titleBarHeight / 2;
    const dotStartX = x + BROWSER_FRAME.DOT_START_X;

    // Red dot
    ctx.fillStyle = BROWSER_FRAME.COLORS.RED_DOT;
    ctx.beginPath();
    ctx.arc(dotStartX, dotY, BROWSER_FRAME.DOT_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Yellow dot
    ctx.fillStyle = BROWSER_FRAME.COLORS.YELLOW_DOT;
    ctx.beginPath();
    ctx.arc(dotStartX + BROWSER_FRAME.DOT_SPACING, dotY, BROWSER_FRAME.DOT_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Green dot
    ctx.fillStyle = BROWSER_FRAME.COLORS.GREEN_DOT;
    ctx.beginPath();
    ctx.arc(dotStartX + BROWSER_FRAME.DOT_SPACING * 2, dotY, BROWSER_FRAME.DOT_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    // Draw URL bar
    ctx.fillStyle = BROWSER_FRAME.COLORS.URL_BAR;
    ctx.beginPath();
    roundedRect(
        ctx,
        x + BROWSER_FRAME.URL_BAR.X_OFFSET,
        y + BROWSER_FRAME.URL_BAR.Y_OFFSET,
        width - BROWSER_FRAME.URL_BAR.WIDTH_OFFSET,
        BROWSER_FRAME.URL_BAR.HEIGHT,
        BROWSER_FRAME.URL_BAR.BORDER_RADIUS
    );
    ctx.fill();

    ctx.restore();
}

/**
 * Draw macOS window frame with traffic lights
 */
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

/**
 * Draw Windows window frame with control buttons
 */
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

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;

    // Close (X)
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

/**
 * Get iPhone screen bounds for clipping
 */
export function getiPhoneScreenBounds(
    x: number,
    y: number,
    width: number,
    height: number
): { x: number; y: number; width: number; height: number; radius: number } {
    const PHONE_WIDTH = 433;
    const PHONE_HEIGHT = 882;
    const BEZEL_SIZE = 16; // Reduced from 24px to 12px
    const SCREEN_RADIUS = 55.75;

    const scaleX = width / PHONE_WIDTH;
    const scaleY = height / PHONE_HEIGHT;
    const s = Math.min(scaleX, scaleY);

    const scaledWidth = PHONE_WIDTH * s;
    const scaledHeight = PHONE_HEIGHT * s;
    const offsetX = x + (width - scaledWidth) / 2;
    const offsetY = y + (height - scaledHeight) / 2;

    return {
        x: offsetX + BEZEL_SIZE * s,
        y: offsetY + BEZEL_SIZE * s,
        width: (PHONE_WIDTH - BEZEL_SIZE * 2) * s,
        height: (PHONE_HEIGHT - BEZEL_SIZE * 2) * s,
        radius: SCREEN_RADIUS * s,
    };
}

/**
 * Draw iPhone frame based on MagicUI design
 * Dimensions: 433x882 with precise bezel and notch
 */
function drawiPhoneFrame(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    _borderRadius: number,
    scale: number
): void {
    ctx.save();

    // MagicUI iPhone dimensions (scaled)
    const PHONE_WIDTH = 433;
    const PHONE_HEIGHT = 882;
    const scaleX = width / PHONE_WIDTH;
    const scaleY = height / PHONE_HEIGHT;
    const s = Math.min(scaleX, scaleY);

    // Calculate centered position if aspect ratio doesn't match
    const scaledWidth = PHONE_WIDTH * s;
    const scaledHeight = PHONE_HEIGHT * s;
    const offsetX = x + (width - scaledWidth) / 2;
    const offsetY = y + (height - scaledHeight) / 2;

    // Apply transform for easier drawing
    ctx.translate(offsetX, offsetY);
    ctx.scale(s, s);

    // Outer phone body (main rounded rectangle) - BLACK
    const outerRadius = 73;
    ctx.beginPath();
    roundedRect(ctx, 2, 0, 428, 882, outerRadius);

    // Black frame
    ctx.fillStyle = '#1a1a1a';
    ctx.fill();

    // Left side buttons (black)
    // Volume/Silent button (top)
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 170, 3, 34);

    // Volume up button
    ctx.fillRect(1, 233, 2.5, 67);

    // Volume down button
    ctx.fillRect(1, 318, 2.5, 67);

    // Right side power button
    ctx.fillRect(430, 279, 3, 106);

    // Inner phone body (dark gray)
    const innerRadius = 70;
    ctx.beginPath();
    roundedRect(ctx, 6, 4, 420, 874, innerRadius);
    ctx.fillStyle = '#0a0a0a';
    ctx.fill();

    // Screen bezel (black inner border) - uniform bezel all around
    const bezelSize = 12; // Thinner bezel size
    const screenX = bezelSize;
    const screenY = bezelSize;
    const screenWidth = PHONE_WIDTH - (bezelSize * 2); // 433 - 24 = 409
    const screenHeight = PHONE_HEIGHT - (bezelSize * 2); // 882 - 24 = 858
    const screenRadius = 55.75;

    ctx.beginPath();
    roundedRect(ctx, screenX, screenY, screenWidth, screenHeight, screenRadius);
    ctx.fillStyle = '#000000';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 0.5;
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

/**
 * Draw iPhone notch/Dynamic Island overlay (drawn on top of image)
 */
function drawiPhoneNotchOverlay(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    scale: number
): void {
    ctx.save();

    // MagicUI iPhone dimensions (scaled)
    const PHONE_WIDTH = 433;
    const PHONE_HEIGHT = 882;
    const scaleX = width / PHONE_WIDTH;
    const scaleY = height / PHONE_HEIGHT;
    const s = Math.min(scaleX, scaleY);

    // Calculate centered position if aspect ratio doesn't match
    const scaledWidth = PHONE_WIDTH * s;
    const scaledHeight = PHONE_HEIGHT * s;
    const offsetX = x + (width - scaledWidth) / 2;
    const offsetY = y + (height - scaledHeight) / 2;

    // Apply transform for easier drawing
    ctx.translate(offsetX, offsetY);
    ctx.scale(s, s);

    // Notch/Dynamic Island area (BLACK)
    const notchY = 30;
    const notchHeight = 37;

    // Notch background pill (black)
    ctx.beginPath();
    roundedRect(ctx, 154, notchY, 124, notchHeight, 18.5);
    ctx.fillStyle = '#000000';
    ctx.fill();

    // Camera/sensor circle on the right side of notch (black)
    ctx.beginPath();
    ctx.arc(259.5, 48.5, 10.5, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.fill();

    // Inner camera/sensor detail (very dark gray for subtle detail)
    ctx.beginPath();
    ctx.arc(259.5, 48.5, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = '#0a0a0a';
    ctx.fill();

    ctx.restore();
}


/**
 * Get Android screen bounds for clipping
 */
export function getAndroidScreenBounds(
    x: number,
    y: number,
    width: number,
    height: number
): { x: number; y: number; width: number; height: number; radiusX: number; radiusY: number } {
    const PHONE_WIDTH = 378; // Android is 378x830
    const PHONE_HEIGHT = 830;
    const SCREEN_X = 9;
    const SCREEN_Y = 14;
    const SCREEN_WIDTH = 360;
    const SCREEN_HEIGHT = 800;
    const SCREEN_RADIUS_X = 33;
    const SCREEN_RADIUS_Y = 25;

    const scaleX = width / PHONE_WIDTH;
    const scaleY = height / PHONE_HEIGHT;
    const s = Math.min(scaleX, scaleY);

    const scaledWidth = PHONE_WIDTH * s;
    const scaledHeight = PHONE_HEIGHT * s;
    const offsetX = x + (width - scaledWidth) / 2;
    const offsetY = y + (height - scaledHeight) / 2;

    return {
        x: offsetX + SCREEN_X * s,
        y: offsetY + SCREEN_Y * s,
        width: SCREEN_WIDTH * s,
        height: SCREEN_HEIGHT * s,
        radiusX: SCREEN_RADIUS_X * s,
        radiusY: SCREEN_RADIUS_Y * s,
    };
}

/**
 * Draw Android frame based on MagicUI design
 * Dimensions: 378x830 with precise bezel and camera
 */
function drawAndroidFrame(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    _borderRadius: number,
    _scale: number
): void {
    ctx.save();

    // MagicUI Android dimensions
    const PHONE_WIDTH = 378;
    const PHONE_HEIGHT = 830;
    const scaleX = width / PHONE_WIDTH;
    const scaleY = height / PHONE_HEIGHT;
    const s = Math.min(scaleX, scaleY);

    // Calculate centered position if aspect ratio doesn't match
    const scaledWidth = PHONE_WIDTH * s;
    const scaledHeight = PHONE_HEIGHT * s;
    const offsetX = x + (width - scaledWidth) / 2;
    const offsetY = y + (height - scaledHeight) / 2;

    // Apply transform for easier drawing
    ctx.translate(offsetX, offsetY);
    ctx.scale(s, s);

    // Side buttons (right side) - power and volume
    ctx.fillStyle = '#1a1a1a';

    // Power button
    ctx.beginPath();
    roundedRect(ctx, 376, 153, 4, 98, 1);
    ctx.fill();

    // Volume button
    ctx.beginPath();
    roundedRect(ctx, 376, 301, 4, 52, 1);
    ctx.fill();

    // Outer phone body - BLACK
    const outerRadius = 42;
    ctx.beginPath();
    roundedRect(ctx, 0, 0, 378, 830, outerRadius);
    ctx.fillStyle = '#1a1a1a';
    ctx.fill();

    // Inner phone body (dark gray)
    const innerRadius = 40;
    ctx.beginPath();
    roundedRect(ctx, 2, 5, 374, 820, innerRadius);
    ctx.fillStyle = '#0a0a0a';
    ctx.fill();

    // Screen bezel (black inner border)
    const screenX = 9;
    const screenY = 14;
    const screenWidth = 360;
    const screenHeight = 800;
    const screenRadiusX = 33;
    const screenRadiusY = 25;

    ctx.beginPath();
    ctx.ellipse(
        screenX + screenRadiusX,
        screenY + screenRadiusY,
        screenRadiusX,
        screenRadiusY,
        0,
        Math.PI,
        1.5 * Math.PI
    );
    ctx.lineTo(screenX + screenWidth - screenRadiusX, screenY);
    ctx.ellipse(
        screenX + screenWidth - screenRadiusX,
        screenY + screenRadiusY,
        screenRadiusX,
        screenRadiusY,
        0,
        1.5 * Math.PI,
        0
    );
    ctx.lineTo(screenX + screenWidth, screenY + screenHeight - screenRadiusY);
    ctx.ellipse(
        screenX + screenWidth - screenRadiusX,
        screenY + screenHeight - screenRadiusY,
        screenRadiusX,
        screenRadiusY,
        0,
        0,
        0.5 * Math.PI
    );
    ctx.lineTo(screenX + screenRadiusX, screenY + screenHeight);
    ctx.ellipse(
        screenX + screenRadiusX,
        screenY + screenHeight - screenRadiusY,
        screenRadiusX,
        screenRadiusY,
        0,
        0.5 * Math.PI,
        Math.PI
    );
    ctx.closePath();
    ctx.fillStyle = '#000000';
    ctx.fill();

    ctx.restore();
}

/**
 * Draw Android camera dot overlay (drawn on top of image)
 */
function drawAndroidCameraOverlay(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    _scale: number
): void {
    ctx.save();

    const PHONE_WIDTH = 378;
    const PHONE_HEIGHT = 830;
    const scaleX = width / PHONE_WIDTH;
    const scaleY = height / PHONE_HEIGHT;
    const s = Math.min(scaleX, scaleY);

    const scaledWidth = PHONE_WIDTH * s;
    const scaledHeight = PHONE_HEIGHT * s;
    const offsetX = x + (width - scaledWidth) / 2;
    const offsetY = y + (height - scaledHeight) / 2;

    ctx.translate(offsetX, offsetY);
    ctx.scale(s, s);

    // Camera outer circle (white/light in original, black here)
    ctx.beginPath();
    ctx.arc(189, 28, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.fill();

    // Camera inner circle (darker detail)
    ctx.beginPath();
    ctx.arc(189, 28, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#0a0a0a';
    ctx.fill();

    ctx.restore();
}
