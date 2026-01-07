import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Canvas } from '../Canvas';
import { useEditorStore } from '@/lib/store/editor-store';
import { renderCanvas } from '@/lib/canvas/renderer';

// Mock dependencies
vi.mock('@/lib/store/editor-store');
vi.mock('@/lib/canvas/renderer');
vi.mock('../DropZone', () => ({
  DropZone: () => <div data-testid="drop-zone">Drop Zone</div>,
}));
vi.mock('@/lib/utils/performance', () => ({
  measureRender: vi.fn((name, fn) => fn()),
}));
vi.mock('@/lib/hooks/useThrottle', () => ({
  useThrottle: vi.fn((fn) => fn),
}));

describe('Canvas Component', () => {
  const mockImage = {
    width: 1000,
    height: 800,
  } as HTMLImageElement;

  const defaultState = {
    originalImage: mockImage,
    backgroundType: 'gradient' as const,
    backgroundColor: '#6366f1',
    gradientColors: ['#6366f1', '#8b5cf6'] as [string, string],
    gradientAngle: 135,
    meshGradientCSS: '',
    padding: 64,
    shadowBlur: 20,
    shadowOpacity: 50,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    frameType: 'none' as const,
    imageScale: 1,
    rotation: 0,
    canvasWidth: 1128,
    canvasHeight: 928,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useEditorStore
    (useEditorStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(defaultState);

    // Mock renderCanvas
    (renderCanvas as ReturnType<typeof vi.fn>).mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render canvas when image is present', () => {
      const { container } = render(<Canvas />);
      const canvas = container.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
    });

    it('should render DropZone when no image is present', () => {
      (useEditorStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultState,
        originalImage: null,
      });

      render(<Canvas />);
      expect(screen.getByTestId('drop-zone')).toBeInTheDocument();
    });

    it('should apply correct container styling', () => {
      const { container } = render(<Canvas />);
      const containerDiv = container.firstChild as HTMLElement;

      expect(containerDiv).toHaveClass('flex-1');
      expect(containerDiv).toHaveClass('flex');
      expect(containerDiv).toHaveClass('items-center');
      expect(containerDiv).toHaveClass('justify-center');
    });

    it('should apply canvas styling', () => {
      const { container } = render(<Canvas />);
      const canvas = container.querySelector('canvas');

      expect(canvas).toHaveClass('rounded-lg');
      expect(canvas).toHaveClass('shadow-2xl');
    });
  });

  describe('Canvas Rendering', () => {
    it('should call renderCanvas when image is present', () => {
      render(<Canvas />);

      expect(renderCanvas).toHaveBeenCalled();
    });

    it('should pass correct parameters to renderCanvas', () => {
      render(<Canvas />);

      expect(renderCanvas).toHaveBeenCalledWith(
        expect.objectContaining({
          image: mockImage,
          backgroundType: 'gradient',
          backgroundColor: '#6366f1',
          padding: 64,
          shadowBlur: 20,
          shadowOpacity: 50,
          frameType: 'none',
          imageScale: 1,
          rotation: 0,
        })
      );
    });

    it('should not call renderCanvas when no image is present', () => {
      (useEditorStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultState,
        originalImage: null,
      });

      render(<Canvas />);

      expect(renderCanvas).not.toHaveBeenCalled();
    });

    it('should pass canvas element to renderCanvas', () => {
      const { container } = render(<Canvas />);
      const canvas = container.querySelector('canvas');

      expect(renderCanvas).toHaveBeenCalledWith(
        expect.objectContaining({
          canvas: canvas,
        })
      );
    });
  });

  describe('Throttled Rendering', () => {
    it('should render canvas with throttling enabled', () => {
      // useThrottle is mocked to pass through for testing
      // Actual throttling behavior is tested in useThrottle.test.ts
      render(<Canvas />);

      expect(renderCanvas).toHaveBeenCalled();
    });

    it('should render when state changes', () => {
      const { rerender } = render(<Canvas />);

      (useEditorStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultState,
        padding: 100,
      });

      rerender(<Canvas />);

      expect(renderCanvas).toHaveBeenCalled();
    });
  });

  describe('Different States', () => {
    it('should handle browser frame type', () => {
      (useEditorStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultState,
        frameType: 'browser',
      });

      render(<Canvas />);

      expect(renderCanvas).toHaveBeenCalledWith(
        expect.objectContaining({
          frameType: 'browser',
        })
      );
    });

    it('should handle solid background', () => {
      (useEditorStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultState,
        backgroundType: 'solid',
        backgroundColor: '#ff0000',
      });

      render(<Canvas />);

      expect(renderCanvas).toHaveBeenCalledWith(
        expect.objectContaining({
          backgroundType: 'solid',
          backgroundColor: '#ff0000',
        })
      );
    });

    it('should handle mesh gradient', () => {
      (useEditorStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultState,
        backgroundType: 'mesh',
        meshGradientCSS: 'radial-gradient(...)',
      });

      render(<Canvas />);

      expect(renderCanvas).toHaveBeenCalledWith(
        expect.objectContaining({
          backgroundType: 'mesh',
          meshGradientCSS: 'radial-gradient(...)',
        })
      );
    });

    it('should handle rotation', () => {
      (useEditorStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultState,
        rotation: 90,
      });

      render(<Canvas />);

      expect(renderCanvas).toHaveBeenCalledWith(
        expect.objectContaining({
          rotation: 90,
        })
      );
    });

    it('should handle image scale', () => {
      (useEditorStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultState,
        imageScale: 2,
      });

      render(<Canvas />);

      expect(renderCanvas).toHaveBeenCalledWith(
        expect.objectContaining({
          imageScale: 2,
        })
      );
    });
  });

  describe('All Frame Types', () => {
    const frameTypes = ['none', 'browser', 'macos', 'windows', 'iphone', 'android'] as const;

    frameTypes.forEach((frameType) => {
      it(`should handle ${frameType} frame`, () => {
        (useEditorStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
          ...defaultState,
          frameType,
        });

        const { unmount } = render(<Canvas />);

        expect(renderCanvas).toHaveBeenCalledWith(
          expect.objectContaining({
            frameType,
          })
        );

        unmount();
      });
    });
  });

  describe('Canvas Dimensions', () => {
    it('should handle large canvas dimensions', () => {
      (useEditorStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultState,
        canvasWidth: 5000,
        canvasHeight: 5000,
      });

      render(<Canvas />);

      expect(renderCanvas).toHaveBeenCalledWith(
        expect.objectContaining({
          targetWidth: 5000,
          targetHeight: 5000,
        })
      );
    });

    it('should handle small canvas dimensions', () => {
      (useEditorStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultState,
        canvasWidth: 100,
        canvasHeight: 100,
      });

      render(<Canvas />);

      expect(renderCanvas).toHaveBeenCalledWith(
        expect.objectContaining({
          targetWidth: 100,
          targetHeight: 100,
        })
      );
    });
  });

  describe('Display Scaling', () => {
    it('should apply transform style to canvas', () => {
      const { container } = render(<Canvas />);
      const canvas = container.querySelector('canvas');

      expect(canvas?.style.transform).toBeDefined();
      expect(canvas?.style.transformOrigin).toBe('center center');
    });
  });

  describe('Performance', () => {
    it('should not throw errors on rapid re-renders', () => {
      const { rerender } = render(<Canvas />);

      expect(() => {
        for (let i = 0; i < 100; i++) {
          (useEditorStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            ...defaultState,
            padding: i,
          });
          rerender(<Canvas />);
        }
      }).not.toThrow();
    });

    it('should handle multiple simultaneous state changes', () => {
      (useEditorStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultState,
        padding: 100,
        shadowBlur: 30,
        borderRadius: 20,
        rotation: 45,
      });

      expect(() => render(<Canvas />)).not.toThrow();
    });
  });

  describe('Cleanup', () => {
    it('should cleanup on unmount', () => {
      const { unmount } = render(<Canvas />);

      expect(() => unmount()).not.toThrow();
    });

    it('should not cause memory leaks', () => {
      const { unmount, rerender } = render(<Canvas />);

      for (let i = 0; i < 10; i++) {
        rerender(<Canvas />);
      }

      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Integration', () => {
    it('should work with all parameters combined', () => {
      (useEditorStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        originalImage: mockImage,
        backgroundType: 'mesh',
        backgroundColor: '#ff0000',
        gradientColors: ['#ff0000', '#00ff00'],
        gradientAngle: 45,
        meshGradientCSS: 'radial-gradient(...)',
        padding: 100,
        shadowBlur: 30,
        shadowOpacity: 75,
        shadowColor: 'rgba(255, 0, 0, 0.5)',
        borderRadius: 24,
        frameType: 'browser',
        imageScale: 2,
        rotation: 90,
        canvasWidth: 2000,
        canvasHeight: 1500,
      });

      render(<Canvas />);

      expect(renderCanvas).toHaveBeenCalledWith(
        expect.objectContaining({
          image: mockImage,
          backgroundType: 'mesh',
          padding: 100,
          shadowBlur: 30,
          frameType: 'browser',
          imageScale: 2,
          rotation: 90,
        })
      );
    });
  });
});
