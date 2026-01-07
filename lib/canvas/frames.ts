/**
 * Frame Rendering for Canvas
 * Handles browser, macOS, Windows, iPhone, and Android frame mockups
 */

import { FrameType } from '@/types/editor';
import { roundedRect } from './helpers';

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
 * Draw frame overlay elements (Dynamic Island, Camera Dot)
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
        // Dynamic Island
        const islandWidth = Math.min(120 * safeScale, width * 0.35);
        const islandHeight = 35 * safeScale;
        const islandX = x + width / 2 - islandWidth / 2;
        const islandY = y + 12 * safeScale;

        ctx.save();
        ctx.beginPath();
        roundedRect(ctx, islandX, islandY, islandWidth, islandHeight, 18 * safeScale);
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.restore();
    } else if (frameType === 'android') {
        // Camera Dot
        const dotSize = 12 * safeScale;
        const dotX = x + width / 2;
        const dotY = y + 18 * safeScale;

        ctx.save();
        ctx.beginPath();
        ctx.arc(dotX, dotY, dotSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.restore();
    }
}

/**
 * Draw browser window frame with traffic lights and URL bar
 */
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
 * Draw iPhone frame with bezel and buttons
 */
function drawiPhoneFrame(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    borderRadius: number,
    scale: number
): void {
    const phoneRadius = 32 * scale;

    ctx.save();

    // Draw black body
    ctx.beginPath();
    roundedRect(ctx, x, y, width, height, phoneRadius);
    ctx.fillStyle = '#000000';
    ctx.fill();

    // Inner stroke for definition
    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = '#333333';
    ctx.stroke();

    // Side buttons (Volume/Power)
    const buttonWidth = 3 * scale;
    const buttonHeight = 40 * scale;
    const buttonX = x - buttonWidth; // Left side
    const volUpY = y + 100 * scale;
    const volDownY = volUpY + buttonHeight + 10 * scale;
    const powerY = y + 100 * scale;
    const powerX = x + width; // Right side

    ctx.fillStyle = '#111111';

    // Vol Up
    ctx.beginPath();
    roundedRect(ctx, buttonX, volUpY, buttonWidth, buttonHeight, 2 * scale);
    ctx.fill();

    // Vol Down
    ctx.beginPath();
    roundedRect(ctx, buttonX, volDownY, buttonWidth, buttonHeight, 2 * scale);
    ctx.fill();

    // Power
    ctx.beginPath();
    roundedRect(ctx, powerX, powerY, buttonWidth, 60 * scale, 2 * scale);
    ctx.fill();

    ctx.restore();
}

/**
 * Draw Android frame with bezel and buttons
 */
function drawAndroidFrame(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    borderRadius: number,
    scale: number
): void {
    const phoneRadius = 24 * scale;

    ctx.save();

    // Draw body
    ctx.beginPath();
    roundedRect(ctx, x, y, width, height, phoneRadius);
    ctx.fillStyle = '#121212';
    ctx.fill();

    // Border for definition
    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = '#333333';
    ctx.stroke();

    // Side buttons (Power/Volume)
    const buttonWidth = 3 * scale;
    const buttonX = x + width; // Right side

    const powerHeight = 40 * scale;
    const powerY = y + 80 * scale;

    const volHeight = 80 * scale;
    const volY = powerY + powerHeight + 15 * scale;

    ctx.fillStyle = '#161616';

    // Power
    ctx.beginPath();
    roundedRect(ctx, buttonX, powerY, buttonWidth, powerHeight, 2 * scale);
    ctx.fill();

    // Volume (Rocker)
    ctx.beginPath();
    roundedRect(ctx, buttonX, volY, buttonWidth, volHeight, 2 * scale);
    ctx.fill();

    ctx.restore();
}
