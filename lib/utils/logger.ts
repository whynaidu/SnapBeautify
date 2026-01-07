/**
 * Centralized Logging and Telemetry System
 * Provides structured logging with support for production monitoring
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
    [key: string]: unknown;
}

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    event: string;
    message?: string;
    context?: LogContext;
    error?: Error;
    stack?: string;
}

class Logger {
    private isProduction = process.env.NODE_ENV === 'production';
    private isDevelopment = process.env.NODE_ENV === 'development';

    /**
     * Log debug information (development only)
     */
    debug(event: string, context?: LogContext): void {
        if (this.isDevelopment) {
            this.log('debug', event, undefined, context);
        }
    }

    /**
     * Log informational events
     */
    info(event: string, message?: string, context?: LogContext): void {
        this.log('info', event, message, context);
    }

    /**
     * Log warning events
     */
    warn(event: string, message: string, context?: LogContext): void {
        this.log('warn', event, message, context);
    }

    /**
     * Log error events
     */
    error(event: string, error: Error, context?: LogContext): void {
        this.log('error', event, error.message, context, error);

        // Send to error tracking service in production
        if (this.isProduction) {
            this.sendToErrorTracking(event, error, context);
        }
    }

    /**
     * Core logging method
     */
    private log(
        level: LogLevel,
        event: string,
        message?: string,
        context?: LogContext,
        error?: Error
    ): void {
        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            event,
            message,
            context,
            error,
            stack: error?.stack,
        };

        // Console output with appropriate method
        const consoleMethod = level === 'error' ? console.error :
                             level === 'warn' ? console.warn :
                             level === 'info' ? console.log :
                             console.debug;

        if (this.isDevelopment) {
            // Pretty print in development
            consoleMethod(
                `[${level.toUpperCase()}] ${event}`,
                message || '',
                context || '',
                error || ''
            );
        } else {
            // Structured JSON in production
            consoleMethod(JSON.stringify(entry));
        }

        // Store in local buffer for debugging
        this.storeInBuffer(entry);
    }

    /**
     * Send error to tracking service (Sentry, LogRocket, etc.)
     */
    private sendToErrorTracking(
        event: string,
        error: Error,
        context?: LogContext
    ): void {
        // TODO: Integrate with Sentry or similar service
        // Example:
        // if (typeof Sentry !== 'undefined') {
        //     Sentry.captureException(error, {
        //         tags: { event },
        //         extra: context,
        //     });
        // }

        // For now, just ensure error is captured
        console.error('[ERROR_TRACKING]', { event, error, context });
    }

    /**
     * Store logs in memory buffer for debugging
     */
    private logBuffer: LogEntry[] = [];
    private readonly MAX_BUFFER_SIZE = 100;

    private storeInBuffer(entry: LogEntry): void {
        this.logBuffer.push(entry);

        // Keep buffer size limited
        if (this.logBuffer.length > this.MAX_BUFFER_SIZE) {
            this.logBuffer.shift();
        }
    }

    /**
     * Get recent logs (useful for debugging)
     */
    getRecentLogs(count: number = 50): LogEntry[] {
        return this.logBuffer.slice(-count);
    }

    /**
     * Clear log buffer
     */
    clearLogs(): void {
        this.logBuffer = [];
    }

    /**
     * Export logs for support/debugging
     */
    exportLogs(): string {
        return JSON.stringify(this.logBuffer, null, 2);
    }
}

// Singleton instance
export const logger = new Logger();

// Analytics tracking
export const analytics = {
    /**
     * Track user events
     */
    track(event: string, properties?: Record<string, unknown>): void {
        logger.info(`analytics:${event}`, undefined, properties);

        // TODO: Send to analytics service (Google Analytics, Mixpanel, etc.)
        if (process.env.NODE_ENV === 'production') {
            // Example: gtag('event', event, properties);
        }
    },

    /**
     * Track page views
     */
    pageView(path: string, title?: string): void {
        this.track('page_view', { path, title });
    },

    /**
     * Track feature usage
     */
    feature(feature: string, action: string, metadata?: Record<string, unknown>): void {
        this.track('feature_usage', { feature, action, ...metadata });
    },

    /**
     * Track export events
     */
    export(format: string, scale: number, success: boolean): void {
        this.track('export', { format, scale, success });
    },
};

// Performance monitoring
export const performance = {
    /**
     * Measure operation duration
     */
    async measure<T>(
        operation: string,
        fn: () => Promise<T>,
        context?: LogContext
    ): Promise<T> {
        const start = Date.now();

        try {
            const result = await fn();
            const duration = Date.now() - start;

            logger.info(`perf:${operation}`, `Completed in ${duration}ms`, {
                ...context,
                duration,
            });

            return result;
        } catch (error) {
            const duration = Date.now() - start;

            logger.error(`perf:${operation}`, error as Error, {
                ...context,
                duration,
                failed: true,
            });

            throw error;
        }
    },

    /**
     * Start a performance timer
     */
    startTimer(operation: string): () => void {
        const start = Date.now();

        return () => {
            const duration = Date.now() - start;
            logger.info(`perf:${operation}`, `Duration: ${duration}ms`, { duration });
        };
    },
};
