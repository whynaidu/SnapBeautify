'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Square, Sun, Frame } from 'lucide-react';
import { BackgroundPicker } from '@/components/controls/BackgroundPicker';
import { PaddingControl } from '@/components/controls/PaddingControl';
import { ShadowControl } from '@/components/controls/ShadowControl';
import { BorderRadiusControl } from '@/components/controls/BorderRadiusControl';
import { FramePicker } from '@/components/controls/FramePicker';
import { AspectRatioPicker } from '@/components/controls/AspectRatioPicker';
import { ScaleControl } from '@/components/controls/ScaleControl';
import { useEditorStore } from '@/lib/store/editor-store';

export function ControlPanel() {
    const { originalImage } = useEditorStore();

    if (!originalImage) {
        return (
            <div className="w-80 bg-background border-l border-border flex items-center justify-center">
                <div className="text-center p-6">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                        <Palette className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Upload an image to start editing</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-80 bg-background border-l border-border overflow-y-auto">
            <Tabs defaultValue="background" className="w-full">
                <TabsList className="w-full grid grid-cols-4 bg-background border-b border-border rounded-none h-12 p-0">
                    <TabsTrigger
                        value="background"
                        className="rounded-none data-[state=active]:bg-muted data-[state=active]:shadow-none h-full"
                    >
                        <Palette className="w-4 h-4" />
                    </TabsTrigger>
                    <TabsTrigger
                        value="style"
                        className="rounded-none data-[state=active]:bg-muted data-[state=active]:shadow-none h-full"
                    >
                        <Square className="w-4 h-4" />
                    </TabsTrigger>
                    <TabsTrigger
                        value="shadow"
                        className="rounded-none data-[state=active]:bg-muted data-[state=active]:shadow-none h-full"
                    >
                        <Sun className="w-4 h-4" />
                    </TabsTrigger>
                    <TabsTrigger
                        value="frame"
                        className="rounded-none data-[state=active]:bg-muted data-[state=active]:shadow-none h-full"
                    >
                        <Frame className="w-4 h-4" />
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
                </div>
            </Tabs>
        </div>
    );
}
