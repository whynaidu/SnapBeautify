'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/lib/store/editor-store';
import { useSubscription } from '@/lib/subscription/context';
import { FREE_TIER_LIMITS } from '@/lib/subscription/feature-gates';
import { cn } from '@/lib/utils';
import { ZoomIn, ZoomOut, RotateCcw, Crown } from 'lucide-react';

export function ScaleControl() {
    const { imageScale, setImageScale } = useEditorStore();

    // Handle hydration
    const [localScale, setLocalScale] = useState(100);

    // Subscription access
    const { checkFeature } = useSubscription();
    const hasExtendedScale = checkFeature('extended_image_scale').hasAccess;

    // Free tier limits
    const FREE_MIN = FREE_TIER_LIMITS.imageScaleMin;
    const FREE_MAX = FREE_TIER_LIMITS.imageScaleMax;
    const PRO_MIN = 10;
    const PRO_MAX = 200;

    // Show upgrade modal
    const showUpgradeModal = (message: string) => {
        window.dispatchEvent(
            new CustomEvent('show-upgrade-modal', {
                detail: { featureId: 'extended_image_scale', message },
            })
        );
    };

    useEffect(() => {
        setLocalScale(Math.round(imageScale * 100));
    }, [imageScale]);

    const handleScaleChange = (value: number) => {
        const min = hasExtendedScale ? PRO_MIN : FREE_MIN;
        const max = hasExtendedScale ? PRO_MAX : FREE_MAX;
        const clampedValue = Math.max(min, Math.min(max, value));

        // If user tries to go beyond free limits, show upgrade modal
        if (!hasExtendedScale && (value < FREE_MIN || value > FREE_MAX)) {
            showUpgradeModal(`Upgrade to Pro to scale images from ${PRO_MIN}% to ${PRO_MAX}%`);
            return;
        }

        setLocalScale(clampedValue);
        setImageScale(clampedValue / 100);
    };

    const handleZoomIn = () => {
        const newValue = localScale + 10;
        const max = hasExtendedScale ? PRO_MAX : FREE_MAX;

        if (!hasExtendedScale && newValue > FREE_MAX) {
            showUpgradeModal(`Upgrade to Pro to scale images up to ${PRO_MAX}%`);
            return;
        }

        handleScaleChange(Math.min(newValue, max));
    };

    const handleZoomOut = () => {
        const newValue = localScale - 10;
        const min = hasExtendedScale ? PRO_MIN : FREE_MIN;

        if (!hasExtendedScale && newValue < FREE_MIN) {
            showUpgradeModal(`Upgrade to Pro to scale images down to ${PRO_MIN}%`);
            return;
        }

        handleScaleChange(Math.max(newValue, min));
    };

    const handleReset = () => {
        handleScaleChange(100);
    };

    const currentMin = hasExtendedScale ? PRO_MIN : FREE_MIN;
    const currentMax = hasExtendedScale ? PRO_MAX : FREE_MAX;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                    Image Scale
                </Label>
                {!hasExtendedScale && (
                    <button
                        onClick={() => showUpgradeModal(`Upgrade to Pro to scale images from ${PRO_MIN}% to ${PRO_MAX}%`)}
                        className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-500/20 rounded text-[9px] font-semibold text-orange-500 hover:bg-orange-500/30 transition-colors"
                    >
                        <Crown className="w-2 h-2" />
                        {FREE_MIN}-{FREE_MAX}% free
                    </button>
                )}
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={localScale <= currentMin}
                    className="w-9 h-9 p-0"
                >
                    <ZoomOut className="w-4 h-4" />
                </Button>

                <Slider
                    value={[localScale]}
                    onValueChange={([value]) => handleScaleChange(value)}
                    min={currentMin}
                    max={currentMax}
                    step={5}
                    className="flex-1"
                />

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={localScale >= currentMax}
                    className="w-9 h-9 p-0"
                >
                    <ZoomIn className="w-4 h-4" />
                </Button>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <Input
                        type="number"
                        value={localScale}
                        onChange={(e) => handleScaleChange(Number(e.target.value))}
                        className="w-16 h-7 text-xs text-right bg-input border-border"
                        min={currentMin}
                        max={currentMax}
                    />
                    <span className="text-xs text-muted-foreground">%</span>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-xs text-muted-foreground hover:text-foreground"
                >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reset
                </Button>
            </div>

            {/* Range indicator for free users */}
            {!hasExtendedScale && (
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>Min: {FREE_MIN}%</span>
                    <button
                        onClick={() => showUpgradeModal(`Upgrade to Pro to scale images from ${PRO_MIN}% to ${PRO_MAX}%`)}
                        className="flex items-center gap-1 hover:text-orange-500 transition-colors cursor-pointer"
                    >
                        <Crown className="w-2.5 h-2.5 text-orange-500" />
                        PRO: {PRO_MIN}%-{PRO_MAX}%
                    </button>
                    <span>Max: {FREE_MAX}%</span>
                </div>
            )}
        </div>
    );
}
