'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Crown } from 'lucide-react';
import { PRESET_GRADIENTS, MESH_GRADIENTS } from '@/lib/constants/gradients';
import { GradientPresetButton } from './GradientPresetButton';
import { MeshGradientButton } from './MeshGradientButton';
import { FREE_GRADIENTS, FREE_MESH_GRADIENTS } from './types';

interface GradientSectionProps {
    isGradientActive: boolean;
    isMeshActive: boolean;
    gradientColors: [string, string];
    gradientAngle: number;
    meshGradientCSS: string;
    isPro: boolean;
    onGradientClick: (colors: [string, string], angle: number) => void;
    onMeshClick: (css: string) => void;
    onGradientChange: (colors: [string, string], angle: number) => void;
}

export function GradientSection({
    isGradientActive,
    isMeshActive,
    gradientColors,
    gradientAngle,
    meshGradientCSS,
    isPro,
    onGradientClick,
    onMeshClick,
    onGradientChange,
}: GradientSectionProps) {
    return (
        <div className="space-y-4">
            {/* Custom Gradient Controls - Only show when standard gradient is active */}
            {isGradientActive && (
                <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border relative">
                    <Label className="text-[10px] uppercase text-muted-foreground flex items-center gap-2">
                        Custom Gradient
                        {!isPro && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-500/20 rounded text-[10px] font-semibold text-orange-500">
                                <Crown className="w-2.5 h-2.5" aria-hidden="true" />
                                PRO
                            </span>
                        )}
                    </Label>

                    <div className="flex gap-2">
                        {/* Start Color */}
                        <div className="space-y-1 flex-1">
                            <div className="relative">
                                <input
                                    type="color"
                                    id="gradient-start-color"
                                    value={gradientColors[0]}
                                    onChange={(e) => onGradientChange([e.target.value, gradientColors[1]], gradientAngle)}
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
                                id="gradient-start-input"
                                value={gradientColors[0]}
                                onChange={(e) => onGradientChange([e.target.value, gradientColors[1]], gradientAngle)}
                                className="h-7 text-[10px] font-mono px-2"
                                aria-label="Gradient start color hex value"
                            />
                        </div>

                        {/* End Color */}
                        <div className="space-y-1 flex-1">
                            <div className="relative">
                                <input
                                    type="color"
                                    id="gradient-end-color"
                                    value={gradientColors[1]}
                                    onChange={(e) => onGradientChange([gradientColors[0], e.target.value], gradientAngle)}
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
                                id="gradient-end-input"
                                value={gradientColors[1]}
                                onChange={(e) => onGradientChange([gradientColors[0], e.target.value], gradientAngle)}
                                className="h-7 text-[10px] font-mono px-2"
                                aria-label="Gradient end color hex value"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div>
                <Label className="text-muted-foreground text-xs mb-2 block">
                    Gradient Presets ({isPro ? PRESET_GRADIENTS.length : `${FREE_GRADIENTS} free`})
                </Label>
                <div className="grid grid-cols-6 gap-2" role="listbox" aria-label="Gradient presets">
                    {PRESET_GRADIENTS.map((gradient, index) => (
                        <GradientPresetButton
                            key={gradient.name}
                            gradient={gradient}
                            isSelected={
                                isGradientActive &&
                                gradientColors[0] === gradient.colors[0] &&
                                gradientColors[1] === gradient.colors[1]
                            }
                            isPremium={index >= FREE_GRADIENTS && !isPro}
                            onClick={() => onGradientClick(gradient.colors, gradient.angle)}
                        />
                    ))}
                </div>
            </div>

            {/* Gradient Angle Slider - Show for regular gradients */}
            {isGradientActive && (
                <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="gradient-angle" className="text-[10px] uppercase text-muted-foreground">Gradient Angle</Label>
                        <span className="text-xs text-muted-foreground" aria-live="polite">{gradientAngle}°</span>
                    </div>
                    <input
                        id="gradient-angle"
                        type="range"
                        min="0"
                        max="360"
                        value={gradientAngle}
                        onChange={(e) => onGradientChange(gradientColors, parseInt(e.target.value))}
                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        aria-label="Gradient angle"
                    />
                </div>
            )}

            <div>
                <Label className="text-muted-foreground text-xs mb-2 block">
                    Mesh Gradients ({isPro ? MESH_GRADIENTS.length : `${FREE_MESH_GRADIENTS} free`})
                </Label>
                <div className="grid grid-cols-5 gap-2" role="listbox" aria-label="Mesh gradients">
                    {MESH_GRADIENTS.map((mesh, index) => (
                        <MeshGradientButton
                            key={mesh.name}
                            mesh={mesh}
                            isSelected={isMeshActive && meshGradientCSS === mesh.css}
                            isPremium={index >= FREE_MESH_GRADIENTS && !isPro}
                            onClick={() => onMeshClick(mesh.css)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
