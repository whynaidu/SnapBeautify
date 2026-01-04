'use client';

import { Header } from './Header';
import { Canvas } from './Canvas';
import { ControlPanel } from './ControlPanel';
import { ExportBar } from './ExportBar';
import { KeyboardShortcuts } from '@/components/shared/KeyboardShortcuts';

export function Editor() {
    return (
        <div className="h-screen flex flex-col bg-zinc-950 text-white overflow-hidden">
            <Header />

            <div className="flex-1 flex overflow-hidden">
                <Canvas />
                <ControlPanel />
            </div>

            <ExportBar />

            {/* Global keyboard shortcuts handler */}
            <KeyboardShortcuts />
        </div>
    );
}
