'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Square, Sun, Frame, Type, Sparkles } from 'lucide-react';
import { BackgroundPicker } from '@/components/controls/BackgroundPicker';
import { PaddingControl } from '@/components/controls/PaddingControl';
import { ShadowControl } from '@/components/controls/ShadowControl';
import { BorderRadiusControl } from '@/components/controls/BorderRadiusControl';
import { FramePicker } from '@/components/controls/FramePicker';
import { AspectRatioPicker } from '@/components/controls/AspectRatioPicker';
import { ScaleControl } from '@/components/controls/ScaleControl';
import { TextOverlayControl } from '@/components/controls/TextOverlayControl';
import { TemplatePresets } from '@/components/controls/TemplatePresets';
import { useEditorStore } from '@/lib/store/editor-store';
import { cn } from '@/lib/utils';

const tabs = [
    { value: 'templates', icon: Sparkles, label: 'Templates' },
    { value: 'background', icon: Palette, label: 'Background' },
    { value: 'style', icon: Square, label: 'Style' },
    { value: 'shadow', icon: Sun, label: 'Shadow' },
    { value: 'frame', icon: Frame, label: 'Frame' },
    { value: 'text', icon: Type, label: 'Text' },
];

export function ControlPanel() {
    const { originalImage } = useEditorStore();

    if (!originalImage) {
        return (
            <div className="w-80 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-l border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center">
                <div className="text-center p-6">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                        <Palette className="w-7 h-7 text-zinc-400 dark:text-zinc-500" />
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Upload an image to start editing</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-80 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-l border-zinc-200/50 dark:border-zinc-800/50 flex flex-col h-full">
            <Tabs defaultValue="templates" className="w-full flex flex-col flex-1 overflow-hidden">
                {/* Tab navigation */}
                <div className="p-3 border-b border-zinc-200/50 dark:border-zinc-800/50 flex-shrink-0">
                    <TabsList className="w-full grid grid-cols-6 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl h-11 p-1 gap-0.5">
                        {tabs.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className={cn(
                                    'rounded-lg h-full transition-all duration-200',
                                    'data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700',
                                    'data-[state=active]:shadow-sm',
                                    'data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400',
                                    'data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white',
                                    'hover:text-zinc-900 dark:hover:text-white'
                                )}
                            >
                                <tab.icon className="w-4 h-4" />
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {/* Scrollable content area */}
                <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                    <TabsContent value="templates" className="mt-0 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-zinc-400" />
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Templates</h3>
                            </div>
                            <TemplatePresets />
                        </div>
                    </TabsContent>

                    <TabsContent value="background" className="mt-0 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Palette className="w-4 h-4 text-zinc-400" />
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Background</h3>
                            </div>
                            <BackgroundPicker />
                        </div>
                    </TabsContent>

                    <TabsContent value="style" className="mt-0 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Square className="w-4 h-4 text-zinc-400" />
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Style</h3>
                            </div>
                            <PaddingControl />
                        </div>
                        <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 pt-6">
                            <BorderRadiusControl />
                        </div>
                        <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 pt-6">
                            <ScaleControl />
                        </div>
                        <div className="border-t border-zinc-200/50 dark:border-zinc-800/50 pt-6">
                            <AspectRatioPicker />
                        </div>
                    </TabsContent>

                    <TabsContent value="shadow" className="mt-0 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Sun className="w-4 h-4 text-zinc-400" />
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Shadow</h3>
                            </div>
                            <ShadowControl />
                        </div>
                    </TabsContent>

                    <TabsContent value="frame" className="mt-0 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Frame className="w-4 h-4 text-zinc-400" />
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Frame</h3>
                            </div>
                            <FramePicker />
                        </div>
                    </TabsContent>

                    <TabsContent value="text" className="mt-0 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Type className="w-4 h-4 text-zinc-400" />
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Text Overlay</h3>
                            </div>
                            <TextOverlayControl />
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
