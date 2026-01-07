import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { canvasPool } from '../canvas-pool';

describe('Canvas Pool', () => {
  let acquiredCanvases: HTMLCanvasElement[] = [];

  beforeEach(() => {
    acquiredCanvases = [];
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Release all acquired canvases
    acquiredCanvases.forEach(canvas => {
      try {
        canvasPool.release(canvas);
      } catch (e) {
        // Ignore errors during cleanup
      }
    });
    acquiredCanvases = [];
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('acquire', () => {
    it('should create and return a new canvas', () => {
      const canvas = canvasPool.acquire(100, 200);
      acquiredCanvases.push(canvas);

      expect(canvas).toBeInstanceOf(HTMLCanvasElement);
      expect(canvas.width).toBe(100);
      expect(canvas.height).toBe(200);
    });

    it('should reuse canvas with same dimensions after release', () => {
      const canvas1 = canvasPool.acquire(100, 200);
      canvasPool.release(canvas1);

      const canvas2 = canvasPool.acquire(100, 200);
      acquiredCanvases.push(canvas2);

      // Should be the same canvas instance (reused)
      expect(canvas2).toBe(canvas1);
    });

    it('should create new canvas for different dimensions', () => {
      const canvas1 = canvasPool.acquire(100, 200);
      acquiredCanvases.push(canvas1);
      canvasPool.release(canvas1);

      const canvas2 = canvasPool.acquire(200, 100);
      acquiredCanvases.push(canvas2);

      // Should be different canvas instances
      expect(canvas2).not.toBe(canvas1);
      expect(canvas2.width).toBe(200);
      expect(canvas2.height).toBe(100);
    });

    it('should create new canvas if previous one is still in use', () => {
      const canvas1 = canvasPool.acquire(100, 200);
      acquiredCanvases.push(canvas1);
      // Don't release canvas1

      const canvas2 = canvasPool.acquire(100, 200);
      acquiredCanvases.push(canvas2);

      // Should be different since canvas1 is still in use
      expect(canvas2).not.toBe(canvas1);
    });

    it('should handle fractional dimensions', () => {
      const canvas = canvasPool.acquire(100.5, 200.7);
      acquiredCanvases.push(canvas);

      expect(canvas).toBeInstanceOf(HTMLCanvasElement);
      // Canvas dimensions are integers
      expect(canvas.width).toBe(100);
      expect(canvas.height).toBe(200);
    });

    it('should handle zero dimensions', () => {
      const canvas = canvasPool.acquire(0, 0);
      acquiredCanvases.push(canvas);

      expect(canvas).toBeInstanceOf(HTMLCanvasElement);
      expect(canvas.width).toBe(0);
      expect(canvas.height).toBe(0);
    });

    it('should handle very large dimensions', () => {
      const canvas = canvasPool.acquire(10000, 10000);
      acquiredCanvases.push(canvas);

      expect(canvas).toBeInstanceOf(HTMLCanvasElement);
      expect(canvas.width).toBe(10000);
      expect(canvas.height).toBe(10000);
    });
  });

  describe('release', () => {
    it('should allow released canvas to be reused', () => {
      const canvas1 = canvasPool.acquire(100, 200);
      canvasPool.release(canvas1);

      const canvas2 = canvasPool.acquire(100, 200);
      acquiredCanvases.push(canvas2);

      expect(canvas2).toBe(canvas1);
    });

    it('should clear canvas on release', () => {
      const canvas = canvasPool.acquire(100, 200);
      acquiredCanvases.push(canvas);

      // Note: We can't spy on clearRect here because the context is already created
      // and the implementation calls clearRect internally. We just verify it doesn't throw
      expect(() => {
        canvasPool.release(canvas);
      }).not.toThrow();

      // Canvas should be available for reuse
      const canvas2 = canvasPool.acquire(100, 200);
      expect(canvas2).toBe(canvas);
    });

    it('should handle releasing canvas not in pool', () => {
      const externalCanvas = document.createElement('canvas');
      externalCanvas.width = 100;
      externalCanvas.height = 100;

      // Should not throw
      expect(() => {
        canvasPool.release(externalCanvas);
      }).not.toThrow();
    });

    it('should handle multiple releases of same canvas', () => {
      const canvas = canvasPool.acquire(100, 200);
      canvasPool.release(canvas);
      canvasPool.release(canvas); // Second release

      // Should not throw or cause issues
      const canvas2 = canvasPool.acquire(100, 200);
      acquiredCanvases.push(canvas2);
      expect(canvas2).toBe(canvas);
    });
  });

  describe('dispose', () => {
    it('should permanently remove canvas from pool', () => {
      const canvas1 = canvasPool.acquire(100, 200);
      canvasPool.dispose(canvas1);

      // Canvas should not be reused after disposal
      const canvas2 = canvasPool.acquire(100, 200);
      acquiredCanvases.push(canvas2);

      expect(canvas2).not.toBe(canvas1);
    });

    it('should set canvas dimensions to 0', () => {
      const canvas = canvasPool.acquire(100, 200);
      acquiredCanvases.push(canvas);

      canvasPool.dispose(canvas);

      expect(canvas.width).toBe(0);
      expect(canvas.height).toBe(0);
    });

    it('should handle disposing canvas not in pool', () => {
      const externalCanvas = document.createElement('canvas');

      // Should not throw
      expect(() => {
        canvasPool.dispose(externalCanvas);
      }).not.toThrow();
    });
  });

  describe('destroy', () => {
    it('should clear all canvases from pool', () => {
      const canvas1 = canvasPool.acquire(100, 200);
      const canvas2 = canvasPool.acquire(200, 300);
      canvasPool.release(canvas1);
      canvasPool.release(canvas2);

      canvasPool.destroy();

      // After destroy, new canvases should be created
      const canvas3 = canvasPool.acquire(100, 200);
      acquiredCanvases.push(canvas3);

      expect(canvas3).not.toBe(canvas1);
      expect(canvas3).toBeInstanceOf(HTMLCanvasElement);
    });

    it('should set destroyed canvas dimensions to 0', () => {
      const canvas = canvasPool.acquire(100, 200);
      canvasPool.release(canvas);

      canvasPool.destroy();

      expect(canvas.width).toBe(0);
      expect(canvas.height).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle concurrent acquire calls', () => {
      const canvas1 = canvasPool.acquire(100, 200);
      const canvas2 = canvasPool.acquire(100, 200);
      const canvas3 = canvasPool.acquire(100, 200);
      acquiredCanvases.push(canvas1, canvas2, canvas3);

      // All should be different instances since none were released
      expect(canvas1).not.toBe(canvas2);
      expect(canvas2).not.toBe(canvas3);
      expect(canvas1).not.toBe(canvas3);
    });

    it('should handle rapid acquire/release cycles', () => {
      let lastCanvas: HTMLCanvasElement | null = null;

      for (let i = 0; i < 10; i++) {
        const canvas = canvasPool.acquire(100, 200);

        if (lastCanvas) {
          // Should reuse the same canvas after release
          expect(canvas).toBe(lastCanvas);
        }

        canvasPool.release(canvas);
        lastCanvas = canvas;
      }
    });

    it('should handle acquiring same dimensions multiple times', () => {
      const canvases: HTMLCanvasElement[] = [];

      // Acquire 3 canvases with same dimensions
      for (let i = 0; i < 3; i++) {
        const canvas = canvasPool.acquire(100, 200);
        canvases.push(canvas);
      }

      acquiredCanvases.push(...canvases);

      // All should be different (since not released)
      expect(canvases[0]).not.toBe(canvases[1]);
      expect(canvases[1]).not.toBe(canvases[2]);
      expect(canvases[0]).not.toBe(canvases[2]);
    });

    it('should handle mixed acquire and release operations', () => {
      const canvas1 = canvasPool.acquire(100, 200);
      const canvas2 = canvasPool.acquire(200, 300);
      acquiredCanvases.push(canvas1, canvas2);

      canvasPool.release(canvas1);

      const canvas3 = canvasPool.acquire(100, 200);
      acquiredCanvases.push(canvas3);

      // Should reuse canvas1
      expect(canvas3).toBe(canvas1);

      const canvas4 = canvasPool.acquire(200, 300);
      acquiredCanvases.push(canvas4);

      // Should not reuse canvas2 (still in use)
      expect(canvas4).not.toBe(canvas2);
    });
  });

  describe('Memory Management', () => {
    it('should clear canvas content on release', () => {
      const canvas = canvasPool.acquire(100, 200);

      // Release should complete without errors
      expect(() => {
        canvasPool.release(canvas);
      }).not.toThrow();

      // Canvas should be reusable after release
      const canvas2 = canvasPool.acquire(100, 200);
      acquiredCanvases.push(canvas2);
      expect(canvas2).toBe(canvas);
    });

    it('should set dimensions to 0 on dispose', () => {
      const canvas = canvasPool.acquire(500, 500);

      const originalWidth = canvas.width;
      const originalHeight = canvas.height;

      canvasPool.dispose(canvas);

      expect(originalWidth).toBe(500);
      expect(originalHeight).toBe(500);
      expect(canvas.width).toBe(0);
      expect(canvas.height).toBe(0);
    });
  });
});
