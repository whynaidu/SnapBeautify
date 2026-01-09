'use client';

import { useEffect, useCallback } from 'react';
import { useEditorStore } from '@/lib/store/editor-store';
import { copyCanvasToClipboard, downloadCanvas } from '@/lib/canvas/export';
import { renderCanvas } from '@/lib/canvas/renderer';
import { toast } from 'sonner';
// import { ShadowSize } from '@/types/editor';

interface KeyboardShortcutsOptions {
    onCopy?: () => void;
    onDownload?: () => void;
    onClear?: () => void;
}

export function useKeyboardShortcuts(options: KeyboardShortcutsOptions = {}) {
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
        exportFormat,
        exportScale,
        rotation,
        imageScale,
        canvasWidth,
        canvasHeight,
        textOverlays,
        setPadding,
        // setShadowSize, // Deprecated
        clearImage,
        resetToDefaults,
    } = useEditorStore();

    const handleCopy = useCallback(async () => {
        if (!originalImage) {
            toast.error('No image to copy');
            return;
        }

        try {
            const exportCanvas = document.createElement('canvas');
            renderCanvas({
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

            await copyCanvasToClipboard(exportCanvas);
            toast.success('Copied to clipboard!');
        } catch {
            toast.error('Failed to copy to clipboard');
        }
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
        exportScale,
        imageScale,
        rotation,
        canvasWidth,
        canvasHeight,
        textOverlays,
    ]);

    const handleDownload = useCallback(() => {
        if (!originalImage) {
            toast.error('No image to download');
            return;
        }

        try {
            const exportCanvas = document.createElement('canvas');
            renderCanvas({
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

            const timestamp = new Date().toISOString().slice(0, 10);
            downloadCanvas(exportCanvas, `snapbeautify-${timestamp}`, exportFormat);
            toast.success('Downloaded!');
        } catch {
            toast.error('Failed to download');
        }
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
        exportFormat,
        exportScale,
        imageScale,
        rotation,
        canvasWidth,
        canvasHeight,
        textOverlays,
    ]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isMac = navigator.userAgent.includes('Mac');
            const modifier = isMac ? e.metaKey : e.ctrlKey;

            // Copy - Cmd/Ctrl + C
            if (modifier && e.key === 'c' && originalImage) {
                e.preventDefault();
                if (options.onCopy) options.onCopy();
                else handleCopy();
            }

            // Download - Cmd/Ctrl + S
            if (modifier && e.key === 's') {
                e.preventDefault();
                if (options.onDownload) options.onDownload();
                else handleDownload();
            }

            // Reset - Cmd/Ctrl + Z
            if (modifier && e.key === 'z') {
                e.preventDefault();
                resetToDefaults();
                toast.info('Reset to defaults');
            }

            // Escape - Clear image (with confirmation)
            if (e.key === 'Escape' && originalImage) {
                e.preventDefault();
                if (options.onClear) {
                    options.onClear();
                } else {
                    // Fallback to direct clear if no callback provided
                    clearImage();
                    toast.info('Image cleared');
                }
            }

            // Shadow presets shortcut removed in favor of granular controls
            if (!modifier && !e.shiftKey && !e.altKey) {
                // Padding - [ and ]
                if (e.key === '[' && originalImage) {
                    setPadding(Math.max(0, padding - 8));
                }
                if (e.key === ']' && originalImage) {
                    setPadding(Math.min(200, padding + 8));
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [
        originalImage,
        handleCopy,
        handleDownload,
        options,
        padding,
        setPadding,
        // setShadowSize,
        clearImage,
        resetToDefaults,
    ]);

    return {
        handleCopy,
        handleDownload,
    };
}
