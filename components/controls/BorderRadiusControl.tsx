'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useEditorStore } from '@/lib/store/editor-store';
import { cn } from '@/lib/utils';
import { useThrottle } from '@/hooks/useThrottle';

const RADIUS_PRESETS = [0, 8, 12, 16, 24];

export function BorderRadiusControl() {
    const { borderRadius, setBorderRadius } = useEditorStore();
    const [localRadius, setLocalRadius] = useState(borderRadius);

    const throttledSetRadius = useThrottle((value: number) => {
        setBorderRadius(value);
    }, 50);

    useEffect(() => {
        setLocalRadius(borderRadius);
    }, [borderRadius]);

    const handleRadiusChange = (value: number) => {
        setLocalRadius(value);
        throttledSetRadius(value);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider">
                    Border Radius
                </Label>
                <div className="flex items-center gap-1">
                    <Input
                        type="number"
                        value={localRadius}
                        onChange={(e) => handleRadiusChange(Number(e.target.value))}
                        className="w-16 h-7 text-xs text-right bg-zinc-800 border-zinc-700"
                        min={0}
                        max={50}
                    />
                    <span className="text-xs text-zinc-500">px</span>
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
                                ? 'bg-indigo-600 text-white'
                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        )}
                    >
                        {preset}
                    </button>
                ))}
            </div>

            {/* Visual preview */}
            <div className="flex justify-center p-3 bg-zinc-800 rounded-lg">
                <div
                    className="w-16 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 transition-all duration-150"
                    style={{ borderRadius: `${localRadius}px` }}
                />
            </div>
        </div>
    );
}
