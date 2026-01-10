'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useEditorStore } from '@/lib/store/editor-store';
import { useSubscription } from '@/lib/subscription/context';
import { FREE_TIER_LIMITS } from '@/lib/subscription/feature-gates';
import { cn } from '@/lib/utils';
import { Crown } from 'lucide-react';

// All presets - some are PRO only
const ALL_RADIUS_PRESETS = [0, 8, 12, 16, 24];

export function BorderRadiusControl() {
    const { borderRadius, setBorderRadius } = useEditorStore();
    const [localRadius, setLocalRadius] = useState(borderRadius);

    // Subscription access
    const { checkFeature } = useSubscription();
    const hasAllBorderRadius = checkFeature('all_border_radius').hasAccess;

    // Free presets from limits
    const freeBorderRadiusPresets = FREE_TIER_LIMITS.freeBorderRadiusPresets;

    // Show upgrade modal
    const showUpgradeModal = (message: string) => {
        window.dispatchEvent(
            new CustomEvent('show-upgrade-modal', {
                detail: { featureId: 'all_border_radius', message },
            })
        );
    };

    // Check if a preset is free
    const isPresetFree = (preset: number): boolean => {
        return (freeBorderRadiusPresets as readonly number[]).includes(preset);
    };

    useEffect(() => {
        setLocalRadius(borderRadius);
    }, [borderRadius]);

    const handleRadiusChange = (value: number) => {
        if (!hasAllBorderRadius) {
            // For free users, only allow free presets
            if (!(freeBorderRadiusPresets as readonly number[]).includes(value)) {
                showUpgradeModal('Upgrade to Pro for custom border radius values');
                return;
            }
        }
        setLocalRadius(value);
        setBorderRadius(value);
    };

    const handleSliderChange = (value: number) => {
        if (!hasAllBorderRadius) {
            showUpgradeModal('Upgrade to Pro for custom border radius values');
            return;
        }
        setLocalRadius(value);
        setBorderRadius(value);
    };

    const handleInputChange = (value: number) => {
        if (!hasAllBorderRadius) {
            showUpgradeModal('Upgrade to Pro for custom border radius values');
            return;
        }
        const clampedValue = Math.max(0, Math.min(50, value));
        setLocalRadius(clampedValue);
        setBorderRadius(clampedValue);
    };

    const handlePresetClick = (preset: number) => {
        if (!isPresetFree(preset) && !hasAllBorderRadius) {
            showUpgradeModal('Upgrade to Pro to access all border radius presets');
            return;
        }
        setBorderRadius(preset);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                    Border Radius
                </Label>
                <div className={cn("flex items-center gap-1 relative", !hasAllBorderRadius && "opacity-60")}>
                    <Input
                        type="number"
                        value={localRadius}
                        onChange={(e) => handleInputChange(Number(e.target.value))}
                        className="w-16 h-7 text-xs text-right bg-input border-border"
                        min={0}
                        max={50}
                        disabled={!hasAllBorderRadius}
                    />
                    <span className="text-xs text-muted-foreground">px</span>
                    {!hasAllBorderRadius && (
                        <>
                            <Crown className="w-3 h-3 text-orange-500 ml-1" />
                            {/* Clickable overlay for free users */}
                            <div
                                className="absolute inset-0 cursor-pointer"
                                onClick={() => showUpgradeModal('Upgrade to Pro for custom border radius values')}
                            />
                        </>
                    )}
                </div>
            </div>

            <div className="relative">
                <Slider
                    value={[localRadius]}
                    onValueChange={([value]) => handleSliderChange(value)}
                    min={0}
                    max={50}
                    step={2}
                    className={cn("w-full", !hasAllBorderRadius && "opacity-50")}
                    disabled={!hasAllBorderRadius}
                />
                {!hasAllBorderRadius && (
                    <>
                        <div className="absolute -right-1 -top-1">
                            <span className="inline-flex items-center gap-0.5 px-1 py-0.5 bg-orange-500/20 rounded text-[8px] font-semibold text-orange-500">
                                <Crown className="w-2 h-2" />
                                PRO
                            </span>
                        </div>
                        {/* Clickable overlay for free users */}
                        <div
                            className="absolute inset-0 cursor-pointer"
                            onClick={() => showUpgradeModal('Upgrade to Pro for custom border radius values')}
                        />
                    </>
                )}
            </div>

            {/* Quick presets */}
            <div className="flex gap-2">
                {ALL_RADIUS_PRESETS.map((preset) => {
                    const isFree = isPresetFree(preset);
                    const isPremium = !isFree && !hasAllBorderRadius;
                    return (
                        <button
                            key={preset}
                            onClick={() => handlePresetClick(preset)}
                            className={cn(
                                'flex-1 py-1.5 text-xs rounded transition-colors relative',
                                borderRadius === preset
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                                isPremium && 'opacity-60'
                            )}
                        >
                            {preset}
                            {isPremium && (
                                <Crown className="w-2 h-2 absolute -top-1 -right-1 text-orange-500" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Visual preview */}
            <div className="flex justify-center p-3 bg-muted/40 rounded-lg">
                <div
                    className="w-16 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 transition-all duration-150"
                    style={{ borderRadius: `${localRadius}px` }}
                />
            </div>

            {/* Helper text for free users */}
            {!hasAllBorderRadius && (
                <p className="text-[10px] text-muted-foreground">
                    Free: {freeBorderRadiusPresets.join(', ')}px presets only
                </p>
            )}
        </div>
    );
}
