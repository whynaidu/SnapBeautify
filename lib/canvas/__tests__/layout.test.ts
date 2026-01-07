import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  calculateFrameOffsets,
  calculateLayout,
  calculateBorderRadii,
  clearLayoutCache,
} from '../layout';
import { FrameType } from '@/types/editor';

describe('Layout Module', () => {
  // Clean up cache before and after each test
  beforeEach(() => {
    clearLayoutCache();
  });

  afterEach(() => {
    clearLayoutCache();
  });

  describe('calculateFrameOffsets', () => {
    it('should return zero offsets for "none" frame type', () => {
      const result = calculateFrameOffsets('none', 1);

      expect(result.top).toBe(0);
      expect(result.bottom).toBe(0);
      expect(result.left).toBe(0);
      expect(result.right).toBe(0);
      expect(result.offsetX).toBe(0);
      expect(result.offsetY).toBe(0);
    });

    it('should return correct offsets for browser frame', () => {
      const result = calculateFrameOffsets('browser', 1);

      expect(result.top).toBe(40);
      expect(result.bottom).toBe(0);
      expect(result.left).toBe(0);
      expect(result.right).toBe(0);
      expect(result.offsetX).toBe(0);
      expect(result.offsetY).toBe(40);
    });

    it('should return correct offsets for macOS frame', () => {
      const result = calculateFrameOffsets('macos', 1);

      expect(result.top).toBe(32);
      expect(result.bottom).toBe(0);
      expect(result.left).toBe(0);
      expect(result.right).toBe(0);
      expect(result.offsetX).toBe(0);
      expect(result.offsetY).toBe(32);
    });

    it('should return correct offsets for Windows frame', () => {
      const result = calculateFrameOffsets('windows', 1);

      expect(result.top).toBe(32);
      expect(result.bottom).toBe(0);
      expect(result.left).toBe(0);
      expect(result.right).toBe(0);
      expect(result.offsetX).toBe(0);
      expect(result.offsetY).toBe(32);
    });

    it('should return scaled offsets for iPhone frame', () => {
      const scale = 2;
      const result = calculateFrameOffsets('iphone', scale);

      expect(result.top).toBe(16 * scale);
      expect(result.bottom).toBe(16 * scale);
      expect(result.left).toBe(16 * scale);
      expect(result.right).toBe(16 * scale);
      expect(result.offsetX).toBe(32 * scale);
      expect(result.offsetY).toBe(32 * scale);
    });

    it('should return scaled offsets for Android frame', () => {
      const scale = 1.5;
      const result = calculateFrameOffsets('android', scale);

      expect(result.top).toBe(12 * scale);
      expect(result.bottom).toBe(12 * scale);
      expect(result.left).toBe(12 * scale);
      expect(result.right).toBe(12 * scale);
      expect(result.offsetX).toBe(24 * scale);
      expect(result.offsetY).toBe(24 * scale);
    });

    it('should cache results for same inputs', () => {
      const result1 = calculateFrameOffsets('iphone', 2);
      const result2 = calculateFrameOffsets('iphone', 2);

      // Should return the same object instance (cached)
      expect(result1).toBe(result2);
    });

    it('should return different results for different inputs', () => {
      const result1 = calculateFrameOffsets('iphone', 1);
      const result2 = calculateFrameOffsets('iphone', 2);

      expect(result1).not.toBe(result2);
      expect(result1.top).not.toBe(result2.top);
    });

    it('should handle default scale of 1', () => {
      const result1 = calculateFrameOffsets('iphone');
      const result2 = calculateFrameOffsets('iphone', 1);

      expect(result1.top).toBe(result2.top);
      expect(result1.offsetX).toBe(result2.offsetX);
    });
  });

  describe('calculateLayout', () => {
    const mockImage = {
      width: 1000,
      height: 2000,
    } as HTMLImageElement;

    it('should calculate correct dimensions for no frame', () => {
      const padding = 64;
      const imageScale = 1;

      const result = calculateLayout(mockImage, 'none', padding, imageScale);

      expect(result.scaledImgWidth).toBe(1000);
      expect(result.scaledImgHeight).toBe(2000);
      expect(result.canvasWidth).toBe(1000 + padding * 2);
      expect(result.canvasHeight).toBe(2000 + padding * 2);
      expect(result.imgWidth).toBe(1000);
      expect(result.imgHeight).toBe(2000);
    });

    it('should calculate correct dimensions with browser frame', () => {
      const padding = 64;
      const imageScale = 1;

      const result = calculateLayout(mockImage, 'browser', padding, imageScale);

      expect(result.scaledImgWidth).toBe(1000);
      expect(result.scaledImgHeight).toBe(2000);
      // Browser frame adds 40px to top
      expect(result.canvasWidth).toBe(1000 + padding * 2);
      expect(result.canvasHeight).toBe(2000 + padding * 2 + 40);
    });

    it('should calculate correct dimensions with iPhone frame', () => {
      const padding = 64;
      const imageScale = 1;

      const result = calculateLayout(mockImage, 'iphone', padding, imageScale);

      expect(result.scaledImgWidth).toBe(1000);
      expect(result.scaledImgHeight).toBe(2000);
      // iPhone frame adds 16px on all sides (scaled)
      expect(result.canvasWidth).toBe(1000 + padding * 2 + 32);
      expect(result.canvasHeight).toBe(2000 + padding * 2 + 32);
    });

    it('should apply image scale correctly', () => {
      const padding = 64;
      const imageScale = 2;

      const result = calculateLayout(mockImage, 'none', padding, imageScale);

      expect(result.scaledImgWidth).toBe(2000);
      expect(result.scaledImgHeight).toBe(4000);
      expect(result.canvasWidth).toBe(2000 + padding * 2);
      expect(result.canvasHeight).toBe(4000 + padding * 2);
    });

    it('should center content in canvas', () => {
      const padding = 64;
      const imageScale = 1;

      const result = calculateLayout(mockImage, 'none', padding, imageScale);

      // With no target dimensions, content should be centered in calculated canvas
      expect(result.contentX).toBeGreaterThanOrEqual(0);
      expect(result.contentY).toBeGreaterThanOrEqual(0);
    });

    it('should use target dimensions when provided', () => {
      const padding = 64;
      const imageScale = 1;
      const targetWidth = 1920;
      const targetHeight = 1080;

      const result = calculateLayout(
        mockImage,
        'none',
        padding,
        imageScale,
        targetWidth,
        targetHeight
      );

      expect(result.canvasWidth).toBe(targetWidth);
      expect(result.canvasHeight).toBe(targetHeight);
    });

    it('should calculate image position with frame offset', () => {
      const padding = 64;
      const imageScale = 1;

      const result = calculateLayout(mockImage, 'browser', padding, imageScale);

      // Image Y should account for browser frame (40px top)
      expect(result.imgY).toBeGreaterThan(result.contentY);
    });

    it('should handle fractional scaling', () => {
      const padding = 64;
      const imageScale = 0.5;

      const result = calculateLayout(mockImage, 'none', padding, imageScale);

      expect(result.scaledImgWidth).toBe(500);
      expect(result.scaledImgHeight).toBe(1000);
    });

    it('should handle large images', () => {
      const largeImage = {
        width: 5000,
        height: 3000,
      } as HTMLImageElement;

      const result = calculateLayout(largeImage, 'none', 64, 1);

      expect(result.scaledImgWidth).toBe(5000);
      expect(result.scaledImgHeight).toBe(3000);
      expect(result.canvasWidth).toBeGreaterThan(5000);
      expect(result.canvasHeight).toBeGreaterThan(3000);
    });
  });

  describe('calculateBorderRadii', () => {
    it('should return same radius for all corners with no frame', () => {
      const borderRadius = 12;
      const imageScale = 1;

      const result = calculateBorderRadii('none', borderRadius, imageScale);

      expect(result.effectiveTopRadius).toBe(borderRadius);
      expect(result.effectiveBottomRadius).toBe(borderRadius);
    });

    it('should return flat top for browser frame', () => {
      const borderRadius = 12;
      const imageScale = 1;

      const result = calculateBorderRadii('browser', borderRadius, imageScale);

      expect(result.effectiveTopRadius).toBe(0);
      expect(result.effectiveBottomRadius).toBe(borderRadius);
    });

    it('should return flat top for macOS frame', () => {
      const borderRadius = 12;
      const imageScale = 1;

      const result = calculateBorderRadii('macos', borderRadius, imageScale);

      expect(result.effectiveTopRadius).toBe(0);
      expect(result.effectiveBottomRadius).toBe(borderRadius);
    });

    it('should return flat top for Windows frame', () => {
      const borderRadius = 12;
      const imageScale = 1;

      const result = calculateBorderRadii('windows', borderRadius, imageScale);

      expect(result.effectiveTopRadius).toBe(0);
      expect(result.effectiveBottomRadius).toBe(borderRadius);
    });

    it('should return scaled screen radius for iPhone', () => {
      const borderRadius = 12;
      const imageScale = 2;

      const result = calculateBorderRadii('iphone', borderRadius, imageScale);

      const expectedRadius = 24 * imageScale; // iPhone screen radius
      expect(result.effectiveTopRadius).toBe(expectedRadius);
      expect(result.effectiveBottomRadius).toBe(expectedRadius);
    });

    it('should return scaled screen radius for Android', () => {
      const borderRadius = 12;
      const imageScale = 1.5;

      const result = calculateBorderRadii('android', borderRadius, imageScale);

      const expectedRadius = 18 * imageScale; // Android screen radius
      expect(result.effectiveTopRadius).toBe(expectedRadius);
      expect(result.effectiveBottomRadius).toBe(expectedRadius);
    });

    it('should use fixed phone radius regardless of borderRadius param', () => {
      const result1 = calculateBorderRadii('iphone', 0, 1);
      const result2 = calculateBorderRadii('iphone', 100, 1);

      // iPhone always uses 24px screen radius
      expect(result1.effectiveTopRadius).toBe(24);
      expect(result2.effectiveTopRadius).toBe(24);
    });

    it('should handle zero border radius', () => {
      const result = calculateBorderRadii('none', 0, 1);

      expect(result.effectiveTopRadius).toBe(0);
      expect(result.effectiveBottomRadius).toBe(0);
    });

    it('should handle large border radius', () => {
      const result = calculateBorderRadii('none', 100, 1);

      expect(result.effectiveTopRadius).toBe(100);
      expect(result.effectiveBottomRadius).toBe(100);
    });
  });

  describe('Cache Management', () => {
    it('should clear cache', () => {
      // Calculate once to populate cache
      const result1 = calculateFrameOffsets('iphone', 2);

      // Clear cache
      clearLayoutCache();

      // Calculate again - should be a new object
      const result2 = calculateFrameOffsets('iphone', 2);

      // Values should be equal but not the same instance
      expect(result1.top).toBe(result2.top);
      expect(result1).not.toBe(result2);
    });

    it('should handle multiple frame types in cache', () => {
      const iphone = calculateFrameOffsets('iphone', 1);
      const android = calculateFrameOffsets('android', 1);
      const browser = calculateFrameOffsets('browser', 1);

      // All should be different
      expect(iphone).not.toBe(android);
      expect(iphone).not.toBe(browser);
      expect(android).not.toBe(browser);

      // Verify values are correct
      expect(iphone.top).toBe(16);
      expect(android.top).toBe(12);
      expect(browser.top).toBe(40);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very small images', () => {
      const tinyImage = {
        width: 10,
        height: 10,
      } as HTMLImageElement;

      const result = calculateLayout(tinyImage, 'none', 64, 1);

      expect(result.scaledImgWidth).toBe(10);
      expect(result.scaledImgHeight).toBe(10);
      expect(result.canvasWidth).toBeGreaterThan(10);
    });

    it('should handle extreme image scale', () => {
      const mockImage = {
        width: 1000,
        height: 1000,
      } as HTMLImageElement;

      const result = calculateLayout(mockImage, 'none', 64, 0.1);

      expect(result.scaledImgWidth).toBe(100);
      expect(result.scaledImgHeight).toBe(100);
    });

    it('should handle zero padding', () => {
      const mockImage = {
        width: 1000,
        height: 1000,
      } as HTMLImageElement;

      const result = calculateLayout(mockImage, 'none', 0, 1);

      expect(result.canvasWidth).toBe(1000);
      expect(result.canvasHeight).toBe(1000);
    });

    it('should handle all frame types', () => {
      const frameTypes: FrameType[] = ['none', 'browser', 'macos', 'windows', 'iphone', 'android'];
      const mockImage = {
        width: 1000,
        height: 1000,
      } as HTMLImageElement;

      frameTypes.forEach(frameType => {
        const result = calculateLayout(mockImage, frameType, 64, 1);

        expect(result.scaledImgWidth).toBeGreaterThan(0);
        expect(result.scaledImgHeight).toBeGreaterThan(0);
        expect(result.canvasWidth).toBeGreaterThan(0);
        expect(result.canvasHeight).toBeGreaterThan(0);
      });
    });
  });
});
