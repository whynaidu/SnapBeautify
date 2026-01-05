'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/lib/store/editor-store';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

import { useThrottle } from '@/hooks/useThrottle';

export function ScaleControl() {
    const { imageScale, setImageScale } = useEditorStore();

    // Handle hydration
    const [localScale, setLocalScale] = useState(100);

    const throttledSetScale = useThrottle((value: number) => {
        setImageScale(value / 100);
    }, 50);

    useEffect(() => {
        setLocalScale(Math.round(imageScale * 100));
    }, [imageScale]);

    const handleScaleChange = (value: number) => {
        const clampedValue = Math.max(10, Math.min(200, value));
        setLocalScale(clampedValue);
        throttledSetScale(clampedValue);
    };

    const handleZoomIn = () => {
        handleScaleChange(localScale + 10);
    };

    const handleZoomOut = () => {
        handleScaleChange(localScale - 10);
    };

    const handleReset = () => {
        handleScaleChange(100);
    };

    return (
        <div className="space-y-3">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                Image Scale
            </Label>

            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={localScale <= 10}
                    className="w-9 h-9 p-0"
                >
                    <ZoomOut className="w-4 h-4" />
                </Button>

                <Slider
                    value={[localScale]}
                    onValueChange={([value]) => handleScaleChange(value)}
                    min={10}
                    max={200}
                    step={5}
                    className="flex-1"
                />

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={localScale >= 200}
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
                        min={10}
                        max={200}
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
