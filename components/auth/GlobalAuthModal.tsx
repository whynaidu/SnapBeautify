'use client';

import { useState, useEffect } from 'react';
import { AuthModal } from './AuthModal';
import { useAuth } from '@/lib/auth/context';

export function GlobalAuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<'login' | 'signup'>('login');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleShowAuthModal = (event: CustomEvent<{ defaultTab?: 'login' | 'signup' }>) => {
      if (!isAuthenticated) {
        setDefaultTab(event.detail?.defaultTab || 'login');
        setIsOpen(true);
      }
    };

    window.addEventListener('show-auth-modal', handleShowAuthModal as EventListener);

    return () => {
      window.removeEventListener('show-auth-modal', handleShowAuthModal as EventListener);
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
