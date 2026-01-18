'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Check, Pipette, X } from 'lucide-react';
import { PRESET_GRADIENTS } from '@/lib/constants/gradients';
import { GradientPresetButton } from './GradientPresetButton';
import { MAX_LOGO_FILE_SIZE } from './types';
import { toast } from 'sonner';

interface LogoPatternSectionProps {
    logoPatternImage: HTMLImageElement | null;
    logoPatternOpacity: number;
    logoPatternSize: number;
    logoPatternSpacing: number;
    gradientColors: [string, string];
    gradientAngle: number;
    onLogoPattern: (img: HTMLImageElement) => void;
    onClearLogoPattern: () => void;
    onLogoPatternOpacity: (value: number) => void;
    onLogoPatternSize: (value: number) => void;
    onLogoPatternSpacing: (value: number) => void;
    onUpdateGradientColors: (colors: [string, string], angle: number) => void;
}

export function LogoPatternSection({
    logoPatternImage,
    logoPatternOpacity,
    logoPatternSize,
    logoPatternSpacing,
    gradientColors,
    gradientAngle,
    onLogoPattern,
    onClearLogoPattern,
    onLogoPatternOpacity,
    onLogoPatternSize,
    onLogoPatternSpacing,
    onUpdateGradientColors,
}: LogoPatternSectionProps) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // File size validation
        if (file.size > MAX_LOGO_FILE_SIZE) {
            toast.error(`File too large. Maximum size is ${MAX_LOGO_FILE_SIZE / (1024 * 1024)}MB`);
            e.target.value = ''; // Reset input
            return;
        }

        // File type validation
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                onLogoPattern(img);
            };
            img.onerror = () => {
                toast.error('Failed to load image');
            };
            img.src = event.target?.result as string;
        };
        reader.onerror = () => {
            toast.error('Failed to read file');
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-4">
            {/* Logo Upload */}
            <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                <Label htmlFor="logo-upload" className="text-[10px] uppercase text-muted-foreground">
                    Upload Logo (max 5MB)
                </Label>
                <div className="relative">
                    <input
                        type="file"
                        id="logo-upload"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        aria-describedby="logo-upload-hint"
                    />
                    <Button variant="outline" size="sm" className="w-full justify-start" aria-hidden="true">
                        {logoPatternImage ? (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Logo Uploaded
                            </>
                        ) : (
                            <>
                                <Pipette className="w-4 h-4 mr-2" />
                                Choose File
                            </>
                        )}
                    </Button>
                </div>
                <p id="logo-upload-hint" className="sr-only">
                    Upload an image file to use as a logo pattern. Maximum file size is 5MB.
                </p>
                {logoPatternImage && (
                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded border border-border">
                        <img
                            src={logoPatternImage.src}
                            alt="Logo preview"
                            className="w-10 h-10 object-contain rounded border border-border bg-background"
                        />
                        <div className="flex-1 text-xs text-muted-foreground">
                            {logoPatternImage.width} × {logoPatternImage.height}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearLogoPattern}
                            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                            title="Remove logo"
                            aria-label="Remove uploaded logo"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Gradient Background Controls */}
            <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                <Label className="text-[10px] uppercase text-muted-foreground">Background Gradient</Label>

                {/* Custom Gradient Colors */}
                <div className="flex gap-2">
                    {/* Start Color */}
                    <div className="space-y-1 flex-1">
                        <div className="relative">
                            <input
                                type="color"
                                id="logo-gradient-start"
                                value={gradientColors[0]}
                                onChange={(e) => onUpdateGradientColors([e.target.value, gradientColors[1]], gradientAngle)}
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
                            onChange={(e) => onUpdateGradientColors([e.target.value, gradientColors[1]], gradientAngle)}
                            className="h-7 text-[10px] font-mono px-2"
                            aria-label="Gradient start color hex"
                        />
                    </div>

                    {/* End Color */}
                    <div className="space-y-1 flex-1">
                        <div className="relative">
                            <input
                                type="color"
                                id="logo-gradient-end"
                                value={gradientColors[1]}
                                onChange={(e) => onUpdateGradientColors([gradientColors[0], e.target.value], gradientAngle)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                aria-label="Pick gradient end color"
                            />
                            <Button variant="outline" size="sm" className="w-full h-8 px-2 justify-between" aria-hidden="true">
                                <span className="text-[10px]">End</span>
                                <div
                                    className="w-3 h-3 rounded border border-zinc-600"
                                    style={{ backgroundColor: gradientColors[1] }}
                                />
                            </Button>
                        </div>
                        <Input
                            value={gradientColors[1]}
                            onChange={(e) => onUpdateGradientColors([gradientColors[0], e.target.value], gradientAngle)}
                            className="h-7 text-[10px] font-mono px-2"
                            aria-label="Gradient end color hex"
                        />
                    </div>
                </div>
            </div>

            {/* Gradient Angle Control */}
            <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                <div className="flex justify-between items-center">
                    <Label htmlFor="logo-gradient-angle" className="text-[10px] uppercase text-muted-foreground">Gradient Angle</Label>
                    <span className="text-xs text-muted-foreground" aria-live="polite">{gradientAngle}°</span>
                </div>
                <input
                    id="logo-gradient-angle"
                    type="range"
                    min="0"
                    max="360"
                    value={gradientAngle}
                    onChange={(e) => onUpdateGradientColors(gradientColors, parseInt(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
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

            {/* Logo Opacity */}
            <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                <div className="flex justify-between items-center">
                    <Label htmlFor="logo-opacity" className="text-[10px] uppercase text-muted-foreground">Logo Opacity</Label>
                    <span className="text-xs text-muted-foreground" aria-live="polite">{Math.round(logoPatternOpacity * 100)}%</span>
                </div>
                <Slider
                    id="logo-opacity"
                    value={[logoPatternOpacity * 100]}
                    onValueChange={([value]) => onLogoPatternOpacity(value / 100)}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                    aria-label="Logo opacity"
                />
            </div>

            {/* Logo Size */}
            <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                <div className="flex justify-between items-center">
                    <Label htmlFor="logo-size" className="text-[10px] uppercase text-muted-foreground">Logo Size</Label>
                    <span className="text-xs text-muted-foreground" aria-live="polite">{Math.round(logoPatternSize * 100)}%</span>
                </div>
                <Slider
                    id="logo-size"
                    value={[logoPatternSize * 100]}
                    onValueChange={([value]) => onLogoPatternSize(value / 100)}
                    min={10}
                    max={100}
                    step={1}
                    className="w-full"
                    aria-label="Logo size"
                />
            </div>

            {/* Logo Spacing */}
            <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                <div className="flex justify-between items-center">
                    <Label htmlFor="logo-spacing" className="text-[10px] uppercase text-muted-foreground">Logo Spacing</Label>
                    <span className="text-xs text-muted-foreground" aria-live="polite">{logoPatternSpacing.toFixed(1)}x</span>
                </div>
                <Slider
                    id="logo-spacing"
                    value={[logoPatternSpacing * 10]}
                    onValueChange={([value]) => onLogoPatternSpacing(value / 10)}
                    min={10}
                    max={30}
                    step={1}
                    className="w-full"
                    aria-label="Logo spacing"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                    Adjust spacing between logos in the grid
                </p>
            </div>
        </div>
    );
}
