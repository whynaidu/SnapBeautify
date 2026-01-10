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
        textPatternText,
        textPatternColor,
        textPatternOpacity,
        textPatternPositions,
        textPatternFontFamily,
        textPatternFontSize,
        textPatternFontWeight,
        textPatternRows,
        waveSplitFlipped,
        padding,
        shadowBlur,
        shadowOpacity,
        shadowColor,
        borderRadius,
        frameType,
        imageScale,
        rotation,
        exportScale,
        canvasWidth,
        canvasHeight,
        textOverlays,
    } = useEditorStore();

    const render = useCallback(async () => {
        if (!canvasRef.current || !originalImage) return;

        await renderCanvas({
            canvas: canvasRef.current,
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
            padding,
            shadowBlur,
            shadowOpacity,
            shadowColor,
            borderRadius,
            frameType,
            scale: 1,
            imageScale,
            rotation,
            targetWidth: canvasWidth,
            targetHeight: canvasHeight,
            textOverlays,
        });
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
        textPatternRows,
        waveSplitFlipped,
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

    const renderExport = useCallback(async (): Promise<HTMLCanvasElement> => {
        const exportCanvas = document.createElement('canvas');

        if (!originalImage) {
            throw new Error('No image to export');
        }

        await renderCanvas({
            canvas: exportCanvas,
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
            padding,
            shadowBlur,
            shadowOpacity,
            shadowColor,
            borderRadius,
            frameType,
            scale: exportScale,
            imageScale,
            rotation,
            targetWidth: canvasWidth,
            targetHeight: canvasHeight,
            textOverlays,
        });

        return exportCanvas;
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
        textPatternRows,
        waveSplitFlipped,
        padding,
        shadowBlur,
        shadowOpacity,
        shadowColor,
        borderRadius,
        frameType,
        exportScale,
        imageScale,
        rotation,
        canvasWidth,
        canvasHeight,
        textOverlays,
    ]);

    return {
        canvasRef,
        render,
        renderExport,
    };
}
