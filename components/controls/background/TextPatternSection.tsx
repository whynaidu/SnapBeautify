'use client';

import { useState, useMemo, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Check, Search, Crown } from 'lucide-react';
import { TEXT_PATTERNS } from '@/lib/constants/gradients';
import { FONTS_BY_CATEGORY, FONT_CATEGORIES, type FontCategory } from '@/lib/constants/fonts';
import { FontButton } from './FontButton';
import { FREE_FONTS } from './types';
import { cn } from '@/lib/utils';

interface TextPatternSectionProps {
    gradientColors: [string, string];
    gradientAngle: number;
    textPatternText: string;
    textPatternPositions: string[];
    textPatternFontFamily: string;
    textPatternFontSize: number;
    textPatternFontWeight: number;
    textPatternRows: number;
    isPro: boolean;
    onUpdateGradientColors: (colors: [string, string], angle: number) => void;
    onSetTextPatternText: (text: string) => void;
    onToggleTextPatternPosition: (position: 'top' | 'center' | 'bottom') => void;
    onSetTextPatternFontFamily: (font: string) => void;
    onSetTextPatternFontSize: (size: number) => void;
    onSetTextPatternFontWeight: (weight: number) => void;
    onSetTextPatternRows: (rows: number) => void;
}

export function TextPatternSection({
    gradientColors,
    gradientAngle,
    textPatternText,
    textPatternPositions,
    textPatternFontFamily,
    textPatternFontSize,
    textPatternFontWeight,
    textPatternRows,
    isPro,
    onUpdateGradientColors,
    onSetTextPatternText,
    onToggleTextPatternPosition,
    onSetTextPatternFontFamily,
    onSetTextPatternFontSize,
    onSetTextPatternFontWeight,
    onSetTextPatternRows,
}: TextPatternSectionProps) {
    // Font picker state
    const findFontCategory = useCallback((fontFamily: string): FontCategory | null => {
        for (const [category, fonts] of Object.entries(FONTS_BY_CATEGORY)) {
            if (fonts.some(font => font.fontFamily === fontFamily)) {
                return category as FontCategory;
            }
        }
        return null;
    }, []);

    const getInitialCategory = useCallback((): FontCategory => {
        if (textPatternFontFamily) {
            const category = findFontCategory(textPatternFontFamily);
            if (category) return category;
        }
        return 'popular';
    }, [textPatternFontFamily, findFontCategory]);

    const [fontCategory, setFontCategory] = useState<FontCategory>(getInitialCategory);
    const [fontSearch, setFontSearch] = useState('');

    // Handle font selection
    const handleFontSelection = useCallback((fontFamily: string) => {
        onSetTextPatternFontFamily(fontFamily);
        const category = findFontCategory(fontFamily);
        if (category && category !== fontCategory) {
            setFontCategory(category);
            setFontSearch('');
        }
    }, [onSetTextPatternFontFamily, findFontCategory, fontCategory]);

    // Filter fonts based on search
    const filteredFonts = useMemo(() => {
        const fonts = FONTS_BY_CATEGORY[fontCategory];
        if (!fontSearch.trim()) return fonts;
        return fonts.filter(font =>
            font.name.toLowerCase().includes(fontSearch.toLowerCase())
        );
    }, [fontCategory, fontSearch]);

    // Memoized handlers
    const handleGradientAngleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdateGradientColors(gradientColors, parseInt(e.target.value));
    }, [gradientColors, onUpdateGradientColors]);

    const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onSetTextPatternText(e.target.value.toUpperCase());
    }, [onSetTextPatternText]);

    const handleFontSizeChange = useCallback(([value]: number[]) => {
        onSetTextPatternFontSize(value / 100);
    }, [onSetTextPatternFontSize]);

    const handleRowsChange = useCallback(([value]: number[]) => {
        onSetTextPatternRows(value);
    }, [onSetTextPatternRows]);

    return (
        <div className="space-y-4">
            {/* Gradient Presets for Text Background */}
            <div>
                <Label className="text-muted-foreground text-xs mb-2 block">
                    Gradients ({TEXT_PATTERNS.length}) - Keeps your text
                </Label>
                <div className="grid grid-cols-5 gap-2" role="listbox" aria-label="Text pattern gradients">
                    {TEXT_PATTERNS.map((pattern) => {
                        const isSelected =
                            gradientColors[0] === pattern.colors[0] &&
                            gradientColors[1] === pattern.colors[1];

                        return (
                            <button
                                key={pattern.name}
                                onClick={() => onUpdateGradientColors(pattern.colors, pattern.angle)}
                                className={cn(
                                    'relative w-full aspect-square rounded-lg transition-all overflow-hidden group',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                                    isSelected
                                        ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-105'
                                        : 'hover:scale-105'
                                )}
                                style={{
                                    background: `linear-gradient(${pattern.angle}deg, ${pattern.colors[0]}, ${pattern.colors[1]})`,
                                }}
                                title={pattern.name}
                                aria-label={`Select ${pattern.name} gradient${isSelected ? ', currently selected' : ''}`}
                            >
                                {/* Preview text */}
                                <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
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
                                    <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow-lg z-10" aria-hidden="true" />
                                )}
                                <span className="absolute bottom-0 left-0 right-0 text-[8px] text-white bg-black/80 px-1 py-0.5 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity truncate">
                                    {pattern.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Gradient Angle Slider */}
            <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                <div className="flex justify-between items-center">
                    <Label htmlFor="text-gradient-angle" className="text-[10px] uppercase text-muted-foreground">Gradient Angle</Label>
                    <span className="text-xs text-muted-foreground" aria-live="polite">{gradientAngle}°</span>
                </div>
                <input
                    id="text-gradient-angle"
                    type="range"
                    min="0"
                    max="360"
                    value={gradientAngle}
                    onChange={handleGradientAngleChange}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                    aria-label="Gradient angle"
                />
            </div>

            {/* Custom Text Input */}
            <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                <Label htmlFor="custom-text-input" className="text-[10px] uppercase text-muted-foreground">Custom Text</Label>
                <Input
                    id="custom-text-input"
                    value={textPatternText}
                    onChange={handleTextChange}
                    placeholder="ENTER YOUR TEXT"
                    className="font-mono text-sm font-bold uppercase"
                    maxLength={20}
                    aria-describedby="custom-text-hint"
                />
                <p id="custom-text-hint" className="sr-only">Enter up to 20 characters for your text pattern</p>
            </div>

            {/* Text Layout Mode Toggle */}
            <div className="space-y-3 p-3 bg-muted/30 rounded-lg border border-border">
                <Label className="text-[10px] uppercase text-muted-foreground">Text Layout</Label>

                {/* Mode Toggle */}
                <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Text layout mode">
                    <Button
                        variant={textPatternRows === 1 ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onSetTextPatternRows(1)}
                        className={cn(
                            'h-9',
                            textPatternRows === 1 && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                        )}
                        role="radio"
                        aria-checked={textPatternRows === 1}
                    >
                        Position
                    </Button>
                    <Button
                        variant={textPatternRows > 1 ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => onSetTextPatternRows(textPatternRows === 1 ? 4 : textPatternRows)}
                        className={cn(
                            'h-9 relative',
                            textPatternRows > 1 && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                        )}
                        role="radio"
                        aria-checked={textPatternRows > 1}
                    >
                        Repeat
                        {!isPro && (
                            <>
                                <Crown className="w-3 h-3 absolute -top-1 -right-1 text-orange-500" aria-hidden="true" />
                                <span className="sr-only">(Pro feature)</span>
                            </>
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
                        <div className="grid grid-cols-3 gap-2" role="group" aria-label="Text positions">
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
                                        onClick={() => onToggleTextPatternPosition(position)}
                                        className={cn(
                                            'h-9 relative',
                                            isSelected && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                        )}
                                        aria-pressed={isSelected}
                                        aria-label={`${labels[position]} position${isPremiumPosition ? ' (Pro feature)' : ''}${isSelected ? ', selected' : ''}`}
                                    >
                                        {labels[position]}
                                        {isPremiumPosition && (
                                            <Crown className="w-2.5 h-2.5 absolute -top-1 -right-1 text-orange-500" aria-hidden="true" />
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
                            <Label htmlFor="text-rows-slider" className="text-[10px] text-muted-foreground">Number of Rows</Label>
                            <span className="text-xs text-muted-foreground" aria-live="polite">{textPatternRows}</span>
                        </div>
                        <Slider
                            id="text-rows-slider"
                            value={[textPatternRows]}
                            onValueChange={handleRowsChange}
                            min={2}
                            max={12}
                            step={1}
                            className="w-full"
                            aria-label="Number of text rows"
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
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                    <Input
                        value={fontSearch}
                        onChange={(e) => setFontSearch(e.target.value)}
                        placeholder="Search fonts..."
                        className="h-8 pl-8 text-xs"
                        aria-label="Search fonts"
                    />
                    {!isPro && (
                        <Crown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-orange-500" aria-hidden="true" />
                    )}
                </div>

                {/* Font Category Pills */}
                <div className="flex flex-wrap gap-1" role="tablist" aria-label="Font categories">
                    {(Object.keys(FONT_CATEGORIES) as FontCategory[]).map((category) => (
                        <button
                            key={category}
                            onClick={() => {
                                setFontCategory(category);
                                setFontSearch('');
                            }}
                            className={cn(
                                'px-2 py-1 text-[10px] rounded-full transition-all',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                fontCategory === category
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                            )}
                            role="tab"
                            aria-selected={fontCategory === category}
                            aria-controls={`font-panel-${category}`}
                        >
                            {FONT_CATEGORIES[category]}
                        </button>
                    ))}
                </div>

                {/* Font List */}
                <div
                    id={`font-panel-${fontCategory}`}
                    className="max-h-48 overflow-y-auto space-y-0.5 rounded-md border border-border/50 p-1"
                    role="tabpanel"
                    aria-label={`${fontCategory} fonts`}
                >
                    {filteredFonts.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-4">
                            No fonts found
                        </p>
                    ) : (
                        filteredFonts.map((font, index) => {
                            const isPremiumFont = fontCategory !== 'popular' || index >= FREE_FONTS;
                            return (
                                <FontButton
                                    key={font.fontFamily}
                                    font={font}
                                    isSelected={textPatternFontFamily === font.fontFamily}
                                    isPremium={isPremiumFont && !isPro}
                                    onClick={() => handleFontSelection(font.fontFamily)}
                                />
                            );
                        })
                    )}
                </div>
            </div>

            {/* Font Size Slider */}
            <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
                <div className="flex justify-between items-center">
                    <Label htmlFor="font-size-slider" className="text-[10px] uppercase text-muted-foreground">Font Size</Label>
                    <span className="text-xs text-muted-foreground" aria-live="polite">{Math.round(textPatternFontSize * 100)}%</span>
                </div>
                <Slider
                    id="font-size-slider"
                    value={[textPatternFontSize * 100]}
                    onValueChange={handleFontSizeChange}
                    min={10}
                    max={100}
                    step={1}
                    className="w-full"
                    aria-label="Font size"
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
                <div className="grid grid-cols-5 gap-1.5" role="radiogroup" aria-label="Font weight">
                    {[100, 300, 400, 700, 900].map((weight) => {
                        const isSelected = textPatternFontWeight === weight;
                        const freeWeights = [400, 700];
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
                                onClick={() => onSetTextPatternFontWeight(weight)}
                                className={cn(
                                    'h-9 text-[10px] relative',
                                    isSelected && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                                )}
                                title={isPremiumWeight ? `${labels[weight]} (PRO)` : labels[weight]}
                                role="radio"
                                aria-checked={isSelected}
                                aria-label={`${labels[weight]}${isPremiumWeight ? ' (Pro feature)' : ''}`}
                            >
                                {labels[weight]}
                                {isPremiumWeight && (
                                    <Crown className="w-2 h-2 absolute -top-0.5 -right-0.5 text-orange-500" aria-hidden="true" />
                                )}
                            </Button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
