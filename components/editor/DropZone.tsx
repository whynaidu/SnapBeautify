'use client';

import { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, Clipboard } from 'lucide-react';
import { useEditorStore } from '@/lib/store/editor-store';
import { loadImageFromFile } from '@/lib/utils/image';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function DropZone() {
    const { setImage, originalImage } = useEditorStore();

    const loadImage = useCallback(
        async (file: File | Blob) => {
            try {
                const { image, dataUrl } = await loadImageFromFile(file);
                setImage(image, dataUrl);
                toast.success('Image loaded successfully!');
            } catch (error) {
                toast.error('Failed to load image');
            }
        },
        [setImage]
    );

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                loadImage(acceptedFiles[0]);
            }
        },
        [loadImage]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'],
        },
        maxFiles: 1,
    });

    // Handle paste from clipboard
    const handlePaste = useCallback(
        async (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            for (const item of items) {
                if (item.type.startsWith('image/')) {
                    const blob = item.getAsFile();
                    if (blob) {
                        await loadImage(blob);
                        e.preventDefault();
                    }
                    break;
                }
            }
        },
        [loadImage]
    );

    // Add paste listener
    useEffect(() => {
        document.addEventListener('paste', handlePaste);
        return () => document.removeEventListener('paste', handlePaste);
    }, [handlePaste]);

    // Don't show drop zone if image is already loaded
    if (originalImage) return null;

    return (
        <div
            {...getRootProps()}
            className={cn(
                'flex flex-col items-center justify-center',
                'w-full h-full min-h-[400px]',
                'border-2 border-dashed rounded-xl',
                'cursor-pointer transition-all duration-200',
                isDragActive
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900/50'
            )}
        >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center gap-4 p-8 text-center">
                <div
                    className={cn(
                        'p-4 rounded-full',
                        isDragActive ? 'bg-indigo-500/20' : 'bg-zinc-800'
                    )}
                >
                    {isDragActive ? (
                        <ImageIcon className="w-8 h-8 text-indigo-500" />
                    ) : (
                        <Upload className="w-8 h-8 text-zinc-400" />
                    )}
                </div>

                <div>
                    <p className="text-lg font-medium text-zinc-200">
                        {isDragActive ? 'Drop your image here' : 'Drag & drop your screenshot'}
                    </p>
                    <p className="text-sm text-zinc-500 mt-1">or click to browse</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-600">
                    <Clipboard className="w-3 h-3" />
                    <span>You can also paste from clipboard (⌘V)</span>
                </div>

                <p className="text-xs text-zinc-600">Supports PNG, JPG, WebP, GIF</p>
            </div>
        </div>
    );
}
