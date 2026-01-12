'use client';

import { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Clipboard, Sparkles, ArrowUpFromLine } from 'lucide-react';
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
        <div className="w-full max-w-2xl mx-auto p-4 sm:p-6">
            <div
                {...getRootProps()}
                role="button"
                aria-label="Upload screenshot - drag and drop or click to select file"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
                        input?.click();
                    }
                }}
                className={cn(
                    'relative flex flex-col items-center justify-center',
                    'w-full min-h-[280px] sm:min-h-[360px]',
                    'rounded-3xl',
                    'cursor-pointer transition-all duration-300',
                    'focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:ring-offset-4 focus:ring-offset-zinc-50 dark:focus:ring-offset-zinc-950',
                    isDragActive
                        ? 'bg-black dark:bg-white scale-[1.02]'
                        : 'bg-white dark:bg-zinc-900 border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-white/5'
                )}
            >
                <input
                    {...getInputProps()}
                    aria-label="File input for screenshot upload"
                />

                <div className="flex flex-col items-center gap-4 sm:gap-6 p-6 sm:p-10 text-center">
                    {/* Icon container - static for performance */}
                    <div
                        className={cn(
                            'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shadow-lg transition-colors duration-200',
                            isDragActive
                                ? 'bg-white dark:bg-black shadow-white/20'
                                : 'bg-black dark:bg-white shadow-black/10 dark:shadow-white/10'
                        )}
                    >
                        {isDragActive ? (
                            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-black dark:text-white" />
                        ) : (
                            <ArrowUpFromLine className="w-8 h-8 sm:w-10 sm:h-10 text-white dark:text-black" />
                        )}
                    </div>

                    {/* Text content */}
                    <div>
                        <p className={cn(
                            'text-lg sm:text-xl font-semibold',
                            isDragActive
                                ? 'text-white dark:text-black'
                                : 'text-zinc-900 dark:text-white'
                        )}>
                            {isDragActive ? 'Release to upload' : 'Drop your image here'}
                        </p>
                        <p className={cn(
                            'text-sm sm:text-base mt-1',
                            isDragActive
                                ? 'text-white/70 dark:text-black/70'
                                : 'text-zinc-500 dark:text-zinc-400'
                        )}>
                            or click to browse files
                        </p>
                    </div>

                    {/* Clipboard hint */}
                    <div className={cn(
                        'hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium',
                        isDragActive
                            ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    )}>
                        <Clipboard className="w-3.5 h-3.5" />
                        <span>Paste from clipboard (⌘V / Ctrl+V)</span>
                    </div>

                    {/* Supported formats */}
                    <div className={cn(
                        'flex items-center gap-2',
                        isDragActive
                            ? 'text-white/60 dark:text-black/60'
                            : 'text-zinc-400 dark:text-zinc-500'
                    )}>
                        <span className="text-xs font-medium">Supports:</span>
                        <div className="flex gap-1.5">
                            {['PNG', 'JPG', 'WebP', 'GIF'].map((format) => (
                                <span
                                    key={format}
                                    className={cn(
                                        'text-[10px] px-2 py-0.5 rounded-full font-medium',
                                        isDragActive
                                            ? 'bg-white/20 dark:bg-black/20'
                                            : 'bg-zinc-100 dark:bg-zinc-800'
                                    )}
                                >
                                    {format}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Decorative gradient when active - simplified for performance */}
                {isDragActive && (
                    <div className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-transparent to-pink-500/10" />
                    </div>
                )}
            </div>
        </div>
    );
}
