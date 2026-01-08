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

        // Check if click is on any text overlay (in reverse order, top to bottom)
        for (let i = textOverlays.length - 1; i >= 0; i--) {
            const overlay = textOverlays[i];
            const textWidth = 20; // Approximate hitbox width in %
            const textHeight = 10; // Approximate hitbox height in %

            if (
                x >= overlay.x - textWidth / 2 &&
                x <= overlay.x + textWidth / 2 &&
                y >= overlay.y - textHeight / 2 &&
                y <= overlay.y + textHeight / 2
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
        if (!isDragging || !draggedTextId || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

        updateTextOverlay(draggedTextId, { x, y });
    }, [isDragging, draggedTextId, updateTextOverlay]);

    const handleCanvasMouseUp = useCallback(() => {
        if (canvasRef.current) {
            canvasRef.current.style.cursor = textOverlays.length > 0 ? 'grab' : 'default';
        }
        setIsDragging(false);
        setDraggedTextId(null);
    }, [textOverlays.length]);

    const handleCanvasMouseEnter = useCallback(() => {
        if (canvasRef.current && textOverlays.length > 0 && !isDragging) {
            canvasRef.current.style.cursor = 'grab';
        }
    }, [textOverlays.length, isDragging]);

    const handleCanvasMouseLeave = useCallback(() => {
        if (canvasRef.current) {
            canvasRef.current.style.cursor = 'default';
        }
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
                    onMouseEnter={handleCanvasMouseEnter}
                    onMouseLeave={handleCanvasMouseLeave}
                    style={{
                        transform: `scale(${displayScale})`,
                        transformOrigin: 'center center',
                        cursor: textOverlays.length > 0 ? 'grab' : 'default',
                    }}
                    className="rounded-lg shadow-2xl"
                />
            ) : (
                <DropZone />
            )}
        </div>
    );
}
