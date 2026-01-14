'use client';

import { useState, memo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Square, Sun, Frame, Type, Sparkles, ChevronDown } from 'lucide-react';
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

// Memoize heavy components
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

export function MobileControlPanelV2() {
    const [activeTab, setActiveTab] = useState<string | null>(null);

    const handleTabClick = (value: string) => {
        // Toggle: if clicking active tab, close it
        setActiveTab(activeTab === value ? null : value);
    };

    return (
        <>
            {/* Compact Control Bar - Always visible at bottom above ExportBar */}
            <div
                className={cn(
                    'fixed left-0 right-0 z-40',
                    'bottom-16', // Above ExportBar
                    'bg-zinc-900/95 backdrop-blur-xl',
                    'border-t border-zinc-800',
                    'shadow-lg',
                    'transition-all duration-300'
                )}
            >
                {/* Tab Navigation */}
                <div className="px-3 py-2">
                    <Tabs value={activeTab || ''} className="w-full">
                        <TabsList className="w-full grid grid-cols-6 bg-zinc-800/80 rounded-xl h-12 p-1 gap-0.5">
                            {tabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    onClick={() => handleTabClick(tab.value)}
                                    className={cn(
                                        'rounded-lg h-full flex-col gap-0.5 transition-all duration-200',
                                        'data-[state=active]:bg-zinc-700',
                                        'data-[state=active]:shadow-sm',
                                        'data-[state=inactive]:text-zinc-400',
                                        'data-[state=active]:text-white'
                                    )}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    <span className="text-[9px] font-medium">{tab.label}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {/* Bottom Sheet - Slides up when tab is active, max 50vh to keep canvas visible */}
            {activeTab && (
                <div
                    className={cn(
                        'fixed left-0 right-0 z-39',
                        'bottom-[calc(4rem+3.5rem)]', // Above control bar + export bar
                        'max-h-[50vh]',
                        'bg-zinc-900/98 backdrop-blur-xl',
                        'border-t border-zinc-800',
                        'rounded-t-3xl',
                        'shadow-2xl',
                        'overflow-hidden',
                        'animate-in slide-in-from-bottom duration-300'
                    )}
                >
                    {/* Collapse Handle */}
                    <div className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur-xl">
                        <button
                            onClick={() => setActiveTab(null)}
                            className="w-full py-2 flex flex-col items-center gap-1 hover:bg-zinc-800/50 transition-colors"
                        >
                            <div className="w-10 h-1 rounded-full bg-zinc-700" />
                            <ChevronDown className="w-4 h-4 text-zinc-500" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto max-h-[calc(50vh-3rem)] px-4 pb-4 scrollbar-thin scrollbar-thumb-zinc-700">
                        {activeTab === 'templates' && <MemoizedTemplatePresets />}
                        {activeTab === 'background' && <MemoizedBackgroundPicker />}
                        {activeTab === 'frame' && <MemoizedFramePicker />}
                        {activeTab === 'text' && <MemoizedTextOverlayControl />}

                        {activeTab === 'style' && (
                            <div className="space-y-4">
                                <PaddingControl />
                                <div className="border-t border-zinc-800/50 pt-4">
                                    <BorderRadiusControl />
                                </div>
                                <div className="border-t border-zinc-800/50 pt-4">
                                    <ScaleControl />
                                </div>
                                <div className="border-t border-zinc-800/50 pt-4">
                                    <AspectRatioPicker />
                                </div>
                            </div>
                        )}

                        {activeTab === 'shadow' && (
                            <div className="space-y-4">
                                <ShadowControl />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
