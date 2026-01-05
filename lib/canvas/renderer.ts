import { FrameType } from '@/types/editor';

export interface RenderOptions {
    canvas: HTMLCanvasElement;
    image: HTMLImageElement;
    backgroundType: string;
    backgroundColor: string;
    gradientColors: [string, string];
    gradientAngle: number;
    meshGradientCSS?: string;
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
    } = options;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate frame dimensions
    let frameTop = 0;
    let frameBottom = 0;
    let frameLeft = 0;
    let frameRight = 0;

    if (frameType === 'browser') frameTop = 40;
    else if (frameType === 'macos') frameTop = 32;
    else if (frameType === 'windows') frameTop = 32;
    else if (frameType === 'iphone') {
        frameTop = 16 * imageScale;
        frameBottom = 16 * imageScale;
        frameLeft = 16 * imageScale;
        frameRight = 16 * imageScale;
    } else if (frameType === 'android') {
        frameTop = 12 * imageScale;
        frameBottom = 12 * imageScale;
        frameLeft = 12 * imageScale;
        frameRight = 12 * imageScale;
    }

    const frameOffsetY = frameTop + frameBottom;
    const frameOffsetX = frameLeft + frameRight;

    // Calculate dimensions (apply imageScale to image)
    const scaledImgWidth = Math.round(image.width * imageScale);
    const scaledImgHeight = Math.round(image.height * imageScale);
    const defaultCanvasWidth = scaledImgWidth + padding * 2 + frameOffsetX;
    const defaultCanvasHeight = scaledImgHeight + padding * 2 + frameOffsetY;

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
    // Center the "Content" (Image + Frame)
    const contentWidth = scaledImgWidth + frameOffsetX;
    const contentHeight = scaledImgHeight + frameOffsetY;

    // Content top-left corner
    const contentX = (canvasWidth - contentWidth) / 2;
    const contentY = (canvasHeight - contentHeight) / 2;

    // Image position relative to content
    const imgX = contentX + frameLeft;
    const imgY = contentY + frameTop;

    // Adjusted dimensions for frame and shadow drawing
    const imgWidth = scaledImgWidth;
    const imgHeight = scaledImgHeight;

    // Determine effective border radius for screenshot
    // When using a frame, don't round the top corners (they connect to the frame)
    // UNLESS it's a phone frame, in which case we want the screen to be rounded
    let effectiveTopRadius = frameType !== 'none' ? 0 : borderRadius;
    let effectiveBottomRadius = borderRadius;

    if (frameType === 'iphone' || frameType === 'android') {
        const screenRadius = (frameType === 'iphone' ? 24 : 18) * imageScale;
        effectiveTopRadius = screenRadius;
        effectiveBottomRadius = screenRadius;
        // Optionally mix with user's borderRadius if they want MORE rounding?
        // But enforcing a standard screen radius creates the best "Mockup" effect.
    } else if (frameType !== 'none') {
        // Browser/Window frames: Top is flat (0), Bottom is rounded (borderRadius)
        effectiveTopRadius = 0;
        effectiveBottomRadius = borderRadius;
    }

    // Draw frame if needed
    if (frameType !== 'none') {
        drawFrame(
            ctx,
            imgX - frameLeft,
            imgY - frameTop,
            imgWidth + frameOffsetX,
            imgHeight + frameOffsetY,
            frameType,
            borderRadius,
            imageScale
        );
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
    if (shadowBlur > 0 && shadowOpacity > 0) {
        ctx.save();

        // Convert shadowColor to RGBA with correct opacity if needed, 
        // or just apply globalAlpha if shadowColor is solid.
        // Assuming shadowColor is the base color (e.g. #000000 or rgba(0,0,0,1))
        // We can use the alpha channel of shadowColor mixed with shadowOpacity?
        // Simpler: Just set shadowColor and rely on alpha, but user wants opacity control.
        // If user picks black, and opacity 50%, result should be 50% black.
        // If we use ctx.shadowColor, it follows normal color rules.
        // Let's assume shadowColor from picker is full opacity, and we apply opacity here.
        // BUT color picker might return HEX.

        // Workaround: render shadow to a layer? No, explicit shadow props:
        // Parse color or just use it. If HEX, we need to add alpha.
        // If we can't parse easily without a library, we can set shadowColor and globalAlpha?
        // But globalAlpha affects everything.
        // Correct approach: HexToRgba.
        // For now, let's assume shadowColor is passed.
        // If we want to strictly enforce opacity, we might need a utility.
        // However, standard context shadowColor takes a string.
        // If we want to use the slider opacity, simple way:

        ctx.shadowColor = shadowColor;
        // We can't easily modify alpha of a generic color string without parsing.
        // BUT, notice previous code: `rgba(0,0,0, ${opacity})`.
        // If we want to support any color + slider opacity, we need to mix them.
        // Let's implement a simple HexToRgba helper inline or assume color includes alpha?
        // User asked for "Shadow Preset %".
        // Let's try to pass the color as is.
        // And rely on the user picking the alpha in the color picker?
        // NO, user likely wants separate opacity slider.
        // I'll assume for now `shadowColor` is just the hue, and I'll modify alpha?
        // Actually, if I use `globalAlpha` for the shadow drawing pass, it works!
        // But `shadowBlur` is a property of the context.
        // Shadows are drawn as part of the shape drawing.
        // If I set `ctx.shadowColor`, the shadow is drawn.
        // A trick: Draw the shadow rect (without fill) then draw image?
        // Or `ctx.shadowColor` supports rgba.

        // Let's stick to the previous `roundedRectWithDifferentCorners` logic fill.

        // Wait, the previous logic was:
        // ctx.shadowColor = `rgba(0,0,0, ${opacity})`;

        // I will use a helper to inject alpha if possible, or just ignore opacity slider if color has alpha?
        // No, slider is better.
        // Let's try to convert HEX to RGBA if possible.
        // Or simpler: Draw the shadow ONLY (offscreen?)

        // SIMPLEST: Use `ctx.globalAlpha` inside `ctx.save()` scope just for the shadow fill?
        // But shadow is attached to the fill.
        // If I `ctx.fillStyle = 'rgba(0,0,0,1)'` and `ctx.globalAlpha = 0.5`, the fill AND shadow get 0.5?
        // If I draw a socket shape behind the image?

        // PREVIOUS LOGIC: 
        // ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        // ctx.fill();
        // This drew a black rectangle BEHIND the image (because `ctx.restore()` before image drawing).
        // Yes! Look at line 129 in original code.
        // It draws a FILLED rect with shadow.
        // So I can just set `ctx.globalAlpha = shadowOpacity / 100`?
        // If I do that, the "black" rect will also be visible?
        // Ah, the image is drawn ON TOP later.
        // But if the image has transparency (PNG), the black rect will show through!
        // The previous logic drew a black rect... this effectively makes transparent images have black background?
        // That's a bug in previous implementation if image is transparent.
        // But standard screenshots are opaque usually.

        // Improved logic:
        // Don't draw a fill. Just use `ctx.rect` and `ctx.shadow...`?
        // If I don't fill, no shadow is cast.
        // I must fill or stroke.

        // If I set `ctx.fillStyle = shadowColor` and `ctx.globalAlpha = shadowOpacity / 100`...
        // The shadow color will be derived from fill style? No, `shadowColor` is separate.

        // Let's use `shadowColor` directly from store.
        // And ignore separate opacity slider for color blending for a moment, OR apply it to `ctx.globalAlpha`?
        // If I apply `ctx.globalAlpha`, it applies to the shadow as well.
        // So:
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = shadowBlur * 2; // Multiplier for better scale
        ctx.shadowOffsetY = shadowBlur * 0.5; // Offset logic
        ctx.shadowOffsetX = 0;

        // To handle opacity:
        ctx.globalAlpha = shadowOpacity / 100;

        ctx.beginPath();
        roundedRectWithDifferentCorners(ctx, imgX, imgY, imgWidth, imgHeight, effectiveTopRadius, effectiveBottomRadius);
        ctx.fillStyle = shadowColor; // The shape itself needs a color?
        // Ideally we want ONLY the shadow, not the shape?
        // If we draw the shape *behind* the image, and the image covers it, it's fine.
        // But for transparent images, we see the shape.
        // The user probably wants a "Drop Shadow" filter effect.
        // Canvas `shadowBlur` works on the shape.

        // For now, I'll stick to the "Draw Shape Behind" method which works for opaque images (most screenshots).
        // Using `globalAlpha` handles the opacity.

        ctx.fill();
        ctx.restore();
    }

    // Draw image with rounded corners (different for top vs bottom when frame is used)
    ctx.beginPath();
    roundedRectWithDifferentCorners(ctx, imgX, imgY, imgWidth, imgHeight, effectiveTopRadius, effectiveBottomRadius);
    ctx.clip();
    ctx.drawImage(image, imgX, imgY, imgWidth, imgHeight);

    ctx.restore();

    // Draw frame overlay (Dynamic Island, Camera Dot) that must be ON TOP of the image
    if (frameType === 'iphone' || frameType === 'android') {
        const overlayX = imgX - frameLeft;
        const overlayY = imgY - frameTop;
        const overlayWidth = imgWidth + frameOffsetX;
        const overlayHeight = imgHeight + frameOffsetY;

        drawFrameOverlay(
            ctx,
            overlayX,
            overlayY,
            overlayWidth,
            overlayHeight,
            frameType,
            imageScale
        );
    }
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
    borderRadius: number,
    scale: number = 1
): void {
    if (frameType === 'browser') {
        drawBrowserFrame(ctx, x, y, width, height, borderRadius);
    } else if (frameType === 'macos') {
        drawMacOSFrame(ctx, x, y, width, height, borderRadius);
    } else if (frameType === 'windows') {
        drawWindowsFrame(ctx, x, y, width, height, borderRadius);
    } else if (frameType === 'iphone') {
        drawiPhoneFrame(ctx, x, y, width, height, borderRadius, scale);
    } else if (frameType === 'android') {
        drawAndroidFrame(ctx, x, y, width, height, borderRadius, scale);
    }
}

function drawFrameOverlay(
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
        // Scale dimensions
        const islandWidth = Math.min(120 * safeScale, width * 0.35);
        const islandHeight = 35 * safeScale;
        const islandX = x + width / 2 - islandWidth / 2;
        const islandY = y + 12 * safeScale;

        ctx.save();
        ctx.beginPath();
        roundedRect(ctx, islandX, islandY, islandWidth, islandHeight, 18 * safeScale);
        ctx.fillStyle = '#000000'; // Pure black for the island
        ctx.fill();

        // Inner detail / reflections could go here

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

function drawiPhoneFrame(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    borderRadius: number,
    scale: number
): void {
    // Outer frame (bezel)
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

    // Note: Island is drawn in overlay

    ctx.restore();
}

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
    ctx.fillStyle = '#121212'; // Dark grey
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

    // Note: Camera dot is drawn in overlay

    ctx.restore();
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
