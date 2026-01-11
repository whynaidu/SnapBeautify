'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from './Header';
import { Canvas } from './Canvas';
import { ControlPanel } from './ControlPanel';
import { ExportBar } from './ExportBar';
import { MobileControlPanel } from './MobileControlPanel';
import { CropActionButtons } from './CropActionButtons';
import { KeyboardShortcuts } from '@/components/shared/KeyboardShortcuts';
import { useEditorStore } from '@/lib/store/editor-store';

// Animated background component matching landing page
function EditorBackground() {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Base background */}
            <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-950" />

            {/* Subtle grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
                    backgroundSize: '32px 32px',
                }}
            />

            {/* Large gradient orbs */}
            <motion.div
                className="absolute -top-64 -left-64 w-[600px] h-[600px] rounded-full bg-violet-500/10 dark:bg-violet-400/5 blur-3xl"
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute -bottom-64 -right-64 w-[600px] h-[600px] rounded-full bg-pink-500/10 dark:bg-pink-400/5 blur-3xl"
                animate={{
                    x: [0, -50, 0],
                    y: [0, -30, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-500/5 dark:bg-blue-400/3 blur-3xl"
                animate={{
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            />
        </div>
    );
}

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
        <div className="h-screen w-full flex flex-col overflow-hidden supports-[height:100cqh]:h-[100cqh] supports-[height:100dvh]:h-[100dvh]">
            {/* Animated background */}
            <EditorBackground />

            {/* Main content with glass effect */}
            <div className="relative z-10 flex flex-col h-full">
                <Header />

                <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
                    <Canvas />
                    {/* Desktop: Show sidebar only when image is loaded (hide when cropping), Mobile: Hide (use bottom sheet) */}
                    {originalImage && !isCropping && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="hidden md:block h-full"
                        >
                            <ControlPanel />
                        </motion.div>
                    )}
                </div>

                {/* Hide export bar when cropping or no image */}
                {originalImage && !isCropping && <ExportBar />}

                {/* Mobile: Show bottom control panel (hide when cropping) */}
                {isMobile && originalImage && !isCropping && <MobileControlPanel />}

                {/* Show crop action buttons when in crop mode */}
                {isCropping && <CropActionButtons />}
            </div>

            {/* Global keyboard shortcuts handler */}
            <KeyboardShortcuts />
        </div>
    );
}
