'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useEditorStore } from '@/lib/store/editor-store';
import { PRESET_GRADIENTS, SOLID_COLORS, MESH_GRADIENTS, TEXT_PATTERNS } from '@/lib/constants/gradients';
import { FONTS_BY_CATEGORY, FONT_CATEGORIES, FontCategory } from '@/lib/constants/fonts';
import { cn } from '@/lib/utils';
import { Check, Pipette, X, Search, Crown } from 'lucide-react';
import { useState, useMemo, memo, useCallback } from 'react';
import { useSubscription } from '@/lib/subscription/context';

// Memoized Color Button component to prevent re-renders
const ColorButton = memo(function ColorButton({
    color,
    isSelected,
    isPremium,
    onClick,
}: {
    color: string;
    isSelected: boolean;
    isPremium: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'w-full aspect-square rounded-md border-2 transition-all relative',
                isSelected
                    ? 'border-foreground/80 scale-110 z-10'
                    : 'border-transparent hover:scale-105'
            )}
            style={{ backgroundColor: color }}
            title={isPremium ? `${color} (PRO)` : color}
        >
            {isPremium && (
                <Crown className="absolute -top-1 -right-1 w-2.5 h-2.5 text-orange-500" />
            )}
        </button>
    );
});

// Memoized Gradient Preset Button component
const GradientPresetButton = memo(function GradientPresetButton({
    gradient,
    isSelected,
    isPremium,
    onClick,
}: {
    gradient: { name: string; colors: [string, string]; angle: number };
    isSelected: boolean;
    isPremium: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'relative w-full aspect-square rounded-lg transition-all group',
                isSelected
                    ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-105'
                    : 'hover:scale-105'
            )}
            style={{
                background: `linear-gradient(${gradient.angle}deg, ${gradient.colors[0]}, ${gradient.colors[1]})`,
            }}
            title={isPremium ? `${gradient.name} (PRO)` : gradient.name}
        >
            {isSelected && (
                <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow-lg" />
            )}
            {isPremium && (
                <Crown className="absolute top-0.5 right-0.5 w-3 h-3 text-orange-500 drop-shadow" />
            )}
            <span className="absolute bottom-0 left-0 right-0 text-[8px] text-white bg-black/80 px-1 py-0.5 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity truncate">
                {gradient.name}
            </span>
        </button>
    );
});

// Memoized Mesh Gradient Button component
const MeshGradientButton = memo(function MeshGradientButton({
    mesh,
    isSelected,
    isPremium,
    onClick,
}: {
    mesh: { name: string; css: string };
    isSelected: boolean;
    isPremium: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'relative w-full aspect-square rounded-lg transition-all overflow-hidden group',
                isSelected
                    ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-105'
                    : 'hover:scale-105'
            )}
            style={{ background: mesh.css, backgroundColor: '#0f172a' }}
            title={isPremium ? `${mesh.name} (PRO)` : mesh.name}
        >
            {isSelected && (
                <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow-lg" />
            )}
            {isPremium && (
                <Crown className="absolute top-0.5 right-0.5 w-3 h-3 text-orange-500 drop-shadow" />
            )}
            <span className="absolute bottom-0 left-0 right-0 text-[8px] text-white bg-black/80 px-1 py-0.5 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity truncate">
                {mesh.name}
            </span>
        </button>
    );
});

// Memoized Font Button component
const FontButton = memo(function FontButton({
    font,
    isSelected,
    isPremium,
    onClick,
}: {
    font: { name: string; fontFamily: string };
    isSelected: boolean;
    isPremium: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-all group relative',
                isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted/80'
            )}
        >
            {/* Font Preview */}
            <span
                className={cn(
                    'text-base leading-none w-6 text-center',
                    !isSelected && 'text-muted-foreground group-hover:text-foreground'
                )}
                style={{ fontFamily: font.fontFamily }}
            >
                Aa
            </span>
            {/* Font Name */}
            <span
                className="flex-1 text-xs truncate"
                style={{ fontFamily: font.fontFamily }}
            >
                {font.name}
            </span>
            {/* PRO Badge or Check Icon */}
            {isPremium ? (
                <Crown className="w-3 h-3 shrink-0 text-orange-500" />
            ) : isSelected ? (
                <Check className="w-3 h-3 shrink-0" />
            ) : null}
        </button>
    );
});

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
        textPatternRows,
        waveSplitFlipped,
        logoPatternImage,
        logoPatternOpacity,
        logoPatternSize,
        logoPatternSpacing,
        setBackgroundColor,
        updateBackgroundColor,
        setGradient,
        updateGradientColors,
        setMeshGradient,
        setTextPatternText,
        toggleTextPatternPosition,
        setTextPatternFontFamily,
        setTextPatternFontSize,
        setTextPatternFontWeight,
        setTextPatternRows,
        toggleWaveSplitFlip,
        setLogoPattern,
        clearLogoPattern,
        setLogoPatternOpacity,
        setLogoPatternSize,
        setLogoPatternSpacing,
        setBackgroundType,
    } = useEditorStore();

    // Check if mesh gradient is currently active
    const isMeshActive = backgroundType === 'mesh';
    // Check if regular gradient is active (not mesh)
    const isGradientActive = backgroundType === 'gradient';
    // Check if text pattern is active
    const isTextPatternActive = backgroundType === 'textPattern';

    // Font picker state - derive initial category from textPatternFontFamily
    const findFontCategory = (fontFamily: string): FontCategory | null => {
        for (const [category, fonts] of Object.entries(FONTS_BY_CATEGORY)) {
            if (fonts.some(font => font.fontFamily === fontFamily)) {
                return category as FontCategory;
            }
        }
        return null;
    };

    // Initialize category based on current font, or default to 'popular'
    const getInitialCategory = (): FontCategory => {
        if (textPatternFontFamily) {
            const category = findFontCategory(textPatternFontFamily);
            if (category) return category;
        }
        return 'popular';
    };

    const [fontCategory, setFontCategory] = useState<FontCategory>(getInitialCategory);
    const [fontSearch, setFontSearch] = useState('');

    // Handle font selection - update category when user selects a font
    const handleFontSelection = (fontFamily: string) => {
        setTextPatternFontFamily(fontFamily);
        // When user selects a font, update category to match
        const category = findFontCategory(fontFamily);
        if (category && category !== fontCategory) {
            setFontCategory(category);
            setFontSearch('');
        }
    };

    // Filter fonts based on search
    const filteredFonts = useMemo(() => {
        const fonts = FONTS_BY_CATEGORY[fontCategory];
        if (!fontSearch.trim()) return fonts;
        return fonts.filter(font =>
            font.name.toLowerCase().includes(fontSearch.toLowerCase())
        );
    }, [fontCategory, fontSearch]);

    // Subscription access (for PRO badge only)
    const { isPro } = useSubscription();

    // Free tier limits from feature-analysis-report.html
    const FREE_SOLID_COLORS = 24;    // First 24 out of 72
    const FREE_GRADIENTS = 20;       // First 20 out of 78
    const FREE_MESH_GRADIENTS = 5;   // First 5 out of 15+
    const FREE_FONTS = 10;           // First 10 fonts (Popular category)

    // Memoized click handlers to prevent recreation on each render
    const handleColorClick = useCallback((color: string) => {
        setBackgroundColor(color);
    }, [setBackgroundColor]);

    const handleGradientClick = useCallback((colors: [string, string], angle: number) => {
        setGradient(colors, angle);
    }, [setGradient]);

    const handleMeshClick = useCallback((css: string) => {
        setMeshGradient(css);
    }, [setMeshGradient]);

    const handleUpdateGradientColors = useCallback((colors: [string, string], angle: number) => {
        updateGradientColors(colors, angle);
    }, [updateGradientColors]);

    const handleUpdateBackgroundColor = useCallback((color: string) => {
        updateBackgroundColor(color);
    }, [updateBackgroundColor]);

    return (
        <div className="space-y-4">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                Background
            </Label>

            {/* Type Selector */}
            <div className="grid grid-cols-3 gap-2">
                <Button
                    variant={backgroundType === 'solid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBackgroundType('solid')}
                    className={cn(
                        'h-9',
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
                        'h-9',
                        (backgroundType === 'gradient' || backgroundType === 'mesh') && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    )}
                >
                    Gradient
                </Button>
                <Button
                    variant={backgroundType === 'waveSplit' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBackgroundType('waveSplit')}
                    className={cn(
                        'h-9 relative',
                        backgroundType === 'waveSplit' && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    )}
                >
                    Wave
                    {!isPro && (
                        <Crown className="w-3 h-3 absolute -top-1 -right-1 text-orange-500" />
                    )}
                </Button>
                <Button
                    variant={backgroundType === 'textPattern' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBackgroundType('textPattern')}
                    className={cn(
                        'h-9',
                        backgroundType === 'textPattern' && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    )}
                >
                    Text
                </Button>
                <Button
                    variant={backgroundType === 'logoPattern' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBackgroundType('logoPattern')}
                    className={cn(
                        'h-9 relative',
                        backgroundType === 'logoPattern' && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    )}
                >
                    Logo
                    {!isPro && (
                        <Crown className="w-3 h-3 absolute -top-1 -right-1 text-orange-500" />
                    )}
                </Button>
                <Button
                    variant={backgroundType === 'transparent' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setBackgroundType('transparent')}
                    className={cn(
                        'h-9',
                        backgroundType === 'transparent' && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    )}
                >
                    None
                </Button>
            </div>

            {/* Solid Colors */}
            {backgroundType === 'solid' && (
                <div className="space-y-3">
                    <Label className="text-muted-foreground text-xs mb-2 block">
                        Colors ({isPro ? SOLID_COLORS.length : `${FREE_SOLID_COLORS} free`})
                    </Label>
                    <div className="grid grid-cols-8 gap-1.5">
                            {SOLID_COLORS.map((color, index) => (
                                <ColorButton
                                    key={color}
                                    color={color}
                                    isSelected={backgroundColor === color}
                                    isPremium={index >= FREE_SOLID_COLORS && !isPro}
                                    onClick={() => handleColorClick(color)}
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
                        <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border relative">
                            <Label className="text-[10px] uppercase text-muted-foreground flex items-center gap-2">
                                Custom Gradient
                                {!isPro && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-500/20 rounded text-[10px] font-semibold text-orange-500">
                                        <Crown className="w-2.5 h-2.5" />
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
                            Gradient Presets ({isPro ? PRESET_GRADIENTS.length : `${FREE_GRADIENTS} free`})
                        </Label>
                        <div className="grid grid-cols-6 gap-2">
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
                                        onClick={() => handleGradientClick(gradient.colors, gradient.angle)}
                                    />
                                ))}
                        </div>
                    </div>

                    {/* Gradient Angle Slider - Show for regular gradients */}
                    {isGradientActive && (
                        <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                            <div className="flex justify-between items-center">
                                <Label className="text-[10px] uppercase text-muted-foreground">Gradient Angle</Label>
                                <span className="text-xs text-muted-foreground">{gradientAngle}°</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="360"
                                value={gradientAngle}
                                onChange={(e) => setGradient(gradientColors, parseInt(e.target.value))}
                                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>
                    )}

                    <div>
                        <Label className="text-muted-foreground text-xs mb-2 block">
                            Mesh Gradients ({isPro ? MESH_GRADIENTS.length : `${FREE_MESH_GRADIENTS} free`})
                        </Label>
                        <div className="grid grid-cols-5 gap-2">
                                {MESH_GRADIENTS.map((mesh, index) => (
                                    <MeshGradientButton
                                        key={mesh.name}
                                        mesh={mesh}
                                        isSelected={isMeshActive && meshGradientCSS === mesh.css}
                                        isPremium={index >= FREE_MESH_GRADIENTS && !isPro}
                                        onClick={() => handleMeshClick(mesh.css)}
                                    />
                                ))}
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
                                        <span className="absolute bottom-0 left-0 right-0 text-[8px] text-white bg-black/80 px-1 py-0.5 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity truncate">
                                            {pattern.name}
                                        </span>
                                    </button>
                                );
                            })}
                    </div>

                    {/* Gradient Angle Slider */}
                    <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                        <div className="flex justify-between items-center">
                            <Label className="text-[10px] uppercase text-muted-foreground">Gradient Angle</Label>
                            <span className="text-xs text-muted-foreground">{gradientAngle}°</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={gradientAngle}
                            onChange={(e) => updateGradientColors(gradientColors, parseInt(e.target.value))}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
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

                    {/* Text Layout Mode Toggle */}
                    <div className="space-y-3 p-3 bg-muted/30 rounded-lg border border-border">
                        <Label className="text-[10px] uppercase text-muted-foreground">Text Layout</Label>

                        {/* Mode Toggle */}
                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant={textPatternRows === 1 ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setTextPatternRows(1)}
                                className={cn(
                                    'h-9',
                                    textPatternRows === 1 && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                )}
                            >
                                Position
                            </Button>
                            <Button
                                variant={textPatternRows > 1 ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setTextPatternRows(textPatternRows === 1 ? 4 : textPatternRows)}
                                className={cn(
                                    'h-9 relative',
                                    textPatternRows > 1 && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                )}
                            >
                                Repeat
                                {!isPro && (
                                    <Crown className="w-3 h-3 absolute -top-1 -right-1 text-orange-500" />
                                )}
                            </Button>
                        </div>

                        {/* Position Mode Controls */}
                        {textPatternRows === 1 && (
                            <div className="space-y-2 pt-2 border-t border-border/50">
                                <Label className="text-[10px] text-muted-foreground flex items-center gap-2">
                                    Select Positions
                                    {!isPro && (
                                        <span className="text-[9px] text-muted-foreground/70">(Center free, Top/Bottom PRO)</span>
                                    )}
                                </Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['top', 'center', 'bottom'] as const).map((position) => {
                                        const isSelected = textPatternPositions.includes(position);
                                        const isPremiumPosition = position !== 'center' && !isPro;
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
                                                    'h-9 relative',
                                                    isSelected && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                                )}
                                            >
                                                {labels[position]}
                                                {isPremiumPosition && (
                                                    <Crown className="w-2.5 h-2.5 absolute -top-1 -right-1 text-orange-500" />
                                                )}
                                            </Button>
                                        );
                                    })}
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                    Large text at {textPatternPositions.length} position{textPatternPositions.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        )}

                        {/* Repeat Mode Controls */}
                        {textPatternRows > 1 && (
                            <div className="space-y-2 pt-2 border-t border-border/50">
                                <div className="flex justify-between items-center">
                                    <Label className="text-[10px] text-muted-foreground">Number of Rows</Label>
                                    <span className="text-xs text-muted-foreground">{textPatternRows}</span>
                                </div>
                                <Slider
                                    value={[textPatternRows]}
                                    onValueChange={([value]) => setTextPatternRows(value)}
                                    min={2}
                                    max={12}
                                    step={1}
                                    className="w-full"
                                />
                                <p className="text-[10px] text-muted-foreground">
                                    Wallpaper pattern with {textPatternRows} rows
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Font Family Selector */}
                    <div className="space-y-3 p-3 bg-muted/30 rounded-lg border border-border">
                        <Label className="text-[10px] uppercase text-muted-foreground flex items-center gap-2">
                            Font Family
                            {!isPro && (
                                <span className="text-[9px] text-muted-foreground/70">({FREE_FONTS} free)</span>
                            )}
                        </Label>

                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                            <Input
                                value={fontSearch}
                                onChange={(e) => setFontSearch(e.target.value)}
                                placeholder="Search fonts..."
                                className="h-8 pl-8 text-xs"
                            />
                            {!isPro && (
                                <Crown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-orange-500" />
                            )}
                        </div>

                        {/* Font Category Pills */}
                        <div className="flex flex-wrap gap-1">
                            {(Object.keys(FONT_CATEGORIES) as FontCategory[]).map((category) => {
                                const isPremiumCategory = category !== 'popular' && !isPro;
                                return (
                                    <button
                                        key={category}
                                        onClick={() => {
                                            setFontCategory(category);
                                            setFontSearch('');
                                        }}
                                        className={cn(
                                            'px-2 py-0.5 rounded-full text-[9px] font-medium transition-all relative',
                                            fontCategory === category
                                                ? 'bg-primary text-primary-foreground shadow-sm'
                                                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                                        )}
                                    >
                                        {FONT_CATEGORIES[category]}
                                        {isPremiumCategory && (
                                            <Crown className="inline-block w-2 h-2 ml-0.5 text-orange-500" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Font List */}
                        <div className="max-h-40 overflow-y-auto rounded-md border border-border bg-background/50">
                            <div className="p-1 space-y-0.5">
                                {filteredFonts.length === 0 ? (
                                    <div className="text-center py-4 text-xs text-muted-foreground">
                                        No fonts found
                                    </div>
                                ) : (
                                    filteredFonts.map((font, index) => (
                                        <FontButton
                                            key={font.fontFamily}
                                            font={font}
                                            isSelected={textPatternFontFamily === font.fontFamily}
                                            isPremium={(fontCategory !== 'popular' || index >= FREE_FONTS) && !isPro}
                                            onClick={() => handleFontSelection(font.fontFamily)}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
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
                        <Label className="text-[10px] uppercase text-muted-foreground flex items-center gap-2">
                            Font Weight
                            {!isPro && (
                                <span className="text-[9px] text-muted-foreground/70">(Normal & Bold free)</span>
                            )}
                        </Label>
                        <div className="grid grid-cols-5 gap-1.5">
                            {[100, 300, 400, 700, 900].map((weight) => {
                                const isSelected = textPatternFontWeight === weight;
                                const freeWeights = [400, 700]; // Normal and Bold only
                                const isPremiumWeight = !freeWeights.includes(weight) && !isPro;
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
                                            'h-9 text-[10px] relative',
                                            isSelected && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                        )}
                                        title={isPremiumWeight ? `${labels[weight]} (PRO)` : labels[weight]}
                                    >
                                        {labels[weight]}
                                        {isPremiumWeight && (
                                            <Crown className="w-2 h-2 absolute -top-0.5 -right-0.5 text-orange-500" />
                                        )}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Wave Split */}
            {backgroundType === 'waveSplit' && (
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
                            onClick={toggleWaveSplitFlip}
                            className="h-8"
                        >
                            Flip
                        </Button>
                    </div>

                    {/* Solid Color */}
                    <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs">{waveSplitFlipped ? 'Top' : 'Bottom'} Half (Solid)</Label>
                        <div className="grid grid-cols-8 gap-1.5">
                            {SOLID_COLORS.map((color) => (
                                <ColorButton
                                    key={color}
                                    color={color}
                                    isSelected={backgroundColor === color}
                                    isPremium={false}
                                    onClick={() => handleUpdateBackgroundColor(color)}
                                />
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="color"
                                    value={backgroundColor}
                                    onChange={(e) => updateBackgroundColor(e.target.value)}
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
                                onChange={(e) => updateBackgroundColor(e.target.value)}
                                className="w-28 font-mono text-xs uppercase"
                                placeholder="#HEX"
                            />
                        </div>
                    </div>

                    {/* Gradient */}
                    <div className="space-y-2">
                        <Label className="text-muted-foreground text-xs">{waveSplitFlipped ? 'Bottom' : 'Top'} Half (Gradient)</Label>

                        {/* Custom Gradient Controls */}
                        <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                            <Label className="text-[10px] uppercase text-muted-foreground">Custom Gradient</Label>
                            <div className="flex gap-2">
                                {/* Start Color */}
                                <div className="space-y-1 flex-1">
                                    <div className="relative">
                                        <input
                                            type="color"
                                            value={gradientColors[0]}
                                            onChange={(e) => updateGradientColors([e.target.value, gradientColors[1]], gradientAngle)}
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
                                        onChange={(e) => updateGradientColors([e.target.value, gradientColors[1]], gradientAngle)}
                                        className="h-7 text-[10px] font-mono px-2"
                                    />
                                </div>

                                {/* End Color */}
                                <div className="space-y-1 flex-1">
                                    <div className="relative">
                                        <input
                                            type="color"
                                            value={gradientColors[1]}
                                            onChange={(e) => updateGradientColors([gradientColors[0], e.target.value], gradientAngle)}
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
                                        onChange={(e) => updateGradientColors([gradientColors[0], e.target.value], gradientAngle)}
                                        className="h-7 text-[10px] font-mono px-2"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Gradient Angle Control */}
                        <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                            <div className="flex justify-between items-center">
                                <Label className="text-[10px] uppercase text-muted-foreground">Angle</Label>
                                <span className="text-xs text-muted-foreground">{gradientAngle}°</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="360"
                                value={gradientAngle}
                                onChange={(e) => updateGradientColors(gradientColors, parseInt(e.target.value))}
                                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>

                        {/* Gradient Presets */}
                        <div>
                            <Label className="text-muted-foreground text-xs mb-2 block">
                                Gradient Presets ({PRESET_GRADIENTS.length})
                            </Label>
                            <div className="grid grid-cols-6 gap-2">
                                {PRESET_GRADIENTS.map((gradient) => (
                                    <GradientPresetButton
                                        key={gradient.name}
                                        gradient={gradient}
                                        isSelected={
                                            gradientColors[0] === gradient.colors[0] &&
                                            gradientColors[1] === gradient.colors[1]
                                        }
                                        isPremium={false}
                                        onClick={() => handleUpdateGradientColors(gradient.colors, gradient.angle)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Logo Pattern */}
            {backgroundType === 'logoPattern' && (
                <div className="space-y-4">
                    {/* Logo Upload */}
                    <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                        <Label className="text-[10px] uppercase text-muted-foreground">Upload Logo</Label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            const img = new Image();
                                            img.onload = () => {
                                                setLogoPattern(img);
                                            };
                                            img.src = event.target?.result as string;
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <Button variant="outline" size="sm" className="w-full justify-start">
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
                                    onClick={clearLogoPattern}
                                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                                    title="Remove logo"
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
                                        value={gradientColors[0]}
                                        onChange={(e) => updateGradientColors([e.target.value, gradientColors[1]], gradientAngle)}
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
                                    onChange={(e) => updateGradientColors([e.target.value, gradientColors[1]], gradientAngle)}
                                    className="h-7 text-[10px] font-mono px-2"
                                />
                            </div>

                            {/* End Color */}
                            <div className="space-y-1 flex-1">
                                <div className="relative">
                                    <input
                                        type="color"
                                        value={gradientColors[1]}
                                        onChange={(e) => updateGradientColors([gradientColors[0], e.target.value], gradientAngle)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <Button variant="outline" size="sm" className="w-full h-8 px-2 justify-between">
                                        <span className="text-[10px]">End</span>
                                        <div
                                            className="w-3 h-3 rounded border border-zinc-600"
                                            style={{ backgroundColor: gradientColors[1] }}
                                        />
                                    </Button>
                                </div>
                                <Input
                                    value={gradientColors[1]}
                                    onChange={(e) => updateGradientColors([gradientColors[0], e.target.value], gradientAngle)}
                                    className="h-7 text-[10px] font-mono px-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Gradient Angle Control */}
                    <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                        <div className="flex justify-between items-center">
                            <Label className="text-[10px] uppercase text-muted-foreground">Gradient Angle</Label>
                            <span className="text-xs text-muted-foreground">{gradientAngle}°</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={gradientAngle}
                            onChange={(e) => updateGradientColors(gradientColors, parseInt(e.target.value))}
                            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    {/* Gradient Presets */}
                    <div>
                        <Label className="text-muted-foreground text-xs mb-2 block">
                            Gradient Presets ({PRESET_GRADIENTS.length})
                        </Label>
                        <div className="grid grid-cols-6 gap-2">
                            {PRESET_GRADIENTS.map((gradient) => (
                                <GradientPresetButton
                                    key={gradient.name}
                                    gradient={gradient}
                                    isSelected={
                                        gradientColors[0] === gradient.colors[0] &&
                                        gradientColors[1] === gradient.colors[1]
                                    }
                                    isPremium={false}
                                    onClick={() => handleUpdateGradientColors(gradient.colors, gradient.angle)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Logo Opacity */}
                    <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                        <div className="flex justify-between items-center">
                            <Label className="text-[10px] uppercase text-muted-foreground">Logo Opacity</Label>
                            <span className="text-xs text-muted-foreground">{Math.round(logoPatternOpacity * 100)}%</span>
                        </div>
                        <Slider
                            value={[logoPatternOpacity * 100]}
                            onValueChange={([value]) => setLogoPatternOpacity(value / 100)}
                            min={0}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                    </div>

                    {/* Logo Size */}
                    <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                        <div className="flex justify-between items-center">
                            <Label className="text-[10px] uppercase text-muted-foreground">Logo Size</Label>
                            <span className="text-xs text-muted-foreground">{Math.round(logoPatternSize * 100)}%</span>
                        </div>
                        <Slider
                            value={[logoPatternSize * 100]}
                            onValueChange={([value]) => setLogoPatternSize(value / 100)}
                            min={10}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                    </div>

                    {/* Logo Spacing */}
                    <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                        <div className="flex justify-between items-center">
                            <Label className="text-[10px] uppercase text-muted-foreground">Logo Spacing</Label>
                            <span className="text-xs text-muted-foreground">{logoPatternSpacing.toFixed(1)}x</span>
                        </div>
                        <Slider
                            value={[logoPatternSpacing * 10]}
                            onValueChange={([value]) => setLogoPatternSpacing(value / 10)}
                            min={10}
                            max={30}
                            step={1}
                            className="w-full"
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">
                            Adjust spacing between logos in the grid
                        </p>
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
