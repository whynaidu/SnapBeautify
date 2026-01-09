'use client';

import { useEffect, useState } from 'react';
import { useEditorStore } from '@/lib/store/editor-store';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { loadImageFromFile } from '@/lib/utils/image';
import { toast } from 'sonner';
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

export function KeyboardShortcuts() {
    const { setImage, clearImage } = useEditorStore();
    const [showClearDialog, setShowClearDialog] = useState(false);

    const handleClearConfirm = () => {
        clearImage();
        setShowClearDialog(false);
        toast.info('Image cleared');
    };

    // Initialize keyboard shortcuts with clear callback
    useKeyboardShortcuts({
        onClear: () => setShowClearDialog(true),
    });

    // Handle paste from clipboard
    useEffect(() => {
        const handlePaste = async (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (const item of items) {
                if (item.type.startsWith('image/')) {
                    const blob = item.getAsFile();
                    if (blob) {
                        try {
                            const { image, dataUrl } = await loadImageFromFile(blob);
                            setImage(image, dataUrl);
                            toast.success('Image pasted!');
                            e.preventDefault();
                        } catch (error) {
                            toast.error('Failed to paste image');
                        }
                        break;
                    }
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [setImage]);

    return (
        <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Clear image?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will remove the current image and all adjustments. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearConfirm}>
                        Clear Image
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
