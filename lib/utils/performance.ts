/**
 * Performance Monitoring System
 * Tracks and reports performance metrics for critical operations
 */

import { logger } from './logger';

/**
 * Performance thresholds (in milliseconds)
 */
const THRESHOLDS = {
    RENDER: 16, // 60fps = 16.67ms per frame
    CANVAS_OPERATION: 100, // Canvas operations should be under 100ms
    IMAGE_LOAD: 3000, // Image loading should complete within 3s
    EXPORT: 5000, // Export should complete within 5s
} as const;

/**
 * Performance metric entry
 */
interface PerformanceEntry {
    name: string;
    duration: number;
    timestamp: number;
    threshold: number;
    metadata?: Record<string, unknown>;
}

/**
 * Performance statistics
 */
interface PerformanceStats {
    count: number;
    totalDuration: number;
    avgDuration: number;
    minDuration: number;
    maxDuration: number;
    slowOperations: number; // Count of operations exceeding threshold
}

/**
 * Singleton Performance Monitor
 */
class PerformanceMonitor {
    private static instance: PerformanceMonitor;
    private metrics: Map<string, PerformanceEntry[]> = new Map();
    private enabled: boolean;

    private constructor() {
        // Enable in development and when explicitly enabled in production
        this.enabled =
            process.env.NODE_ENV === 'development' ||
            process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true';
    }

    static getInstance(): PerformanceMonitor {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor();
        }
        return PerformanceMonitor.instance;
    }

    /**
     * Measure synchronous operation performance
     */
    measure<T>(
        name: string,
        operation: () => T,
        threshold: number = THRESHOLDS.RENDER,
        metadata?: Record<string, unknown>
    ): T {
        if (!this.enabled) {
            return operation();
        }

        const start = performance.now();
        try {
            return operation();
        } finally {
            const duration = performance.now() - start;
            this.recordMetric(name, duration, threshold, metadata);
        }
    }

    /**
     * Measure asynchronous operation performance
     */
    async measureAsync<T>(
        name: string,
        operation: () => Promise<T>,
        threshold: number = THRESHOLDS.RENDER,
        metadata?: Record<string, unknown>
    ): Promise<T> {
        if (!this.enabled) {
            return operation();
        }

        const start = performance.now();
        try {
            return await operation();
        } finally {
            const duration = performance.now() - start;
            this.recordMetric(name, duration, threshold, metadata);
        }
    }

    /**
     * Start a manual performance measurement
     */
    start(name: string): (threshold?: number, metadata?: Record<string, unknown>) => void {
        if (!this.enabled) {
            return () => {}; // No-op
        }

        const startTime = performance.now();
        return (threshold: number = THRESHOLDS.RENDER, metadata?: Record<string, unknown>) => {
            const duration = performance.now() - startTime;
            this.recordMetric(name, duration, threshold, metadata);
        };
    }

    /**
     * Record a metric entry
     */
    private recordMetric(
        name: string,
        duration: number,
        threshold: number,
        metadata?: Record<string, unknown>
    ): void {
        const entry: PerformanceEntry = {
            name,
            duration,
            timestamp: Date.now(),
            threshold,
            metadata,
        };

        // Store metric
        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }
        this.metrics.get(name)!.push(entry);

        // Keep only last 100 entries per metric
        const entries = this.metrics.get(name)!;
        if (entries.length > 100) {
            entries.shift();
        }

        // Log slow operations
        if (duration > threshold) {
            logger.warn('performance:slow', `${name} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`, {
                duration,
                threshold,
                ...metadata,
            });
        } else if (process.env.NODE_ENV === 'development') {
            logger.debug(`performance:${name}`, {
                duration: duration.toFixed(2),
                ...metadata,
            });
        }
    }

    /**
     * Get statistics for a specific metric
     */
    getStats(name: string): PerformanceStats | null {
        const entries = this.metrics.get(name);
        if (!entries || entries.length === 0) {
            return null;
        }

        const durations = entries.map(e => e.duration);
        const totalDuration = durations.reduce((sum, d) => sum + d, 0);
        const slowOperations = entries.filter(e => e.duration > e.threshold).length;

        return {
            count: entries.length,
            totalDuration,
            avgDuration: totalDuration / entries.length,
            minDuration: Math.min(...durations),
            maxDuration: Math.max(...durations),
            slowOperations,
        };
    }

    /**
     * Get all available metrics
     */
    getAllMetrics(): string[] {
        return Array.from(this.metrics.keys());
    }

    /**
     * Get performance report
     */
    getReport(): Record<string, PerformanceStats | null> {
        const report: Record<string, PerformanceStats | null> = {};
        for (const name of this.metrics.keys()) {
            report[name] = this.getStats(name);
        }
        return report;
    }

    /**
     * Clear all metrics
     */
    clear(): void {
        this.metrics.clear();
    }

    /**
     * Clear metrics for a specific operation
     */
    clearMetric(name: string): void {
        this.metrics.delete(name);
    }

    /**
     * Enable/disable monitoring
     */
    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    /**
     * Check if monitoring is enabled
     */
    isEnabled(): boolean {
        return this.enabled;
    }
}

/**
 * Singleton instance
 */
export const performanceMonitor = PerformanceMonitor.getInstance();

/**
 * Performance monitoring decorators and utilities
 */

/**
 * Measure canvas rendering performance
 */
export function measureRender<T>(name: string, operation: () => T, metadata?: Record<string, unknown>): T {
    return performanceMonitor.measure(name, operation, THRESHOLDS.RENDER, metadata);
}

/**
 * Measure canvas operation performance
 */
export function measureCanvasOp<T>(name: string, operation: () => T, metadata?: Record<string, unknown>): T {
    return performanceMonitor.measure(name, operation, THRESHOLDS.CANVAS_OPERATION, metadata);
}

/**
 * Measure async canvas operation performance
 */
export async function measureCanvasOpAsync<T>(
    name: string,
    operation: () => Promise<T>,
    metadata?: Record<string, unknown>
): Promise<T> {
    return performanceMonitor.measureAsync(name, operation, THRESHOLDS.CANVAS_OPERATION, metadata);
}

/**
 * Measure image loading performance
 */
export async function measureImageLoad<T>(
    name: string,
    operation: () => Promise<T>,
    metadata?: Record<string, unknown>
): Promise<T> {
    return performanceMonitor.measureAsync(name, operation, THRESHOLDS.IMAGE_LOAD, metadata);
}

/**
 * Measure export operation performance
 */
export async function measureExport<T>(
    name: string,
    operation: () => Promise<T>,
    metadata?: Record<string, unknown>
): Promise<T> {
    return performanceMonitor.measureAsync(name, operation, THRESHOLDS.EXPORT, metadata);
}

/**
 * Mark and measure using Performance API
 * Useful for measuring across async boundaries
 */
export class PerformanceMark {
    private name: string;
    private startMark: string;
    private endMark: string;

    constructor(name: string) {
        this.name = name;
        this.startMark = `${name}-start`;
        this.endMark = `${name}-end`;
    }

    start(): void {
        if (typeof performance !== 'undefined' && performance.mark) {
            performance.mark(this.startMark);
        }
    }

    end(threshold?: number, metadata?: Record<string, unknown>): number | null {
        if (typeof performance === 'undefined' || !performance.mark || !performance.measure) {
            return null;
        }

        performance.mark(this.endMark);

        try {
            performance.measure(this.name, this.startMark, this.endMark);
            const measure = performance.getEntriesByName(this.name, 'measure')[0];

            if (measure) {
                const duration = measure.duration;

                // Record in our monitor
                if (threshold !== undefined) {
                    performanceMonitor.measure(
                        this.name,
                        () => {},
                        threshold,
                        { ...metadata, duration }
                    );
                }

                // Clean up marks
                performance.clearMarks(this.startMark);
                performance.clearMarks(this.endMark);
                performance.clearMeasures(this.name);

                return duration;
            }
        } catch (error) {
            logger.debug('performance:mark:error', { error, name: this.name });
        }

        return null;
    }
}

/**
 * React hook for performance monitoring
 */
export function usePerformanceMark(name: string): {
    start: () => void;
    end: (threshold?: number, metadata?: Record<string, unknown>) => void;
} {
    const mark = new PerformanceMark(name);
    return {
        start: () => mark.start(),
        end: (threshold, metadata) => mark.end(threshold, metadata),
    };
}

/**
 * Export thresholds for use in components
 */
export { THRESHOLDS as PERFORMANCE_THRESHOLDS };
