'use client';

import { useSyncExternalStore, useCallback } from 'react';

// Shared state for window dimensions (singleton pattern)
// Benefits: Single resize listener for entire app, automatic cleanup
let windowSize = { width: 0, height: 0 };
let listeners = new Set<() => void>();
let isListening = false;

// Throttled resize handler (16ms = ~60fps)
let rafId: number | null = null;
const handleResize = () => {
  if (rafId !== null) return;

  rafId = requestAnimationFrame(() => {
    windowSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    listeners.forEach(listener => listener());
    rafId = null;
  });
};

// Subscribe to window resize events
const subscribe = (callback: () => void) => {
  listeners.add(callback);

  // Start listening on first subscriber
  if (!isListening && typeof window !== 'undefined') {
    windowSize = { width: window.innerWidth, height: window.innerHeight };
    window.addEventListener('resize', handleResize, { passive: true });
    isListening = true;
  }

  // Cleanup when last subscriber unsubscribes
  return () => {
    listeners.delete(callback);
    if (listeners.size === 0 && isListening) {
      window.removeEventListener('resize', handleResize);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      isListening = false;
    }
  };
};

// Get current snapshot
const getSnapshot = () => windowSize;

// Server snapshot (SSR) - cached to avoid infinite loop
const serverSnapshot = { width: 0, height: 0 };
const getServerSnapshot = () => serverSnapshot;

/**
 * useWindowSize - Shared hook for window dimensions
 *
 * Benefits over individual resize listeners:
 * - Single event listener for entire app (client-event-listeners optimization)
 * - Throttled updates via requestAnimationFrame
 * - Automatic cleanup when no components are subscribed
 * - React 18+ concurrent-safe via useSyncExternalStore
 *
 * @returns { width: number, height: number }
 */
export function useWindowSize() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * useIsMobile - Derived hook for mobile detection
 * Uses shared window size state (no additional listeners)
 *
 * @param breakpoint - Mobile breakpoint in pixels (default: 768)
 * @returns boolean - true if viewport width < breakpoint
 */
export function useIsMobile(breakpoint = 768) {
  const { width } = useWindowSize();
  return width > 0 && width < breakpoint;
}

/**
 * useBreakpoint - Check if viewport matches a specific breakpoint
 *
 * @param minWidth - Minimum width for the breakpoint
 * @param maxWidth - Optional maximum width
 * @returns boolean
 */
export function useBreakpoint(minWidth: number, maxWidth?: number) {
  const { width } = useWindowSize();
  if (width === 0) return false;
  if (maxWidth !== undefined) {
    return width >= minWidth && width < maxWidth;
  }
  return width >= minWidth;
}
