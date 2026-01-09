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
        case 'instagram':
            drawInstagramFrame(ctx, x, y, width, height, borderRadius);
            break;
        case 'facebook':
            drawFacebookFrame(ctx, x, y, width, height, borderRadius);
            break;
        case 'twitter':
            drawTwitterFrame(ctx, x, y, width, height, borderRadius);
            break;
        case 'linkedin':
            drawLinkedInFrame(ctx, x, y, width, height, borderRadius);
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

/**
 * Get social media frame content bounds for clipping
 * Returns the area where the actual content/image should be displayed
 */
export function getSocialMediaContentBounds(
    x: number,
    y: number,
    width: number,
    height: number,
    frameType: 'instagram' | 'facebook' | 'twitter' | 'linkedin'
): { x: number; y: number; width: number; height: number; radius: number } {
    let headerHeight: number;
    let footerHeight: number;
    let radius: number;

    switch (frameType) {
        case 'instagram':
            headerHeight = 60;
            footerHeight = 50;
            radius = 0; // Square content area
            break;
        case 'facebook':
            headerHeight = 70;
            footerHeight = 50;
            radius = 0;
            break;
        case 'twitter':
            headerHeight = 60;
            footerHeight = 50;
            radius = 0;
            break;
        case 'linkedin':
            headerHeight = 70;
            footerHeight = 50;
            radius = 0;
            break;
    }

    return {
        x: x,
        y: y + headerHeight,
        width: width,
        height: height - headerHeight - footerHeight,
        radius: radius,
    };
}

/**
 * Draw Instagram post frame
 */
function drawInstagramFrame(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    borderRadius: number
): void {
    ctx.save();

    const headerHeight = 60;
    const footerHeight = 50;

    // Main white card background
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    roundedRect(ctx, x, y, width, height, borderRadius);
    ctx.fill();

    // Header section (username bar)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, width, headerHeight);

    // Profile picture circle
    const profileSize = 32;
    const profileX = x + 12;
    const profileY = y + headerHeight / 2;

    // Profile picture border (gradient effect)
    const gradient = ctx.createLinearGradient(profileX - profileSize / 2, profileY, profileX + profileSize / 2, profileY);
    gradient.addColorStop(0, '#f09433');
    gradient.addColorStop(0.25, '#e6683c');
    gradient.addColorStop(0.5, '#dc2743');
    gradient.addColorStop(0.75, '#cc2366');
    gradient.addColorStop(1, '#bc1888');

    ctx.beginPath();
    ctx.arc(profileX, profileY, profileSize / 2 + 2, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Inner white circle (profile background)
    ctx.beginPath();
    ctx.arc(profileX, profileY, profileSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Gray circle (profile photo placeholder)
    ctx.beginPath();
    ctx.arc(profileX, profileY, profileSize / 2 - 2, 0, Math.PI * 2);
    ctx.fillStyle = '#e4e4e7';
    ctx.fill();

    // Username text
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px -apple-system, system-ui, sans-serif';
    ctx.fillText('Username', profileX + profileSize / 2 + 12, profileY + 4);

    // Menu dots (three dots)
    const dotX = x + width - 24;
    const dotY = y + headerHeight / 2;
    ctx.fillStyle = '#262626';
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(dotX, dotY + (i - 1) * 5, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Footer section (action buttons) - positioned at the bottom of the frame
    const footerY = y + height - footerHeight;

    // Like icon (heart)
    const iconStartX = x + 16;
    const iconY = footerY + 12;

    ctx.strokeStyle = '#262626';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Heart
    ctx.beginPath();
    ctx.moveTo(iconStartX + 12, iconY + 20);
    ctx.bezierCurveTo(iconStartX + 12, iconY + 17, iconStartX + 10, iconY + 14, iconStartX + 6, iconY + 14);
    ctx.bezierCurveTo(iconStartX + 2, iconY + 14, iconStartX, iconY + 16, iconStartX, iconY + 19);
    ctx.bezierCurveTo(iconStartX, iconY + 23, iconStartX + 3, iconY + 26, iconStartX + 12, iconY + 34);
    ctx.bezierCurveTo(iconStartX + 21, iconY + 26, iconStartX + 24, iconY + 23, iconStartX + 24, iconY + 19);
    ctx.bezierCurveTo(iconStartX + 24, iconY + 16, iconStartX + 22, iconY + 14, iconStartX + 18, iconY + 14);
    ctx.bezierCurveTo(iconStartX + 14, iconY + 14, iconStartX + 12, iconY + 17, iconStartX + 12, iconY + 20);
    ctx.stroke();

    // Comment icon (speech bubble)
    const commentX = iconStartX + 40;
    ctx.beginPath();
    ctx.moveTo(commentX, iconY + 20);
    ctx.lineTo(commentX + 22, iconY + 20);
    ctx.quadraticCurveTo(commentX + 24, iconY + 20, commentX + 24, iconY + 18);
    ctx.lineTo(commentX + 24, iconY + 10);
    ctx.quadraticCurveTo(commentX + 24, iconY + 8, commentX + 22, iconY + 8);
    ctx.lineTo(commentX + 2, iconY + 8);
    ctx.quadraticCurveTo(commentX, iconY + 8, commentX, iconY + 10);
    ctx.lineTo(commentX, iconY + 18);
    ctx.quadraticCurveTo(commentX, iconY + 20, commentX + 2, iconY + 20);
    ctx.stroke();

    // Share icon (paper plane)
    const shareX = iconStartX + 80;
    ctx.beginPath();
    ctx.moveTo(shareX + 2, iconY + 8);
    ctx.lineTo(shareX + 22, iconY - 2);
    ctx.lineTo(shareX + 12, iconY + 18);
    ctx.lineTo(shareX + 8, iconY + 14);
    ctx.lineTo(shareX + 2, iconY + 8);
    ctx.stroke();

    // Save icon (bookmark) - right aligned
    const saveX = x + width - 30;
    ctx.beginPath();
    ctx.moveTo(saveX, iconY + 8);
    ctx.lineTo(saveX + 16, iconY + 8);
    ctx.lineTo(saveX + 16, iconY + 24);
    ctx.lineTo(saveX + 8, iconY + 18);
    ctx.lineTo(saveX, iconY + 24);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
}

/**
 * Draw Facebook post frame
 */
function drawFacebookFrame(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    borderRadius: number
): void {
    ctx.save();

    const headerHeight = 70;
    const footerHeight = 50;

    // Main white card background
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    roundedRect(ctx, x, y, width, height, borderRadius);
    ctx.fill();

    // Header section
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, width, headerHeight);

    // Facebook logo text
    ctx.fillStyle = '#1877f2';
    ctx.font = 'bold 28px -apple-system, system-ui, sans-serif';
    ctx.fillText('facebook', x + 16, y + 40);

    // Header buttons (right side)
    const buttonY = y + 24;
    const buttonSize = 36;
    const buttonSpacing = 8;

    // Search button
    const searchX = x + width - buttonSize * 3 - buttonSpacing * 2 - 16;
    ctx.beginPath();
    ctx.arc(searchX + buttonSize / 2, buttonY + buttonSize / 2, buttonSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#f0f2f5';
    ctx.fill();

    // Search icon
    ctx.strokeStyle = '#65676b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(searchX + buttonSize / 2 - 2, buttonY + buttonSize / 2 - 2, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(searchX + buttonSize / 2 + 4, buttonY + buttonSize / 2 + 4);
    ctx.lineTo(searchX + buttonSize / 2 + 8, buttonY + buttonSize / 2 + 8);
    ctx.stroke();

    // Add button
    const addX = searchX + buttonSize + buttonSpacing;
    ctx.beginPath();
    ctx.arc(addX + buttonSize / 2, buttonY + buttonSize / 2, buttonSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#f0f2f5';
    ctx.fill();

    // Plus icon
    ctx.strokeStyle = '#65676b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(addX + buttonSize / 2, buttonY + 10);
    ctx.lineTo(addX + buttonSize / 2, buttonY + buttonSize - 10);
    ctx.moveTo(addX + 10, buttonY + buttonSize / 2);
    ctx.lineTo(addX + buttonSize - 10, buttonY + buttonSize / 2);
    ctx.stroke();

    // Menu button
    const menuX = addX + buttonSize + buttonSpacing;
    ctx.beginPath();
    ctx.arc(menuX + buttonSize / 2, buttonY + buttonSize / 2, buttonSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#f0f2f5';
    ctx.fill();

    // Menu icon (three dots)
    ctx.fillStyle = '#65676b';
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(menuX + buttonSize / 2 + (i - 1) * 8, buttonY + buttonSize / 2, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Footer section (reactions and comment area) - positioned at bottom of frame
    const footerY = y + height - footerHeight;

    // Reaction icons
    const reactionStartX = x + 16;
    const reactionY = footerY + 8;

    // Like (thumbs up) - using emoji representation
    ctx.fillStyle = '#1877f2';
    ctx.beginPath();
    ctx.arc(reactionStartX + 12, reactionY + 12, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('👍', reactionStartX + 6, reactionY + 18);

    // Heart
    ctx.fillStyle = '#f33e58';
    ctx.beginPath();
    ctx.arc(reactionStartX + 36, reactionY + 12, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillText('❤️', reactionStartX + 30, reactionY + 18);

    // Comment text
    ctx.fillStyle = '#65676b';
    ctx.font = '13px -apple-system, system-ui, sans-serif';
    ctx.fillText('36 Comments', reactionStartX + 60, reactionY + 12);

    // Comment input box
    ctx.fillStyle = '#f0f2f5';
    ctx.beginPath();
    roundedRect(ctx, x + 16, footerY + 28, width - 32, 20, 16);
    ctx.fill();

    // Placeholder text
    ctx.fillStyle = '#65676b';
    ctx.font = '12px -apple-system, system-ui, sans-serif';
    ctx.fillText('Write your comment...', x + 28, footerY + 40);

    ctx.restore();
}

/**
 * Draw Twitter/X post frame
 */
function drawTwitterFrame(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    borderRadius: number
): void {
    ctx.save();

    const headerHeight = 60;
    const footerHeight = 50;

    // Main card background
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    roundedRect(ctx, x, y, width, height, borderRadius);
    ctx.fill();

    // Header section
    const profileSize = 40;
    const profileX = x + 16;
    const profileY = y + 16;

    // Profile picture (gray circle)
    ctx.beginPath();
    ctx.arc(profileX + profileSize / 2, profileY + profileSize / 2, profileSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#e1e8ed';
    ctx.fill();

    // Username and handle
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 15px -apple-system, system-ui, sans-serif';
    ctx.fillText('Display Name', profileX + profileSize + 12, profileY + 16);

    ctx.fillStyle = '#657786';
    ctx.font = '14px -apple-system, system-ui, sans-serif';
    ctx.fillText('@username', profileX + profileSize + 12, profileY + 34);

    // Twitter/X logo
    const logoX = x + width - 40;
    const logoY = y + 16;

    // X logo (simple X shape)
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(logoX, logoY);
    ctx.lineTo(logoX + 20, logoY + 20);
    ctx.moveTo(logoX + 20, logoY);
    ctx.lineTo(logoX, logoY + 20);
    ctx.stroke();

    // Footer section (action buttons) - positioned at bottom of frame
    const footerY = y + height - footerHeight;
    const iconY = footerY + 10;

    ctx.strokeStyle = '#657786';
    ctx.fillStyle = '#657786';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Reply icon (speech bubble)
    const replyX = x + 20;
    ctx.beginPath();
    ctx.arc(replyX + 10, iconY + 12, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(replyX + 7, iconY + 19);
    ctx.lineTo(replyX + 4, iconY + 23);
    ctx.stroke();

    // Retweet icon
    const retweetX = x + width / 4 + 20;
    ctx.beginPath();
    ctx.moveTo(retweetX, iconY + 10);
    ctx.lineTo(retweetX + 14, iconY + 10);
    ctx.lineTo(retweetX + 10, iconY + 6);
    ctx.moveTo(retweetX + 14, iconY + 10);
    ctx.lineTo(retweetX + 10, iconY + 14);
    ctx.moveTo(retweetX + 14, iconY + 18);
    ctx.lineTo(retweetX, iconY + 18);
    ctx.lineTo(retweetX + 4, iconY + 22);
    ctx.moveTo(retweetX, iconY + 18);
    ctx.lineTo(retweetX + 4, iconY + 14);
    ctx.stroke();

    // Like icon (heart)
    const likeX = x + width / 2 + 20;
    ctx.beginPath();
    ctx.moveTo(likeX + 10, iconY + 20);
    ctx.bezierCurveTo(likeX + 10, iconY + 18, likeX + 8, iconY + 15, likeX + 5, iconY + 15);
    ctx.bezierCurveTo(likeX + 2, iconY + 15, likeX, iconY + 17, likeX, iconY + 19);
    ctx.bezierCurveTo(likeX, iconY + 22, likeX + 2, iconY + 24, likeX + 10, iconY + 30);
    ctx.bezierCurveTo(likeX + 18, iconY + 24, likeX + 20, iconY + 22, likeX + 20, iconY + 19);
    ctx.bezierCurveTo(likeX + 20, iconY + 17, likeX + 18, iconY + 15, likeX + 15, iconY + 15);
    ctx.bezierCurveTo(likeX + 12, iconY + 15, likeX + 10, iconY + 18, likeX + 10, iconY + 20);
    ctx.stroke();

    // Share icon
    const shareX = x + width - 60;
    ctx.beginPath();
    ctx.moveTo(shareX + 4, iconY + 14);
    ctx.lineTo(shareX + 16, iconY + 6);
    ctx.lineTo(shareX + 16, iconY + 22);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
}

/**
 * Draw LinkedIn post frame
 */
function drawLinkedInFrame(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    borderRadius: number
): void {
    ctx.save();

    const headerHeight = 70;
    const footerHeight = 50;

    // Main white card background
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    roundedRect(ctx, x, y, width, height, borderRadius);
    ctx.fill();

    // Header section
    const profileSize = 48;
    const profileX = x + 16;
    const profileY = y + 12;

    // Profile picture (gray circle)
    ctx.beginPath();
    ctx.arc(profileX + profileSize / 2, profileY + profileSize / 2, profileSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#dbe7f2';
    ctx.fill();

    // Name and title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px -apple-system, system-ui, sans-serif';
    ctx.fillText('Professional Name', profileX + profileSize + 12, profileY + 16);

    ctx.fillStyle = '#666666';
    ctx.font = '12px -apple-system, system-ui, sans-serif';
    ctx.fillText('Job Title at Company', profileX + profileSize + 12, profileY + 32);

    ctx.fillStyle = '#666666';
    ctx.font = '11px -apple-system, system-ui, sans-serif';
    ctx.fillText('1h • 🌎', profileX + profileSize + 12, profileY + 46);

    // Menu dots (right side)
    const menuX = x + width - 30;
    const menuY = y + 30;
    ctx.fillStyle = '#666666';
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(menuX + i * 6, menuY, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Footer section (reaction buttons)
    const footerY = y + height - footerHeight;

    // Separator line
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 16, footerY);
    ctx.lineTo(x + width - 16, footerY);
    ctx.stroke();

    // Action buttons
    const buttonWidth = (width - 32) / 3;
    const buttonY = footerY + 12;

    // Like button
    ctx.fillStyle = '#666666';
    ctx.font = '13px -apple-system, system-ui, sans-serif';
    ctx.fillText('👍 Like', x + buttonWidth / 2 - 20, buttonY + 16);

    // Comment button
    ctx.fillText('💬 Comment', x + buttonWidth * 1.5 - 30, buttonY + 16);

    // Share button
    ctx.fillText('↗️ Share', x + buttonWidth * 2.5 - 20, buttonY + 16);

    ctx.restore();
}
