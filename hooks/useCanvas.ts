'use client';

import { useRef, useCallback } from 'react';
import { useEditorStore } from '@/lib/store/editor-store';
import { renderCanvas } from '@/lib/canvas/renderer';

export function useCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
        exportScale,
        canvasWidth,
        canvasHeight,
    } = useEditorStore();

    const render = useCallback(() => {
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
            scale: 1,
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

    const renderExport = useCallback((): HTMLCanvasElement => {
        const exportCanvas = document.createElement('canvas');

        if (!originalImage) {
            throw new Error('No image to export');
        }

        renderCanvas({
            canvas: exportCanvas,
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
            scale: exportScale,
            imageScale,
            rotation,
            targetWidth: canvasWidth,
            targetHeight: canvasHeight,
        });

        return exportCanvas;
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
        exportScale,
        imageScale,
        rotation,
        canvasWidth,
        canvasHeight,
    ]);

    return {
        canvasRef,
        render,
        renderExport,
    };
}
