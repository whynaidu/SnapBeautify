import { useRef, useCallback, useEffect, useState } from 'react';

/**
 * Custom hook to throttle a callback function
 * Ensures the callback is not called more frequently than the specified delay
 *
 * @param callback - Function to throttle
 * @param delay - Minimum time between calls in milliseconds
 * @returns Throttled version of the callback
 */
export function useThrottle<T extends (...args: unknown[]) => void>(
    callback: T,
    delay: number
): (...args: Parameters<T>) => void {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    // Initialize to 0 - first call will always execute immediately
    const lastRunRef = useRef<number>(0);
    const lastArgsRef = useRef<Parameters<T> | undefined>(undefined);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const throttledCallback = useCallback(
        (...args: Parameters<T>) => {
            const now = Date.now();
            const timeSinceLastRun = now - lastRunRef.current;

            // Store the latest args
            lastArgsRef.current = args;

            // If enough time has passed (or first call), execute immediately
            if (timeSinceLastRun >= delay) {
                callback(...args);
                lastRunRef.current = now;
            } else {
                // Schedule execution for later with the latest args
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }

                timeoutRef.current = setTimeout(() => {
                    if (lastArgsRef.current) {
                        callback(...lastArgsRef.current);
                        lastRunRef.current = Date.now();
                    }
                }, delay - timeSinceLastRun);
            }
        },
        [callback, delay]
    );

    return throttledCallback;
}

/**
 * Custom hook to create a throttled version of a value
 * Updates are throttled to the specified delay
 *
 * @param value - Value to throttle
 * @param delay - Minimum time between updates in milliseconds
 * @returns Throttled value
 */
export function useThrottledValue<T>(value: T, delay: number): T {
    const [throttledValue, setThrottledValue] = useState<T>(value);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    // Initialize to 0 - first update will always apply immediately
    const lastUpdateRef = useRef<number>(0);

    useEffect(() => {
        const now = Date.now();
        const timeSinceLastUpdate = now - lastUpdateRef.current;

        if (timeSinceLastUpdate >= delay) {
            setThrottledValue(value);
            lastUpdateRef.current = now;
        } else {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                setThrottledValue(value);
                lastUpdateRef.current = Date.now();
            }, delay - timeSinceLastUpdate);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [value, delay]);

    return throttledValue;
}
