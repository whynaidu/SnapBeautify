'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useEditorStore } from '@/lib/store/editor-store';
import { PRESET_GRADIENTS, SOLID_COLORS, MESH_GRADIENTS, TEXT_PATTERNS } from '@/lib/constants/gradients';
import { cn } from '@/lib/utils';
import { Check, Pipette } from 'lucide-react';

export function BackgroundPicker() {
    const {
        backgroundType,
        backgroundColor,
        gradientColors,
        gradientAngle,
        meshGradientCSS,
        textPatternText,
        textPatternPositions,
        textPatternFontFamily,
        textPatternFontSize,
        textPatternFontWeight,
        setBackgroundColor,
        setGradient,
        updateGradientColors,
        setMeshGradient,
        setTextPatternText,
        toggleTextPatternPosition,
        setTextPatternFontFamily,
        setTextPatternFontSize,
        setTextPatternFontWeight,
        setBackgroundType,
    } = useEditorStore();

    // Check if mesh gradient is currently active
    const isMeshActive = backgroundType === 'mesh';
    // Check if regular gradient is active (not mesh)
    const isGradientActive = backgroundType === 'gradient';
    // Check if text pattern is active
    const isTextPatternActive = backgroundType === 'textPattern';

    return (
        <div className="space-y-4">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                Background
            </Label>

            {/* Type Selector */}
            <div className="grid grid-cols-4 gap-2">
                <Button
                    variant={backgroundType === 'solid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBackgroundType('solid')}
                    className={cn(
                        'flex-1',
                        backgroundType === 'solid' && 'bg-primary hover:bg-primary/90 text-primary-foreground'
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
                        (backgroundType === 'gradient' || backgroundType === 'mesh') && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    )}
                >
                    Gradient
                </Button>
                <Button
                    variant={backgroundType === 'textPattern' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBackgroundType('textPattern')}
                    className={cn(
                        'flex-1',
                        backgroundType === 'textPattern' && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    )}
                >
                    Text
                </Button>
                <Button
                    variant={backgroundType === 'transparent' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBackgroundType('transparent')}
                    className={cn(
                        'flex-1',
                        backgroundType === 'transparent' && 'bg-primary hover:bg-primary/90 text-primary-foreground'
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
                                            ? 'border-foreground/80 scale-110 z-10'
                                            : 'border-transparent hover:scale-105'
                                    )}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                    </div>

                    {/* Custom Color Picker & Input */}
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="color"
                                value={backgroundColor}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <Button variant="outline" size="sm" className="w-full justify-start">
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
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-28 font-mono text-xs uppercase"
                            placeholder="#HEX or RGB"
                        />
                    </div>
                </div>
            )}

            {/* Gradients - Show for both 'gradient' and 'mesh' background types */}
            {(backgroundType === 'gradient' || backgroundType === 'mesh') && (
                <div className="space-y-4">
                    {/* Custom Gradient Controls - Only show when standard gradient is active */}
                    {isGradientActive && (
                        <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                            <Label className="text-[10px] uppercase text-muted-foreground">Custom Gradient</Label>

                            <div className="flex gap-2">
                                {/* Start Color */}
                                <div className="space-y-1 flex-1">
                                    <div className="relative">
                                        <input
                                            type="color"
                                            value={gradientColors[0]}
                                            onChange={(e) => setGradient([e.target.value, gradientColors[1]], gradientAngle)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <Button variant="outline" size="sm" className="w-full h-8 px-2 justify-between">
                                            <span className="text-[10px]">Start</span>
                                            <div
                                                className="w-3 h-3 rounded border border-zinc-600"
                                                style={{ backgroundColor: gradientColors[0] }}
                                            />
                                        </Button>
                                    </div>
                                    <Input
                                        value={gradientColors[0]}
                                        onChange={(e) => setGradient([e.target.value, gradientColors[1]], gradientAngle)}
                                        className="h-7 text-[10px] font-mono px-2"
                                    />
                                </div>

                                {/* End Color */}
                                <div className="space-y-1 flex-1">
                                    <div className="relative">
                                        <input
                                            type="color"
                                            value={gradientColors[1]}
                                            onChange={(e) => setGradient([gradientColors[0], e.target.value], gradientAngle)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <Button variant="outline" size="sm" className="w-full h-8 px-2 justify-between">
                                            <span className="text-[10px]">End</span>
                                            <div
                                                className="w-3 h-3 rounded border border-border"
                                                style={{ backgroundColor: gradientColors[1] }}
                                            />
                                        </Button>
                                    </div>
                                    <Input
                                        value={gradientColors[1]}
                                        onChange={(e) => setGradient([gradientColors[0], e.target.value], gradientAngle)}
                                        className="h-7 text-[10px] font-mono px-2"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <Label className="text-muted-foreground text-xs mb-2 block">
                            Gradient Presets ({PRESET_GRADIENTS.length})
                        </Label>
                        <div className="grid grid-cols-6 gap-2">
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
                                                'relative w-full aspect-square rounded-lg transition-all group',
                                                isSelected
                                                    ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-105'
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
                                            <span className="absolute bottom-0 left-0 right-0 text-[8px] text-white bg-black/50 backdrop-blur-sm px-1 py-0.5 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity truncate">
                                                {gradient.name}
                                            </span>
                                        </button>
                                    );
                                })}
                        </div>
                    </div>

                    <div>
                        <Label className="text-muted-foreground text-xs mb-2 block">
                            Mesh Gradients ({MESH_GRADIENTS.length})
                        </Label>
                        <div className="grid grid-cols-5 gap-2">
                                {MESH_GRADIENTS.map((mesh, index) => {
                                    // Only show as selected if it's a mesh type AND the CSS matches
                                    const isSelected = isMeshActive && meshGradientCSS === mesh.css;
                                    return (
                                        <button
                                            key={mesh.name}
                                            onClick={() => setMeshGradient(mesh.css)}
                                            className={cn(
                                                'relative w-full aspect-square rounded-lg transition-all overflow-hidden group',
                                                isSelected
                                                    ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-105'
                                                    : 'hover:scale-105'
                                            )}
                                            style={{ background: mesh.css, backgroundColor: '#0f172a' }}
                                            title={mesh.name}
                                        >
                                            {isSelected && (
                                                <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow-lg" />
                                            )}
                                            <span className="absolute bottom-0 left-0 right-0 text-[8px] text-white bg-black/50 backdrop-blur-sm px-1 py-0.5 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity truncate">
                                                {mesh.name}
                                            </span>
                                        </button>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            )}

            {/* Text Patterns */}
            {backgroundType === 'textPattern' && (
                <div className="space-y-3">
                    <Label className="text-muted-foreground text-xs mb-2 block">
                        Gradients ({TEXT_PATTERNS.length}) - Keeps your text
                    </Label>
                    <div className="grid grid-cols-5 gap-2">
                            {TEXT_PATTERNS.map((pattern) => {
                                const isSelected =
                                    isTextPatternActive &&
                                    gradientColors[0] === pattern.colors[0] &&
                                    gradientColors[1] === pattern.colors[1];

                                return (
                                    <button
                                        key={pattern.name}
                                        onClick={() => updateGradientColors(pattern.colors, pattern.angle)}
                                        className={cn(
                                            'relative w-full aspect-square rounded-lg transition-all overflow-hidden group',
                                            isSelected
                                                ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-105'
                                                : 'hover:scale-105'
                                        )}
                                        style={{
                                            background: `linear-gradient(${pattern.angle}deg, ${pattern.colors[0]}, ${pattern.colors[1]})`,
                                        }}
                                        title={pattern.name}
                                    >
                                        {/* Preview text */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span
                                                className="text-[10px] font-black uppercase"
                                                style={{
                                                    color: pattern.textColor,
                                                    opacity: pattern.textOpacity * 3,
                                                }}
                                            >
                                                {pattern.text.slice(0, 3)}
                                            </span>
                                        </div>
                                        {isSelected && (
                                            <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow-lg z-10" />
                                        )}
                                        <span className="absolute bottom-0 left-0 right-0 text-[8px] text-white bg-black/50 backdrop-blur-sm px-1 py-0.5 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity truncate">
                                            {pattern.name}
                                        </span>
                                    </button>
                                );
                            })}
                    </div>

                    {/* Custom Text Input */}
                    <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                        <Label className="text-[10px] uppercase text-muted-foreground">Custom Text</Label>
                        <Input
                            value={textPatternText}
                            onChange={(e) => setTextPatternText(e.target.value.toUpperCase())}
                            placeholder="ENTER YOUR TEXT"
                            className="font-mono text-sm font-bold uppercase"
                            maxLength={20}
                        />
                    </div>

                    {/* Text Position Selector - Multi-select */}
                    <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                        <Label className="text-[10px] uppercase text-muted-foreground">Text Position (Multi-select)</Label>
                        <div className="grid grid-cols-3 gap-2">
                            {(['top', 'center', 'bottom'] as const).map((position) => {
                                const isSelected = textPatternPositions.includes(position);
                                const labels = {
                                    'top': 'Top',
                                    'center': 'Center',
                                    'bottom': 'Bottom',
                                };

                                return (
                                    <Button
                                        key={position}
                                        variant={isSelected ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => toggleTextPatternPosition(position)}
                                        className={cn(
                                            'h-10',
                                            isSelected && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                        )}
                                    >
                                        {labels[position]}
                                    </Button>
                                );
                            })}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                            Select multiple positions to show text {textPatternPositions.length} time{textPatternPositions.length !== 1 ? 's' : ''}
                        </p>
                    </div>

                    {/* Font Family Selector */}
                    <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                        <Label className="text-[10px] uppercase text-muted-foreground">Font Family</Label>
                        <select
                            value={textPatternFontFamily}
                            onChange={(e) => setTextPatternFontFamily(e.target.value)}
                            className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm"
                        >
                            <option value="system-ui, -apple-system, sans-serif">System UI (Default)</option>
                            <option value="Arial, sans-serif">Arial</option>
                            <option value="Helvetica, sans-serif">Helvetica</option>
                            <option value="'Times New Roman', serif">Times New Roman</option>
                            <option value="Georgia, serif">Georgia</option>
                            <option value="'Courier New', monospace">Courier New</option>
                            <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                            <option value="Verdana, sans-serif">Verdana</option>
                            <option value="Impact, sans-serif">Impact</option>
                            <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
                            <option value="'Brush Script MT', cursive">Brush Script MT</option>
                        </select>
                    </div>

                    {/* Font Size Slider */}
                    <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                        <div className="flex justify-between items-center">
                            <Label className="text-[10px] uppercase text-muted-foreground">Font Size</Label>
                            <span className="text-xs text-muted-foreground">{Math.round(textPatternFontSize * 100)}%</span>
                        </div>
                        <Slider
                            value={[textPatternFontSize * 100]}
                            onValueChange={([value]) => setTextPatternFontSize(value / 100)}
                            min={10}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                    </div>

                    {/* Font Weight Selector */}
                    <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                        <Label className="text-[10px] uppercase text-muted-foreground">Font Weight</Label>
                        <div className="grid grid-cols-5 gap-1.5">
                            {[100, 300, 400, 700, 900].map((weight) => {
                                const isSelected = textPatternFontWeight === weight;
                                const labels: Record<number, string> = {
                                    100: 'Thin',
                                    300: 'Light',
                                    400: 'Normal',
                                    700: 'Bold',
                                    900: 'Black',
                                };

                                return (
                                    <Button
                                        key={weight}
                                        variant={isSelected ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setTextPatternFontWeight(weight)}
                                        className={cn(
                                            'h-9 text-[10px]',
                                            isSelected && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                        )}
                                        title={labels[weight]}
                                    >
                                        {labels[weight]}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Transparent */}
            {backgroundType === 'transparent' && (
                <div className="p-4 bg-muted/40 rounded-lg text-center">
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
                    <p className="text-xs text-muted-foreground">Exports with transparent background (PNG)</p>
                </div>
            )}
        </div>
    );
}
