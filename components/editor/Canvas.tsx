'use client';

import { useRef, useEffect, useState } from 'react';
import { useEditorStore } from '@/lib/store/editor-store';
import { renderCanvas } from '@/lib/canvas/renderer';
import { DropZone } from './DropZone';
import { cn } from '@/lib/utils';

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
        padding,
        shadowSize,
        shadowIntensity,
        borderRadius,
        frameType,
        imageScale,
        rotation,
        canvasWidth,
        canvasHeight,
    } = useEditorStore();

    // Re-render canvas when any setting changes
    useEffect(() => {
        if (!canvasRef.current || !originalImage) return;

        renderCanvas({
            canvas: canvasRef.current,
            image: originalImage,
            backgroundType,
            backgroundColor,
            gradientColors,
            gradientAngle,
            meshGradientCSS,
            padding,
            shadowSize,
            shadowIntensity,
            borderRadius,
            frameType,
            imageScale,
            rotation,
            targetWidth: canvasWidth,
            targetHeight: canvasHeight,
        });
    }, [
        originalImage,
        backgroundType,
        backgroundColor,
        gradientColors,
        gradientAngle,
        meshGradientCSS,
        padding,
        shadowSize,
        shadowIntensity,
        borderRadius,
        frameType,
        imageScale,
        rotation,
        canvasWidth,
        canvasHeight,
    ]);

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
                'bg-zinc-950 overflow-hidden p-6',
                'relative'
            )}
            style={{
                backgroundImage: `
          linear-gradient(45deg, #1a1a1a 25%, transparent 25%),
          linear-gradient(-45deg, #1a1a1a 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, #1a1a1a 75%),
          linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)
        `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
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
