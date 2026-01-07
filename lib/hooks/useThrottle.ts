import { useRef, useCallback, useEffect, useState } from 'react';

/**
 * Custom hook to throttle a callback function
 * Ensures the callback is not called more frequently than the specified delay
 *
 * @param callback - Function to throttle
 * @param delay - Minimum time between calls in milliseconds
 * @returns Throttled version of the callback
 */
export function useThrottle<T extends (...args: any[]) => void>(
    callback: T,
    delay: number
): T {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastRunRef = useRef<number>(Date.now());
    const lastArgsRef = useRef<Parameters<T> | undefined>(undefined);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return useCallback(
        ((...args: Parameters<T>) => {
            const now = Date.now();
            const timeSinceLastRun = now - lastRunRef.current;

            // Store the latest args
            lastArgsRef.current = args;

            // If enough time has passed, execute immediately
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
        }) as T,
        [callback, delay]
    );
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
    const lastUpdateRef = useRef<number>(Date.now());

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
