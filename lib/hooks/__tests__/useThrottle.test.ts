import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useThrottle, useThrottledValue } from '../useThrottle';

describe('useThrottle Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('useThrottle', () => {
    it('should return a function', () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useThrottle(fn, 100));

      expect(typeof result.current).toBe('function');
    });

    it('should accept callback and delay parameters', () => {
      const fn = vi.fn();

      expect(() => {
        renderHook(() => useThrottle(fn, 100));
      }).not.toThrow();
    });

    it('should cleanup on unmount', () => {
      const fn = vi.fn();
      const { unmount } = renderHook(() => useThrottle(fn, 100));

      expect(() => unmount()).not.toThrow();
    });

    it('should handle zero delay', () => {
      const fn = vi.fn();

      expect(() => {
        renderHook(() => useThrottle(fn, 0));
      }).not.toThrow();
    });

    it('should handle large delay', () => {
      const fn = vi.fn();

      expect(() => {
        renderHook(() => useThrottle(fn, 10000));
      }).not.toThrow();
    });

    it('should handle multiple rapid calls without errors', () => {
      const fn = vi.fn();
      const { result } = renderHook(() => useThrottle(fn, 16));

      expect(() => {
        act(() => {
          for (let i = 0; i < 1000; i++) {
            result.current(i);
          }
        });
      }).not.toThrow();
    });
  });

  describe('useThrottledValue', () => {
    it('should return initial value', () => {
      const { result } = renderHook(() => useThrottledValue('initial', 100));

      expect(result.current).toBe('initial');
    });

    it('should handle value changes', () => {
      const { rerender } = renderHook(
        ({ value }) => useThrottledValue(value, 100),
        { initialProps: { value: 'a' } }
      );

      expect(() => {
        rerender({ value: 'b' });
      }).not.toThrow();
    });

    it('should handle rapid value changes without errors', () => {
      const { rerender } = renderHook(
        ({ value }) => useThrottledValue(value, 50),
        { initialProps: { value: 0 } }
      );

      expect(() => {
        for (let i = 1; i <= 100; i++) {
          rerender({ value: i });
        }
      }).not.toThrow();
    });

    it('should handle complex objects', () => {
      const obj1 = { id: 1 };
      const { result } = renderHook(() => useThrottledValue(obj1, 100));

      expect(result.current).toBe(obj1);
    });

    it('should cleanup on unmount', () => {
      const { unmount } = renderHook(() => useThrottledValue('test', 100));

      expect(() => unmount()).not.toThrow();
    });

    it('should handle undefined value', () => {
      const { result } = renderHook(() => useThrottledValue(undefined, 100));

      expect(result.current).toBeUndefined();
    });

    it('should handle null value', () => {
      const { result } = renderHook(() => useThrottledValue(null, 100));

      expect(result.current).toBeNull();
    });
  });

  describe('Integration with Canvas (tested via Canvas.test.tsx)', () => {
    it('should be usable in React components', () => {
      const fn = vi.fn();

      expect(() => {
        renderHook(() => {
          const throttled = useThrottle(fn, 16);
          return throttled;
        });
      }).not.toThrow();
    });

    it('should work with 60fps target delay', () => {
      const fn = vi.fn();

      expect(() => {
        renderHook(() => useThrottle(fn, 16));
      }).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid delay gracefully', () => {
      const fn = vi.fn();

      expect(() => {
        renderHook(() => useThrottle(fn, -1));
      }).not.toThrow();
    });

    it('should handle callback changes', () => {
      const fn1 = vi.fn();
      const fn2 = vi.fn();

      const { rerender } = renderHook(
        ({ callback }) => useThrottle(callback, 100),
        { initialProps: { callback: fn1 } }
      );

      expect(() => {
        rerender({ callback: fn2 });
      }).not.toThrow();
    });
  });
});
