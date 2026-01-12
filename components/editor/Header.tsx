'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, RotateCcw, Crop, Undo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useEditorStore } from '@/lib/store/editor-store';
import { toast } from 'sonner';
import { UserMenu } from '@/components/auth/UserMenu';

export function Header() {
    const { resetToDefaults, originalImage, enterCropMode, isCropping, uncroppedImage, revertCrop } = useEditorStore();
    const [showResetDialog, setShowResetDialog] = useState(false);

    const handleResetConfirm = () => {
        resetToDefaults();
        setShowResetDialog(false);
        toast.info('All settings reset to defaults');
    };

    const handleCrop = () => {
        enterCropMode();
        toast.info('Drag and resize the crop area, then click Apply');
    };

    const handleRevertCrop = () => {
        revertCrop();
        toast.success('Crop reverted to original image');
    };

    return (
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50">
            {/* Logo and brand */}
            <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-3 group">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center shadow-lg shadow-black/10 dark:shadow-white/10"
                    >
                        <Sparkles className="w-5 h-5 text-white dark:text-black" />
                    </motion.div>
                    <div className="hidden sm:block">
                        <span className="text-lg font-bold text-zinc-900 dark:text-white">SnapBeautify</span>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 -mt-0.5">Transform your photos</p>
                    </div>
                </Link>
            </div>

            {/* Action buttons - center */}
            <div className="flex items-center gap-1 sm:gap-2">
                {originalImage && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 sm:gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-full p-1"
                    >
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCrop}
                            disabled={isCropping}
                            className="rounded-full text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-700 h-8 px-3"
                        >
                            <Crop className="w-4 h-4 sm:mr-1.5" />
                            <span className="hidden sm:inline text-xs font-medium">Crop</span>
                        </Button>
                        {uncroppedImage && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleRevertCrop}
                                className="rounded-full text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-700 h-8 px-3"
                            >
                                <Undo className="w-4 h-4 sm:mr-1.5" />
                                <span className="hidden sm:inline text-xs font-medium">Revert</span>
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowResetDialog(true)}
                            className="rounded-full text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-700 h-8 px-3"
                        >
                            <RotateCcw className="w-4 h-4 sm:mr-1.5" />
                            <span className="hidden sm:inline text-xs font-medium">Reset</span>
                        </Button>
                    </motion.div>
                )}
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2">
                {/* User Menu */}
                <UserMenu />
            </div>

            {/* Reset confirmation dialog */}
            <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                <AlertDialogContent className="rounded-2xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-zinc-900 dark:text-white">Reset all settings?</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-500 dark:text-zinc-400">
                            This will reset all adjustments to their default values. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-full border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleResetConfirm}
                            className="rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200"
                        >
                            Reset All
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </header>
    );
}
