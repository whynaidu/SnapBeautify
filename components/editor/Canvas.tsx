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
                    style={{
                        transform: `scale(${displayScale})`,
                        transformOrigin: 'center center',
                    }}
                    className="rounded-lg shadow-2xl"
                />
            ) : (
                <DropZone />
            )}
        </div>
    );
}
