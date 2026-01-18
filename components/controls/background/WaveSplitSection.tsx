'use client';

import { useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pipette } from 'lucide-react';
import { SOLID_COLORS, PRESET_GRADIENTS } from '@/lib/constants/gradients';
import { ColorButton } from './ColorButton';
import { GradientPresetButton } from './GradientPresetButton';

interface WaveSplitSectionProps {
    waveSplitFlipped: boolean;
    backgroundColor: string;
    gradientColors: [string, string];
    gradientAngle: number;
    onToggleWaveSplitFlip: () => void;
    onUpdateBackgroundColor: (color: string) => void;
    onUpdateGradientColors: (colors: [string, string], angle: number) => void;
}

export function WaveSplitSection({
    waveSplitFlipped,
    backgroundColor,
    gradientColors,
    gradientAngle,
    onToggleWaveSplitFlip,
    onUpdateBackgroundColor,
    onUpdateGradientColors,
}: WaveSplitSectionProps) {
    // Memoized handlers
    const handleSolidColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdateBackgroundColor(e.target.value);
    }, [onUpdateBackgroundColor]);

    const handleGradientStartChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdateGradientColors([e.target.value, gradientColors[1]], gradientAngle);
    }, [gradientColors, gradientAngle, onUpdateGradientColors]);

    const handleGradientEndChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdateGradientColors([gradientColors[0], e.target.value], gradientAngle);
    }, [gradientColors, gradientAngle, onUpdateGradientColors]);

    const handleGradientAngleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdateGradientColors(gradientColors, parseInt(e.target.value));
    }, [gradientColors, onUpdateGradientColors]);

    return (
        <div className="space-y-4">
            {/* Flip Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border">
                <div>
                    <Label className="text-xs font-medium">Orientation</Label>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                        {waveSplitFlipped ? 'Gradient bottom, Solid top' : 'Gradient top, Solid bottom'}
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleWaveSplitFlip}
                    className="h-8"
                    aria-label={`Flip orientation. Currently: ${waveSplitFlipped ? 'Gradient bottom, Solid top' : 'Gradient top, Solid bottom'}`}
                >
                    Flip
                </Button>
            </div>

            {/* Solid Color */}
            <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">
                    {waveSplitFlipped ? 'Top' : 'Bottom'} Half (Solid)
                </Label>
                <div className="grid grid-cols-8 gap-1.5" role="listbox" aria-label="Solid colors">
                    {SOLID_COLORS.map((color) => (
                        <ColorButton
                            key={color}
                            color={color}
                            isSelected={backgroundColor === color}
                            isPremium={false}
                            onClick={() => onUpdateBackgroundColor(color)}
                        />
                    ))}
                </div>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input
                            type="color"
                            id="wave-solid-color"
                            value={backgroundColor}
                            onChange={handleSolidColorChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            aria-label="Pick solid color"
                        />
                        <Button variant="outline" size="sm" className="w-full justify-start" aria-hidden="true">
                            <Pipette className="w-4 h-4 mr-2" />
                            Picker
                            <div
                                className="w-4 h-4 rounded ml-auto border border-border"
                                style={{ backgroundColor: backgroundColor }}
                            />
                        </Button>
                    </div>
                    <Input
                        value={backgroundColor}
                        onChange={handleSolidColorChange}
                        className="w-28 font-mono text-xs uppercase"
                        placeholder="#HEX"
                        aria-label="Solid color hex value"
                    />
                </div>
            </div>

            {/* Gradient */}
            <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">
                    {waveSplitFlipped ? 'Bottom' : 'Top'} Half (Gradient)
                </Label>

                {/* Custom Gradient Controls */}
                <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                    <Label className="text-[10px] uppercase text-muted-foreground">Custom Gradient</Label>
                    <div className="flex gap-2">
                        {/* Start Color */}
                        <div className="space-y-1 flex-1">
                            <div className="relative">
                                <input
                                    type="color"
                                    id="wave-gradient-start"
                                    value={gradientColors[0]}
                                    onChange={handleGradientStartChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    aria-label="Pick gradient start color"
                                />
                                <Button variant="outline" size="sm" className="w-full h-8 px-2 justify-between" aria-hidden="true">
                                    <span className="text-[10px]">Start</span>
                                    <div
                                        className="w-3 h-3 rounded border border-zinc-600"
                                        style={{ backgroundColor: gradientColors[0] }}
                                    />
                                </Button>
                            </div>
                            <Input
                                value={gradientColors[0]}
                                onChange={handleGradientStartChange}
                                className="h-7 text-[10px] font-mono px-2"
                                aria-label="Gradient start color hex"
                            />
                        </div>

                        {/* End Color */}
                        <div className="space-y-1 flex-1">
                            <div className="relative">
                                <input
                                    type="color"
                                    id="wave-gradient-end"
                                    value={gradientColors[1]}
                                    onChange={handleGradientEndChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    aria-label="Pick gradient end color"
                                />
                                <Button variant="outline" size="sm" className="w-full h-8 px-2 justify-between" aria-hidden="true">
                                    <span className="text-[10px]">End</span>
                                    <div
                                        className="w-3 h-3 rounded border border-border"
                                        style={{ backgroundColor: gradientColors[1] }}
                                    />
                                </Button>
                            </div>
                            <Input
                                value={gradientColors[1]}
                                onChange={handleGradientEndChange}
                                className="h-7 text-[10px] font-mono px-2"
                                aria-label="Gradient end color hex"
                            />
                        </div>
                    </div>
                </div>

                {/* Gradient Angle Control */}
                <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="wave-gradient-angle" className="text-[10px] uppercase text-muted-foreground">Angle</Label>
                        <span className="text-xs text-muted-foreground" aria-live="polite">{gradientAngle}°</span>
                    </div>
                    <input
                        id="wave-gradient-angle"
                        type="range"
                        min="0"
                        max="360"
                        value={gradientAngle}
                        onChange={handleGradientAngleChange}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        aria-label="Gradient angle"
                    />
                </div>

                {/* Gradient Presets */}
                <div>
                    <Label className="text-muted-foreground text-xs mb-2 block">
                        Gradient Presets ({PRESET_GRADIENTS.length})
                    </Label>
                    <div className="grid grid-cols-6 gap-2" role="listbox" aria-label="Gradient presets">
                        {PRESET_GRADIENTS.map((gradient) => (
                            <GradientPresetButton
                                key={gradient.name}
                                gradient={gradient}
                                isSelected={
                                    gradientColors[0] === gradient.colors[0] &&
                                    gradientColors[1] === gradient.colors[1]
                                }
                                isPremium={false}
                                onClick={() => onUpdateGradientColors(gradient.colors, gradient.angle)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
