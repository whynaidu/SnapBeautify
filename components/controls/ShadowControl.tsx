'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useEditorStore } from '@/lib/store/editor-store';
import { useSubscription } from '@/lib/subscription/context';
import { FREE_TIER_LIMITS } from '@/lib/subscription/feature-gates';
import { cn } from '@/lib/utils';
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

    // Subscription access
    const { checkFeature } = useSubscription();
    const hasShadowCustomization = checkFeature('shadow_customization').hasAccess;
    const hasShadowColor = checkFeature('shadow_color').hasAccess;

    // Free tier defaults
    const DEFAULT_BLUR = FREE_TIER_LIMITS.fixedShadowBlur;
    const DEFAULT_OPACITY = FREE_TIER_LIMITS.fixedShadowOpacity * 100;

    // Show upgrade modal
    const showUpgradeModal = (feature: string, message: string) => {
        window.dispatchEvent(
            new CustomEvent('show-upgrade-modal', {
                detail: { featureId: feature, message },
            })
        );
    };

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
        if (!hasShadowCustomization) {
            showUpgradeModal('shadow_customization', 'Upgrade to Pro to customize shadow blur and opacity');
            return;
        }
        setLocalBlur(value);
        setShadowBlur(value);
        if (value > 0 && !isEnabled) setIsEnabled(true);
        if (value === 0 && isEnabled) setIsEnabled(false);
    };

    const handleOpacityChange = (value: number) => {
        if (!hasShadowCustomization) {
            showUpgradeModal('shadow_customization', 'Upgrade to Pro to customize shadow blur and opacity');
            return;
        }
        setLocalOpacity(value);
        setShadowOpacity(value);
    };

    const handleColorChange = (color: string) => {
        if (!hasShadowColor) {
            showUpgradeModal('shadow_color', 'Upgrade to Pro for custom shadow colors');
            return;
        }
        setShadowColor(color);
    };

    const toggleShadow = (checked: boolean) => {
        setIsEnabled(checked);
        if (checked) {
            // Use default or Pro values
            const newBlur = hasShadowCustomization ? (localBlur > 0 ? localBlur : DEFAULT_BLUR) : DEFAULT_BLUR;
            const newOpacity = hasShadowCustomization ? (localOpacity > 0 ? localOpacity : DEFAULT_OPACITY) : DEFAULT_OPACITY;
            setLocalBlur(newBlur);
            setLocalOpacity(newOpacity);
            setShadowBlur(newBlur);
            setShadowOpacity(newOpacity);
            // Reset to black for free users
            if (!hasShadowColor) {
                setShadowColor('#000000');
            }
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
                            {!hasShadowColor && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-500/20 rounded text-[9px] font-semibold text-orange-500">
                                    <Crown className="w-2 h-2" />
                                    PRO
                                </span>
                            )}
                        </Label>
                        <div className={cn("flex items-center gap-2 relative", !hasShadowColor && "opacity-60")}>
                            <div className="relative group">
                                <div
                                    className="w-8 h-8 rounded-full border border-border cursor-pointer shadow-sm"
                                    style={{ backgroundColor: hasShadowColor ? shadowColor : '#000000' }}
                                />
                                <input
                                    type="color"
                                    value={hasShadowColor ? shadowColor : '#000000'}
                                    onChange={(e) => handleColorChange(e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    disabled={!hasShadowColor}
                                />
                            </div>
                            <Input
                                value={hasShadowColor ? shadowColor : '#000000'}
                                onChange={(e) => handleColorChange(e.target.value)}
                                className="w-20 h-7 text-xs bg-input border-border uppercase"
                                disabled={!hasShadowColor}
                            />
                            {/* Clickable overlay for free users */}
                            {!hasShadowColor && (
                                <div
                                    className="absolute inset-0 cursor-pointer"
                                    onClick={() => showUpgradeModal('shadow_color', 'Upgrade to Pro for custom shadow colors')}
                                />
                            )}
                        </div>
                    </div>

                    {/* Blur Slider */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-2">
                                Blur Radius
                                {!hasShadowCustomization && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-500/20 rounded text-[9px] font-semibold text-orange-500">
                                        <Crown className="w-2 h-2" />
                                        PRO
                                    </span>
                                )}
                            </Label>
                            <span className="text-xs text-muted-foreground">
                                {hasShadowCustomization ? localBlur : DEFAULT_BLUR}px
                                {!hasShadowCustomization && ' (fixed)'}
                            </span>
                        </div>
                        <div className="relative">
                            <Slider
                                value={[hasShadowCustomization ? localBlur : DEFAULT_BLUR]}
                                onValueChange={([val]) => handleBlurChange(val)}
                                min={0}
                                max={100}
                                step={1}
                                className={cn("w-full", !hasShadowCustomization && "opacity-50")}
                                disabled={!hasShadowCustomization}
                            />
                            {/* Clickable overlay for free users */}
                            {!hasShadowCustomization && (
                                <div
                                    className="absolute inset-0 cursor-pointer"
                                    onClick={() => showUpgradeModal('shadow_customization', 'Upgrade to Pro to customize shadow blur and opacity')}
                                />
                            )}
                        </div>
                    </div>

                    {/* Opacity Slider */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-2">
                                Opacity
                                {!hasShadowCustomization && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-500/20 rounded text-[9px] font-semibold text-orange-500">
                                        <Crown className="w-2 h-2" />
                                        PRO
                                    </span>
                                )}
                            </Label>
                            <span className="text-xs text-muted-foreground">
                                {hasShadowCustomization ? localOpacity : DEFAULT_OPACITY}%
                                {!hasShadowCustomization && ' (fixed)'}
                            </span>
                        </div>
                        <div className="relative">
                            <Slider
                                value={[hasShadowCustomization ? localOpacity : DEFAULT_OPACITY]}
                                onValueChange={([val]) => handleOpacityChange(val)}
                                min={0}
                                max={100}
                                step={1}
                                className={cn("w-full", !hasShadowCustomization && "opacity-50")}
                                disabled={!hasShadowCustomization}
                            />
                            {/* Clickable overlay for free users */}
                            {!hasShadowCustomization && (
                                <div
                                    className="absolute inset-0 cursor-pointer"
                                    onClick={() => showUpgradeModal('shadow_customization', 'Upgrade to Pro to customize shadow blur and opacity')}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
