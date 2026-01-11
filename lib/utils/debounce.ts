/**
 * Debounce utility function
 * Delays execution of a function until after a specified time has elapsed since the last call
 *
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function with cancel method
 */
export function debounce<T extends (...args: unknown[]) => void>(
    func: T,
    delay: number
): T & { cancel: () => void } {
    let timeoutId: NodeJS.Timeout | null = null;

    const debounced = ((...args: Parameters<T>) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            func(...args);
            timeoutId = null;
        }, delay);
    }) as T & { cancel: () => void };

    // Add cancel method to clear pending execution
    debounced.cancel = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
    };

    return debounced;
}

/**
 * Creates a debounced version of an async function
 * Only the last call's result will be returned
 *
 * @param func - Async function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced async function
 */
export function debounceAsync<T extends (...args: never[]) => Promise<unknown>>(
    func: T,
    delay: number
): ((...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>) & { cancel: () => void } {
    let timeoutId: NodeJS.Timeout | null = null;
    let latestReject: ((reason?: unknown) => void) | null = null;

    const debounced = ((...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
        return new Promise((resolve, reject) => {
            // Cancel previous execution
            if (timeoutId) {
                clearTimeout(timeoutId);

                // Reject previous promise
                if (latestReject) {
                    latestReject(new Error('Debounced: newer call made'));
                }
            }

            // Store latest reject handler for cancellation
            latestReject = reject;

            timeoutId = setTimeout(async () => {
                try {
                    const result = await func(...args);
                    resolve(result as Awaited<ReturnType<T>>);
                } catch (error) {
                    reject(error);
                } finally {
                    timeoutId = null;
                    latestReject = null;
                }
            }, delay);
        });
    }) as ((...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>) & { cancel: () => void };

    debounced.cancel = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }

        if (latestReject) {
            latestReject(new Error('Debounced: cancelled'));
            latestReject = null;
        }
    };

    return debounced;
}
