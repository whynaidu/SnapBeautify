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

    // Subscription access (for PRO badge only)
    const { isPro } = useSubscription();

    // Free presets from limits
    const freeBorderRadiusPresets = FREE_TIER_LIMITS.freeBorderRadiusPresets;

    // Check if a preset is free
    const isPresetFree = (preset: number): boolean => {
        return (freeBorderRadiusPresets as readonly number[]).includes(preset);
    };

    useEffect(() => {
        setLocalRadius(borderRadius);
    }, [borderRadius]);

    const handleRadiusChange = (value: number) => {
        setLocalRadius(value);
        setBorderRadius(value);
    };

    const handleSliderChange = (value: number) => {
        setLocalRadius(value);
        setBorderRadius(value);
    };

    const handleInputChange = (value: number) => {
        const clampedValue = Math.max(0, Math.min(50, value));
        setLocalRadius(clampedValue);
        setBorderRadius(clampedValue);
    };

    const handlePresetClick = (preset: number) => {
        setBorderRadius(preset);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                    Border Radius
                </Label>
                <div className="flex items-center gap-1">
                    <Input
                        type="number"
                        value={localRadius}
                        onChange={(e) => handleInputChange(Number(e.target.value))}
                        className="w-16 h-7 text-xs text-right bg-input border-border"
                        min={0}
                        max={50}
                    />
                    <span className="text-xs text-muted-foreground">px</span>
                    {!isPro && (
                        <Crown className="w-3 h-3 text-orange-500 ml-1" />
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
                    className="w-full"
                />
                {!isPro && (
                    <div className="absolute -right-1 -top-1">
                        <span className="inline-flex items-center gap-0.5 px-1 py-0.5 bg-orange-500/20 rounded text-[8px] font-semibold text-orange-500">
                            <Crown className="w-2 h-2" />
                            PRO
                        </span>
                    </div>
                )}
            </div>

            {/* Quick presets */}
            <div className="flex gap-2">
                {ALL_RADIUS_PRESETS.map((preset) => {
                    const isFree = isPresetFree(preset);
                    const isPremium = !isFree && !isPro;
                    return (
                        <button
                            key={preset}
                            onClick={() => handlePresetClick(preset)}
                            className={cn(
                                'flex-1 py-1.5 text-xs rounded transition-colors relative',
                                borderRadius === preset
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
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
        </div>
    );
}
