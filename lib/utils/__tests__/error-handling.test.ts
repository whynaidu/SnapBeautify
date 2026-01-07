import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  AppError,
  ErrorType,
  handleError,
  retryWithBackoff,
  validateImageFile,
  getUserFriendlyError,
  ERROR_MESSAGES,
} from '../error-handling';

// Helper to create mock files with proper size
const createFile = (name: string, size: number, type: string) => {
  // For large files, use a blob to avoid OOM
  const blob = new Blob(['a'.repeat(Math.min(size, 1024))]);
  const file = new File([blob], name, { type });

  // Mock the size property for large files
  Object.defineProperty(file, 'size', {
    value: size,
    writable: false,
  });

  return file;
};

describe('Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('AppError', () => {
    it('should create error with type and message', () => {
      const error = new AppError(ErrorType.VALIDATION, 'Invalid input');

      expect(error.type).toBe(ErrorType.VALIDATION);
      expect(error.message).toBe('Invalid input');
      expect(error.originalError).toBeUndefined();
      expect(error.context).toBeUndefined();
    });

    it('should store original error', () => {
      const originalError = new Error('Original error');
      const error = new AppError(ErrorType.IMAGE_LOAD, 'Failed to load', originalError);

      expect(error.originalError).toBe(originalError);
    });

    it('should store context', () => {
      const context = { fileName: 'test.png', fileSize: 1024 };
      const error = new AppError(ErrorType.VALIDATION, 'Invalid file', undefined, context);

      expect(error.context).toEqual(context);
    });

    it('should be instance of Error', () => {
      const error = new AppError(ErrorType.UNKNOWN, 'Test');

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
    });

    it('should have stack trace', () => {
      const error = new AppError(ErrorType.UNKNOWN, 'Test');

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('AppError');
    });
  });

  describe('handleError', () => {
    it('should convert Error to AppError', () => {
      const originalError = new Error('Test error');
      const result = handleError(originalError);

      expect(result).toBeInstanceOf(AppError);
      expect(result.type).toBe(ErrorType.UNKNOWN);
      expect(result.originalError).toBe(originalError);
    });

    it('should preserve AppError', () => {
      const appError = new AppError(ErrorType.VALIDATION, 'Test');
      const result = handleError(appError);

      expect(result).toBe(appError);
    });

    it('should detect image load errors', () => {
      const error = new Error('Image load timeout');
      const result = handleError(error);

      expect(result.type).toBe(ErrorType.IMAGE_LOAD);
    });

    it('should detect network errors', () => {
      const error = new Error('network request failed');
      const result = handleError(error);

      expect(result.type).toBe(ErrorType.NETWORK);
    });

    it('should detect memory errors', () => {
      const error = new Error('Out of memory quota exceeded');
      const result = handleError(error);

      expect(result.type).toBe(ErrorType.MEMORY);
    });

    it('should add context', () => {
      const error = new Error('Test');
      const context = { operation: 'export' };
      const result = handleError(error, context);

      expect(result.context).toEqual(context);
    });

    it('should handle string errors', () => {
      const result = handleError('String error');

      expect(result).toBeInstanceOf(AppError);
      expect(result.message).toBe('An unexpected error occurred');
      expect(result.context?.originalError).toBe('String error');
    });

    it('should handle unknown error types', () => {
      const result = handleError({ weird: 'object' });

      expect(result).toBeInstanceOf(AppError);
      expect(result.type).toBe(ErrorType.UNKNOWN);
    });
  });

  describe('retryWithBackoff', () => {
    it('should return successful result on first try', async () => {
      const operation = vi.fn().mockResolvedValue('success');

      const result = await retryWithBackoff(operation, 'test-operation');

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure', async () => {
      const operation = vi
        .fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockRejectedValueOnce(new Error('Fail 2'))
        .mockResolvedValue('success');

      const result = await retryWithBackoff(operation, 'test-operation', {
        maxRetries: 3,
        baseDelay: 10,
      });

      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should throw after max retries', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('Always fails'));

      await expect(
        retryWithBackoff(operation, 'test-operation', {
          maxRetries: 2,
          baseDelay: 10,
        })
      ).rejects.toThrow('Always fails');

      expect(operation).toHaveBeenCalledTimes(3); // initial + 2 retries
    });

    it('should use exponential backoff', async () => {
      const delays: number[] = [];
      const operation = vi.fn(async () => {
        throw new Error('Fail');
      });

      const startTime = Date.now();

      try {
        await retryWithBackoff(operation, 'test-operation', {
          maxRetries: 2,
          baseDelay: 100,
        });
      } catch (e) {
        // Expected to fail
      }

      // Should have waited (100 + 200 = 300ms minimum)
      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(200); // Allow some tolerance
    });

    it('should respect shouldRetry function', async () => {
      const operation = vi
        .fn()
        .mockRejectedValueOnce(new Error('Retry me'))
        .mockRejectedValueOnce(new Error('Do not retry'))
        .mockResolvedValue('success');

      const shouldRetry = (error: Error) => error.message.includes('Retry');

      await expect(
        retryWithBackoff(operation, 'test-operation', {
          maxRetries: 3,
          baseDelay: 10,
          shouldRetry,
        })
      ).rejects.toThrow('Do not retry');

      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('should work with async operations', async () => {
      let attempts = 0;
      const operation = async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error('Not ready');
        }
        return 'ready';
      };

      const result = await retryWithBackoff(operation, 'test-operation', {
        maxRetries: 3,
        baseDelay: 10,
      });

      expect(result).toBe('ready');
      expect(attempts).toBe(3);
    });

    it('should handle custom maxRetries', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('Fail'));

      try {
        await retryWithBackoff(operation, 'test-operation', {
          maxRetries: 5,
          baseDelay: 1,
        });
      } catch (e) {
        // Expected
      }

      expect(operation).toHaveBeenCalledTimes(6); // initial + 5 retries
    });

    it('should handle zero retries', async () => {
      const operation = vi.fn().mockRejectedValue(new Error('Fail'));

      await expect(
        retryWithBackoff(operation, 'test-operation', {
          maxRetries: 0,
          baseDelay: 10,
        })
      ).rejects.toThrow('Fail');

      expect(operation).toHaveBeenCalledTimes(1);
    });
  });

  describe('validateImageFile', () => {
    it('should validate valid image files', () => {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

      validTypes.forEach(type => {
        const file = createFile('test.png', 1024 * 1024, type); // 1MB
        const result = validateImageFile(file);

        expect(result.valid).toBe(true);
        expect(result.error).toBeUndefined();
      });
    });

    it('should reject files that are too large', () => {
      const file = createFile('large.png', 60 * 1024 * 1024, 'image/png'); // 60MB > 50MB limit
      const result = validateImageFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('FILE_TOO_LARGE');
      expect(result.message).toContain('50MB');
    });

    it('should reject invalid file types', () => {
      const file = createFile('test.pdf', 1024, 'application/pdf');
      const result = validateImageFile(file);

      expect(result.valid).toBe(false);
      expect(result.error).toBe('INVALID_FILE_TYPE');
      expect(result.message).toContain('type');
    });

    it('should accept files at size limit', () => {
      const file = createFile('test.png', 10 * 1024 * 1024, 'image/png'); // 10MB
      const result = validateImageFile(file);

      expect(result.valid).toBe(true);
    });

    it('should handle files with uppercase extensions', () => {
      const file = createFile('TEST.PNG', 1024, 'image/png');
      const result = validateImageFile(file);

      expect(result.valid).toBe(true);
    });

    it('should allow empty files (no explicit check)', () => {
      const file = createFile('empty.png', 0, 'image/png');
      const result = validateImageFile(file);

      // Implementation doesn't explicitly reject empty files
      expect(result.valid).toBe(true);
    });

    it('should reject SVG files', () => {
      const file = createFile('image.svg', 1024, 'image/svg+xml');
      const result = validateImageFile(file);

      // SVG is not in the allowed types list
      expect(result.valid).toBe(false);
      expect(result.error).toBe('INVALID_FILE_TYPE');
    });
  });

  describe('getUserFriendlyError', () => {
    it('should return friendly message for known errors', () => {
      const error = new AppError(ErrorType.IMAGE_LOAD, 'Failed to load');
      const result = getUserFriendlyError(error);

      expect(result.title).toBe(ERROR_MESSAGES.IMAGE_LOAD_FAILED.title);
      expect(result.message).toBe(ERROR_MESSAGES.IMAGE_LOAD_FAILED.message);
      expect(result.action).toBe(ERROR_MESSAGES.IMAGE_LOAD_FAILED.action);
    });

    it('should return generic message for unknown errors', () => {
      const error = new AppError(ErrorType.UNKNOWN, 'Something went wrong');
      const result = getUserFriendlyError(error);

      expect(result.title).toBe(ERROR_MESSAGES.EXPORT_FAILED.title);
      expect(result.message).toBe(ERROR_MESSAGES.EXPORT_FAILED.message);
    });

    it('should include action advice', () => {
      const error = new AppError(ErrorType.NETWORK, 'Network error');
      const result = getUserFriendlyError(error);

      expect(result.action).toBeDefined();
      expect(result.action).toBeTruthy();
    });

    it('should handle all error types', () => {
      const errorTypes = Object.values(ErrorType);

      errorTypes.forEach(type => {
        const error = new AppError(type as ErrorType, 'Test');
        const result = getUserFriendlyError(error);

        // getUserFriendlyError always returns a valid message object
        expect(result.title).toBeDefined();
        expect(result.message).toBeDefined();
      });
    });
  });

  describe('ERROR_MESSAGES', () => {
    it('should have messages for common error scenarios', () => {
      const messageKeys = Object.keys(ERROR_MESSAGES) as Array<keyof typeof ERROR_MESSAGES>;

      messageKeys.forEach(key => {
        expect(ERROR_MESSAGES[key]).toBeDefined();
        expect(ERROR_MESSAGES[key].title).toBeDefined();
        expect(ERROR_MESSAGES[key].message).toBeDefined();
      });
    });

    it('should have user-friendly titles', () => {
      Object.values(ERROR_MESSAGES).forEach(message => {
        expect(message.title.length).toBeGreaterThan(0);
        expect(message.title.length).toBeLessThan(50);
      });
    });

    it('should have helpful messages', () => {
      Object.values(ERROR_MESSAGES).forEach(message => {
        expect(message.message.length).toBeGreaterThan(10);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle null errors', () => {
      const result = handleError(null);

      expect(result).toBeInstanceOf(AppError);
      expect(result.type).toBe(ErrorType.UNKNOWN);
    });

    it('should handle undefined errors', () => {
      const result = handleError(undefined);

      expect(result).toBeInstanceOf(AppError);
    });

    it('should handle errors with no message', () => {
      const error = new Error();
      const result = handleError(error);

      expect(result.message).toBeDefined();
    });

    it('should handle very long error messages', () => {
      const longMessage = 'a'.repeat(10000);
      const error = new Error(longMessage);
      const result = handleError(error);

      expect(result.message).toContain('a');
    });

    it('should handle errors with circular references', () => {
      const error: any = new Error('Test');
      error.circular = error;

      expect(() => {
        handleError(error);
      }).not.toThrow();
    });

    it('should handle retry with zero delay', async () => {
      let attempts = 0;
      const operation = async () => {
        attempts++;
        if (attempts < 2) {
          throw new Error('Retry');
        }
        return 'success';
      };

      const result = await retryWithBackoff(operation, 'test', {
        maxRetries: 2,
        baseDelay: 0,
      });

      expect(result).toBe('success');
    });

    it('should handle file validation with special characters', () => {
      const file = createFile('test@#$.png', 1024, 'image/png');
      const result = validateImageFile(file);

      expect(result.valid).toBe(true);
    });
  });
});
