'use client';

import { useEffect } from 'react';
import { useEditorStore } from '@/lib/store/editor-store';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { loadImageFromFile } from '@/lib/utils/image';
import { toast } from 'sonner';

export function KeyboardShortcuts() {
    const { setImage } = useEditorStore();

    // Initialize keyboard shortcuts
    useKeyboardShortcuts();

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

    return null;
}
