'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useEditorStore } from '@/lib/store/editor-store';
import { useSubscription } from '@/lib/subscription/context';
import { Crown } from 'lucide-react';

export function ShadowControl() {
    const {
        shadowBlur,
        setShadowBlur,
        shadowOpacity,
        setShadowOpacity,
        shadowColor,
        setShadowColor
    } = useEditorStore();

    // Subscription access (for showing PRO badges only)
    const { isPro } = useSubscription();

    // Local state for smooth slider interactions
    const [localBlur, setLocalBlur] = useState(shadowBlur);
    const [localOpacity, setLocalOpacity] = useState(shadowOpacity);
    const [isEnabled, setIsEnabled] = useState(shadowBlur > 0);
    const rafIdRef = useRef<number | null>(null);
    const pendingBlurRef = useRef<number | null>(null);
    const pendingOpacityRef = useRef<number | null>(null);

    // Sync local state with store
    useEffect(() => {
        setLocalBlur(shadowBlur);
        setIsEnabled(shadowBlur > 0);
    }, [shadowBlur]);

    useEffect(() => {
        setLocalOpacity(shadowOpacity);
    }, [shadowOpacity]);

    // Cleanup RAF on unmount
    useEffect(() => {
        return () => {
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, []);

    // RAF-based store updates for smooth slider interaction
    const scheduleUpdate = useCallback(() => {
        if (rafIdRef.current !== null) return;

        rafIdRef.current = requestAnimationFrame(() => {
            if (pendingBlurRef.current !== null) {
                const value = pendingBlurRef.current;
                setShadowBlur(value);
                if (value > 0 && !isEnabled) setIsEnabled(true);
                if (value === 0 && isEnabled) setIsEnabled(false);
                pendingBlurRef.current = null;
            }
            if (pendingOpacityRef.current !== null) {
                setShadowOpacity(pendingOpacityRef.current);
                pendingOpacityRef.current = null;
            }
            rafIdRef.current = null;
        });
    }, [setShadowBlur, setShadowOpacity, isEnabled]);

    const handleBlurChange = (value: number) => {
        setLocalBlur(value);
        pendingBlurRef.current = value;
        scheduleUpdate();
    };

    const handleOpacityChange = (value: number) => {
        setLocalOpacity(value);
        pendingOpacityRef.current = value;
        scheduleUpdate();
    };

    const handleColorChange = (color: string) => {
        setShadowColor(color);
    };

    const toggleShadow = (checked: boolean) => {
        setIsEnabled(checked);
        if (checked) {
            const newBlur = localBlur > 0 ? localBlur : 20;
            const newOpacity = localOpacity > 0 ? localOpacity : 50;
            setLocalBlur(newBlur);
            setLocalOpacity(newOpacity);
            setShadowBlur(newBlur);
            setShadowOpacity(newOpacity);
        } else {
            setLocalBlur(0);
            setShadowBlur(0);
        }
    };

    return (
        <div className="space-y-4">
            {/* Enable Toggle */}
            <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                    Enable Shadow
                </Label>
                <Switch
                    checked={isEnabled}
                    onCheckedChange={toggleShadow}
                />
            </div>

            {isEnabled && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Color Picker */}
                    <div className="flex items-center justify-between">
                        <Label className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-2">
                            Color
                            {!isPro && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-500/20 rounded text-[9px] font-semibold text-orange-500">
                                    <Crown className="w-2 h-2" />
                                    PRO
                                </span>
                            )}
                        </Label>
                        <div className="flex items-center gap-2">
                            <label className="relative group cursor-pointer rounded-full focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
                                <div
                                    className="w-8 h-8 rounded-full border-2 border-muted-foreground/50 shadow-sm ring-1 ring-white/20"
                                    style={{ backgroundColor: shadowColor }}
                                />
                                <input
                                    type="color"
                                    value={shadowColor}
                                    onChange={(e) => handleColorChange(e.target.value)}
                                    className="sr-only"
                                    aria-label="Shadow color picker"
                                />
                            </label>
                            <Input
                                value={shadowColor}
                                onChange={(e) => handleColorChange(e.target.value)}
                                className="w-20 h-7 text-xs bg-input border-border uppercase"
                            />
                        </div>
                    </div>

                    {/* Blur Slider */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-2">
                                Blur Radius
                                {!isPro && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-500/20 rounded text-[9px] font-semibold text-orange-500">
                                        <Crown className="w-2 h-2" />
                                        PRO
                                    </span>
                                )}
                            </Label>
                            <span className="text-xs text-muted-foreground">
                                {localBlur}px
                            </span>
                        </div>
                        <Slider
                            value={[localBlur]}
                            onValueChange={([val]) => handleBlurChange(val)}
                            min={0}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                    </div>

                    {/* Opacity Slider */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-2">
                                Opacity
                                {!isPro && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-500/20 rounded text-[9px] font-semibold text-orange-500">
                                        <Crown className="w-2 h-2" />
                                        PRO
                                    </span>
                                )}
                            </Label>
                            <span className="text-xs text-muted-foreground">
                                {localOpacity}%
                            </span>
                        </div>
                        <Slider
                            value={[localOpacity]}
                            onValueChange={([val]) => handleOpacityChange(val)}
                            min={0}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
