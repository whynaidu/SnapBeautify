'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useEditorStore } from '@/lib/store/editor-store';
import { cn } from '@/lib/utils';

const RADIUS_PRESETS = [0, 8, 12, 16, 24];

export function BorderRadiusControl() {
    const { borderRadius, setBorderRadius } = useEditorStore();

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-zinc-400 text-xs uppercase tracking-wider">
                    Border Radius
                </Label>
                <div className="flex items-center gap-1">
                    <Input
                        type="number"
                        value={borderRadius}
                        onChange={(e) => setBorderRadius(Number(e.target.value))}
                        className="w-16 h-7 text-xs text-right bg-zinc-800 border-zinc-700"
                        min={0}
                        max={50}
                    />
                    <span className="text-xs text-zinc-500">px</span>
                </div>
            </div>

            <Slider
                value={[borderRadius]}
                onValueChange={([value]) => setBorderRadius(value)}
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
                    style={{ borderRadius: `${borderRadius}px` }}
                />
            </div>
        </div>
    );
}
