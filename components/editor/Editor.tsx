'use client';

import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Canvas } from './Canvas';
import { ControlPanel } from './ControlPanel';
import { ExportBar } from './ExportBar';
import { MobileControlPanel } from './MobileControlPanel';
import { CropActionButtons } from './CropActionButtons';
import { KeyboardShortcuts } from '@/components/shared/KeyboardShortcuts';
import { useEditorStore } from '@/lib/store/editor-store';

export function Editor() {
    const [isMobile, setIsMobile] = useState(false);
    const { originalImage, isCropping } = useEditorStore();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="h-screen w-full flex flex-col bg-background text-foreground overflow-hidden supports-[height:100cqh]:h-[100cqh] supports-[height:100dvh]:h-[100dvh]">
            <Header />

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                <Canvas />
                {/* Desktop: Show sidebar (hide when cropping), Mobile: Hide (use bottom sheet) */}
                {!isCropping && (
                    <div className="hidden md:block h-full">
                        <ControlPanel />
                    </div>
                )}
            </div>

            {/* Hide export bar when cropping */}
            {!isCropping && <ExportBar />}

            {/* Mobile: Show bottom control panel (hide when cropping) */}
            {isMobile && originalImage && !isCropping && <MobileControlPanel />}

            {/* Show crop action buttons when in crop mode */}
            {isCropping && <CropActionButtons />}

            {/* Global keyboard shortcuts handler */}
            <KeyboardShortcuts />
        </div>
    );
}
