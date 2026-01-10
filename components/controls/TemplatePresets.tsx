'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/lib/store/editor-store';
import { TEMPLATE_PRESETS, TEMPLATES_BY_CATEGORY } from '@/lib/constants/templates';
import { TemplatePreset } from '@/types/editor';
import { cn } from '@/lib/utils';
import { Check, Sparkles } from 'lucide-react';
import { useState } from 'react';

type CategoryType = 'minimal' | 'vibrant' | 'professional' | 'creative' | 'wave' | 'text';

const CATEGORY_LABELS: Record<CategoryType, string> = {
    minimal: 'Minimal',
    vibrant: 'Vibrant',
    professional: 'Professional',
    creative: 'Creative',
    wave: 'Wave',
    text: 'Text',
};

export function TemplatePresets() {
    const { applyTemplate } = useEditorStore();
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>('vibrant');
    const [appliedTemplateId, setAppliedTemplateId] = useState<string | null>(null);

    const handleApplyTemplate = (template: TemplatePreset) => {
        applyTemplate(template);
        setAppliedTemplateId(template.id);
    };

    const templates = TEMPLATES_BY_CATEGORY[selectedCategory];

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                    Template Presets
                </Label>
            </div>

            {/* Category Selector */}
            <div className="grid grid-cols-3 gap-1.5">
                {(Object.keys(CATEGORY_LABELS) as CategoryType[]).map((category) => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className={cn(
                            'h-8 text-xs',
                            selectedCategory === category && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                        )}
                    >
                        {CATEGORY_LABELS[category]}
                    </Button>
                ))}
            </div>

            {/* Template Grid */}
            <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">
                    {CATEGORY_LABELS[selectedCategory]} Templates ({templates.length})
                </Label>
                <div className="grid grid-cols-2 gap-3 max-h-[calc(100vh-280px)] overflow-y-auto p-2 -m-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                    {templates.map((template) => {
                        const isApplied = appliedTemplateId === template.id;
                        return (
                            <button
                                key={template.id}
                                onClick={() => handleApplyTemplate(template)}
                                className={cn(
                                    'relative group rounded-lg overflow-hidden transition-all',
                                    isApplied
                                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105'
                                        : 'hover:scale-105 border border-border'
                                )}
                            >
                                {/* Preview */}
                                <div className="relative aspect-video">
                                    {/* Background Preview */}
                                    <div
                                        className="absolute inset-0"
                                        style={getPreviewStyle(template.preview)}
                                    />

                                    {/* Text Pattern Preview Overlay */}
                                    {template.preview.backgroundType === 'textPattern' && template.preview.textPatternText && (
                                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                                            <div
                                                className="text-3xl font-black uppercase whitespace-nowrap"
                                                style={{
                                                    color: 'rgba(255, 255, 255, 0.15)',
                                                    textShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
                                                }}
                                            >
                                                {template.preview.textPatternText}
                                            </div>
                                        </div>
                                    )}

                                    {/* Mock Image */}
                                    <div className="absolute inset-0 flex items-center justify-center p-4">
                                        <div className="w-full h-full bg-white/5 backdrop-blur-[2px] rounded-md border border-white/20 flex items-center justify-center">
                                            <div className="text-white/70 text-xs font-medium">
                                                Image
                                            </div>
                                        </div>
                                    </div>

                                    {/* Check mark for applied template */}
                                    {isApplied && (
                                        <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                                            <Check className="w-3 h-3 text-primary-foreground" />
                                        </div>
                                    )}
                                </div>

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors pointer-events-none" />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Helper Text */}
            <div className="p-3 bg-muted/30 rounded-lg border border-border">
                <p className="text-[10px] text-muted-foreground">
                    Click any template to instantly apply its background, styling, and text overlays to your image.
                </p>
            </div>
        </div>
    );
}

// Helper function to generate preview styles
function getPreviewStyle(preview: TemplatePreset['preview']): React.CSSProperties {
    const { backgroundType } = preview;

    if (backgroundType === 'solid') {
        return {
            backgroundColor: preview.backgroundColor,
        };
    }

    if (backgroundType === 'gradient') {
        return {
            background: `linear-gradient(${preview.gradientAngle || 135}deg, ${preview.gradientColors?.[0]}, ${preview.gradientColors?.[1]})`,
        };
    }

    if (backgroundType === 'mesh') {
        return {
            background: preview.meshGradientCSS,
            backgroundColor: '#0f172a',
        };
    }

    if (backgroundType === 'textPattern') {
        return {
            background: `linear-gradient(${preview.gradientAngle || 135}deg, ${preview.gradientColors?.[0]}, ${preview.gradientColors?.[1]})`,
            position: 'relative' as const,
        };
    }

    if (backgroundType === 'waveSplit') {
        const flipped = preview.waveSplitFlipped || false;
        const gradientStart = preview.gradientColors?.[0] || '#6366f1';
        const gradientEnd = preview.gradientColors?.[1] || '#8b5cf6';
        const solidColor = preview.backgroundColor || '#ffffff';

        return {
            background: flipped
                ? `linear-gradient(to top, ${gradientStart}, ${gradientEnd} 50%, ${solidColor} 50%)`
                : `linear-gradient(to bottom, ${gradientStart}, ${gradientEnd} 50%, ${solidColor} 50%)`,
        };
    }

    return {
        backgroundColor: '#6366f1',
    };
}
