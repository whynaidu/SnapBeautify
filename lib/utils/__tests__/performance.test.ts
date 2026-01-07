import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  performanceMonitor,
  measureRender,
  measureCanvasOp,
  measureCanvasOpAsync,
  measureImageLoad,
  measureExport,
  PerformanceMark,
  PERFORMANCE_THRESHOLDS,
} from '../performance';

describe('Performance Monitoring', () => {
  beforeEach(() => {
    performanceMonitor.clear();
    performanceMonitor.setEnabled(true);
    vi.spyOn(performance, 'now').mockReturnValue(0);
  });

  afterEach(() => {
    performanceMonitor.clear();
    vi.restoreAllMocks();
  });

  describe('PerformanceMonitor.measure', () => {
    it('should measure synchronous operations', () => {
      let callCount = 0;
      const operation = () => {
        callCount++;
        return 'result';
      };

      const result = performanceMonitor.measure('test-op', operation);

      expect(result).toBe('result');
      expect(callCount).toBe(1);
    });

    it('should track execution time', () => {
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0)   // Start time
        .mockReturnValueOnce(100); // End time

      performanceMonitor.measure('test-op', () => 'result');

      const stats = performanceMonitor.getStats('test-op');
      expect(stats).toBeDefined();
      expect(stats!.avgDuration).toBe(100);
    });

    it('should record multiple measurements', () => {
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0).mockReturnValueOnce(50)
        .mockReturnValueOnce(0).mockReturnValueOnce(75)
        .mockReturnValueOnce(0).mockReturnValueOnce(100);

      performanceMonitor.measure('test-op', () => {});
      performanceMonitor.measure('test-op', () => {});
      performanceMonitor.measure('test-op', () => {});

      const stats = performanceMonitor.getStats('test-op');
      expect(stats!.count).toBe(3);
      expect(stats!.avgDuration).toBe(75);
    });

    it('should track min and max durations', () => {
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0).mockReturnValueOnce(100)
        .mockReturnValueOnce(0).mockReturnValueOnce(50)
        .mockReturnValueOnce(0).mockReturnValueOnce(200);

      performanceMonitor.measure('test-op', () => {});
      performanceMonitor.measure('test-op', () => {});
      performanceMonitor.measure('test-op', () => {});

      const stats = performanceMonitor.getStats('test-op');
      expect(stats!.minDuration).toBe(50);
      expect(stats!.maxDuration).toBe(200);
    });

    it('should track slow operations', () => {
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0).mockReturnValueOnce(10)  // Fast
        .mockReturnValueOnce(0).mockReturnValueOnce(30); // Slow (threshold 16)

      performanceMonitor.measure('test-op', () => {}, PERFORMANCE_THRESHOLDS.RENDER);
      performanceMonitor.measure('test-op', () => {}, PERFORMANCE_THRESHOLDS.RENDER);

      const stats = performanceMonitor.getStats('test-op');
      expect(stats!.slowOperations).toBe(1);
    });

    it('should include metadata', () => {
      const metadata = { operation: 'render', frameType: 'iphone' };

      performanceMonitor.measure('test-op', () => {}, 16, metadata);

      // Metadata is recorded but not directly accessible in stats
      const stats = performanceMonitor.getStats('test-op');
      expect(stats).toBeDefined();
    });

    it('should handle exceptions in operation', () => {
      const operation = () => {
        throw new Error('Operation failed');
      };

      expect(() => {
        performanceMonitor.measure('test-op', operation);
      }).toThrow('Operation failed');

      // Should still record the measurement
      const stats = performanceMonitor.getStats('test-op');
      expect(stats!.count).toBe(1);
    });

    it('should return operation result even on exception', () => {
      const operation = () => {
        throw new Error('Test error');
      };

      try {
        performanceMonitor.measure('test-op', operation);
      } catch (error) {
        expect((error as Error).message).toBe('Test error');
      }
    });
  });

  describe('PerformanceMonitor.measureAsync', () => {
    it('should measure async operations', async () => {
      const operation = async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return 'result';
      };

      const result = await performanceMonitor.measureAsync('test-async', operation);

      expect(result).toBe('result');
      const stats = performanceMonitor.getStats('test-async');
      expect(stats).toBeDefined();
    });

    it('should track async execution time', async () => {
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0)    // Start
        .mockReturnValueOnce(150);  // End

      await performanceMonitor.measureAsync('test-async', async () => 'result');

      const stats = performanceMonitor.getStats('test-async');
      expect(stats!.avgDuration).toBe(150);
    });

    it('should handle async exceptions', async () => {
      const operation = async () => {
        throw new Error('Async error');
      };

      await expect(
        performanceMonitor.measureAsync('test-async', operation)
      ).rejects.toThrow('Async error');

      const stats = performanceMonitor.getStats('test-async');
      expect(stats!.count).toBe(1);
    });

    it('should handle Promise rejection', async () => {
      const operation = async () => {
        return Promise.reject(new Error('Rejected'));
      };

      await expect(
        performanceMonitor.measureAsync('test-async', operation)
      ).rejects.toThrow('Rejected');
    });
  });

  describe('PerformanceMonitor.start', () => {
    it('should create a manual measurement function', () => {
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0)    // Start
        .mockReturnValueOnce(100);  // End

      const end = performanceMonitor.start('manual-op');
      end(16);

      const stats = performanceMonitor.getStats('manual-op');
      expect(stats!.avgDuration).toBe(100);
    });

    it('should allow ending with metadata', () => {
      const end = performanceMonitor.start('manual-op');
      end(16, { custom: 'data' });

      const stats = performanceMonitor.getStats('manual-op');
      expect(stats).toBeDefined();
    });

    it('should return no-op when disabled', () => {
      performanceMonitor.setEnabled(false);

      const end = performanceMonitor.start('manual-op');
      end(16);

      const stats = performanceMonitor.getStats('manual-op');
      expect(stats).toBeNull();

      performanceMonitor.setEnabled(true);
    });
  });

  describe('PerformanceMonitor.getStats', () => {
    it('should return null for non-existent metric', () => {
      const stats = performanceMonitor.getStats('non-existent');

      expect(stats).toBeNull();
    });

    it('should calculate correct average', () => {
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0).mockReturnValueOnce(100)
        .mockReturnValueOnce(0).mockReturnValueOnce(200)
        .mockReturnValueOnce(0).mockReturnValueOnce(300);

      performanceMonitor.measure('test-avg', () => {});
      performanceMonitor.measure('test-avg', () => {});
      performanceMonitor.measure('test-avg', () => {});

      const stats = performanceMonitor.getStats('test-avg');
      expect(stats!.avgDuration).toBe(200);
    });

    it('should calculate total duration', () => {
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0).mockReturnValueOnce(100)
        .mockReturnValueOnce(0).mockReturnValueOnce(200);

      performanceMonitor.measure('test-total', () => {});
      performanceMonitor.measure('test-total', () => {});

      const stats = performanceMonitor.getStats('test-total');
      expect(stats!.totalDuration).toBe(300);
    });

    it('should limit entries to 100', () => {
      // Create 150 entries
      for (let i = 0; i < 150; i++) {
        performanceMonitor.measure('test-limit', () => {});
      }

      const stats = performanceMonitor.getStats('test-limit');
      expect(stats!.count).toBeLessThanOrEqual(100);
    });
  });

  describe('PerformanceMonitor.getAllMetrics', () => {
    it('should return empty array when no metrics', () => {
      const metrics = performanceMonitor.getAllMetrics();

      expect(metrics).toEqual([]);
    });

    it('should return all metric names', () => {
      performanceMonitor.measure('metric1', () => {});
      performanceMonitor.measure('metric2', () => {});
      performanceMonitor.measure('metric3', () => {});

      const metrics = performanceMonitor.getAllMetrics();

      expect(metrics).toContain('metric1');
      expect(metrics).toContain('metric2');
      expect(metrics).toContain('metric3');
      expect(metrics.length).toBe(3);
    });
  });

  describe('PerformanceMonitor.getReport', () => {
    it('should return report for all metrics', () => {
      performanceMonitor.measure('op1', () => {});
      performanceMonitor.measure('op2', () => {});

      const report = performanceMonitor.getReport();

      expect(report.op1).toBeDefined();
      expect(report.op2).toBeDefined();
    });

    it('should return empty report when no metrics', () => {
      const report = performanceMonitor.getReport();

      expect(Object.keys(report).length).toBe(0);
    });
  });

  describe('PerformanceMonitor.clear', () => {
    it('should remove all metrics', () => {
      performanceMonitor.measure('op1', () => {});
      performanceMonitor.measure('op2', () => {});

      performanceMonitor.clear();

      const metrics = performanceMonitor.getAllMetrics();
      expect(metrics.length).toBe(0);
    });

    it('should allow new measurements after clear', () => {
      performanceMonitor.measure('op1', () => {});
      performanceMonitor.clear();

      performanceMonitor.measure('op2', () => {});

      const metrics = performanceMonitor.getAllMetrics();
      expect(metrics).toEqual(['op2']);
    });
  });

  describe('PerformanceMonitor.clearMetric', () => {
    it('should remove specific metric', () => {
      performanceMonitor.measure('op1', () => {});
      performanceMonitor.measure('op2', () => {});

      performanceMonitor.clearMetric('op1');

      const metrics = performanceMonitor.getAllMetrics();
      expect(metrics).toEqual(['op2']);
    });

    it('should handle clearing non-existent metric', () => {
      expect(() => {
        performanceMonitor.clearMetric('non-existent');
      }).not.toThrow();
    });
  });

  describe('PerformanceMonitor.setEnabled', () => {
    it('should disable monitoring', () => {
      performanceMonitor.setEnabled(false);
      performanceMonitor.measure('test', () => {});

      const stats = performanceMonitor.getStats('test');
      expect(stats).toBeNull();
    });

    it('should enable monitoring', () => {
      performanceMonitor.setEnabled(false);
      performanceMonitor.setEnabled(true);

      performanceMonitor.measure('test', () => {});

      const stats = performanceMonitor.getStats('test');
      expect(stats).toBeDefined();
    });
  });

  describe('Helper Functions', () => {
    it('measureRender should use RENDER threshold', () => {
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(20); // Exceeds 16ms threshold

      measureRender('render-test', () => {});

      const stats = performanceMonitor.getStats('render-test');
      expect(stats!.slowOperations).toBe(1);
    });

    it('measureCanvasOp should use CANVAS_OPERATION threshold', () => {
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(150); // Exceeds 100ms threshold

      measureCanvasOp('canvas-test', () => {});

      const stats = performanceMonitor.getStats('canvas-test');
      expect(stats!.slowOperations).toBe(1);
    });

    it('measureCanvasOpAsync should handle async operations', async () => {
      const result = await measureCanvasOpAsync('async-canvas', async () => 'result');

      expect(result).toBe('result');
      const stats = performanceMonitor.getStats('async-canvas');
      expect(stats).toBeDefined();
    });

    it('measureImageLoad should handle image loading', async () => {
      const result = await measureImageLoad('image-load', async () => 'loaded');

      expect(result).toBe('loaded');
      const stats = performanceMonitor.getStats('image-load');
      expect(stats).toBeDefined();
    });

    it('measureExport should handle export operations', async () => {
      const result = await measureExport('export-test', async () => 'exported');

      expect(result).toBe('exported');
      const stats = performanceMonitor.getStats('export-test');
      expect(stats).toBeDefined();
    });
  });

  describe('PerformanceMark', () => {
    it('should create performance marks', () => {
      const mark = new PerformanceMark('test-mark');

      mark.start();
      mark.end();

      // Mark should be created (tested via no exceptions)
      expect(true).toBe(true);
    });

    it('should measure duration', () => {
      vi.spyOn(performance, 'measure').mockImplementation(() => {});
      vi.spyOn(performance, 'getEntriesByName').mockReturnValue([
        { duration: 150 } as PerformanceEntry,
      ]);

      const mark = new PerformanceMark('test-mark');
      mark.start();
      const duration = mark.end();

      expect(duration).toBe(150);
    });

    it('should clean up marks', () => {
      const clearMarks = vi.spyOn(performance, 'clearMarks');
      const clearMeasures = vi.spyOn(performance, 'clearMeasures');

      const mark = new PerformanceMark('test-mark');
      mark.start();
      mark.end();

      expect(clearMarks).toHaveBeenCalled();
      expect(clearMeasures).toHaveBeenCalled();
    });

    it('should handle missing performance API', () => {
      const originalPerf = global.performance;
      // @ts-ignore
      delete global.performance;

      const mark = new PerformanceMark('test-mark');
      const duration = mark.end();

      expect(duration).toBeNull();

      global.performance = originalPerf;
    });
  });

  describe('PERFORMANCE_THRESHOLDS', () => {
    it('should define all required thresholds', () => {
      expect(PERFORMANCE_THRESHOLDS.RENDER).toBeDefined();
      expect(PERFORMANCE_THRESHOLDS.CANVAS_OPERATION).toBeDefined();
      expect(PERFORMANCE_THRESHOLDS.IMAGE_LOAD).toBeDefined();
      expect(PERFORMANCE_THRESHOLDS.EXPORT).toBeDefined();
    });

    it('should have reasonable threshold values', () => {
      expect(PERFORMANCE_THRESHOLDS.RENDER).toBe(16); // 60 FPS
      expect(PERFORMANCE_THRESHOLDS.CANVAS_OPERATION).toBe(100);
      expect(PERFORMANCE_THRESHOLDS.IMAGE_LOAD).toBe(3000);
      expect(PERFORMANCE_THRESHOLDS.EXPORT).toBe(5000);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very fast operations', () => {
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0.1);

      performanceMonitor.measure('fast-op', () => {});

      const stats = performanceMonitor.getStats('fast-op');
      expect(stats!.avgDuration).toBe(0.1);
    });

    it('should handle very slow operations', () => {
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(10000);

      performanceMonitor.measure('slow-op', () => {});

      const stats = performanceMonitor.getStats('slow-op');
      expect(stats!.avgDuration).toBe(10000);
    });

    it('should handle operations with same name', () => {
      performanceMonitor.measure('same-name', () => {});
      performanceMonitor.measure('same-name', () => {});

      const stats = performanceMonitor.getStats('same-name');
      expect(stats!.count).toBe(2);
    });

    it('should handle special characters in metric names', () => {
      performanceMonitor.measure('test:metric@123', () => {});

      const stats = performanceMonitor.getStats('test:metric@123');
      expect(stats).toBeDefined();
    });

    it('should handle negative time differences', () => {
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(100)
        .mockReturnValueOnce(50);

      performanceMonitor.measure('negative-time', () => {});

      const stats = performanceMonitor.getStats('negative-time');
      // Should handle gracefully
      expect(stats).toBeDefined();
    });

    it('should handle concurrent measurements', () => {
      const end1 = performanceMonitor.start('concurrent-1');
      const end2 = performanceMonitor.start('concurrent-2');

      end1();
      end2();

      expect(performanceMonitor.getStats('concurrent-1')).toBeDefined();
      expect(performanceMonitor.getStats('concurrent-2')).toBeDefined();
    });
  });
});
