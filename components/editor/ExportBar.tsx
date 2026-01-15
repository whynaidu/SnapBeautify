'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, Download, ChevronDown, Check, Share2, Loader2, Crown, Lock } from 'lucide-react';
import { useEditorStore } from '@/lib/store/editor-store';
import { useAuth } from '@/lib/auth/context';
import { useSubscription } from '@/lib/subscription/context';
import { checkPremiumFeaturesUsed } from '@/lib/subscription/feature-gates';
import {
    copyCanvasToClipboard,
    downloadCanvas,
    shareCanvas,
    isClipboardSupported,
    isShareSupported,
    isMobileDevice
} from '@/lib/canvas/export';
import {
    isCapacitor,
    saveImageCapacitor,
    shareImageCapacitor
} from '@/lib/canvas/export-capacitor';
import { renderCanvas } from '@/lib/canvas/renderer';
import { showUpgradeModal } from '@/lib/events';
import { toast } from 'sonner';
import { ExportFormat, ExportScale } from '@/types/editor';
import { canvasPool } from '@/lib/utils/canvas-pool';
import { measureExport } from '@/lib/utils/performance';
import { logger } from '@/lib/utils/logger';

export function ExportBar() {
    const [canCopy, setCanCopy] = useState(true);
    const [canShare, setCanShare] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Get user for export tracking
    const { user } = useAuth();

    // Subscription for feature gating
    const { checkFeature, exportsRemaining, isPro, refresh: refreshSubscription } = useSubscription();
    const has4kExport = checkFeature('4k_export').hasAccess;
    const hasUnlimitedExports = checkFeature('unlimited_exports').hasAccess;
    const hasWebpExport = checkFeature('webp_export').hasAccess;

    // Get store setters early for memoized callbacks
    const { setExportFormat, setExportScale } = useEditorStore();

    // Memoized: Show upgrade modal for premium features
    const handleShowUpgradeModal = useCallback((feature: string) => {
        showUpgradeModal({ feature });
    }, []);

    // Memoized: Check if a scale is premium (3x and 4x are Pro only)
    const isPremiumScale = useCallback((scale: ExportScale) => scale >= 3 && !has4kExport, [has4kExport]);

    // Memoized: Check if a format is premium (WebP is Pro only)
    const isPremiumFormat = useCallback((format: ExportFormat) => format === 'webp' && !hasWebpExport, [hasWebpExport]);

    // Memoized: Handle scale selection with premium check
    const handleScaleChange = useCallback((scale: ExportScale) => {
        if (scale >= 3 && !has4kExport) {
            showUpgradeModal({ feature: '4k_export' });
            return;
        }
        setExportScale(scale);
    }, [has4kExport, setExportScale]);

    // Memoized: Handle format selection with premium check
    const handleFormatChange = useCallback((format: ExportFormat) => {
        if (format === 'webp' && !hasWebpExport) {
            showUpgradeModal({ feature: 'webp_export' });
            return;
        }
        setExportFormat(format);
    }, [hasWebpExport, setExportFormat]);

    const {
        exportFormat,
        exportScale,
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
        waveSplitFlipped,
        logoPatternImage,
        logoPatternOpacity,
        logoPatternSize,
        logoPatternSpacing,
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
        textPatternRows,
    } = useEditorStore();

    // Check if premium features are being used
    const premiumUsage = useMemo(() => {
        return checkPremiumFeaturesUsed({
            backgroundType,
            backgroundColor,
            gradientColors,
            meshGradientCSS,
            frameType,
            textPatternPositions,
            textPatternRows,
            textPatternFontFamily,
            textPatternFontWeight,
            textOverlays,
            padding,
            shadowBlur,
            shadowOpacity,
            shadowColor,
            borderRadius,
            imageScale,
            exportFormat,
            exportScale,
        });
    }, [
        backgroundType,
        backgroundColor,
        gradientColors,
        meshGradientCSS,
        frameType,
        textPatternPositions,
        textPatternRows,
        textPatternFontFamily,
        textPatternFontWeight,
        textOverlays,
        padding,
        shadowBlur,
        shadowOpacity,
        shadowColor,
        borderRadius,
        imageScale,
        exportFormat,
        exportScale,
    ]);

    // Block export if free user has premium features
    const canExport = isPro || !premiumUsage.isPremiumUsed;

    // Check capabilities on mount
    useEffect(() => {
        setCanCopy(isClipboardSupported());
        // In Capacitor, always enable share (native plugin available)
        // Otherwise check for Web Share API
        setCanShare(isCapacitor() || isShareSupported());
        setIsMobile(isMobileDevice());
    }, []);

    const createExportCanvas = async (scaleOverride?: number) => {
        if (!originalImage) return null;

        const scale = scaleOverride || exportScale;
        const width = canvasWidth * scale;
        const height = canvasHeight * scale;

        // Use canvas pool to prevent memory leaks
        const exportCanvas = canvasPool.acquire(width, height);

        try {
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
                logoPatternImage,
                logoPatternOpacity,
                logoPatternSize,
                logoPatternSpacing,
                padding,
                shadowBlur,
                shadowOpacity,
                shadowColor,
                borderRadius,
                frameType,
                scale,
                imageScale,
                rotation,
                targetWidth: canvasWidth,
                targetHeight: canvasHeight,
                textOverlays,
            });
            return exportCanvas;
        } catch (error) {
            // If rendering fails, release canvas back to pool
            canvasPool.release(exportCanvas);
            throw error;
        }
    };

    const attemptExport = async (
        action: 'download' | 'share' | 'copy',
        currentScale: number
    ): Promise<boolean> => {
        return measureExport(
            `export:${action}`,
            async () => {
                let exportCanvas: HTMLCanvasElement | null = null;
                try {
                    exportCanvas = await createExportCanvas(currentScale);
                    if (!exportCanvas) return false;

                    // Small delay to ensure UI updates before heavy canvas operation
                    await new Promise(resolve => setTimeout(resolve, 0));

                    const timestamp = new Date().toISOString().slice(0, 10);
                    const filename = `snapbeautify-${timestamp}`;

                    // Use Capacitor native APIs when running in native app
                    if (isCapacitor()) {
                        if (action === 'download') {
                            await saveImageCapacitor(exportCanvas, filename, exportFormat);
                        } else if (action === 'share') {
                            await shareImageCapacitor(exportCanvas, filename, exportFormat);
                        } else if (action === 'copy') {
                            // Copy not supported in Capacitor, fallback to share
                            await shareImageCapacitor(exportCanvas, filename, exportFormat);
                        }
                    } else {
                        // Use web APIs for browser
                        if (action === 'download') {
                            await downloadCanvas(exportCanvas, filename, exportFormat);
                        } else if (action === 'share') {
                            await shareCanvas(exportCanvas, filename);
                        } else if (action === 'copy') {
                            await copyCanvasToClipboard(exportCanvas);
                        }
                    }

                    // Release canvas back to pool for reuse
                    canvasPool.release(exportCanvas);

                    return true;
                } catch (error) {
                    // Release canvas on error
                    if (exportCanvas) {
                        canvasPool.release(exportCanvas);
                    }

                    if (error instanceof Error && (error.message.includes('abort') || error.message.includes('cancel'))) {
                        throw error; // Don't retry for user cancellations
                    }
                    return false; // Failed, try next scale
                }
            },
            {
                action,
                scale: currentScale,
                format: exportFormat,
            }
        );
    };

    // Increment export count on server
    const incrementExport = async () => {
        if (!user?.id) {
            logger.error('export:increment-failed', new Error('No user ID available'));
            return;
        }

        try {
            await fetch('/api/subscription/increment-export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id }),
            });
            // Refresh subscription to update export count display
            await refreshSubscription();
        } catch (error) {
            logger.error('export:increment-failed', error instanceof Error ? error : new Error(String(error)));
        }
    };

    const wrapExport = async (action: () => Promise<void>) => {
        if (isExporting) return;

        // Check if free user is trying to export with premium features
        if (!canExport) {
            handleShowUpgradeModal('premium_features');
            return;
        }

        // Check export limit for free users
        if (!hasUnlimitedExports && exportsRemaining <= 0) {
            handleShowUpgradeModal('unlimited_exports');
            return;
        }

        setIsExporting(true);
        try {
            await action();
            // Increment export count for free users
            if (!hasUnlimitedExports) {
                await incrementExport();
            }
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
                } else if (isCapacitor()) {
                    toast.success('Saved to Pictures/SnapBeautify! Check Gallery.', { duration: 5000 });
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
        <div className="fixed md:relative bottom-0 left-0 right-0 md:bottom-auto h-16 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 px-3 sm:px-6 flex items-center justify-between z-50">
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Format Selector */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-16 sm:w-24 justify-between text-xs sm:text-sm rounded-full border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-800"
                            disabled={isExporting}
                            aria-label={`Export format: ${exportFormat.toUpperCase()}. Click to change format`}
                        >
                            {exportFormat.toUpperCase()}
                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="rounded-xl bg-white/90 dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                        {(['png', 'jpeg', 'webp'] as ExportFormat[]).map((format) => (
                            <DropdownMenuItem
                                key={format}
                                onClick={() => handleFormatChange(format)}
                                className="flex items-center justify-between rounded-lg cursor-pointer"
                            >
                                <span className="flex items-center gap-2">
                                    {format.toUpperCase()}
                                    {isPremiumFormat(format) && (
                                        <Crown className="w-3 h-3 text-amber-500" />
                                    )}
                                </span>
                                {exportFormat === format && <Check className="w-4 h-4 text-zinc-500" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Scale Selector */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-14 sm:w-24 justify-between text-xs sm:text-sm rounded-full border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-800"
                            disabled={isExporting}
                            aria-label={`Export scale: ${exportScale}x. Click to change scale`}
                        >
                            {exportScale}x
                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 opacity-50 hidden sm:block" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="rounded-xl bg-white/90 dark:bg-zinc-900/90 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                        {([1, 2, 3, 4] as ExportScale[]).map((scale) => (
                            <DropdownMenuItem
                                key={scale}
                                onClick={() => handleScaleChange(scale)}
                                className="flex items-center justify-between rounded-lg cursor-pointer"
                            >
                                <span className="flex items-center gap-2">
                                    {scale}x {scale === 2 && '(Retina)'}
                                    {scale === 3 && '(3K)'}
                                    {scale === 4 && '(4K)'}
                                    {isPremiumScale(scale) && (
                                        <Crown className="w-3 h-3 text-amber-500" />
                                    )}
                                </span>
                                {exportScale === scale && <Check className="w-4 h-4 text-zinc-500" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Current dimensions display - hide on small screens */}
                <div className="hidden sm:flex items-center gap-2">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        {canvasWidth * exportScale}×{canvasHeight * exportScale}px
                    </span>
                    {exportScale > 1 && (
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 hidden md:inline">
                            ({canvasWidth}×{canvasHeight} @{exportScale}x)
                        </span>
                    )}
                </div>

                {/* Exports remaining for free users */}
                {!hasUnlimitedExports && (
                    <span className={`text-[10px] sm:text-xs hidden sm:inline px-2.5 py-1 rounded-full font-medium ${
                        exportsRemaining <= 1
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                            : exportsRemaining <= 3
                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                    }`}>
                        {exportsRemaining} export{exportsRemaining !== 1 ? 's' : ''} left
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                {/* Premium features warning badge */}
                {!canExport && (
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-3 py-1.5 rounded-full font-medium">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Premium features in use</span>
                    </div>
                )}

                {/* On mobile: show Share button, on desktop: show Copy button */}
                {isMobile ? (
                    canShare && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleShare}
                            disabled={!originalImage || isExporting}
                            className={`gap-1.5 sm:gap-2 px-3 sm:px-4 rounded-full border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${!canExport ? 'border-amber-400 dark:border-amber-600' : ''}`}
                        >
                            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : !canExport ? <Lock className="w-4 h-4 text-amber-500" /> : <Share2 className="w-4 h-4" />}
                            <span className="hidden sm:inline text-sm font-medium">Share</span>
                        </Button>
                    )
                ) : (
                    canCopy && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopy}
                            disabled={!originalImage || isExporting}
                            className={`gap-1.5 sm:gap-2 px-3 sm:px-4 rounded-full border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${!canExport ? 'border-amber-400 dark:border-amber-600' : ''}`}
                        >
                            {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : !canExport ? <Lock className="w-4 h-4 text-amber-500" /> : <Copy className="w-4 h-4" />}
                            <span className="hidden sm:inline text-sm font-medium">Copy</span>
                        </Button>
                    )
                )}

                <Button
                    size="sm"
                    onClick={handleDownload}
                    disabled={!originalImage || isExporting}
                    className={`gap-1.5 sm:gap-2 px-4 sm:px-6 rounded-full font-semibold text-sm shadow-lg ${
                        !canExport
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/25'
                            : 'bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-black/10 dark:shadow-white/10'
                    }`}
                >
                    {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : !canExport ? <Crown className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                    <span>{!canExport ? 'Upgrade' : 'Save'}</span>
                </Button>
            </div>
        </div>
    );
}
