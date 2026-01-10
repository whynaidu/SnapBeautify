'use client';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/lib/store/editor-store';
import { useSubscription } from '@/lib/subscription/context';
import { FREE_TIER_LIMITS } from '@/lib/subscription/feature-gates';
import { TEMPLATE_PRESETS, TEMPLATES_BY_CATEGORY } from '@/lib/constants/templates';
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

    // Subscription access
    const { checkFeature } = useSubscription();
    const hasAllTemplates = checkFeature('all_templates').hasAccess;

    // Free template names from the report
    const freeTemplateNames = FREE_TIER_LIMITS.freeTemplates;

    // Show upgrade modal
    const showUpgradeModal = (message: string) => {
        window.dispatchEvent(
            new CustomEvent('show-upgrade-modal', {
                detail: { featureId: 'all_templates', message },
            })
        );
    };

    // Check if a template is free
    const isTemplateFree = (template: TemplatePreset): boolean => {
        return (freeTemplateNames as readonly string[]).includes(template.name);
    };

    // Check if a category is free
    const isCategoryFree = (category: CategoryType): boolean => {
        return FREE_CATEGORIES.includes(category);
    };

    const handleCategorySelect = (category: CategoryType) => {
        if (!isCategoryFree(category) && !hasAllTemplates) {
            showUpgradeModal(`Upgrade to Pro to access ${CATEGORY_LABELS[category]} templates`);
            return;
        }
        setSelectedCategory(category);
    };

    const handleApplyTemplate = (template: TemplatePreset) => {
        if (!isTemplateFree(template) && !hasAllTemplates) {
            showUpgradeModal('Upgrade to Pro to access all premium templates');
            return;
        }
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
                    {!hasAllTemplates && (
                        <span className="text-[10px] text-muted-foreground">({FREE_TIER_LIMITS.freeTemplateCount} free)</span>
                    )}
                </Label>
            </div>

            {/* Category Selector */}
            <div className="grid grid-cols-3 gap-1.5">
                {(Object.keys(CATEGORY_LABELS) as CategoryType[]).map((category) => {
                    const isPremiumCategory = !isCategoryFree(category) && !hasAllTemplates;
                    return (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleCategorySelect(category)}
                            className={cn(
                                'h-8 text-xs relative',
                                selectedCategory === category && 'bg-primary hover:bg-primary/90 text-primary-foreground',
                                isPremiumCategory && 'opacity-60'
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
                        const isPremium = !isFree && !hasAllTemplates;
                        return (
                            <button
                                key={template.id}
                                onClick={() => handleApplyTemplate(template)}
                                className={cn(
                                    'relative group rounded-lg overflow-hidden transition-all',
                                    isApplied
                                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105'
                                        : 'hover:scale-105 border border-border',
                                    isPremium && 'opacity-60'
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
                    {!hasAllTemplates && ' Upgrade to Pro for all 47 templates!'}
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
