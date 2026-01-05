import { useCallback, useRef, useEffect } from 'react';

export function useThrottle<T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): (...args: Parameters<T>) => void {
    const lastRun = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const callbackRef = useRef(callback);

    // Keep callback fresh
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    return useCallback(
        (...args: Parameters<T>) => {
            const now = Date.now();
            const timeSinceLastRun = now - lastRun.current;

            if (timeSinceLastRun >= delay) {
                // Run immediately
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                }
                callbackRef.current(...args);
                lastRun.current = now;
            } else {
                // Schedule trailing run
                if (!timeoutRef.current) {
                    timeoutRef.current = setTimeout(() => {
                        callbackRef.current(...args);
                        lastRun.current = Date.now();
                        timeoutRef.current = null;
                    }, delay - timeSinceLastRun);
                }
            }
        },
        [delay]
    );
}
