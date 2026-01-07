import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useEditorStore } from '../editor-store';
import { renderHook, act } from '@testing-library/react';

describe('Editor Store', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Reset store to defaults before each test
    const { result } = renderHook(() => useEditorStore());
    act(() => {
      result.current.resetToDefaults();
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Initial State', () => {
    it('should have correct default values', () => {
      const { result } = renderHook(() => useEditorStore());

      expect(result.current.originalImage).toBeNull();
      expect(result.current.imageDataUrl).toBeNull();
      expect(result.current.backgroundType).toBe('gradient');
      expect(result.current.padding).toBe(64);
      expect(result.current.shadowBlur).toBe(20);
      expect(result.current.shadowOpacity).toBe(50);
      expect(result.current.borderRadius).toBe(12);
      expect(result.current.imageScale).toBe(1);
      expect(result.current.rotation).toBe(0);
      expect(result.current.frameType).toBe('none');
      expect(result.current.canvasWidth).toBe(1600);
      expect(result.current.canvasHeight).toBe(900);
      expect(result.current.exportFormat).toBe('png');
      expect(result.current.exportScale).toBe(2);
    });
  });

  describe('Image Management', () => {
    it('should set image with correct dimensions', () => {
      const { result } = renderHook(() => useEditorStore());
      const mockImage = {
        width: 1000,
        height: 800,
      } as HTMLImageElement;

      act(() => {
        result.current.setImage(mockImage, 'data:image/png;base64,test');
      });

      expect(result.current.originalImage).toBe(mockImage);
      expect(result.current.imageDataUrl).toBe('data:image/png;base64,test');
      expect(result.current.imageScale).toBe(1);
      // Canvas should be image size + padding * 2
      expect(result.current.canvasWidth).toBe(1000 + 64 * 2);
      expect(result.current.canvasHeight).toBe(800 + 64 * 2);
    });

    it('should calculate dimensions with frame offsets', () => {
      const { result } = renderHook(() => useEditorStore());

      // Set frame type first
      act(() => {
        result.current.setFrameType('browser');
      });

      const mockImage = {
        width: 1000,
        height: 800,
      } as HTMLImageElement;

      act(() => {
        result.current.setImage(mockImage, 'data:image/png;base64,test');
      });

      // Browser frame adds 40px to top (offsetY = 40)
      expect(result.current.canvasWidth).toBe(1000 + 64 * 2);
      expect(result.current.canvasHeight).toBe(800 + 64 * 2 + 40);
    });

    it('should clear image', () => {
      const { result } = renderHook(() => useEditorStore());
      const mockImage = {
        width: 1000,
        height: 800,
      } as HTMLImageElement;

      act(() => {
        result.current.setImage(mockImage, 'data:image/png;base64,test');
      });

      act(() => {
        result.current.clearImage();
      });

      expect(result.current.originalImage).toBeNull();
      expect(result.current.imageDataUrl).toBeNull();
    });
  });

  describe('Debounced Dimension Recalculation', () => {
    it('should debounce padding changes', () => {
      const { result } = renderHook(() => useEditorStore());
      const mockImage = {
        width: 1000,
        height: 800,
      } as HTMLImageElement;

      act(() => {
        result.current.setImage(mockImage, 'data:image/png;base64,test');
      });

      const initialWidth = result.current.canvasWidth;
      const initialHeight = result.current.canvasHeight;

      // Rapid padding changes (simulating slider drag)
      act(() => {
        result.current.setPadding(100);
        result.current.setPadding(120);
        result.current.setPadding(140);
      });

      // Padding should update immediately
      expect(result.current.padding).toBe(140);

      // But dimensions should not recalculate yet (debounced)
      expect(result.current.canvasWidth).toBe(initialWidth);
      expect(result.current.canvasHeight).toBe(initialHeight);

      // Advance timers to trigger debounced recalculation (16ms)
      act(() => {
        vi.advanceTimersByTime(16);
      });

      // Now dimensions should be recalculated with final padding
      expect(result.current.canvasWidth).toBe(1000 + 140 * 2);
      expect(result.current.canvasHeight).toBe(800 + 140 * 2);
    });

    it('should debounce frame type changes', () => {
      const { result } = renderHook(() => useEditorStore());
      const mockImage = {
        width: 1000,
        height: 800,
      } as HTMLImageElement;

      act(() => {
        result.current.setImage(mockImage, 'data:image/png;base64,test');
      });

      const initialHeight = result.current.canvasHeight;

      act(() => {
        result.current.setFrameType('browser');
        result.current.setFrameType('macos');
        result.current.setFrameType('browser');
      });

      // Frame type should update immediately
      expect(result.current.frameType).toBe('browser');

      // Dimensions should not recalculate yet
      expect(result.current.canvasHeight).toBe(initialHeight);

      act(() => {
        vi.advanceTimersByTime(16);
      });

      // Now dimensions should include frame offset (browser = 40px top)
      expect(result.current.canvasHeight).toBe(800 + 64 * 2 + 40);
    });

    it('should debounce image scale changes', () => {
      const { result } = renderHook(() => useEditorStore());
      const mockImage = {
        width: 1000,
        height: 800,
      } as HTMLImageElement;

      act(() => {
        result.current.setImage(mockImage, 'data:image/png;base64,test');
      });

      act(() => {
        result.current.setImageScale(1.5);
        result.current.setImageScale(2.0);
        result.current.setImageScale(2.5);
      });

      // Scale should update immediately
      expect(result.current.imageScale).toBe(2.5);

      act(() => {
        vi.advanceTimersByTime(16);
      });

      // Dimensions should reflect final scale
      expect(result.current.canvasWidth).toBe(Math.round(1000 * 2.5) + 64 * 2);
      expect(result.current.canvasHeight).toBe(Math.round(800 * 2.5) + 64 * 2);
    });

    it('should prevent race conditions during rapid state changes', () => {
      const { result } = renderHook(() => useEditorStore());
      const mockImage = {
        width: 1000,
        height: 800,
      } as HTMLImageElement;

      act(() => {
        result.current.setImage(mockImage, 'data:image/png;base64,test');
      });

      // Simulate rapid mixed changes (common during UI interactions)
      act(() => {
        result.current.setPadding(80);
        result.current.setImageScale(1.5);
        result.current.setFrameType('browser');
        result.current.setPadding(100);
        result.current.setImageScale(2.0);
        result.current.setFrameType('macos');
      });

      // All values should update immediately
      expect(result.current.padding).toBe(100);
      expect(result.current.imageScale).toBe(2.0);
      expect(result.current.frameType).toBe('macos');

      // Advance debounce timer
      act(() => {
        vi.advanceTimersByTime(16);
      });

      // Dimensions should be calculated once with final values
      // macOS frame = 32px top
      const expectedWidth = Math.round(1000 * 2.0) + 100 * 2;
      const expectedHeight = Math.round(800 * 2.0) + 100 * 2 + 32;

      expect(result.current.canvasWidth).toBe(expectedWidth);
      expect(result.current.canvasHeight).toBe(expectedHeight);
    });

    it('should not debounce when aspect ratio is set', () => {
      const { result } = renderHook(() => useEditorStore());
      const mockImage = {
        width: 1000,
        height: 800,
      } as HTMLImageElement;

      act(() => {
        result.current.setImage(mockImage, 'data:image/png;base64,test');
        result.current.setAspectRatio('16:9');
      });

      const widthBeforeChange = result.current.canvasWidth;

      act(() => {
        result.current.setPadding(100);
      });

      // Should not trigger dimension recalculation when aspect ratio is set
      expect(result.current.padding).toBe(100);
      expect(result.current.canvasWidth).toBe(widthBeforeChange);

      act(() => {
        vi.advanceTimersByTime(16);
      });

      // Still should not recalculate
      expect(result.current.canvasWidth).toBe(widthBeforeChange);
    });

    it('should not debounce when no image is set', () => {
      const { result } = renderHook(() => useEditorStore());

      act(() => {
        result.current.setPadding(100);
      });

      expect(result.current.padding).toBe(100);

      act(() => {
        vi.advanceTimersByTime(16);
      });

      // Should not cause errors, dimensions stay as defaults
      expect(result.current.canvasWidth).toBe(1600);
      expect(result.current.canvasHeight).toBe(900);
    });
  });

  describe('Background Settings', () => {
    it('should set background type', () => {
      const { result } = renderHook(() => useEditorStore());

      act(() => {
        result.current.setBackgroundType('solid');
      });

      expect(result.current.backgroundType).toBe('solid');
    });

    it('should set solid background color', () => {
      const { result } = renderHook(() => useEditorStore());

      act(() => {
        result.current.setBackgroundColor('#ff0000');
      });

      expect(result.current.backgroundColor).toBe('#ff0000');
      expect(result.current.backgroundType).toBe('solid');
    });

    it('should set gradient colors and angle', () => {
      const { result } = renderHook(() => useEditorStore());

      act(() => {
        result.current.setGradient(['#ff0000', '#00ff00'], 45);
      });

      expect(result.current.gradientColors).toEqual(['#ff0000', '#00ff00']);
      expect(result.current.gradientAngle).toBe(45);
      expect(result.current.backgroundType).toBe('gradient');
    });

    it('should set mesh gradient CSS', () => {
      const { result } = renderHook(() => useEditorStore());

      act(() => {
        result.current.setMeshGradient('radial-gradient(...)');
      });

      expect(result.current.meshGradientCSS).toBe('radial-gradient(...)');
      expect(result.current.backgroundType).toBe('mesh');
    });

    it('should set background image', () => {
      const { result } = renderHook(() => useEditorStore());

      act(() => {
        result.current.setBackgroundImage('url(image.jpg)');
      });

      expect(result.current.backgroundImage).toBe('url(image.jpg)');
      expect(result.current.backgroundType).toBe('image');
    });
  });

  describe('Shadow Settings', () => {
    it('should set shadow blur', () => {
      const { result } = renderHook(() => useEditorStore());

      act(() => {
        result.current.setShadowBlur(30);
      });

      expect(result.current.shadowBlur).toBe(30);
    });

    it('should set shadow opacity with clamping', () => {
      const { result } = renderHook(() => useEditorStore());

      act(() => {
        result.current.setShadowOpacity(75);
      });
      expect(result.current.shadowOpacity).toBe(75);

      act(() => {
        result.current.setShadowOpacity(150); // Over 100
      });
      expect(result.current.shadowOpacity).toBe(100);

      act(() => {
        result.current.setShadowOpacity(-10); // Below 0
      });
      expect(result.current.shadowOpacity).toBe(0);
    });

    it('should set shadow color', () => {
      const { result } = renderHook(() => useEditorStore());

      act(() => {
        result.current.setShadowColor('rgba(255, 0, 0, 0.5)');
      });

      expect(result.current.shadowColor).toBe('rgba(255, 0, 0, 0.5)');
    });
  });

  describe('Other Settings', () => {
    it('should set border radius', () => {
      const { result } = renderHook(() => useEditorStore());

      act(() => {
        result.current.setBorderRadius(24);
      });

      expect(result.current.borderRadius).toBe(24);
    });

    it('should set rotation', () => {
      const { result } = renderHook(() => useEditorStore());

      act(() => {
        result.current.setRotation(90);
      });

      expect(result.current.rotation).toBe(90);
    });

    it('should set aspect ratio', () => {
      const { result } = renderHook(() => useEditorStore());

      act(() => {
        result.current.setAspectRatio('16:9');
      });

      expect(result.current.aspectRatio).toBe('16:9');
    });

    it('should set export format', () => {
      const { result } = renderHook(() => useEditorStore());

      act(() => {
        result.current.setExportFormat('jpeg');
      });

      expect(result.current.exportFormat).toBe('jpeg');
    });

    it('should set export scale', () => {
      const { result } = renderHook(() => useEditorStore());

      act(() => {
        result.current.setExportScale(3);
      });

      expect(result.current.exportScale).toBe(3);
    });
  });

  describe('Reset Functionality', () => {
    it('should reset all settings to defaults', () => {
      const { result } = renderHook(() => useEditorStore());
      const mockImage = {
        width: 1000,
        height: 800,
      } as HTMLImageElement;

      // Change multiple settings
      act(() => {
        result.current.setImage(mockImage, 'data:image/png;base64,test');
        result.current.setPadding(100);
        result.current.setBackgroundColor('#ff0000');
        result.current.setFrameType('browser');
        result.current.setImageScale(2);
      });

      // Reset
      act(() => {
        result.current.resetToDefaults();
      });

      // Verify reset to defaults
      expect(result.current.originalImage).toBeNull();
      expect(result.current.imageDataUrl).toBeNull();
      expect(result.current.padding).toBe(64);
      expect(result.current.backgroundType).toBe('gradient');
      expect(result.current.frameType).toBe('none');
      expect(result.current.imageScale).toBe(1);
    });
  });

  describe('Performance and Race Conditions', () => {
    it('should handle 100 rapid padding changes without race conditions', () => {
      const { result } = renderHook(() => useEditorStore());
      const mockImage = {
        width: 1000,
        height: 800,
      } as HTMLImageElement;

      act(() => {
        result.current.setImage(mockImage, 'data:image/png;base64,test');
      });

      // Simulate 100 rapid changes
      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.setPadding(i);
        }
      });

      // Final padding value should be correct
      expect(result.current.padding).toBe(99);

      act(() => {
        vi.advanceTimersByTime(16);
      });

      // Dimensions should be calculated with final value only
      expect(result.current.canvasWidth).toBe(1000 + 99 * 2);
      expect(result.current.canvasHeight).toBe(800 + 99 * 2);
    });

    it('should debounce only once for multiple rapid changes', () => {
      const { result } = renderHook(() => useEditorStore());
      const mockImage = {
        width: 1000,
        height: 800,
      } as HTMLImageElement;

      act(() => {
        result.current.setImage(mockImage, 'data:image/png;base64,test');
      });

      let recalculations = 0;
      const originalWidth = result.current.canvasWidth;

      act(() => {
        for (let i = 0; i < 50; i++) {
          result.current.setPadding(64 + i);
          if (result.current.canvasWidth !== originalWidth && i < 49) {
            recalculations++;
          }
        }
      });

      // Should have debounced, no intermediate recalculations
      expect(recalculations).toBe(0);

      act(() => {
        vi.advanceTimersByTime(16);
      });

      // Single final recalculation
      expect(result.current.canvasWidth).toBe(1000 + (64 + 49) * 2);
    });
  });
});
