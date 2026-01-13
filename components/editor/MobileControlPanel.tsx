'use client';

import { useState, memo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Square, Sun, Frame, Type, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';
import { BackgroundPicker } from '@/components/controls/BackgroundPicker';
import { PaddingControl } from '@/components/controls/PaddingControl';
import { ShadowControl } from '@/components/controls/ShadowControl';
import { BorderRadiusControl } from '@/components/controls/BorderRadiusControl';
import { FramePicker } from '@/components/controls/FramePicker';
import { AspectRatioPicker } from '@/components/controls/AspectRatioPicker';
import { ScaleControl } from '@/components/controls/ScaleControl';
import { TextOverlayControl } from '@/components/controls/TextOverlayControl';
import { TemplatePresets } from '@/components/controls/TemplatePresets';
import { cn } from '@/lib/utils';

// Memoize heavy tab content to prevent unnecessary re-renders
const MemoizedTemplatePresets = memo(TemplatePresets);
const MemoizedBackgroundPicker = memo(BackgroundPicker);
const MemoizedFramePicker = memo(FramePicker);
const MemoizedTextOverlayControl = memo(TextOverlayControl);

const tabs = [
    { value: 'templates', icon: Sparkles, label: 'Templates' },
    { value: 'background', icon: Palette, label: 'BG' },
    { value: 'style', icon: Square, label: 'Style' },
    { value: 'shadow', icon: Sun, label: 'Shadow' },
    { value: 'frame', icon: Frame, label: 'Frame' },
    { value: 'text', icon: Type, label: 'Text' },
];

export function MobileControlPanel() {
    const [isExpanded, setIsExpanded] = useState(false);
    // Persist active tab state so it doesn't reset when panel is collapsed
    const [activeTab, setActiveTab] = useState('templates');

    return (
        <div
            className={cn(
                'fixed left-0 right-0 z-50',
                // Position above ExportBar (which is h-16)
                'bottom-16',
                // Use solid background instead of backdrop-blur for better mobile performance
                'bg-white dark:bg-zinc-900',
                'border-t border-zinc-200 dark:border-zinc-800',
                'rounded-t-3xl shadow-2xl shadow-black/10 dark:shadow-black/30',
                // Fixed height for GPU-optimized animation
                'h-[65vh]',
                // Add will-change hint for better GPU acceleration
                'will-change-transform'
            )}
            style={{
                // Use transform instead of height for GPU-accelerated animation
                transform: isExpanded ? 'translateY(0)' : 'translateY(calc(65vh - 4rem))',
                transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
            {/* Pull handle / Toggle button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full h-16 flex flex-col items-center justify-center gap-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
                <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <div className="flex items-center gap-1.5 text-xs font-medium mt-1">
                    {isExpanded ? (
                        <>
                            <ChevronDown className="w-3.5 h-3.5" />
                            <span>Hide Controls</span>
                        </>
                    ) : (
                        <>
                            <ChevronUp className="w-3.5 h-3.5" />
                            <span>Edit Controls</span>
                        </>
                    )}
                </div>
            </button>

            {/* Expandable content - always mounted for performance, hidden with opacity/pointer-events */}
            <div
                className={cn(
                    "h-[calc(65vh-4rem)] overflow-hidden transition-opacity duration-200",
                    isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
            >
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
                            {/* Tab navigation */}
                            <div className="px-3 pb-2 shrink-0">
                                <TabsList className="w-full grid grid-cols-6 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl h-12 p-1 gap-0.5">
                                    {tabs.map((tab) => (
                                        <TabsTrigger
                                            key={tab.value}
                                            value={tab.value}
                                            className={cn(
                                                'rounded-lg h-full flex-col gap-0.5 transition-all duration-200',
                                                'data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700',
                                                'data-[state=active]:shadow-sm',
                                                'data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400',
                                                'data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white'
                                            )}
                                        >
                                            <tab.icon className="w-4 h-4" />
                                            <span className="text-[9px] font-medium">{tab.label}</span>
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>

                            {/* Scrollable content - use passive scrolling for better performance */}
                            <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700" style={{ overscrollBehavior: 'contain' }}>
                                <TabsContent value="templates" className="mt-0 space-y-4">
                                    <MemoizedTemplatePresets />
                                </TabsContent>

                                <TabsContent value="background" className="mt-0 space-y-4">
                                    <MemoizedBackgroundPicker />
                                </TabsContent>

                                <TabsContent value="style" className="mt-0 space-y-4">
                                    <PaddingControl />
                                    <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 pt-4">
                                        <BorderRadiusControl />
                                    </div>
                                    <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 pt-4">
                                        <ScaleControl />
                                    </div>
                                    <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 pt-4">
                                        <AspectRatioPicker />
                                    </div>
                                </TabsContent>

                                <TabsContent value="shadow" className="mt-0 space-y-4">
                                    <ShadowControl />
                                </TabsContent>

                                <TabsContent value="frame" className="mt-0 space-y-4">
                                    <MemoizedFramePicker />
                                </TabsContent>

                                <TabsContent value="text" className="mt-0 space-y-4">
                                    <MemoizedTextOverlayControl />
                                </TabsContent>
                            </div>
                        </Tabs>
            </div>
        </div>
    );
}
