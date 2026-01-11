'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/lib/store/editor-store';
import { useSubscription } from '@/lib/subscription/context';
import { FREE_TIER_LIMITS } from '@/lib/subscription/feature-gates';
import { TEMPLATES_BY_CATEGORY } from '@/lib/constants/templates';
import { TemplatePreset } from '@/types/editor';
import { cn } from '@/lib/utils';
import { Check, Sparkles, Crown } from 'lucide-react';
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

// Free categories (based on feature-analysis-report.html)
const FREE_CATEGORIES: CategoryType[] = ['minimal', 'vibrant', 'text'];

export function TemplatePresets() {
    const { applyTemplate } = useEditorStore();
    const [selectedCategory, setSelectedCategory] = useState<CategoryType>('vibrant');
    const [appliedTemplateId, setAppliedTemplateId] = useState<string | null>(null);

    // Subscription access (for PRO badge only)
    const { isPro } = useSubscription();

    // Free template names from the report
    const freeTemplateNames = FREE_TIER_LIMITS.freeTemplates;

    // Check if a template is free
    const isTemplateFree = (template: TemplatePreset): boolean => {
        return (freeTemplateNames as readonly string[]).includes(template.name);
    };

    // Check if a category is free
    const isCategoryFree = (category: CategoryType): boolean => {
        return FREE_CATEGORIES.includes(category);
    };

    const handleCategorySelect = (category: CategoryType) => {
        setSelectedCategory(category);
    };

    const handleApplyTemplate = (template: TemplatePreset) => {
        applyTemplate(template);
        setAppliedTemplateId(template.id);
    };

    const templates = TEMPLATES_BY_CATEGORY[selectedCategory];

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <Label className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-2">
                    Template Presets
                    {!isPro && (
                        <span className="text-[10px] text-muted-foreground">({FREE_TIER_LIMITS.freeTemplateCount} free)</span>
                    )}
                </Label>
            </div>

            {/* Category Selector */}
            <div className="grid grid-cols-3 gap-1.5">
                {(Object.keys(CATEGORY_LABELS) as CategoryType[]).map((category) => {
                    const isPremiumCategory = !isCategoryFree(category) && !isPro;
                    return (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleCategorySelect(category)}
                            className={cn(
                                'h-8 text-xs relative',
                                selectedCategory === category && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                            )}
                        >
                            {CATEGORY_LABELS[category]}
                            {isPremiumCategory && (
                                <Crown className="w-2.5 h-2.5 absolute -top-1 -right-1 text-orange-500" />
                            )}
                        </Button>
                    );
                })}
            </div>

            {/* Template Grid */}
            <div className="space-y-2">
                <Label className="text-muted-foreground text-xs">
                    {CATEGORY_LABELS[selectedCategory]} Templates ({templates.length})
                </Label>
                <div className="grid grid-cols-2 gap-3 max-h-[calc(100vh-280px)] overflow-y-auto p-2 -m-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                    {templates.map((template) => {
                        const isApplied = appliedTemplateId === template.id;
                        const isFree = isTemplateFree(template);
                        const isPremium = !isFree && !isPro;
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
                                <div className="relative aspect-video bg-zinc-800">
                                    {/* Background Preview */}
                                    <div
                                        className="absolute inset-0 z-0"
                                        style={getPreviewStyle(template.preview)}
                                    />

                                    {/* Text Pattern Preview Overlay */}
                                    {template.preview.backgroundType === 'textPattern' && template.preview.textPatternText && (
                                        <div className="absolute inset-0 z-[1] flex items-center justify-center overflow-hidden pointer-events-none">
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
                                    <div className="absolute inset-0 z-[2] flex items-center justify-center p-3">
                                        <div className="w-full h-full bg-white/10 rounded-md border border-white/20 flex items-center justify-center shadow-sm">
                                            <div className="text-white/60 text-[10px] font-medium">
                                                Preview
                                            </div>
                                        </div>
                                    </div>

                                    {/* Check mark for applied template */}
                                    {isApplied && (
                                        <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                                            <Check className="w-3 h-3 text-primary-foreground" />
                                        </div>
                                    )}

                                    {/* PRO badge for premium templates */}
                                    {isPremium && (
                                        <div className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 bg-orange-500/90 rounded text-[9px] font-semibold text-white">
                                            <Crown className="w-2.5 h-2.5" />
                                            PRO
                                        </div>
                                    )}
                                </div>

                                {/* Template Name */}
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-2 py-1">
                                    <span className="text-[10px] text-white font-medium truncate block">
                                        {template.name}
                                    </span>
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
                    {!isPro && ' Upgrade to Pro for all 47 templates!'}
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
            backgroundColor: preview.backgroundColor || '#6366f1',
        };
    }

    if (backgroundType === 'gradient') {
        const color1 = preview.gradientColors?.[0] || '#6366f1';
        const color2 = preview.gradientColors?.[1] || '#8b5cf6';
        const angle = preview.gradientAngle || 135;
        return {
            background: `linear-gradient(${angle}deg, ${color1}, ${color2})`,
            backgroundColor: color1, // Fallback
        };
    }

    if (backgroundType === 'mesh') {
        return {
            background: preview.meshGradientCSS || 'radial-gradient(at 50% 50%, #6366f1 0px, transparent 50%)',
            backgroundColor: '#0f172a',
        };
    }

    if (backgroundType === 'textPattern') {
        const color1 = preview.gradientColors?.[0] || '#f472b6';
        const color2 = preview.gradientColors?.[1] || '#c084fc';
        const angle = preview.gradientAngle || 135;
        return {
            background: `linear-gradient(${angle}deg, ${color1}, ${color2})`,
            backgroundColor: color1, // Fallback
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
            backgroundColor: gradientStart, // Fallback
        };
    }

    return {
        backgroundColor: '#6366f1',
    };
}
