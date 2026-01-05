'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, Download, ChevronDown, Check, Share2, Loader2, Moon, Sun } from 'lucide-react';
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
    const [isExporting, setIsExporting] = useState(false);

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

    // Check capabilities on mount
    useEffect(() => {
        setCanCopy(isClipboardSupported());
        setCanShare(isShareSupported());
        setIsMobile(isMobileDevice());
    }, []);

    const createExportCanvas = (scaleOverride?: number) => {
        if (!originalImage) return null;

        // Explicitly clean up old canvases if possible by letting GC run,
        // but we can't force GC. Creating a new element is standard.
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
            shadowBlur,
            shadowOpacity,
            shadowColor,
            borderRadius,
            frameType,
            scale: scaleOverride || exportScale,
            imageScale,
            rotation,
            targetWidth: canvasWidth,
            targetHeight: canvasHeight,
        });
        return exportCanvas;
    };

    const attemptExport = async (
        action: 'download' | 'share' | 'copy',
        currentScale: number
    ): Promise<boolean> => {
        try {
            const exportCanvas = createExportCanvas(currentScale);
            if (!exportCanvas) return false;

            // Small delay to ensure UI updates before heavy canvas operation
            await new Promise(resolve => setTimeout(resolve, 0));

            const timestamp = new Date().toISOString().slice(0, 10);
            const filename = `snapbeautify-${timestamp}`;

            if (action === 'download') {
                await downloadCanvas(exportCanvas, filename, exportFormat);
            } else if (action === 'share') {
                await shareCanvas(exportCanvas, filename);
            } else if (action === 'copy') {
                await copyCanvasToClipboard(exportCanvas);
            }

            // Explicitly clear canvas width to free memory immediately
            exportCanvas.width = 0;
            exportCanvas.height = 0;

            return true;
        } catch (error) {
            if (error instanceof Error && (error.message.includes('abort') || error.message.includes('cancel'))) {
                throw error; // Don't retry for user cancellations
            }
            return false; // Failed, try next scale
        }
    };

    const wrapExport = async (action: () => Promise<void>) => {
        if (isExporting) return;
        setIsExporting(true);
        try {
            await action();
        } finally {
            setIsExporting(false);
        }
    };

    const handleCopy = () => wrapExport(async () => {
        if (!originalImage) {
            toast.error('No image to copy');
            return;
        }

        try {
            const success = await attemptExport('copy', exportScale);
            if (success) {
                toast.success('Copied to clipboard!');
            } else {
                throw new Error('Failed to copy');
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Failed to copy. Try Download instead.');
            }
        }
    });

    const handleShare = () => wrapExport(async () => {
        if (!originalImage) {
            toast.error('No image to share');
            return;
        }

        // Try current scale first, then fallback
        const scalesToTry = [exportScale];
        if (exportScale > 2) scalesToTry.push(2);
        if (exportScale > 1) scalesToTry.push(1);

        // Remove duplicates
        const uniqueScales = [...new Set(scalesToTry)];

        for (const scale of uniqueScales) {
            try {
                const success = await attemptExport('share', scale);
                if (success) return; // Success!
            } catch (error) {
                // User cancelled, stop trying
                return;
            }
        }

        // If we get here, all sharing failed
        toast.error('Sharing failed. Try Download instead.');
    });

    const handleDownload = () => wrapExport(async () => {
        if (!originalImage) {
            toast.error('No image to download');
            return;
        }

        // On mobile share, we already fallback inside handleShare if called directly.
        // However, if we're here, we specifically want to download or try share first if appropriate.

        // On mobile, try Share API first if available
        if (isMobile && canShare) {
            // We call handleShare's logic but manually to avoid double wrapExport
            const scalesToTry = [exportScale];
            if (exportScale > 2) scalesToTry.push(2);
            if (exportScale > 1) scalesToTry.push(1);
            const uniqueScales = [...new Set(scalesToTry)];

            for (const scale of uniqueScales) {
                try {
                    const success = await attemptExport('share', scale);
                    if (success) return;
                } catch (error) {
                    // User cancelled or share failed, continue to download fallback
                }
            }
        }

        // Download fallback logic
        const scalesToTry = [exportScale];
        if (exportScale > 2) scalesToTry.push(2);
        if (exportScale > 1) scalesToTry.push(1);
        const uniqueScales = [...new Set(scalesToTry)];

        for (const scale of uniqueScales) {
            const success = await attemptExport('download', scale);
            if (success) {
                if (scale !== exportScale) {
                    toast.success(`Saved at ${scale}x (lower resolution) due to memory limits`, { duration: 5000 });
                } else if (isMobile) {
                    toast.success('Image ready! Check downloads.', { duration: 5000 });
                } else {
                    toast.success('Downloaded!');
                }
                return;
            }
        }

        toast.error('Failed to download. Try a lower resolution.');
    });

    return (
        <div className="h-16 bg-background border-t border-border px-2 sm:px-4 flex items-center justify-between z-50">
            <div className="flex items-center gap-1 sm:gap-3">
                {/* Format Selector */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-16 sm:w-24 justify-between text-xs sm:text-sm" disabled={isExporting}>
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
                        <Button variant="outline" size="sm" className="w-12 sm:w-24 justify-between text-xs sm:text-sm border-border hover:bg-accent hover:text-accent-foreground" disabled={isExporting}>
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
                <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:inline">
                    {canvasWidth * exportScale}×{canvasHeight * exportScale}px
                    {exportScale > 1 && (
                        <span className="text-zinc-500 ml-1 hidden md:inline">
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
                            disabled={!originalImage || isExporting}
                            className="gap-1 sm:gap-2 px-2 sm:px-4 border-border hover:bg-accent hover:text-accent-foreground"
                        >
                            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                            <span className="hidden sm:inline">Share</span>
                        </Button>
                    )
                ) : (
                    canCopy && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopy}
                            disabled={!originalImage || isExporting}
                            className="gap-1 sm:gap-2 px-2 sm:px-4 border-border hover:bg-accent hover:text-accent-foreground"
                        >
                            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
                            <span className="hidden sm:inline">Copy</span>
                        </Button>
                    )
                )}

                <Button
                    size="sm"
                    onClick={handleDownload}
                    disabled={!originalImage || isExporting}
                    className="gap-1 sm:gap-2 px-2 sm:px-4 shadow-sm"
                >
                    {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span className="sm:inline">Save</span>
                </Button>

                <div className="h-6 w-px bg-border mx-1" />
            </div>
        </div>
    );
}
