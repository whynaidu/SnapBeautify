'use client';

import { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Crown, Loader2 } from 'lucide-react';
import { useBackgroundState, useBackgroundActions, useEditorStore } from '@/lib/store/editor-store';
import { useSubscription } from '@/lib/subscription/context';
import { cn } from '@/lib/utils';
import { BackgroundControlsErrorBoundary } from '@/components/ErrorBoundary';

// Static imports for lightweight components
import {
    SolidColorSection,
    GradientSection,
    LogoPatternSection,
} from './background';

// Dynamic imports for heavier components (text pattern ~400 lines, wave split ~220 lines)
const TextPatternSection = dynamic(
    () => import('./background/TextPatternSection').then(mod => ({ default: mod.TextPatternSection })),
    {
        loading: () => <SectionLoadingFallback label="Loading text controls..." />,
        ssr: false,
    }
);

const WaveSplitSection = dynamic(
    () => import('./background/WaveSplitSection').then(mod => ({ default: mod.WaveSplitSection })),
    {
        loading: () => <SectionLoadingFallback label="Loading wave controls..." />,
        ssr: false,
    }
);

// Loading fallback for dynamic sections
function SectionLoadingFallback({ label }: { label: string }) {
    return (
        <div className="p-4 bg-muted/30 rounded-lg border border-border flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{label}</span>
        </div>
    );
}

export function BackgroundPicker() {
    // Use optimized selectors instead of full store
    const backgroundState = useBackgroundState();
    const backgroundActions = useBackgroundActions();

    // Only subscribe to backgroundType for type selector (using individual selector for minimal re-renders)
    const setBackgroundType = useEditorStore(state => state.setBackgroundType);

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
    } = backgroundState;

    const {
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
    } = backgroundActions;

    // Subscription access (for PRO badge only)
    const { isPro } = useSubscription();

    // Derived state
    const isMeshActive = backgroundType === 'mesh';
    const isGradientActive = backgroundType === 'gradient';

    // Memoized handlers
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

    const handleSetBackgroundType = useCallback((type: typeof backgroundType) => {
        setBackgroundType(type);
    }, [setBackgroundType]);

    return (
        <div className="space-y-4">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                Background
            </Label>

            {/* Type Selector */}
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Background type">
                <Button
                    variant={backgroundType === 'solid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSetBackgroundType('solid')}
                    className={cn(
                        'h-9',
                        backgroundType === 'solid' && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    )}
                    role="radio"
                    aria-checked={backgroundType === 'solid'}
                >
                    Solid
                </Button>
                <Button
                    variant={backgroundType === 'gradient' || backgroundType === 'mesh' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSetBackgroundType('gradient')}
                    className={cn(
                        'h-9',
                        (backgroundType === 'gradient' || backgroundType === 'mesh') && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    )}
                    role="radio"
                    aria-checked={backgroundType === 'gradient' || backgroundType === 'mesh'}
                >
                    Gradient
                </Button>
                <Button
                    variant={backgroundType === 'waveSplit' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSetBackgroundType('waveSplit')}
                    className={cn(
                        'h-9 relative',
                        backgroundType === 'waveSplit' && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    )}
                    role="radio"
                    aria-checked={backgroundType === 'waveSplit'}
                    aria-label={`Wave${!isPro ? ' (Pro feature)' : ''}`}
                >
                    Wave
                    {!isPro && (
                        <>
                            <Crown className="w-3 h-3 absolute -top-1 -right-1 text-orange-500" aria-hidden="true" />
                            <span className="sr-only">(Pro feature)</span>
                        </>
                    )}
                </Button>
                <Button
                    variant={backgroundType === 'textPattern' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSetBackgroundType('textPattern')}
                    className={cn(
                        'h-9',
                        backgroundType === 'textPattern' && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    )}
                    role="radio"
                    aria-checked={backgroundType === 'textPattern'}
                >
                    Text
                </Button>
                <Button
                    variant={backgroundType === 'logoPattern' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSetBackgroundType('logoPattern')}
                    className={cn(
                        'h-9 relative',
                        backgroundType === 'logoPattern' && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    )}
                    role="radio"
                    aria-checked={backgroundType === 'logoPattern'}
                    aria-label={`Logo${!isPro ? ' (Pro feature)' : ''}`}
                >
                    Logo
                    {!isPro && (
                        <>
                            <Crown className="w-3 h-3 absolute -top-1 -right-1 text-orange-500" aria-hidden="true" />
                            <span className="sr-only">(Pro feature)</span>
                        </>
                    )}
                </Button>
                <Button
                    variant={backgroundType === 'transparent' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleSetBackgroundType('transparent')}
                    className={cn(
                        'h-9',
                        backgroundType === 'transparent' && 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    )}
                    role="radio"
                    aria-checked={backgroundType === 'transparent'}
                >
                    None
                </Button>
            </div>

            {/* Solid Colors */}
            {backgroundType === 'solid' && (
                <BackgroundControlsErrorBoundary sectionName="Solid colors">
                    <SolidColorSection
                        backgroundColor={backgroundColor}
                        isPro={isPro}
                        onColorClick={handleColorClick}
                        onColorChange={handleUpdateBackgroundColor}
                    />
                </BackgroundControlsErrorBoundary>
            )}

            {/* Gradients */}
            {(backgroundType === 'gradient' || backgroundType === 'mesh') && (
                <BackgroundControlsErrorBoundary sectionName="Gradient controls">
                    <GradientSection
                        isGradientActive={isGradientActive}
                        isMeshActive={isMeshActive}
                        gradientColors={gradientColors}
                        gradientAngle={gradientAngle}
                        meshGradientCSS={meshGradientCSS}
                        isPro={isPro}
                        onGradientClick={handleGradientClick}
                        onMeshClick={handleMeshClick}
                        onGradientChange={handleUpdateGradientColors}
                    />
                </BackgroundControlsErrorBoundary>
            )}

            {/* Text Pattern - Dynamically loaded */}
            {backgroundType === 'textPattern' && (
                <BackgroundControlsErrorBoundary sectionName="Text pattern controls">
                    <TextPatternSection
                        gradientColors={gradientColors}
                        gradientAngle={gradientAngle}
                        textPatternText={textPatternText}
                        textPatternPositions={textPatternPositions}
                        textPatternFontFamily={textPatternFontFamily}
                        textPatternFontSize={textPatternFontSize}
                        textPatternFontWeight={textPatternFontWeight}
                        textPatternRows={textPatternRows}
                        isPro={isPro}
                        onUpdateGradientColors={handleUpdateGradientColors}
                        onSetTextPatternText={setTextPatternText}
                        onToggleTextPatternPosition={toggleTextPatternPosition}
                        onSetTextPatternFontFamily={setTextPatternFontFamily}
                        onSetTextPatternFontSize={setTextPatternFontSize}
                        onSetTextPatternFontWeight={setTextPatternFontWeight}
                        onSetTextPatternRows={setTextPatternRows}
                    />
                </BackgroundControlsErrorBoundary>
            )}

            {/* Wave Split - Dynamically loaded */}
            {backgroundType === 'waveSplit' && (
                <BackgroundControlsErrorBoundary sectionName="Wave split controls">
                    <WaveSplitSection
                        waveSplitFlipped={waveSplitFlipped}
                        backgroundColor={backgroundColor}
                        gradientColors={gradientColors}
                        gradientAngle={gradientAngle}
                        onToggleWaveSplitFlip={toggleWaveSplitFlip}
                        onUpdateBackgroundColor={handleUpdateBackgroundColor}
                        onUpdateGradientColors={handleUpdateGradientColors}
                    />
                </BackgroundControlsErrorBoundary>
            )}

            {/* Logo Pattern */}
            {backgroundType === 'logoPattern' && (
                <BackgroundControlsErrorBoundary sectionName="Logo pattern controls">
                    <LogoPatternSection
                        logoPatternImage={logoPatternImage}
                        logoPatternOpacity={logoPatternOpacity}
                        logoPatternSize={logoPatternSize}
                        logoPatternSpacing={logoPatternSpacing}
                        gradientColors={gradientColors}
                        gradientAngle={gradientAngle}
                        onLogoPattern={setLogoPattern}
                        onClearLogoPattern={clearLogoPattern}
                        onLogoPatternOpacity={setLogoPatternOpacity}
                        onLogoPatternSize={setLogoPatternSize}
                        onLogoPatternSpacing={setLogoPatternSpacing}
                        onUpdateGradientColors={handleUpdateGradientColors}
                    />
                </BackgroundControlsErrorBoundary>
            )}

            {/* Transparent - No additional controls needed */}
            {backgroundType === 'transparent' && (
                <div className="p-4 bg-muted/30 rounded-lg border border-border text-center">
                    <p className="text-sm text-muted-foreground">
                        Transparent background - exports as PNG with alpha channel
                    </p>
                </div>
            )}
        </div>
    );
}
