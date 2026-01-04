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
        <div className="h-16 bg-zinc-900 border-t border-zinc-800 px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* Format Selector */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="w-24 justify-between">
                            {exportFormat.toUpperCase()}
                            <ChevronDown className="w-4 h-4 opacity-50" />
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
                        <Button variant="outline" size="sm" className="w-24 justify-between">
                            {exportScale}x{exportScale === 2 ? ' Retina' : ''}
                            <ChevronDown className="w-4 h-4 opacity-50" />
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

                {/* Current dimensions display - shows actual export size */}
                <span className="text-xs text-zinc-500">
                    {canvasWidth * exportScale}×{canvasHeight * exportScale}px
                    {exportScale > 1 && (
                        <span className="text-zinc-600 ml-1">
                            ({canvasWidth}×{canvasHeight} @{exportScale}x)
                        </span>
                    )}
                </span>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    onClick={handleCopy}
                    disabled={!originalImage}
                    className="gap-2"
                >
                    <Copy className="w-4 h-4" />
                    <span className="hidden sm:inline">Copy</span>
                    <kbd className="hidden sm:inline ml-1 px-1.5 py-0.5 text-[10px] bg-zinc-700 rounded font-mono">
                        ⌘C
                    </kbd>
                </Button>

                <Button
                    onClick={handleDownload}
                    disabled={!originalImage}
                    className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                    <kbd className="hidden sm:inline ml-1 px-1.5 py-0.5 text-[10px] bg-indigo-500/50 rounded font-mono">
                        ⌘S
                    </kbd>
                </Button>
            </div>
        </div>
    );
}
