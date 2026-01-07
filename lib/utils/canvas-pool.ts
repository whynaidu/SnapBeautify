/**
 * Canvas Pool Manager
 * Prevents memory leaks by reusing canvas elements
 */

interface CanvasPoolEntry {
    canvas: HTMLCanvasElement;
    lastUsed: number;
    inUse: boolean;
}

class CanvasPoolManager {
    private pool: Map<string, CanvasPoolEntry> = new Map();
    private readonly MAX_POOL_SIZE = 5;
    private readonly MAX_IDLE_TIME = 30000; // 30 seconds
    private cleanupInterval: NodeJS.Timeout | null = null;

    constructor() {
        this.startCleanupTimer();
    }

    private getPoolKey(width: number, height: number): string {
        return `${width}x${height}`;
    }

    /**
     * Get a canvas from the pool or create a new one
     */
    acquire(width: number, height: number): HTMLCanvasElement {
        const key = this.getPoolKey(width, height);
        const entry = this.pool.get(key);

        if (entry && !entry.inUse) {
            entry.inUse = true;
            entry.lastUsed = Date.now();
            return entry.canvas;
        }

        // Create new canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const newEntry: CanvasPoolEntry = {
            canvas,
            lastUsed: Date.now(),
            inUse: true,
        };

        this.pool.set(key, newEntry);
        this.enforcePoolSizeLimit();

        return canvas;
    }

    /**
     * Return a canvas to the pool
     */
    release(canvas: HTMLCanvasElement): void {
        const key = this.getPoolKey(canvas.width, canvas.height);
        const entry = this.pool.get(key);

        if (entry && entry.canvas === canvas) {
            entry.inUse = false;
            entry.lastUsed = Date.now();

            // Clear the canvas for reuse
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    }

    /**
     * Dispose of a canvas permanently
     */
    dispose(canvas: HTMLCanvasElement): void {
        const key = this.getPoolKey(canvas.width, canvas.height);
        const entry = this.pool.get(key);

        if (entry && entry.canvas === canvas) {
            this.destroyCanvas(canvas);
            this.pool.delete(key);
        }
    }

    /**
     * Clean up idle canvases
     */
    private cleanup(): void {
        const now = Date.now();

        for (const [key, entry] of this.pool.entries()) {
            if (!entry.inUse && now - entry.lastUsed > this.MAX_IDLE_TIME) {
                this.destroyCanvas(entry.canvas);
                this.pool.delete(key);
            }
        }
    }

    /**
     * Enforce maximum pool size
     */
    private enforcePoolSizeLimit(): void {
        if (this.pool.size <= this.MAX_POOL_SIZE) return;

        // Remove oldest unused canvas
        let oldestKey: string | null = null;
        let oldestTime = Date.now();

        for (const [key, entry] of this.pool.entries()) {
            if (!entry.inUse && entry.lastUsed < oldestTime) {
                oldestTime = entry.lastUsed;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            const entry = this.pool.get(oldestKey);
            if (entry) {
                this.destroyCanvas(entry.canvas);
                this.pool.delete(oldestKey);
            }
        }
    }

    /**
     * Properly destroy a canvas element
     */
    private destroyCanvas(canvas: HTMLCanvasElement): void {
        // Clear the canvas
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        // Set dimensions to 0 to free memory
        canvas.width = 0;
        canvas.height = 0;
    }

    /**
     * Start periodic cleanup
     */
    private startCleanupTimer(): void {
        if (typeof window === 'undefined') return;

        this.cleanupInterval = setInterval(() => {
            this.cleanup();
        }, this.MAX_IDLE_TIME);
    }

    /**
     * Stop cleanup timer and destroy all canvases
     */
    destroy(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }

        for (const [key, entry] of this.pool.entries()) {
            this.destroyCanvas(entry.canvas);
        }

        this.pool.clear();
    }
}

// Singleton instance
export const canvasPool = new CanvasPoolManager();

// Cleanup on page unload
if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', () => {
        canvasPool.destroy();
    });
}
