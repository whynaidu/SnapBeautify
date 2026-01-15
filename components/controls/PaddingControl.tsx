'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
    const rafIdRef = useRef<number | null>(null);
    const pendingValueRef = useRef<number | null>(null);

    // Subscription access (for PRO badge only)
    const { isPro } = useSubscription();

    // Free presets from limits
    const freePaddingPresets = FREE_TIER_LIMITS.freePaddingPresets;

    // Check if a preset is free
    const isPresetFree = (preset: number): boolean => {
        return (freePaddingPresets as readonly number[]).includes(preset);
    };

    useEffect(() => {
        setLocalPadding(padding);
    }, [padding]);

    // Cleanup RAF on unmount
    useEffect(() => {
        return () => {
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, []);

    // RAF-based update for smooth slider interaction (better than setTimeout debounce)
    const rafSetPadding = useCallback((value: number) => {
        pendingValueRef.current = value;

        // If RAF already scheduled, it will use the latest value
        if (rafIdRef.current !== null) return;

        rafIdRef.current = requestAnimationFrame(() => {
            if (pendingValueRef.current !== null) {
                setPadding(pendingValueRef.current);
            }
            rafIdRef.current = null;
        });
    }, [setPadding]);

    const handlePaddingChange = (value: number) => {
        setLocalPadding(value);
        setPadding(value);
    };

    const handleSliderChange = (value: number) => {
        setLocalPadding(value);
        // Use RAF-based update for smooth slider interaction
        rafSetPadding(value);
    };

    const handleInputChange = (value: number) => {
        const clampedValue = Math.max(0, Math.min(200, value));
        setLocalPadding(clampedValue);
        setPadding(clampedValue);
    };

    const handlePresetClick = (preset: number) => {
        setPadding(preset);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                    Padding
                </Label>
                <div className="flex items-center gap-1">
                    <Input
                        type="number"
                        value={localPadding}
                        onChange={(e) => handleInputChange(Number(e.target.value))}
                        className="w-16 h-7 text-xs text-right bg-input border-border"
                        min={0}
                        max={200}
                    />
                    <span className="text-xs text-muted-foreground">px</span>
                    {!isPro && (
                        <Crown className="w-3 h-3 text-orange-500 ml-1" />
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
                {ALL_PADDING_PRESETS.map((preset) => {
                    const isFree = isPresetFree(preset);
                    const isPremium = !isFree && !isPro;
                    return (
                        <button
                            key={preset}
                            onClick={() => handlePresetClick(preset)}
                            className={cn(
                                'flex-1 py-1.5 text-xs rounded transition-colors relative',
                                padding === preset
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
        </div>
    );
}
