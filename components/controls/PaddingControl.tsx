'use client';

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useEditorStore } from '@/lib/store/editor-store';
import { cn } from '@/lib/utils';
import { useThrottle } from '@/hooks/useThrottle';

const PADDING_PRESETS = [32, 48, 64, 96, 128];

export function PaddingControl() {
    const { padding, setPadding } = useEditorStore();
    const [localPadding, setLocalPadding] = useState(padding);

    const throttledSetPadding = useThrottle((value: number) => {
        setPadding(value);
    }, 50);

    useEffect(() => {
        setLocalPadding(padding);
    }, [padding]);

    const handlePaddingChange = (value: number) => {
        setLocalPadding(value);
        throttledSetPadding(value);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider">
                    Padding
                </Label>
                <div className="flex items-center gap-1">
                    <Input
                        type="number"
                        value={localPadding}
                        onChange={(e) => handlePaddingChange(Number(e.target.value))}
                        className="w-16 h-7 text-xs text-right bg-zinc-800 border-zinc-700"
                        min={0}
                        max={200}
                    />
                    <span className="text-xs text-zinc-500">px</span>
                </div>
            </div>

            <Slider
                value={[localPadding]}
                onValueChange={([value]) => handlePaddingChange(value)}
                min={0}
                max={200}
                step={4}
                className="w-full"
            />

            {/* Quick presets */}
            <div className="flex gap-2">
                {PADDING_PRESETS.map((preset) => (
                    <button
                        key={preset}
                        onClick={() => setPadding(preset)}
                        className={cn(
                            'flex-1 py-1.5 text-xs rounded transition-colors',
                            padding === preset
                                ? 'bg-indigo-600 text-white'
                                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        )}
                    >
                        {preset}
                    </button>
                ))}
            </div>
        </div>
    );
}
