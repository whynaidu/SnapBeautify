'use client';

import { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, Clipboard } from 'lucide-react';
import { useEditorStore } from '@/lib/store/editor-store';
import { loadImageFromFile } from '@/lib/utils/image';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { retryWithBackoff, validateImageFile, handleError, getUserFriendlyError, ERROR_MESSAGES } from '@/lib/utils/error-handling';
import { logger, analytics } from '@/lib/utils/logger';
import { measureImageLoad } from '@/lib/utils/performance';

export function DropZone() {
    const { setImage, originalImage } = useEditorStore();

    const loadImage = useCallback(
        async (file: File | Blob) => {
            try {
                // Validate file if it's a File object
                if (file instanceof File) {
                    const validation = validateImageFile(file);
                    if (!validation.valid) {
                        const errorMsg = validation.error ? ERROR_MESSAGES[validation.error] : null;
                        toast.error(errorMsg?.title || 'Invalid file', {
                            description: errorMsg?.message || validation.message,
                        });
                        logger.warn('file_validation_failed', validation.message || 'Unknown validation error', {
                            fileName: file.name,
                            fileSize: file.size,
                            fileType: file.type,
                        });
                        return;
                    }
                }

                // Load image with retry logic and performance monitoring
                const result = await measureImageLoad(
                    'image:load',
                    async () => {
                        return await retryWithBackoff(
                            () => loadImageFromFile(file),
                            'load_image',
                            {
                                maxRetries: 2,
                                baseDelay: 300,
                                shouldRetry: (error) => {
                                    // Retry on timeout or generic load errors, but not on validation errors
                                    return error.message.includes('timeout') ||
                                           error.message.includes('loading') ||
                                           error.message.includes('load image');
                                },
                            }
                        );
                    },
                    {
                        fileSize: file.size,
                        fileType: file instanceof File ? file.type : 'blob',
                    }
                );

                setImage(result.image, result.dataUrl);
                toast.success('Image loaded successfully!');
                analytics.track('image_loaded', {
                    fileSize: file.size,
                    fileType: file instanceof File ? file.type : 'blob',
                });
            } catch (error) {
                const appError = handleError(error, {
                    fileName: file instanceof File ? file.name : 'blob',
                    fileSize: file.size,
                });

                const friendlyError = getUserFriendlyError(appError);
                toast.error(friendlyError.title, {
                    description: friendlyError.message,
                });

                logger.error('image_load_failed', appError.originalError || new Error(appError.message), {
                    context: appError.context,
                });
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
        multiple: false,
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
            role="button"
            aria-label="Upload screenshot - drag and drop or click to select file"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Trigger file dialog by clicking the input
                    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                    input?.click();
                }
            }}
            className={cn(
                'flex flex-col items-center justify-center',
                'w-full h-full min-h-[200px] sm:min-h-[400px]',
                'm-4 sm:m-6',
                'border-2 border-dashed rounded-xl',
                'cursor-pointer transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-background',
                isDragActive
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900/50'
            )}
        >
            <input
                {...getInputProps()}
                aria-label="File input for screenshot upload"
            />

            <div className="flex flex-col items-center gap-3 sm:gap-4 p-4 sm:p-8 text-center">
                <div
                    className={cn(
                        'p-3 sm:p-4 rounded-full',
                        isDragActive ? 'bg-indigo-500/20' : 'bg-zinc-800'
                    )}
                >
                    {isDragActive ? (
                        <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500" />
                    ) : (
                        <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-400" />
                    )}
                </div>

                <div>
                    <p className="text-base sm:text-lg font-medium text-zinc-200">
                        {isDragActive ? 'Drop your image here' : 'Tap to select screenshot'}
                    </p>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-1">or drag & drop</p>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-600">
                    <Clipboard className="w-3 h-3" />
                    <span>You can also paste from clipboard (⌘V)</span>
                </div>

                <p className="text-[10px] sm:text-xs text-zinc-600">PNG, JPG, WebP, GIF</p>
            </div>
        </div>
    );
}
