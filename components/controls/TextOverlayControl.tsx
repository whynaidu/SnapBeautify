'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useEditorStore } from '@/lib/store/editor-store';
import { Plus, Trash2, Type, Copy, Search, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FONTS_BY_CATEGORY, FONT_CATEGORIES, FontCategory } from '@/lib/constants/fonts';
import { useState, useMemo, useEffect } from 'react';

export function TextOverlayControl() {
    const {
        textOverlays,
        selectedTextOverlayId,
        addTextOverlay,
        duplicateTextOverlay,
        removeTextOverlay,
        selectTextOverlay,
        updateTextOverlay,
    } = useEditorStore();

    const [selectedFontCategory, setSelectedFontCategory] = useState<FontCategory>('popular');
    const [fontSearch, setFontSearch] = useState('');
    const selectedOverlay = textOverlays.find(t => t.id === selectedTextOverlayId);

    // Helper function to find which category a font belongs to
    const findFontCategory = (fontFamily: string): FontCategory | null => {
        for (const [category, fonts] of Object.entries(FONTS_BY_CATEGORY)) {
            if (fonts.some(font => font.fontFamily === fontFamily)) {
                return category as FontCategory;
            }
        }
        return null;
    };

    // Auto-select the correct font category when overlay font changes
    useEffect(() => {
        if (selectedOverlay?.fontFamily) {
            const category = findFontCategory(selectedOverlay.fontFamily);
            if (category && category !== selectedFontCategory) {
                setSelectedFontCategory(category);
                setFontSearch(''); // Clear search when switching categories
            }
        }
    }, [selectedOverlay?.fontFamily, selectedOverlay?.id]);

    // Filter fonts based on search
    const filteredFonts = useMemo(() => {
        const fonts = FONTS_BY_CATEGORY[selectedFontCategory];
        if (!fontSearch.trim()) return fonts;
        return fonts.filter(font =>
            font.name.toLowerCase().includes(fontSearch.toLowerCase())
        );
    }, [selectedFontCategory, fontSearch]);

    return (
        <div className="space-y-4">
            {/* Header and Add Button */}
            <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Text Overlays</Label>
                <Button
                    onClick={addTextOverlay}
                    size="sm"
                    className="h-8"
                >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Text
                </Button>
            </div>

            {/* Text Overlay List */}
            {textOverlays.length > 0 && (
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Your Texts ({textOverlays.length})</Label>
                    <div className="space-y-2">
                        {textOverlays.map((overlay) => (
                            <div
                                key={overlay.id}
                                className={cn(
                                    'flex items-center gap-2 p-2 rounded-lg border transition-colors cursor-pointer',
                                    selectedTextOverlayId === overlay.id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-muted-foreground/30'
                                )}
                                onClick={() => selectTextOverlay(overlay.id)}
                            >
                                <Type className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm truncate">{overlay.text || 'Empty text'}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {overlay.fontSize}px • {overlay.fontWeight}
                                    </p>
                                </div>
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        duplicateTextOverlay(overlay.id);
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 flex-shrink-0 hover:bg-primary/10"
                                    title="Duplicate"
                                >
                                    <Copy className="w-3 h-3" />
                                </Button>
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeTextOverlay(overlay.id);
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
                                    title="Delete"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {textOverlays.length === 0 && (
                <div className="text-center p-8 border border-dashed border-border rounded-lg">
                    <Type className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-3">No text overlays yet</p>
                    <Button
                        onClick={addTextOverlay}
                        size="sm"
                        variant="outline"
                    >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Your First Text
                    </Button>
                </div>
            )}

            {/* Edit Selected Text */}
            {selectedOverlay && (
                <div className="space-y-4 pt-4 border-t border-border">
                    <Label className="text-xs text-muted-foreground uppercase">Edit Text</Label>

                    {/* Text Content */}
                    <div className="space-y-2">
                        <Label className="text-xs">Text Content</Label>
                        <Input
                            value={selectedOverlay.text}
                            onChange={(e) => updateTextOverlay(selectedOverlay.id, { text: e.target.value })}
                            placeholder="Enter your text"
                            className="h-9"
                        />
                    </div>

                    {/* Text Color */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs">Color</Label>
                            <div className="inline-flex rounded-md border border-border p-0.5 gap-0.5 bg-muted/30">
                                <Button
                                    onClick={() => updateTextOverlay(selectedOverlay.id, {
                                        useGradient: false,
                                    })}
                                    variant={!selectedOverlay.useGradient ? 'default' : 'ghost'}
                                    size="sm"
                                    className="h-6 text-[10px] px-3"
                                >
                                    Solid
                                </Button>
                                <Button
                                    onClick={() => updateTextOverlay(selectedOverlay.id, {
                                        useGradient: true,
                                        gradientColors: selectedOverlay.gradientColors || ['#f97316', '#ec4899'],
                                        gradientAngle: selectedOverlay.gradientAngle || 90,
                                    })}
                                    variant={selectedOverlay.useGradient ? 'default' : 'ghost'}
                                    size="sm"
                                    className="h-6 text-[10px] px-3"
                                >
                                    Gradient
                                </Button>
                            </div>
                        </div>

                        {!selectedOverlay.useGradient ? (
                            <div className="flex gap-2 items-center">
                                <input
                                    type="color"
                                    value={selectedOverlay.color}
                                    onChange={(e) => updateTextOverlay(selectedOverlay.id, { color: e.target.value })}
                                    className="w-12 h-9 rounded-md border border-border cursor-pointer"
                                />
                                <Input
                                    value={selectedOverlay.color}
                                    onChange={(e) => updateTextOverlay(selectedOverlay.id, { color: e.target.value })}
                                    className="h-9 flex-1 font-mono text-xs"
                                    placeholder="#ffffff"
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {/* Gradient Color 1 */}
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="color"
                                        value={selectedOverlay.gradientColors?.[0] || '#f97316'}
                                        onChange={(e) => updateTextOverlay(selectedOverlay.id, {
                                            gradientColors: [e.target.value, selectedOverlay.gradientColors?.[1] || '#ec4899'],
                                        })}
                                        className="w-12 h-9 rounded-md border border-border cursor-pointer"
                                    />
                                    <Input
                                        value={selectedOverlay.gradientColors?.[0] || '#f97316'}
                                        onChange={(e) => updateTextOverlay(selectedOverlay.id, {
                                            gradientColors: [e.target.value, selectedOverlay.gradientColors?.[1] || '#ec4899'],
                                        })}
                                        className="h-9 flex-1 font-mono text-xs"
                                        placeholder="#f97316"
                                    />
                                </div>

                                {/* Gradient Color 2 */}
                                <div className="flex gap-2 items-center">
                                    <input
                                        type="color"
                                        value={selectedOverlay.gradientColors?.[1] || '#ec4899'}
                                        onChange={(e) => updateTextOverlay(selectedOverlay.id, {
                                            gradientColors: [selectedOverlay.gradientColors?.[0] || '#f97316', e.target.value],
                                        })}
                                        className="w-12 h-9 rounded-md border border-border cursor-pointer"
                                    />
                                    <Input
                                        value={selectedOverlay.gradientColors?.[1] || '#ec4899'}
                                        onChange={(e) => updateTextOverlay(selectedOverlay.id, {
                                            gradientColors: [selectedOverlay.gradientColors?.[0] || '#f97316', e.target.value],
                                        })}
                                        className="h-9 flex-1 font-mono text-xs"
                                        placeholder="#ec4899"
                                    />
                                </div>

                                {/* Gradient Angle */}
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs">Angle</Label>
                                        <span className="text-xs text-muted-foreground">{selectedOverlay.gradientAngle || 90}°</span>
                                    </div>
                                    <Slider
                                        value={[selectedOverlay.gradientAngle || 90]}
                                        onValueChange={([value]) => updateTextOverlay(selectedOverlay.id, { gradientAngle: value })}
                                        min={0}
                                        max={360}
                                        step={15}
                                        className="py-2"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Font Size */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs">Font Size</Label>
                            <span className="text-xs text-muted-foreground">{selectedOverlay.fontSize}px</span>
                        </div>
                        <Slider
                            value={[selectedOverlay.fontSize]}
                            onValueChange={([value]) => updateTextOverlay(selectedOverlay.id, { fontSize: value })}
                            min={12}
                            max={200}
                            step={1}
                            className="py-4"
                        />
                        <div className="grid grid-cols-5 gap-1.5">
                            {[24, 36, 48, 64, 96].map((size) => (
                                <Button
                                    key={size}
                                    onClick={() => updateTextOverlay(selectedOverlay.id, { fontSize: size })}
                                    variant={selectedOverlay.fontSize === size ? 'default' : 'outline'}
                                    size="sm"
                                    className="h-7 text-xs"
                                >
                                    {size}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Font Family */}
                    <div className="space-y-3">
                        <Label className="text-xs">Font Family</Label>

                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                            <Input
                                value={fontSearch}
                                onChange={(e) => setFontSearch(e.target.value)}
                                placeholder="Search fonts..."
                                className="h-8 pl-8 text-xs"
                            />
                        </div>

                        {/* Font Category Pills */}
                        <div className="flex flex-wrap gap-1.5">
                            {(Object.keys(FONT_CATEGORIES) as FontCategory[]).map((category) => (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setSelectedFontCategory(category);
                                        setFontSearch('');
                                    }}
                                    className={cn(
                                        'px-2.5 py-1 rounded-full text-[10px] font-medium transition-all',
                                        selectedFontCategory === category
                                            ? 'bg-primary text-primary-foreground shadow-sm'
                                            : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                                    )}
                                >
                                    {FONT_CATEGORIES[category]}
                                </button>
                            ))}
                        </div>

                        {/* Font List */}
                        <div className="max-h-52 overflow-y-auto rounded-lg border border-border bg-muted/20">
                            <div className="p-1.5 space-y-0.5">
                                {filteredFonts.length === 0 ? (
                                    <div className="text-center py-6 text-xs text-muted-foreground">
                                        No fonts found
                                    </div>
                                ) : (
                                    filteredFonts.map((font) => {
                                        const isSelected = selectedOverlay.fontFamily === font.fontFamily;
                                        return (
                                            <button
                                                key={font.fontFamily}
                                                onClick={() => updateTextOverlay(selectedOverlay.id, { fontFamily: font.fontFamily })}
                                                className={cn(
                                                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all group',
                                                    isSelected
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'hover:bg-muted/80'
                                                )}
                                            >
                                                {/* Font Preview */}
                                                <span
                                                    className={cn(
                                                        'text-lg leading-none w-8 text-center',
                                                        !isSelected && 'text-muted-foreground group-hover:text-foreground'
                                                    )}
                                                    style={{ fontFamily: font.fontFamily }}
                                                >
                                                    Aa
                                                </span>
                                                {/* Font Name */}
                                                <span
                                                    className="flex-1 text-sm truncate"
                                                    style={{ fontFamily: font.fontFamily }}
                                                >
                                                    {font.name}
                                                </span>
                                                {/* Check Icon */}
                                                {isSelected && (
                                                    <Check className="w-4 h-4 shrink-0" />
                                                )}
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Font Weight */}
                    <div className="space-y-2">
                        <Label className="text-xs">Font Weight</Label>
                        <div className="grid grid-cols-5 gap-1.5">
                            {[
                                { value: 100, label: 'Thin' },
                                { value: 300, label: 'Light' },
                                { value: 400, label: 'Normal' },
                                { value: 700, label: 'Bold' },
                                { value: 900, label: 'Black' },
                            ].map(({ value, label }) => (
                                <Button
                                    key={value}
                                    onClick={() => updateTextOverlay(selectedOverlay.id, { fontWeight: value })}
                                    variant={selectedOverlay.fontWeight === value ? 'default' : 'outline'}
                                    size="sm"
                                    className="h-9 text-[10px] px-1"
                                >
                                    {label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
