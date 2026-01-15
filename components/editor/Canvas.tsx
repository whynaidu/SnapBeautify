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
    const dragPreviewRef = useRef<HTMLDivElement>(null);
    const [displayScale, setDisplayScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [draggedTextId, setDraggedTextId] = useState<string | null>(null);
    const [alignmentGuides, setAlignmentGuides] = useState({ showCenterX: false, showCenterY: false });
    const rafIdRef = useRef<number | null>(null);
    const pendingUpdateRef = useRef<{ x: number; y: number } | null>(null);
    // Track final drag position for commit on drag end (avoids store updates during drag)
    const finalDragPositionRef = useRef<{ x: number; y: number } | null>(null);
    // Track which text ID should be excluded from canvas rendering (shown via HTML overlay instead)
    const excludedTextIdRef = useRef<string | null>(null);

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

    // Check if mobile for performance optimizations
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    // Cache text hitboxes to avoid expensive recalculations on every mouse move
    // Only recalculates when textOverlays or canvas dimensions change
    const textHitboxes = useMemo(() => {
        if (!canvasRef.current || textOverlays.length === 0) return [];

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return [];

        return textOverlays.map(overlay => {
            ctx.font = `${overlay.fontWeight} ${overlay.fontSize}px ${overlay.fontFamily}`;
            const metrics = ctx.measureText(overlay.text);
            const textWidthPx = metrics.width;
            const textHeightPx = overlay.fontSize * 1.2;
            const textWidthPercent = canvas.width > 0 ? (textWidthPx / canvas.width) * 100 : 0;
            const textHeightPercent = canvas.height > 0 ? (textHeightPx / canvas.height) * 100 : 0;

            return {
                id: overlay.id,
                x: overlay.x,
                y: overlay.y,
                hitboxWidth: textWidthPercent + 5,
                hitboxHeight: textHeightPercent + 5,
            };
        });
    }, [textOverlays, canvasWidth, canvasHeight]);

    // Store render parameters in a ref to avoid recreating performRender on every state change
    // This prevents throttle tracking from resetting
    const renderParamsRef = useRef({
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
    });

    // Update ref whenever params change (doesn't trigger re-render)
    useEffect(() => {
        renderParamsRef.current = {
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
        };
    });

    // Create a stable render function that reads from ref
    // This prevents throttle from resetting on every state change
    const performRender = useCallback(async () => {
        const params = renderParamsRef.current;
        if (!canvasRef.current || !params.originalImage) return;

        // On mobile during drag, skip expensive renders for better performance
        if (isMobile && isDragging) {
            return;
        }

        // Filter out the dragged text from canvas rendering (it's shown via HTML overlay instead)
        const excludeId = excludedTextIdRef.current;
        const textOverlaysToRender = excludeId
            ? params.textOverlays.filter(t => t.id !== excludeId)
            : params.textOverlays;

        await measureRender(
            'canvas:render',
            async () => {
                await renderCanvas({
                    canvas: canvasRef.current!,
                    image: params.originalImage!,
                    backgroundType: params.backgroundType,
                    backgroundColor: params.backgroundColor,
                    gradientColors: params.gradientColors,
                    gradientAngle: params.gradientAngle,
                    meshGradientCSS: params.meshGradientCSS,
                    textPatternText: params.textPatternText,
                    textPatternColor: params.textPatternColor,
                    textPatternOpacity: params.textPatternOpacity,
                    textPatternPositions: params.textPatternPositions,
                    textPatternFontFamily: params.textPatternFontFamily,
                    textPatternFontSize: params.textPatternFontSize,
                    textPatternFontWeight: params.textPatternFontWeight,
                    textPatternRows: params.textPatternRows,
                    waveSplitFlipped: params.waveSplitFlipped,
                    logoPatternImage: params.logoPatternImage,
                    logoPatternOpacity: params.logoPatternOpacity,
                    logoPatternSize: params.logoPatternSize,
                    logoPatternSpacing: params.logoPatternSpacing,
                    padding: params.padding,
                    shadowBlur: params.shadowBlur,
                    shadowOpacity: params.shadowOpacity,
                    shadowColor: params.shadowColor,
                    borderRadius: params.borderRadius,
                    frameType: params.frameType,
                    imageScale: params.imageScale,
                    rotation: params.rotation,
                    targetWidth: params.canvasWidth,
                    targetHeight: params.canvasHeight,
                    textOverlays: textOverlaysToRender,
                });
            },
            {
                canvasWidth: params.canvasWidth,
                canvasHeight: params.canvasHeight,
                frameType: params.frameType,
            }
        );
    }, [isMobile, isDragging]); // Minimal dependencies - reads from ref for everything else

    // Throttle the render function - 33ms on mobile (30fps), 16ms on desktop (60fps)
    // Mobile devices struggle with 60fps canvas rendering, 30fps is much smoother
    const throttledRender = useThrottle(performRender, isMobile ? 33 : 16);

    // Re-render canvas when any setting changes (throttled)
    // Skip rendering when in crop mode or when actively dragging (for better drag performance)
    // Note: throttledRender is now stable, so adding dependencies here won't reset throttle
    useEffect(() => {
        if (!isCropping && !isDragging) {
            throttledRender();
        }
    }, [
        throttledRender,
        isCropping,
        isDragging,
        // Trigger render on state changes (values read from ref inside performRender)
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

    // Immediate visual update for smooth text dragging - uses HTML overlay instead of store updates
    const batchedUpdateTextPosition = useCallback((x: number, y: number, textId: string) => {
        // Store the pending update
        pendingUpdateRef.current = { x, y };

        // Cancel any existing RAF
        if (rafIdRef.current !== null) {
            return; // Already scheduled, will use latest position
        }

        // Schedule update for next frame - update HTML overlay directly (no store update = no re-renders)
        rafIdRef.current = requestAnimationFrame(() => {
            const pending = pendingUpdateRef.current;
            if (pending && textId && dragPreviewRef.current) {
                const snapped = snapToCenter(pending.x, pending.y);
                // Store final position for commit on drag end
                finalDragPositionRef.current = { x: snapped.x, y: snapped.y };

                // Update HTML overlay position immediately (transform is GPU-accelerated)
                // Use canvasWidth/Height * displayScale for correct pixel positioning
                const previewX = (snapped.x / 100) * canvasWidth * displayScale;
                const previewY = (snapped.y / 100) * canvasHeight * displayScale;
                dragPreviewRef.current.style.transform = `translate(${previewX}px, ${previewY}px) translate(-50%, -50%)`;
            }
            rafIdRef.current = null;
            pendingUpdateRef.current = null;
        });
    }, [snapToCenter, canvasWidth, canvasHeight, displayScale]);

    // Cleanup RAF on unmount
    useEffect(() => {
        return () => {
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, []);

    // Handle text overlay dragging - uses cached hitboxes for performance
    const handleCanvasMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current || textHitboxes.length === 0) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Check if click is on any text overlay using cached hitboxes (reverse order, top to bottom)
        for (let i = textHitboxes.length - 1; i >= 0; i--) {
            const hitbox = textHitboxes[i];

            if (
                x >= hitbox.x - hitbox.hitboxWidth / 2 &&
                x <= hitbox.x + hitbox.hitboxWidth / 2 &&
                y >= hitbox.y - hitbox.hitboxHeight / 2 &&
                y <= hitbox.y + hitbox.hitboxHeight / 2
            ) {
                setIsDragging(true);
                setDraggedTextId(hitbox.id);
                selectTextOverlay(hitbox.id);
                canvas.style.cursor = 'grabbing';
                // Exclude this text from canvas rendering (will show via HTML overlay instead)
                excludedTextIdRef.current = hitbox.id;
                // Re-render canvas without the dragged text
                throttledRender();
                break;
            }
        }
    }, [textHitboxes, selectTextOverlay, throttledRender]);

    const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

        // If dragging, update position with RAF batching (same as touch events)
        if (isDragging && draggedTextId) {
            batchedUpdateTextPosition(x, y, draggedTextId);
            return;
        }

        // If not dragging, check if hovering over any text to show grab cursor (using cached hitboxes)
        if (textHitboxes.length > 0) {
            let isOverText = false;
            for (let i = textHitboxes.length - 1; i >= 0; i--) {
                const hitbox = textHitboxes[i];

                if (
                    x >= hitbox.x - hitbox.hitboxWidth / 2 &&
                    x <= hitbox.x + hitbox.hitboxWidth / 2 &&
                    y >= hitbox.y - hitbox.hitboxHeight / 2 &&
                    y <= hitbox.y + hitbox.hitboxHeight / 2
                ) {
                    isOverText = true;
                    break;
                }
            }

            canvas.style.cursor = isOverText ? 'grab' : 'default';
        }
    }, [isDragging, draggedTextId, batchedUpdateTextPosition, textHitboxes]);

    const handleCanvasMouseUp = useCallback(() => {
        // Commit final position to store on drag end (only update that triggers re-render)
        if (draggedTextId && finalDragPositionRef.current) {
            updateTextOverlay(draggedTextId, {
                x: finalDragPositionRef.current.x,
                y: finalDragPositionRef.current.y
            });
            finalDragPositionRef.current = null;
        }
        // Clear excluded text so canvas renders it again
        excludedTextIdRef.current = null;
        setIsDragging(false);
        setDraggedTextId(null);
        setAlignmentGuides({ showCenterX: false, showCenterY: false });
        // Trigger a final render after drag ends
        requestAnimationFrame(() => {
            throttledRender();
        });
    }, [throttledRender, draggedTextId, updateTextOverlay]);

    const handleCanvasMouseLeave = useCallback(() => {
        if (canvasRef.current) {
            canvasRef.current.style.cursor = 'default';
        }
        // Commit final position if dragging was in progress
        if (draggedTextId && finalDragPositionRef.current) {
            updateTextOverlay(draggedTextId, {
                x: finalDragPositionRef.current.x,
                y: finalDragPositionRef.current.y
            });
            finalDragPositionRef.current = null;
        }
        // Clear excluded text so canvas renders it again
        excludedTextIdRef.current = null;
        setIsDragging(false);
        setDraggedTextId(null);
        setAlignmentGuides({ showCenterX: false, showCenterY: false });
    }, [draggedTextId, updateTextOverlay]);

    // Touch event handlers for mobile - uses cached hitboxes for performance
    const handleCanvasTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current || textHitboxes.length === 0) return;

        // Prevent default touch behavior and scrolling
        e.preventDefault();
        e.stopPropagation();

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;

        // Check if touch is on any text overlay using cached hitboxes
        for (let i = textHitboxes.length - 1; i >= 0; i--) {
            const hitbox = textHitboxes[i];

            if (
                x >= hitbox.x - hitbox.hitboxWidth / 2 &&
                x <= hitbox.x + hitbox.hitboxWidth / 2 &&
                y >= hitbox.y - hitbox.hitboxHeight / 2 &&
                y <= hitbox.y + hitbox.hitboxHeight / 2
            ) {
                setIsDragging(true);
                setDraggedTextId(hitbox.id);
                selectTextOverlay(hitbox.id);
                // Exclude this text from canvas rendering (will show via HTML overlay instead)
                excludedTextIdRef.current = hitbox.id;
                // Re-render canvas without the dragged text
                throttledRender();
                break;
            }
        }
    }, [textHitboxes, selectTextOverlay, throttledRender]);

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
        // Commit final position to store on drag end (only update that triggers re-render)
        if (draggedTextId && finalDragPositionRef.current) {
            updateTextOverlay(draggedTextId, {
                x: finalDragPositionRef.current.x,
                y: finalDragPositionRef.current.y
            });
            finalDragPositionRef.current = null;
        }
        // Clear excluded text so canvas renders it again
        excludedTextIdRef.current = null;
        setIsDragging(false);
        setDraggedTextId(null);
        setAlignmentGuides({ showCenterX: false, showCenterY: false });
        // Trigger a final render after drag ends
        requestAnimationFrame(() => {
            throttledRender();
        });
    }, [throttledRender, draggedTextId, updateTextOverlay]);

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

                    {/* Premium Watermark Overlay - CSS-based pattern (no DOM elements) */}
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
                            {/* CSS-based repeating watermark pattern using SVG data URI */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='100'%3E%3Ctext x='50%25' y='50%25' font-family='system-ui, sans-serif' font-size='14' font-weight='bold' fill='%23000' fill-opacity='0.15' text-anchor='middle' dominant-baseline='middle' transform='rotate(-30, 100, 50)'%3ESNAPBEAUTIFY PRO%3C/text%3E%3C/svg%3E")`,
                                    backgroundRepeat: 'repeat',
                                }}
                            />

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
                    {/* Drag Preview Overlay - immediate visual feedback during text dragging */}
                    {isDragging && draggedTextId && (() => {
                        const draggedText = textOverlays.find(t => t.id === draggedTextId);
                        if (!draggedText) return null;

                        // Build style object with gradient support
                        const textStyle: React.CSSProperties = {
                            top: 0,
                            left: 0,
                            // Initial position from store, will be updated via ref during drag
                            transform: `translate(${(draggedText.x / 100) * canvasWidth * displayScale}px, ${(draggedText.y / 100) * canvasHeight * displayScale}px) translate(-50%, -50%)`,
                            fontFamily: draggedText.fontFamily || 'Inter, sans-serif',
                            fontSize: `${(draggedText.fontSize || 24) * displayScale}px`,
                            fontWeight: draggedText.fontWeight || 400,
                            opacity: 0.9,
                            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            whiteSpace: 'nowrap',
                        };

                        // Apply gradient or solid color
                        if (draggedText.useGradient && draggedText.gradientColors) {
                            const angle = draggedText.gradientAngle ?? 90;
                            textStyle.background = `linear-gradient(${angle}deg, ${draggedText.gradientColors[0]}, ${draggedText.gradientColors[1]})`;
                            textStyle.WebkitBackgroundClip = 'text';
                            textStyle.backgroundClip = 'text';
                            textStyle.WebkitTextFillColor = 'transparent';
                            textStyle.color = 'transparent';
                        } else {
                            textStyle.color = draggedText.color || '#000000';
                        }

                        return (
                            <div
                                ref={dragPreviewRef}
                                className="absolute pointer-events-none z-20 will-change-transform"
                                style={textStyle}
                            >
                                {draggedText.text}
                            </div>
                        );
                    })()}
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
