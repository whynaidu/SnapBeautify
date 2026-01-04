'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, Download, ChevronDown, Check } from 'lucide-react';
import { useEditorStore } from '@/lib/store/editor-store';
import { copyCanvasToClipboard, downloadCanvas } from '@/lib/canvas/export';
import { renderCanvas } from '@/lib/canvas/renderer';
import { toast } from 'sonner';
import { ExportFormat, ExportScale } from '@/types/editor';

export function ExportBar() {
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

    const handleCopy = async () => {
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

            await copyCanvasToClipboard(exportCanvas);
            toast.success('Copied to clipboard!');
        } catch (error) {
            toast.error('Failed to copy');
        }
    };

    const handleDownload = () => {
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

            const timestamp = new Date().toISOString().slice(0, 10);
            downloadCanvas(exportCanvas, `snapbeautify-${timestamp}`, exportFormat);
            toast.success('Downloaded!');
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

                <Button
                    size="sm"
                    onClick={handleDownload}
                    disabled={!originalImage}
                    className="gap-1 sm:gap-2 px-2 sm:px-4 bg-indigo-600 hover:bg-indigo-700"
                >
                    <Download className="w-4 h-4" />
                    <span className="hidden xs:inline sm:inline">Save</span>
                </Button>
            </div>
        </div>
    );
}
