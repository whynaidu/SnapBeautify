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
const ALL_PADDING_PRESETS = [32, 48, 64, 96, 128];

export function PaddingControl() {
    const { padding, setPadding } = useEditorStore();
    const [localPadding, setLocalPadding] = useState(padding);

    // Subscription access
    const { checkFeature } = useSubscription();
    const hasAllPadding = checkFeature('all_padding_values').hasAccess;

    // Free presets from limits
    const freePaddingPresets = FREE_TIER_LIMITS.freePaddingPresets;

    // Show upgrade modal
    const showUpgradeModal = (message: string) => {
        window.dispatchEvent(
            new CustomEvent('show-upgrade-modal', {
                detail: { featureId: 'all_padding_values', message },
            })
        );
    };

    // Check if a preset is free
    const isPresetFree = (preset: number): boolean => {
        return (freePaddingPresets as readonly number[]).includes(preset);
    };

    useEffect(() => {
        setLocalPadding(padding);
    }, [padding]);

    const handlePaddingChange = (value: number) => {
        if (!hasAllPadding) {
            // For free users, only allow free presets
            if (!(freePaddingPresets as readonly number[]).includes(value)) {
                showUpgradeModal('Upgrade to Pro for custom padding values and all presets');
                return;
            }
        }
        setLocalPadding(value);
        setPadding(value);
    };

    const handleSliderChange = (value: number) => {
        if (!hasAllPadding) {
            showUpgradeModal('Upgrade to Pro for custom padding values');
            return;
        }
        setLocalPadding(value);
        setPadding(value);
    };

    const handleInputChange = (value: number) => {
        if (!hasAllPadding) {
            showUpgradeModal('Upgrade to Pro for custom padding values');
            return;
        }
        const clampedValue = Math.max(0, Math.min(200, value));
        setLocalPadding(clampedValue);
        setPadding(clampedValue);
    };

    const handlePresetClick = (preset: number) => {
        if (!isPresetFree(preset) && !hasAllPadding) {
            showUpgradeModal('Upgrade to Pro to access all padding presets');
            return;
        }
        setPadding(preset);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                    Padding
                </Label>
                <div className={cn("flex items-center gap-1 relative", !hasAllPadding && "opacity-60")}>
                    <Input
                        type="number"
                        value={localPadding}
                        onChange={(e) => handleInputChange(Number(e.target.value))}
                        className="w-16 h-7 text-xs text-right bg-input border-border"
                        min={0}
                        max={200}
                        disabled={!hasAllPadding}
                    />
                    <span className="text-xs text-muted-foreground">px</span>
                    {!hasAllPadding && (
                        <>
                            <Crown className="w-3 h-3 text-orange-500 ml-1" />
                            {/* Clickable overlay for free users */}
                            <div
                                className="absolute inset-0 cursor-pointer"
                                onClick={() => showUpgradeModal('Upgrade to Pro for custom padding values')}
                            />
                        </>
                    )}
                </div>
            </div>

            <div className="relative">
                <Slider
                    value={[localPadding]}
                    onValueChange={([value]) => handleSliderChange(value)}
                    min={0}
                    max={200}
                    step={4}
                    className={cn("w-full", !hasAllPadding && "opacity-50")}
                    disabled={!hasAllPadding}
                />
                {!hasAllPadding && (
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
                            onClick={() => showUpgradeModal('Upgrade to Pro for custom padding values')}
                        />
                    </>
                )}
            </div>

            {/* Quick presets */}
            <div className="flex gap-2">
                {ALL_PADDING_PRESETS.map((preset) => {
                    const isFree = isPresetFree(preset);
                    const isPremium = !isFree && !hasAllPadding;
                    return (
                        <button
                            key={preset}
                            onClick={() => handlePresetClick(preset)}
                            className={cn(
                                'flex-1 py-1.5 text-xs rounded transition-colors relative',
                                padding === preset
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

            {/* Helper text for free users */}
            {!hasAllPadding && (
                <p className="text-[10px] text-muted-foreground">
                    Free: {freePaddingPresets.join(', ')}px presets only
                </p>
            )}
        </div>
    );
}
