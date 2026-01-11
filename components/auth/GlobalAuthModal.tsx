'use client';

import { useState, useEffect, useRef } from 'react';
import { AuthModal } from './AuthModal';
import { useAuth } from '@/lib/auth/context';
import { EVENTS, type AuthModalEventDetail } from '@/lib/events';

export function GlobalAuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<'login' | 'signup'>('login');
  const { isAuthenticated } = useAuth();
  const hasCheckedUrlParam = useRef(false);

  // Check for showLogin URL parameter (e.g., after logout)
  // Using ref to track if we've already processed this to avoid re-renders
  useEffect(() => {
    if (hasCheckedUrlParam.current) return;

    const params = new URLSearchParams(window.location.search);
    const showLogin = params.get('showLogin');
    if (showLogin === 'true' && !isAuthenticated) {
      hasCheckedUrlParam.current = true;
      // Use callback to batch state updates
      requestAnimationFrame(() => {
        setDefaultTab('login');
        setIsOpen(true);
      });
      // Clean up the URL parameter
      const url = new URL(window.location.href);
      url.searchParams.delete('showLogin');
      window.history.replaceState({}, '', url.toString());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleShowAuthModal = (event: CustomEvent<AuthModalEventDetail>) => {
      if (!isAuthenticated) {
        setDefaultTab(event.detail?.defaultTab || 'login');
        setIsOpen(true);
      }
    };

    window.addEventListener(EVENTS.SHOW_AUTH_MODAL, handleShowAuthModal as EventListener);

    return () => {
      window.removeEventListener(EVENTS.SHOW_AUTH_MODAL, handleShowAuthModal as EventListener);
    };
  }, [isAuthenticated]);

  return (
    <AuthModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      defaultTab={defaultTab}
    />
  );
}
