/**
 * Comprehensive Error Handling Utilities
 */

import { logger } from './logger';

/**
 * Error types for better categorization
 */
export enum ErrorType {
    NETWORK = 'NETWORK',
    PERMISSION = 'PERMISSION',
    FILE_READ = 'FILE_READ',
    IMAGE_LOAD = 'IMAGE_LOAD',
    CANVAS_RENDER = 'CANVAS_RENDER',
    EXPORT = 'EXPORT',
    MEMORY = 'MEMORY',
    VALIDATION = 'VALIDATION',
    UNKNOWN = 'UNKNOWN',
}

/**
 * Custom application error
 */
export class AppError extends Error {
    constructor(
        public type: ErrorType,
        message: string,
        public originalError?: Error,
        public context?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'AppError';

        // Maintain proper stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }
    }
}

/**
 * User-friendly error messages
 */
export const ERROR_MESSAGES = {
    IMAGE_LOAD_TIMEOUT: {
        title: 'Image Loading Failed',
        message: 'This image is taking too long to load. Try selecting it again or choose a different image.',
        action: 'Retry',
    },
    IMAGE_LOAD_FAILED: {
        title: 'Cannot Load Image',
        message: 'We couldn\'t load this image. Please make sure it\'s a valid image file.',
        action: 'Try Another',
    },
    FILE_TOO_LARGE: {
        title: 'File Too Large',
        message: 'This image is too large. Please select an image smaller than 50MB.',
        action: 'Select Smaller File',
    },
    INVALID_FILE_TYPE: {
        title: 'Invalid File Type',
        message: 'Please select a valid image file (PNG, JPG, WebP, or GIF).',
        action: 'Select Valid Image',
    },
    STORAGE_PERMISSION_DENIED: {
        title: 'Storage Access Needed',
        message: 'SnapBeautify needs storage access to save your beautiful screenshots.',
        action: 'Open Settings',
        fallback: 'Use Share Instead',
    },
    EXPORT_FAILED: {
        title: 'Export Failed',
        message: 'We couldn\'t export your image. This might be due to memory constraints.',
        action: 'Try Lower Resolution',
    },
    MEMORY_ERROR: {
        title: 'Memory Limit Reached',
        message: 'This operation requires too much memory. Try reducing the export scale.',
        action: 'Use Lower Scale',
    },
    CLIPBOARD_NOT_SUPPORTED: {
        title: 'Clipboard Not Supported',
        message: 'Your browser doesn\'t support copying to clipboard. Use Download or Share instead.',
        action: 'Download Instead',
    },
    SHARE_NOT_SUPPORTED: {
        title: 'Share Not Supported',
        message: 'Your browser doesn\'t support sharing. Use Download instead.',
        action: 'Download Instead',
    },
    NETWORK_ERROR: {
        title: 'Network Error',
        message: 'Please check your internet connection and try again.',
        action: 'Retry',
    },
} as const;

/**
 * Retry configuration
 */
export interface RetryConfig {
    maxRetries: number;
    baseDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
    shouldRetry?: (error: Error, attempt: number) => boolean;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxRetries: 3,
    baseDelay: 300,
    maxDelay: 5000,
    backoffMultiplier: 2,
};

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay
 */
function calculateBackoff(attempt: number, config: RetryConfig): number {
    const delay = config.baseDelay * Math.pow(config.backoffMultiplier, attempt);
    return Math.min(delay, config.maxDelay);
}

/**
 * Retry an async operation with exponential backoff
 */
export async function retryWithBackoff<T>(
    operation: () => Promise<T>,
    operationName: string,
    config: Partial<RetryConfig> = {}
): Promise<T> {
    const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
    let lastError: Error;

    for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
        try {
            logger.debug(`retry:${operationName}`, { attempt, maxRetries: finalConfig.maxRetries });
            return await operation();
        } catch (error) {
            lastError = error as Error;

            // Check if we should retry
            const shouldRetry = finalConfig.shouldRetry?.(lastError, attempt) ?? true;

            if (attempt === finalConfig.maxRetries || !shouldRetry) {
                logger.error(`retry:${operationName}:failed`, lastError, {
                    attempts: attempt + 1,
                    maxRetries: finalConfig.maxRetries,
                });
                throw lastError;
            }

            // Calculate delay and wait
            const delay = calculateBackoff(attempt, finalConfig);
            logger.debug(`retry:${operationName}:waiting`, { attempt, delay });
            await sleep(delay);
        }
    }

    throw lastError!;
}

/**
 * Handle errors gracefully with user-friendly messages
 */
export function handleError(error: unknown, context?: Record<string, unknown>): AppError {
    // Already an AppError
    if (error instanceof AppError) {
        return error;
    }

    // Standard Error
    if (error instanceof Error) {
        // Categorize based on error message
        let type = ErrorType.UNKNOWN;

        if (error.message.includes('timeout')) {
            type = ErrorType.IMAGE_LOAD;
        } else if (error.message.includes('permission') || error.message.includes('denied')) {
            type = ErrorType.PERMISSION;
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
            type = ErrorType.NETWORK;
        } else if (error.message.includes('memory') || error.message.includes('quota')) {
            type = ErrorType.MEMORY;
        } else if (error.message.includes('canvas')) {
            type = ErrorType.CANVAS_RENDER;
        }

        return new AppError(type, error.message, error, context);
    }

    // Unknown error type
    return new AppError(
        ErrorType.UNKNOWN,
        'An unexpected error occurred',
        undefined,
        { originalError: error, ...context }
    );
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyError(error: AppError | Error): typeof ERROR_MESSAGES[keyof typeof ERROR_MESSAGES] {
    if (error instanceof AppError) {
        switch (error.type) {
            case ErrorType.IMAGE_LOAD:
                return error.message.includes('timeout')
                    ? ERROR_MESSAGES.IMAGE_LOAD_TIMEOUT
                    : ERROR_MESSAGES.IMAGE_LOAD_FAILED;
            case ErrorType.PERMISSION:
                return ERROR_MESSAGES.STORAGE_PERMISSION_DENIED;
            case ErrorType.EXPORT:
                return ERROR_MESSAGES.EXPORT_FAILED;
            case ErrorType.MEMORY:
                return ERROR_MESSAGES.MEMORY_ERROR;
            case ErrorType.NETWORK:
                return ERROR_MESSAGES.NETWORK_ERROR;
            default:
                return ERROR_MESSAGES.EXPORT_FAILED;
        }
    }

    // Fallback for standard errors
    if (error.message.includes('clipboard')) {
        return ERROR_MESSAGES.CLIPBOARD_NOT_SUPPORTED;
    }

    if (error.message.includes('share')) {
        return ERROR_MESSAGES.SHARE_NOT_SUPPORTED;
    }

    return ERROR_MESSAGES.EXPORT_FAILED;
}

/**
 * Validate file before processing
 */
export interface FileValidationResult {
    valid: boolean;
    error?: keyof typeof ERROR_MESSAGES;
    message?: string;
}

export function validateImageFile(file: File): FileValidationResult {
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: 'INVALID_FILE_TYPE',
            message: `File type ${file.type} is not supported`,
        };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: 'FILE_TOO_LARGE',
            message: `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds 50MB limit`,
        };
    }

    // Check for suspiciously small files (potential image bombs)
    if (file.size < 1000 && file.name.endsWith('.png')) {
        logger.warn('file_validation', 'Suspiciously small PNG file', {
            size: file.size,
            name: file.name,
        });
    }

    return { valid: true };
}

/**
 * Safe async operation wrapper
 */
export async function safeAsync<T>(
    operation: () => Promise<T>,
    fallback: T,
    context?: string
): Promise<T> {
    try {
        return await operation();
    } catch (error) {
        logger.error(`safe_async:${context || 'unknown'}`, error as Error);
        return fallback;
    }
}
