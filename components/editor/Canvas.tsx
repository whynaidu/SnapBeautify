'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useEditorStore } from '@/lib/store/editor-store';
import { renderCanvas } from '@/lib/canvas/renderer';
import { DropZone } from './DropZone';
import { CropOverlay } from './CropOverlay';
import { cn } from '@/lib/utils';
import { measureRender } from '@/lib/utils/performance';
import { useThrottle } from '@/lib/hooks/useThrottle';
import { useSubscription } from '@/lib/subscription/context';
import { checkPremiumFeaturesUsed } from '@/lib/subscription/feature-gates';

export function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [displayScale, setDisplayScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [draggedTextId, setDraggedTextId] = useState<string | null>(null);
    const [alignmentGuides, setAlignmentGuides] = useState({ showCenterX: false, showCenterY: false });
    const rafIdRef = useRef<number | null>(null);
    const pendingUpdateRef = useRef<{ x: number; y: number } | null>(null);

    // Get subscription status
    const { isPro } = useSubscription();

    const {
        originalImage,
        backgroundType,
        backgroundColor,
        gradientColors,
        gradientAngle,
        meshGradientCSS,
        textPatternText,
        textPatternColor,
        textPatternOpacity,
        textPatternPositions,
        textPatternFontFamily,
        textPatternFontSize,
        textPatternFontWeight,
        textPatternRows,
        waveSplitFlipped,
        logoPatternImage,
        logoPatternOpacity,
        logoPatternSize,
        logoPatternSpacing,
        padding,
        shadowBlur,
        shadowOpacity,
        shadowColor,
        borderRadius,
        frameType,
        imageScale,
        rotation,
        canvasWidth,
        canvasHeight,
        textOverlays,
        updateTextOverlay,
        selectTextOverlay,
        isCropping,
        exportFormat,
        exportScale,
    } = useEditorStore();

    // Check if premium features are being used (for watermark)
    const premiumUsage = useMemo(() => {
        return checkPremiumFeaturesUsed({
            backgroundType,
            backgroundColor,
            gradientColors,
            meshGradientCSS,
            frameType,
            textPatternPositions,
            textPatternRows,
            textPatternFontFamily,
            textPatternFontWeight,
            textOverlays,
            padding,
            shadowBlur,
            shadowOpacity,
            shadowColor,
            borderRadius,
            imageScale,
            exportFormat,
            exportScale,
        });
    }, [
        backgroundType,
        backgroundColor,
        gradientColors,
        meshGradientCSS,
        frameType,
        textPatternPositions,
        textPatternRows,
        textPatternFontFamily,
        textPatternFontWeight,
        textOverlays,
        padding,
        shadowBlur,
        shadowOpacity,
        shadowColor,
        borderRadius,
        imageScale,
        exportFormat,
        exportScale,
    ]);

    // Show watermark if free user is using premium features
    const showWatermark = !isPro && premiumUsage.isPremiumUsed;

    // Create a memoized render function
    const performRender = useCallback(async () => {
        if (!canvasRef.current || !originalImage) return;

        // On mobile during drag, skip expensive renders for better performance
        if (isMobile && isDragging) {
            return;
        }

        await measureRender(
            'canvas:render',
            async () => {
                await renderCanvas({
                    canvas: canvasRef.current!,
                    image: originalImage,
                    backgroundType,
                    backgroundColor,
                    gradientColors,
                    gradientAngle,
                    meshGradientCSS,
                    textPatternText,
                    textPatternColor,
                    textPatternOpacity,
                    textPatternPositions,
                    textPatternFontFamily,
                    textPatternFontSize,
                    textPatternFontWeight,
                    textPatternRows,
                    waveSplitFlipped,
                    logoPatternImage,
                    logoPatternOpacity,
                    logoPatternSize,
                    logoPatternSpacing,
                    padding,
                    shadowBlur,
                    shadowOpacity,
                    shadowColor,
                    borderRadius,
                    frameType,
                    imageScale,
                    rotation,
                    targetWidth: canvasWidth,
                    targetHeight: canvasHeight,
                    textOverlays,
                });
            },
            {
                canvasWidth,
                canvasHeight,
                frameType,
            }
        );
    }, [
        isMobile,
        isDragging,
        originalImage,
        backgroundType,
        backgroundColor,
        gradientColors,
        gradientAngle,
        meshGradientCSS,
        textPatternText,
        textPatternColor,
        textPatternOpacity,
        textPatternPositions,
        textPatternFontFamily,
        textPatternFontSize,
        textPatternFontWeight,
        textPatternRows,
        waveSplitFlipped,
        logoPatternImage,
        logoPatternOpacity,
        logoPatternSize,
        logoPatternSpacing,
        padding,
        shadowBlur,
        shadowOpacity,
        shadowColor,
        borderRadius,
        frameType,
        imageScale,
        rotation,
        canvasWidth,
        canvasHeight,
        textOverlays,
    ]);

    // Throttle the render function - 33ms on mobile (30fps), 16ms on desktop (60fps)
    // Mobile devices struggle with 60fps canvas rendering, 30fps is much smoother
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const throttledRender = useThrottle(performRender, isMobile ? 33 : 16);

    // Re-render canvas when any setting changes (throttled)
    // Skip rendering when in crop mode or when actively dragging (for better drag performance)
    useEffect(() => {
        if (!isCropping && !isDragging) {
            throttledRender();
        }
    }, [throttledRender, isCropping, isDragging]);

    // Render raw image when in crop mode
    useEffect(() => {
        if (!canvasRef.current || !originalImage || !isCropping) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas to original image size
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;

        // Draw the original image without any effects
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(originalImage, 0, 0);
    }, [originalImage, isCropping]);

    // Calculate display scale to fit container (throttled for performance)
    useEffect(() => {
        if (!containerRef.current || !originalImage) return;

        const updateScale = () => {
            const container = containerRef.current!;
            // Account for actual padding values - mobile has more vertical padding
            const isMobile = window.innerWidth < 768;
            const horizontalPadding = isMobile ? 32 : 48; // p-4 (16px * 2) on mobile, p-6 (24px * 2) on desktop
            const verticalPadding = isMobile ? 208 : 48; // pt-20 + pb-32 (80px + 128px) on mobile, p-6 on desktop

            const containerWidth = container.clientWidth - horizontalPadding;
            const containerHeight = container.clientHeight - verticalPadding;

            // Use original image dimensions when cropping, canvas dimensions otherwise
            const width = isCropping ? originalImage.width : canvasWidth;
            const height = isCropping ? originalImage.height : canvasHeight;

            const scaleX = containerWidth / width;
            const scaleY = containerHeight / height;
            const scale = Math.min(scaleX, scaleY, 1);

            setDisplayScale(scale);
        };

        // Throttle resize handler for performance
        let ticking = false;
        const handleResize = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateScale();
                    ticking = false;
                });
                ticking = true;
            }
        };

        updateScale();
        window.addEventListener('resize', handleResize, { passive: true });
        return () => window.removeEventListener('resize', handleResize);
    }, [canvasWidth, canvasHeight, originalImage, isCropping]);

    // Helper function to snap to center and show alignment guides
    const snapToCenter = useCallback((x: number, y: number) => {
        const snapThreshold = 3; // 3% distance threshold for snapping
        const centerX = 50;
        const centerY = 50;

        let snappedX = x;
        let snappedY = y;
        let showCenterX = false;
        let showCenterY = false;

        // Check if close to center X
        if (Math.abs(x - centerX) < snapThreshold) {
            snappedX = centerX;
            showCenterX = true;
        }

        // Check if close to center Y
        if (Math.abs(y - centerY) < snapThreshold) {
            snappedY = centerY;
            showCenterY = true;
        }

        setAlignmentGuides({ showCenterX, showCenterY });

        return { x: snappedX, y: snappedY };
    }, []);

    // RAF-based batched update for smooth text dragging on mobile
    const batchedUpdateTextPosition = useCallback((x: number, y: number, textId: string) => {
        // Store the pending update
        pendingUpdateRef.current = { x, y };

        // Cancel any existing RAF
        if (rafIdRef.current !== null) {
            return; // Already scheduled, will use latest position
        }

        // Schedule update for next frame
        rafIdRef.current = requestAnimationFrame(() => {
            const pending = pendingUpdateRef.current;
            if (pending && textId) {
                const snapped = snapToCenter(pending.x, pending.y);
                updateTextOverlay(textId, { x: snapped.x, y: snapped.y });
            }
            rafIdRef.current = null;
            pendingUpdateRef.current = null;
        });
    }, [snapToCenter, updateTextOverlay]);

    // Cleanup RAF on unmount
    useEffect(() => {
        return () => {
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, []);

    // Handle text overlay dragging
    const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current || textOverlays.length === 0) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Get canvas context for text measurement
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Check if click is on any text overlay (in reverse order, top to bottom)
        for (let i = textOverlays.length - 1; i >= 0; i--) {
            const overlay = textOverlays[i];

            // Measure actual text dimensions
            ctx.font = `${overlay.fontWeight} ${overlay.fontSize}px ${overlay.fontFamily}`;
            const metrics = ctx.measureText(overlay.text);

            // Calculate text width and height in percentage of canvas
            const textWidthPx = metrics.width;
            const textHeightPx = overlay.fontSize * 1.2; // Approximate height with some padding
            const textWidthPercent = (textWidthPx / canvas.width) * 100;
            const textHeightPercent = (textHeightPx / canvas.height) * 100;

            // Add some padding to make it easier to click
            const hitboxWidth = textWidthPercent + 5;
            const hitboxHeight = textHeightPercent + 5;

            if (
                x >= overlay.x - hitboxWidth / 2 &&
                x <= overlay.x + hitboxWidth / 2 &&
                y >= overlay.y - hitboxHeight / 2 &&
                y <= overlay.y + hitboxHeight / 2
            ) {
                setIsDragging(true);
                setDraggedTextId(overlay.id);
                selectTextOverlay(overlay.id);
                canvas.style.cursor = 'grabbing';
                break;
            }
        }
    }, [textOverlays, selectTextOverlay]);

    const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

        // If dragging, update position with snapping
        if (isDragging && draggedTextId) {
            const snapped = snapToCenter(x, y);
            updateTextOverlay(draggedTextId, { x: snapped.x, y: snapped.y });
            return;
        }

        // If not dragging, check if hovering over any text to show grab cursor
        if (textOverlays.length > 0) {
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            let isOverText = false;
            for (let i = textOverlays.length - 1; i >= 0; i--) {
                const overlay = textOverlays[i];

                ctx.font = `${overlay.fontWeight} ${overlay.fontSize}px ${overlay.fontFamily}`;
                const metrics = ctx.measureText(overlay.text);

                const textWidthPx = metrics.width;
                const textHeightPx = overlay.fontSize * 1.2;
                const textWidthPercent = (textWidthPx / canvas.width) * 100;
                const textHeightPercent = (textHeightPx / canvas.height) * 100;

                const hitboxWidth = textWidthPercent + 5;
                const hitboxHeight = textHeightPercent + 5;

                if (
                    x >= overlay.x - hitboxWidth / 2 &&
                    x <= overlay.x + hitboxWidth / 2 &&
                    y >= overlay.y - hitboxHeight / 2 &&
                    y <= overlay.y + hitboxHeight / 2
                ) {
                    isOverText = true;
                    break;
                }
            }

            canvas.style.cursor = isOverText ? 'grab' : 'default';
        }
    }, [isDragging, draggedTextId, updateTextOverlay, textOverlays, snapToCenter]);

    const handleCanvasMouseUp = useCallback(() => {
        setIsDragging(false);
        setDraggedTextId(null);
        setAlignmentGuides({ showCenterX: false, showCenterY: false });
    }, []);

    const handleCanvasMouseLeave = useCallback(() => {
        if (canvasRef.current) {
            canvasRef.current.style.cursor = 'default';
        }
        setIsDragging(false);
        setDraggedTextId(null);
        setAlignmentGuides({ showCenterX: false, showCenterY: false });
    }, []);

    // Touch event handlers for mobile
    const handleCanvasTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current || textOverlays.length === 0) return;

        // Prevent default touch behavior and scrolling
        e.preventDefault();
        e.stopPropagation();

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Check if touch is on any text overlay
        for (let i = textOverlays.length - 1; i >= 0; i--) {
            const overlay = textOverlays[i];

            ctx.font = `${overlay.fontWeight} ${overlay.fontSize}px ${overlay.fontFamily}`;
            const metrics = ctx.measureText(overlay.text);

            const textWidthPx = metrics.width;
            const textHeightPx = overlay.fontSize * 1.2;
            const textWidthPercent = (textWidthPx / canvas.width) * 100;
            const textHeightPercent = (textHeightPx / canvas.height) * 100;

            const hitboxWidth = textWidthPercent + 5;
            const hitboxHeight = textHeightPercent + 5;

            if (
                x >= overlay.x - hitboxWidth / 2 &&
                x <= overlay.x + hitboxWidth / 2 &&
                y >= overlay.y - hitboxHeight / 2 &&
                y <= overlay.y + hitboxHeight / 2
            ) {
                setIsDragging(true);
                setDraggedTextId(overlay.id);
                selectTextOverlay(overlay.id);
                break;
            }
        }
    }, [textOverlays, selectTextOverlay]);

    const handleCanvasTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDragging || !draggedTextId || !canvasRef.current) return;

        // Prevent scrolling and pull-to-refresh while dragging
        e.preventDefault();
        e.stopPropagation();

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));

        // Use batched RAF update for smooth performance
        batchedUpdateTextPosition(x, y, draggedTextId);
    }, [isDragging, draggedTextId, batchedUpdateTextPosition]);

    const handleCanvasTouchEnd = useCallback(() => {
        setIsDragging(false);
        setDraggedTextId(null);
        setAlignmentGuides({ showCenterX: false, showCenterY: false });
        // Trigger a final render after drag ends
        requestAnimationFrame(() => {
            throttledRender();
        });
    }, [throttledRender]);

    return (
        <div
            ref={containerRef}
            className={cn(
                'flex-1 flex items-center justify-center',
                'overflow-hidden',
                'relative',
                // Increase bottom padding on mobile to prevent overlap with controls
                // pt-20 for top spacing, pb-32 for bottom controls, on mobile
                originalImage ? 'p-4 pt-20 pb-32 md:p-8' : 'p-6'
            )}
        >
            {originalImage ? (
                <div
                    className="relative"
                    style={{
                        // Set explicit dimensions based on scaled size to prevent layout overflow
                        width: isCropping
                            ? originalImage.width * displayScale
                            : canvasWidth * displayScale,
                        height: isCropping
                            ? originalImage.height * displayScale
                            : canvasHeight * displayScale,
                    }}
                >
                    <canvas
                        ref={canvasRef}
                        onMouseDown={handleCanvasMouseDown}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseUp={handleCanvasMouseUp}
                        onMouseLeave={handleCanvasMouseLeave}
                        onTouchStart={handleCanvasTouchStart}
                        onTouchMove={handleCanvasTouchMove}
                        onTouchEnd={handleCanvasTouchEnd}
                        style={{
                            transform: `scale(${displayScale})`,
                            transformOrigin: 'top left',
                            touchAction: 'none', // Prevent pull-to-refresh and scrolling on mobile
                        }}
                        className="rounded-2xl shadow-2xl shadow-black/20 dark:shadow-black/40 ring-1 ring-black/5 dark:ring-white/5"
                    />

                    {/* Premium Watermark Overlay */}
                    {showWatermark && (
                        <div
                            className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
                            style={{
                                width: canvasWidth,
                                height: canvasHeight,
                                transform: `scale(${displayScale})`,
                                transformOrigin: 'top left',
                            }}
                        >
                            {/* Diagonal watermark pattern */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: 'repeating-linear-gradient(45deg, transparent, transparent 80px, rgba(0, 0, 0, 0.08) 80px, rgba(0, 0, 0, 0.08) 160px)',
                                }}
                            />

                            {/* Repeating watermark text */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div
                                    className="absolute w-[200%] h-[200%] flex flex-wrap items-center justify-center gap-16"
                                    style={{
                                        transform: 'rotate(-30deg)',
                                    }}
                                >
                                    {Array.from({ length: 25 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="text-2xl font-bold text-zinc-900/20 dark:text-white/20 whitespace-nowrap select-none"
                                        >
                                            SNAPBEAUTIFY PRO
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Premium features badge at bottom */}
                            <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white px-4 py-3 rounded-2xl max-w-md shadow-xl">
                                    <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">Premium Features Used:</div>
                                    <div className="text-[10px] text-zinc-600 dark:text-zinc-400 flex flex-wrap gap-1.5">
                                        {premiumUsage.premiumFeatures.map((feature, i) => (
                                            <span key={i} className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full font-medium">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                    {/* Alignment Guides */}
                    {alignmentGuides.showCenterX && (
                        <div
                            className="absolute w-0.5 bg-pink-500 pointer-events-none z-10"
                            style={{
                                left: (canvasWidth * displayScale) / 2,
                                top: 0,
                                height: canvasHeight * displayScale,
                                opacity: 0.8,
                            }}
                        />
                    )}
                    {alignmentGuides.showCenterY && (
                        <div
                            className="absolute h-0.5 bg-pink-500 pointer-events-none z-10"
                            style={{
                                top: (canvasHeight * displayScale) / 2,
                                left: 0,
                                width: canvasWidth * displayScale,
                                opacity: 0.8,
                            }}
                        />
                    )}
                    {isCropping && originalImage && (
                        <CropOverlay
                            canvasWidth={originalImage.width}
                            canvasHeight={originalImage.height}
                            displayScale={displayScale}
                        />
                    )}
                </div>
            ) : (
                <DropZone />
            )}
        </div>
    );
}
