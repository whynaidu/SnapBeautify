'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useEditorStore } from '@/lib/store/editor-store';
import { Plus, Trash2, Type } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TextOverlayControl() {
    const {
        textOverlays,
        selectedTextOverlayId,
        addTextOverlay,
        removeTextOverlay,
        selectTextOverlay,
        updateTextOverlay,
    } = useEditorStore();

    const selectedOverlay = textOverlays.find(t => t.id === selectedTextOverlayId);

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
                                        removeTextOverlay(overlay.id);
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 flex-shrink-0"
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
                        <Label className="text-xs">Color</Label>
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
                    <div className="space-y-2">
                        <Label className="text-xs">Font Family</Label>
                        <select
                            value={selectedOverlay.fontFamily}
                            onChange={(e) => updateTextOverlay(selectedOverlay.id, { fontFamily: e.target.value })}
                            className="w-full h-9 px-3 rounded-md border border-border bg-background text-sm"
                        >
                            <option value="system-ui, -apple-system, sans-serif">System UI (Default)</option>
                            <option value="Arial, sans-serif">Arial</option>
                            <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</option>
                            <option value="'Times New Roman', Times, serif">Times New Roman</option>
                            <option value="Georgia, serif">Georgia</option>
                            <option value="'Courier New', Courier, monospace">Courier New</option>
                            <option value="Monaco, 'Lucida Console', monospace">Monaco</option>
                            <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
                            <option value="Impact, fantasy">Impact</option>
                            <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                            <option value="Verdana, sans-serif">Verdana</option>
                        </select>
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
