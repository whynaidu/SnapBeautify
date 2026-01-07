'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useEditorStore } from '@/lib/store/editor-store';
import { cn } from '@/lib/utils';

const RADIUS_PRESETS = [0, 8, 12, 16, 24];

export function BorderRadiusControl() {
    const { borderRadius, setBorderRadius } = useEditorStore();
    const [localRadius, setLocalRadius] = useState(borderRadius);

    useEffect(() => {
        setLocalRadius(borderRadius);
    }, [borderRadius]);

    const handleRadiusChange = (value: number) => {
        setLocalRadius(value);
        // Update immediately - Canvas throttle handles performance
        setBorderRadius(value);
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
                        onChange={(e) => handleRadiusChange(Number(e.target.value))}
                        className="w-16 h-7 text-xs text-right bg-input border-border"
                        min={0}
                        max={50}
                    />
                    <span className="text-xs text-muted-foreground">px</span>
                </div>
            </div>

            <Slider
                value={[localRadius]}
                onValueChange={([value]) => handleRadiusChange(value)}
                min={0}
                max={50}
                step={2}
                className="w-full"
            />

            {/* Quick presets */}
            <div className="flex gap-2">
                {RADIUS_PRESETS.map((preset) => (
                    <button
                        key={preset}
                        onClick={() => setBorderRadius(preset)}
                        className={cn(
                            'flex-1 py-1.5 text-xs rounded transition-colors',
                            borderRadius === preset
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                    >
                        {preset}
                    </button>
                ))}
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
