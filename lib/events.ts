/**
 * Custom Event Name Constants
 *
 * This file defines all custom event names used throughout the application
 * to ensure type safety and prevent typos in event handling.
 */

/**
 * Event names for global modal and UI interactions
 */
export const EVENTS = {
  /** Show authentication modal with optional parameters */
  SHOW_AUTH_MODAL: 'show-auth-modal',
  /** Show upgrade/subscription modal with optional feature context */
  SHOW_UPGRADE_MODAL: 'show-upgrade-modal',
} as const;

/**
 * Type for event names
 */
export type EventName = typeof EVENTS[keyof typeof EVENTS];

/**
 * Event detail types for type-safe event dispatching
 */
export interface AuthModalEventDetail {
  defaultTab?: 'login' | 'signup';
}

export interface UpgradeModalEventDetail {
  feature?: string;
}

/**
 * Helper function to dispatch the auth modal event
 */
export function showAuthModal(detail?: AuthModalEventDetail): void {
  window.dispatchEvent(new CustomEvent(EVENTS.SHOW_AUTH_MODAL, { detail }));
}

/**
 * Helper function to dispatch the upgrade modal event
 */
export function showUpgradeModal(detail?: UpgradeModalEventDetail): void {
  window.dispatchEvent(new CustomEvent(EVENTS.SHOW_UPGRADE_MODAL, { detail }));
}
