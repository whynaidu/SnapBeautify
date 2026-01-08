'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useEditorStore } from '@/lib/store/editor-store';
import { renderCanvas } from '@/lib/canvas/renderer';
import { DropZone } from './DropZone';
import { cn } from '@/lib/utils';
import { measureRender } from '@/lib/utils/performance';
import { useThrottle } from '@/lib/hooks/useThrottle';

export function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [displayScale, setDisplayScale] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [draggedTextId, setDraggedTextId] = useState<string | null>(null);

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
    } = useEditorStore();

    // Create a memoized render function
    const performRender = useCallback(() => {
        if (!canvasRef.current || !originalImage) return;

        measureRender(
            'canvas:render',
            () => {
                renderCanvas({
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

    // Throttle the render function to 60fps (16ms)
    const throttledRender = useThrottle(performRender, 16);

    // Re-render canvas when any setting changes (throttled)
    useEffect(() => {
        throttledRender();
    }, [throttledRender]);

    // Calculate display scale to fit container
    useEffect(() => {
        if (!containerRef.current || !originalImage) return;

        const updateScale = () => {
            const container = containerRef.current!;
            const containerWidth = container.clientWidth - 48;
            const containerHeight = container.clientHeight - 48;

            const scaleX = containerWidth / canvasWidth;
            const scaleY = containerHeight / canvasHeight;
            const scale = Math.min(scaleX, scaleY, 1);

            setDisplayScale(scale);
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [canvasWidth, canvasHeight, originalImage]);

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

        // If dragging, update position
        if (isDragging && draggedTextId) {
            updateTextOverlay(draggedTextId, { x, y });
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
    }, [isDragging, draggedTextId, updateTextOverlay, textOverlays]);

    const handleCanvasMouseUp = useCallback(() => {
        setIsDragging(false);
        setDraggedTextId(null);
    }, []);

    const handleCanvasMouseLeave = useCallback(() => {
        if (canvasRef.current) {
            canvasRef.current.style.cursor = 'default';
        }
        setIsDragging(false);
        setDraggedTextId(null);
    }, []);

    // Touch event handlers for mobile
    const handleCanvasTouchStart = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current || textOverlays.length === 0) return;

        e.preventDefault(); // Prevent scrolling while dragging
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

        e.preventDefault(); // Prevent scrolling while dragging
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));

        updateTextOverlay(draggedTextId, { x, y });
    }, [isDragging, draggedTextId, updateTextOverlay]);

    const handleCanvasTouchEnd = useCallback(() => {
        setIsDragging(false);
        setDraggedTextId(null);
    }, []);

    return (
        <div
            ref={containerRef}
            className={cn(
                'flex-1 flex items-center justify-center',
                'bg-muted/30 overflow-hidden p-6',
                'relative'
            )}
            style={{
                backgroundImage: `radial-gradient(var(--border) 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
            }}
        >
            {originalImage ? (
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
                        transformOrigin: 'center center',
                        touchAction: 'none', // Prevent default touch behaviors
                    }}
                    className="rounded-lg shadow-2xl"
                />
            ) : (
                <DropZone />
            )}
        </div>
    );
}
