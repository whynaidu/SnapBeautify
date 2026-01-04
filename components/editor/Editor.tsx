'use client';

import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Canvas } from './Canvas';
import { ControlPanel } from './ControlPanel';
import { ExportBar } from './ExportBar';
import { MobileControlPanel } from './MobileControlPanel';
import { KeyboardShortcuts } from '@/components/shared/KeyboardShortcuts';
import { useEditorStore } from '@/lib/store/editor-store';

export function Editor() {
    const [isMobile, setIsMobile] = useState(false);
    const { originalImage } = useEditorStore();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="h-screen flex flex-col bg-zinc-950 text-white overflow-hidden">
            <Header />

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                <Canvas />
                {/* Desktop: Show sidebar, Mobile: Hide (use bottom sheet) */}
                <div className="hidden md:block">
                    <ControlPanel />
                </div>
            </div>

            <ExportBar />

            {/* Mobile: Show bottom control panel */}
            {isMobile && originalImage && <MobileControlPanel />}

            {/* Global keyboard shortcuts handler */}
            <KeyboardShortcuts />
        </div>
    );
}
