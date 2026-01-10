'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/lib/store/editor-store';
import { useSubscription } from '@/lib/subscription/context';
import { ZoomIn, ZoomOut, RotateCcw, Crown } from 'lucide-react';

export function ScaleControl() {
    const { imageScale, setImageScale } = useEditorStore();

    // Handle hydration
    const [localScale, setLocalScale] = useState(100);

    // Subscription access (for PRO badge only)
    const { isPro } = useSubscription();

    // Full range available for all users (watermark will apply for non-pro)
    const MIN_SCALE = 10;
    const MAX_SCALE = 200;

    useEffect(() => {
        setLocalScale(Math.round(imageScale * 100));
    }, [imageScale]);

    const handleScaleChange = (value: number) => {
        const clampedValue = Math.max(MIN_SCALE, Math.min(MAX_SCALE, value));
        setLocalScale(clampedValue);
        setImageScale(clampedValue / 100);
    };

    const handleZoomIn = () => {
        const newValue = Math.min(localScale + 10, MAX_SCALE);
        handleScaleChange(newValue);
    };

    const handleZoomOut = () => {
        const newValue = Math.max(localScale - 10, MIN_SCALE);
        handleScaleChange(newValue);
    };

    const handleReset = () => {
        handleScaleChange(100);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                    Image Scale
                </Label>
                {!isPro && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-500/20 rounded text-[9px] font-semibold text-orange-500">
                        <Crown className="w-2 h-2" />
                        PRO
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={localScale <= MIN_SCALE}
                    className="w-9 h-9 p-0"
                >
                    <ZoomOut className="w-4 h-4" />
                </Button>

                <Slider
                    value={[localScale]}
                    onValueChange={([value]) => handleScaleChange(value)}
                    min={MIN_SCALE}
                    max={MAX_SCALE}
                    step={5}
                    className="flex-1"
                />

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={localScale >= MAX_SCALE}
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
                        min={MIN_SCALE}
                        max={MAX_SCALE}
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
        </div>
    );
}
