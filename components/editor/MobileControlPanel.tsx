'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Square, Sun, Frame, Type, ChevronUp, ChevronDown } from 'lucide-react';
import { BackgroundPicker } from '@/components/controls/BackgroundPicker';
import { PaddingControl } from '@/components/controls/PaddingControl';
import { ShadowControl } from '@/components/controls/ShadowControl';
import { BorderRadiusControl } from '@/components/controls/BorderRadiusControl';
import { FramePicker } from '@/components/controls/FramePicker';
import { AspectRatioPicker } from '@/components/controls/AspectRatioPicker';
import { ScaleControl } from '@/components/controls/ScaleControl';
import { TextOverlayControl } from '@/components/controls/TextOverlayControl';
import { Button } from '@/components/ui/button';

export function MobileControlPanel() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className={`
        fixed bottom-16 left-0 right-0 bg-background border-t border-border
        transition-all duration-300 ease-out z-50
        ${isExpanded ? 'h-[60vh] shadow-2xl' : 'h-14'}
      `}
        >
            {/* Toggle button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full h-14 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
                {isExpanded ? (
                    <>
                        <ChevronDown className="w-5 h-5" />
                        <span className="text-sm">Hide Controls</span>
                    </>
                ) : (
                    <>
                        <ChevronUp className="w-5 h-5" />
                        <span className="text-sm">Show Controls</span>
                    </>
                )}
            </button>

            {/* Expandable content */}
            {isExpanded && (
                <div className="h-[calc(60vh-3.5rem)] overflow-y-auto">
                    <Tabs defaultValue="background" className="w-full">
                        <TabsList className="w-full grid grid-cols-5 bg-background border-b border-border rounded-none h-12 p-0 sticky top-0 z-10">
                            <TabsTrigger
                                value="background"
                                className="rounded-none data-[state=active]:bg-muted data-[state=active]:shadow-none h-full flex-col gap-0.5"
                            >
                                <Palette className="w-4 h-4" />
                                <span className="text-[10px]">BG</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="style"
                                className="rounded-none data-[state=active]:bg-muted data-[state=active]:shadow-none h-full flex-col gap-0.5"
                            >
                                <Square className="w-4 h-4" />
                                <span className="text-[10px]">Style</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="shadow"
                                className="rounded-none data-[state=active]:bg-muted data-[state=active]:shadow-none h-full flex-col gap-0.5"
                            >
                                <Sun className="w-4 h-4" />
                                <span className="text-[10px]">Shadow</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="frame"
                                className="rounded-none data-[state=active]:bg-muted data-[state=active]:shadow-none h-full flex-col gap-0.5"
                            >
                                <Frame className="w-4 h-4" />
                                <span className="text-[10px]">Frame</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="text"
                                className="rounded-none data-[state=active]:bg-muted data-[state=active]:shadow-none h-full flex-col gap-0.5"
                            >
                                <Type className="w-4 h-4" />
                                <span className="text-[10px]">Text</span>
                            </TabsTrigger>
                        </TabsList>

                        <div className="p-4">
                            <TabsContent value="background" className="mt-0 space-y-6">
                                <BackgroundPicker />
                            </TabsContent>

                            <TabsContent value="style" className="mt-0 space-y-6">
                                <PaddingControl />
                                <div className="border-t border-border pt-6">
                                    <BorderRadiusControl />
                                </div>
                                <div className="border-t border-border pt-6">
                                    <ScaleControl />
                                </div>
                                <div className="border-t border-border pt-6">
                                    <AspectRatioPicker />
                                </div>
                            </TabsContent>

                            <TabsContent value="shadow" className="mt-0 space-y-6">
                                <ShadowControl />
                            </TabsContent>

                            <TabsContent value="frame" className="mt-0 space-y-6">
                                <FramePicker />
                            </TabsContent>

                            <TabsContent value="text" className="mt-0 space-y-6">
                                <TextOverlayControl />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            )}
        </div>
    );
}
