'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useEditorStore } from '@/lib/store/editor-store';
import { SHADOW_OPTIONS } from '@/lib/constants/shadows';
import { ShadowSize } from '@/types/editor';

import { useThrottle } from '@/hooks/useThrottle';

export function ShadowControl() {
    const { shadowSize, setShadowSize, shadowIntensity, setShadowIntensity } = useEditorStore();

    // Handle hydration - use local state that syncs with store
    const [localIntensity, setLocalIntensity] = useState(50);

    const throttledSetIntensity = useThrottle((value: number) => {
        setShadowIntensity(value);
    }, 50);

    useEffect(() => {
        setLocalIntensity(shadowIntensity);
    }, [shadowIntensity]);

    const handleIntensityChange = (value: number) => {
        setLocalIntensity(value);
        throttledSetIntensity(value);
    };

    return (
        <div className="space-y-4">
            <Label className="text-zinc-400 text-xs uppercase tracking-wider">
                Shadow Preset
            </Label>

            <ToggleGroup
                type="single"
                value={shadowSize}
                onValueChange={(value) => value && setShadowSize(value as ShadowSize)}
                className="justify-start w-full"
            >
                {SHADOW_OPTIONS.map((option) => (
                    <ToggleGroupItem
                        key={option.value}
                        value={option.value}
                        className="flex-1 data-[state=on]:bg-indigo-600 data-[state=on]:text-white"
                    >
                        {option.label}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>

            {/* Shadow Intensity Slider */}
            {shadowSize !== 'none' && (
                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-zinc-400 text-xs uppercase tracking-wider">
                            Intensity
                        </Label>
                        <div className="flex items-center gap-1">
                            <Input
                                type="number"
                                value={localIntensity}
                                onChange={(e) => handleIntensityChange(Number(e.target.value))}
                                className="w-16 h-7 text-xs text-right bg-zinc-800 border-zinc-700"
                                min={0}
                                max={100}
                            />
                            <span className="text-xs text-zinc-500">%</span>
                        </div>
                    </div>

                    <Slider
                        value={[localIntensity]}
                        onValueChange={([value]) => handleIntensityChange(value)}
                        min={0}
                        max={100}
                        step={5}
                        className="w-full"
                    />
                </div>
            )}

            {/* Visual preview of shadow */}
            <div className="p-4 bg-zinc-800 rounded-lg">
                <div
                    className="w-20 h-12 mx-auto bg-white rounded-lg transition-shadow duration-200"
                    style={{
                        boxShadow:
                            shadowSize === 'none' || localIntensity === 0
                                ? 'none'
                                : shadowSize === 'sm'
                                    ? `0 ${6 * (localIntensity / 50)}px ${15 * (localIntensity / 50)}px rgba(0,0,0,${0.2 * (localIntensity / 50)})`
                                    : shadowSize === 'md'
                                        ? `0 ${12 * (localIntensity / 50)}px ${30 * (localIntensity / 50)}px rgba(0,0,0,${0.3 * (localIntensity / 50)})`
                                        : shadowSize === 'lg'
                                            ? `0 ${20 * (localIntensity / 50)}px ${50 * (localIntensity / 50)}px rgba(0,0,0,${0.4 * (localIntensity / 50)})`
                                            : `0 ${30 * (localIntensity / 50)}px ${80 * (localIntensity / 50)}px rgba(0,0,0,${0.5 * (localIntensity / 50)})`,
                    }}
                />
                <p className="text-xs text-zinc-500 text-center mt-2">Preview</p>
            </div>
        </div>
    );
}
