'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useEditorStore } from '@/lib/store/editor-store';
import { cn } from '@/lib/utils';

export function ShadowControl() {
    const {
        shadowBlur,
        setShadowBlur,
        shadowOpacity,
        setShadowOpacity,
        shadowColor,
        setShadowColor
    } = useEditorStore();

    // Local state for smooth slider interactions
    const [localBlur, setLocalBlur] = useState(shadowBlur);
    const [localOpacity, setLocalOpacity] = useState(shadowOpacity);
    const [isEnabled, setIsEnabled] = useState(shadowBlur > 0);

    // Sync local state with store
    useEffect(() => {
        setLocalBlur(shadowBlur);
        setIsEnabled(shadowBlur > 0);
    }, [shadowBlur]);

    useEffect(() => {
        setLocalOpacity(shadowOpacity);
    }, [shadowOpacity]);

    const handleBlurChange = (value: number) => {
        setLocalBlur(value);
        // Update immediately - Canvas throttle handles performance
        setShadowBlur(value);
        if (value > 0 && !isEnabled) setIsEnabled(true);
        if (value === 0 && isEnabled) setIsEnabled(false);
    };

    const handleOpacityChange = (value: number) => {
        setLocalOpacity(value);
        // Update immediately - Canvas throttle handles performance
        setShadowOpacity(value);
    };

    const toggleShadow = (checked: boolean) => {
        setIsEnabled(checked);
        if (checked) {
            // Restore default or previous blur if it was 0
            const newBlur = localBlur > 0 ? localBlur : 20;
            setLocalBlur(newBlur);
            setShadowBlur(newBlur);
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
                        <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                            Color
                        </Label>
                        <div className="flex items-center gap-2">
                            <div className="relative group">
                                <div
                                    className="w-8 h-8 rounded-full border border-border cursor-pointer shadow-sm"
                                    style={{ backgroundColor: shadowColor }}
                                />
                                <input
                                    type="color"
                                    value={shadowColor}
                                    onChange={(e) => setShadowColor(e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                            </div>
                            <Input
                                value={shadowColor}
                                onChange={(e) => setShadowColor(e.target.value)}
                                className="w-20 h-7 text-xs bg-input border-border uppercase"
                            />
                        </div>
                    </div>

                    {/* Blur Slider */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                                Blur Radius
                            </Label>
                            <span className="text-xs text-muted-foreground">{localBlur}px</span>
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
                            <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                                Opacity
                            </Label>
                            <span className="text-xs text-muted-foreground">{localOpacity}%</span>
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
