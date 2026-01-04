'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEditorStore } from '@/lib/store/editor-store';
import { PRESET_GRADIENTS, SOLID_COLORS, MESH_GRADIENTS } from '@/lib/constants/gradients';
import { cn } from '@/lib/utils';
import { Check, Pipette } from 'lucide-react';

export function BackgroundPicker() {
    const {
        backgroundType,
        backgroundColor,
        gradientColors,
        meshGradientCSS,
        setBackgroundColor,
        setGradient,
        setMeshGradient,
        setBackgroundType,
    } = useEditorStore();

    // Check if mesh gradient is currently active
    const isMeshActive = backgroundType === 'mesh';
    // Check if regular gradient is active (not mesh)
    const isGradientActive = backgroundType === 'gradient';

    return (
        <div className="space-y-4">
            <Label className="text-zinc-400 text-xs uppercase tracking-wider">
                Background
            </Label>

            {/* Type Selector */}
            <div className="grid grid-cols-3 gap-2">
                <Button
                    variant={backgroundType === 'solid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBackgroundType('solid')}
                    className={cn(
                        'flex-1',
                        backgroundType === 'solid' && 'bg-indigo-600 hover:bg-indigo-700'
                    )}
                >
                    Solid
                </Button>
                <Button
                    variant={backgroundType === 'gradient' || backgroundType === 'mesh' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBackgroundType('gradient')}
                    className={cn(
                        'flex-1',
                        (backgroundType === 'gradient' || backgroundType === 'mesh') && 'bg-indigo-600 hover:bg-indigo-700'
                    )}
                >
                    Gradient
                </Button>
                <Button
                    variant={backgroundType === 'transparent' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBackgroundType('transparent')}
                    className={cn(
                        'flex-1',
                        backgroundType === 'transparent' && 'bg-indigo-600 hover:bg-indigo-700'
                    )}
                >
                    None
                </Button>
            </div>

            {/* Solid Colors */}
            {backgroundType === 'solid' && (
                <div className="space-y-3">
                    <div className="grid grid-cols-8 gap-1.5">
                        {SOLID_COLORS.map((color) => (
                            <button
                                key={color}
                                onClick={() => setBackgroundColor(color)}
                                className={cn(
                                    'w-full aspect-square rounded-md border-2 transition-all',
                                    backgroundColor === color
                                        ? 'border-white scale-110 z-10'
                                        : 'border-transparent hover:scale-105'
                                )}
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>

                    {/* Custom Color Picker */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full">
                                <Pipette className="w-4 h-4 mr-2" />
                                Custom Color
                                <div
                                    className="w-4 h-4 rounded ml-auto border border-zinc-600"
                                    style={{ backgroundColor: backgroundColor }}
                                />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-3" align="start">
                            <input
                                type="color"
                                value={backgroundColor}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                className="w-full h-32 cursor-pointer rounded border-0"
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            )}

            {/* Gradients - Show for both 'gradient' and 'mesh' background types */}
            {(backgroundType === 'gradient' || backgroundType === 'mesh') && (
                <div className="space-y-4">
                    <div>
                        <Label className="text-zinc-500 text-xs mb-2 block">Presets</Label>
                        <div className="grid grid-cols-5 gap-2">
                            {PRESET_GRADIENTS.map((gradient) => {
                                // Only show as selected if it's a regular gradient (not mesh) AND colors match
                                const isSelected =
                                    isGradientActive &&
                                    gradientColors[0] === gradient.colors[0] &&
                                    gradientColors[1] === gradient.colors[1];

                                return (
                                    <button
                                        key={gradient.name}
                                        onClick={() => setGradient(gradient.colors, gradient.angle)}
                                        className={cn(
                                            'relative w-full aspect-square rounded-lg transition-all',
                                            isSelected
                                                ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-105'
                                                : 'hover:scale-105'
                                        )}
                                        style={{
                                            background: `linear-gradient(${gradient.angle}deg, ${gradient.colors[0]}, ${gradient.colors[1]})`,
                                        }}
                                        title={gradient.name}
                                    >
                                        {isSelected && (
                                            <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow-lg" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <Label className="text-zinc-500 text-xs mb-2 block">Mesh Gradients</Label>
                        <div className="grid grid-cols-4 gap-2">
                            {MESH_GRADIENTS.map((mesh, index) => {
                                // Only show as selected if it's a mesh type AND the CSS matches
                                const isSelected = isMeshActive && meshGradientCSS === mesh.css;
                                return (
                                    <button
                                        key={mesh.name}
                                        onClick={() => setMeshGradient(mesh.css)}
                                        className={cn(
                                            'relative w-full aspect-square rounded-lg transition-all overflow-hidden',
                                            isSelected
                                                ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-105'
                                                : 'hover:scale-105'
                                        )}
                                        style={{ background: mesh.css, backgroundColor: '#0f172a' }}
                                        title={mesh.name}
                                    >
                                        {isSelected && (
                                            <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow-lg" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Transparent */}
            {backgroundType === 'transparent' && (
                <div className="p-4 bg-zinc-800 rounded-lg text-center">
                    <div
                        className="w-12 h-12 mx-auto rounded-lg mb-2"
                        style={{
                            backgroundImage: `
                linear-gradient(45deg, #3f3f46 25%, transparent 25%),
                linear-gradient(-45deg, #3f3f46 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #3f3f46 75%),
                linear-gradient(-45deg, transparent 75%, #3f3f46 75%)
              `,
                            backgroundSize: '8px 8px',
                            backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                        }}
                    />
                    <p className="text-xs text-zinc-500">Exports with transparent background (PNG)</p>
                </div>
            )}
        </div>
    );
}
