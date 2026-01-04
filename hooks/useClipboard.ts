'use client';

import { useCallback } from 'react';
import { useEditorStore } from '@/lib/store/editor-store';
import { loadImageFromFile } from '@/lib/utils/image';
import { toast } from 'sonner';

export function useClipboard() {
    const { setImage } = useEditorStore();

    const handlePasteImage = useCallback(async (e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return false;

        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const blob = item.getAsFile();
                if (blob) {
                    try {
                        const { image, dataUrl } = await loadImageFromFile(blob);
                        setImage(image, dataUrl);
                        toast.success('Image pasted successfully!');
                        e.preventDefault();
                        return true;
                    } catch (error) {
                        toast.error('Failed to paste image');
                        return false;
                    }
                }
            }
        }
        return false;
    }, [setImage]);

    return {
        handlePasteImage,
    };
}
