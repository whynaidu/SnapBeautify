'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pipette } from 'lucide-react';
import { SOLID_COLORS } from '@/lib/constants/gradients';
import { ColorButton } from './ColorButton';
import { FREE_SOLID_COLORS } from './types';

interface SolidColorSectionProps {
    backgroundColor: string;
    isPro: boolean;
    onColorClick: (color: string) => void;
    onColorChange: (color: string) => void;
}

export function SolidColorSection({
    backgroundColor,
    isPro,
    onColorClick,
    onColorChange,
}: SolidColorSectionProps) {
    return (
        <div className="space-y-3">
            <Label className="text-muted-foreground text-xs mb-2 block">
                Colors ({isPro ? SOLID_COLORS.length : `${FREE_SOLID_COLORS} free`})
            </Label>
            <div className="grid grid-cols-8 gap-1.5" role="listbox" aria-label="Solid colors">
                {SOLID_COLORS.map((color, index) => (
                    <ColorButton
                        key={color}
                        color={color}
                        isSelected={backgroundColor === color}
                        isPremium={index >= FREE_SOLID_COLORS && !isPro}
                        onClick={() => onColorClick(color)}
                    />
                ))}
            </div>

            {/* Custom Color Picker & Input */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <input
                        type="color"
                        id="solid-color-picker"
                        value={backgroundColor}
                        onChange={(e) => onColorChange(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        aria-label="Pick a custom color"
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
                    id="solid-color-input"
                    value={backgroundColor}
                    onChange={(e) => onColorChange(e.target.value)}
                    className="w-28 font-mono text-xs uppercase"
                    placeholder="#HEX or RGB"
                    aria-label="Enter color hex value"
                />
            </div>
        </div>
    );
}
