'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, Download, ChevronDown, Check, Share2 } from 'lucide-react';
import { useEditorStore } from '@/lib/store/editor-store';
import {
    copyCanvasToClipboard,
    downloadCanvas,
    shareCanvas,
    isClipboardSupported,
    isShareSupported,
    isMobileDevice
} from '@/lib/canvas/export';
import { renderCanvas } from '@/lib/canvas/renderer';
import { toast } from 'sonner';
import { ExportFormat, ExportScale } from '@/types/editor';

export function ExportBar() {
    const [canCopy, setCanCopy] = useState(true);
    const [canShare, setCanShare] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const {
        exportFormat,
        exportScale,
        setExportFormat,
        setExportScale,
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

    // Check capabilities on mount
    useEffect(() => {
        setCanCopy(isClipboardSupported());
        setCanShare(isShareSupported());
        setIsMobile(isMobileDevice());
    }, []);

    const createExportCanvas = () => {
        if (!originalImage) return null;

        const exportCanvas = document.createElement('canvas');
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
    };

    const handleCopy = async () => {
        if (!originalImage) {
            toast.error('No image to copy');
            return;
        }

        try {
            const exportCanvas = createExportCanvas();
            if (!exportCanvas) return;

            await copyCanvasToClipboard(exportCanvas);
            toast.success('Copied to clipboard!');
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Failed to copy. Try Download instead.');
            }
        }
    };

    const handleShare = async () => {
        if (!originalImage) {
            toast.error('No image to share');
            return;
        }

        try {
            const exportCanvas = createExportCanvas();
            if (!exportCanvas) return;

            const timestamp = new Date().toISOString().slice(0, 10);
            await shareCanvas(exportCanvas, `snapbeautify-${timestamp}`);
            // Don't show success toast - share dialog handles feedback
        } catch (error) {
            // User cancelled share or sharing not supported - don't show error for cancel
            if (error instanceof Error && !error.message.includes('abort') && !error.message.includes('cancel')) {
                toast.error('Sharing failed. Try Download instead.');
            }
        }
    };

    const handleDownload = async () => {
        if (!originalImage) {
            toast.error('No image to download');
            return;
        }

        try {
            const exportCanvas = createExportCanvas();
            if (!exportCanvas) return;

            const timestamp = new Date().toISOString().slice(0, 10);

            // On mobile, try Share API first (most reliable for "saving")
            if (isMobile && canShare) {
                try {
                    await shareCanvas(exportCanvas, `snapbeautify-${timestamp}`);
                    return;
                } catch {
                    // Fall through to download
                }
            }

            await downloadCanvas(exportCanvas, `snapbeautify-${timestamp}`, exportFormat);

            if (isMobile) {
                toast.success('Image ready! Check your downloads folder.', {
                    duration: 5000,
                });
            } else {
                toast.success('Downloaded!');
            }
        } catch (error) {
            toast.error('Failed to download');
        }
    };

    return (
        <div className="h-16 bg-zinc-900 border-t border-zinc-800 px-2 sm:px-4 flex items-center justify-between z-50">
            <div className="flex items-center gap-1 sm:gap-3">
                {/* Format Selector */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-16 sm:w-24 justify-between text-xs sm:text-sm">
                            {exportFormat.toUpperCase()}
                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        {(['png', 'jpeg', 'webp'] as ExportFormat[]).map((format) => (
                            <DropdownMenuItem
                                key={format}
                                onClick={() => setExportFormat(format)}
                                className="flex items-center justify-between"
                            >
                                {format.toUpperCase()}
                                {exportFormat === format && <Check className="w-4 h-4" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Scale Selector */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-12 sm:w-24 justify-between text-xs sm:text-sm">
                            {exportScale}x
                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 opacity-50 hidden sm:block" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        {([1, 2, 3, 4] as ExportScale[]).map((scale) => (
                            <DropdownMenuItem
                                key={scale}
                                onClick={() => setExportScale(scale)}
                                className="flex items-center justify-between"
                            >
                                {scale}x {scale === 2 && '(Retina)'}
                                {exportScale === scale && <Check className="w-4 h-4" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Current dimensions display - hide on small screens */}
                <span className="text-[10px] sm:text-xs text-zinc-500 hidden sm:inline">
                    {canvasWidth * exportScale}×{canvasHeight * exportScale}px
                    {exportScale > 1 && (
                        <span className="text-zinc-600 ml-1 hidden md:inline">
                            ({canvasWidth}×{canvasHeight} @{exportScale}x)
                        </span>
                    )}
                </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
                {/* On mobile: show Share button, on desktop: show Copy button */}
                {isMobile ? (
                    canShare && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleShare}
                            disabled={!originalImage}
                            className="gap-1 sm:gap-2 px-2 sm:px-4"
                        >
                            <Share2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Share</span>
                        </Button>
                    )
                ) : (
                    canCopy && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopy}
                            disabled={!originalImage}
                            className="gap-1 sm:gap-2 px-2 sm:px-4"
                        >
                            <Copy className="w-4 h-4" />
                            <span className="hidden sm:inline">Copy</span>
                        </Button>
                    )
                )}

                <Button
                    size="sm"
                    onClick={handleDownload}
                    disabled={!originalImage}
                    className="gap-1 sm:gap-2 px-2 sm:px-4 bg-indigo-600 hover:bg-indigo-700"
                >
                    <Download className="w-4 h-4" />
                    <span className="sm:inline">Save</span>
                </Button>
            </div>
        </div>
    );
}
