'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
  last_login_at: string | null;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkSession = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/auth/session');
      const data = await response.json();

      if (response.ok && data.success) {
        setAdmin(data.data);
      } else {
        setAdmin(null);
        // Redirect to login if not on login page
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      }
    } catch {
      setAdmin(null);
      if (pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [pathname, router]);

  const refreshSession = useCallback(async () => {
    setIsLoading(true);
    await checkSession();
  }, [checkSession]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } finally {
      setAdmin(null);
      router.push('/admin/login');
    }
  }, [router]);

  useEffect(() => {
    // Skip session check on login page
    if (pathname === '/admin/login') {
      setIsLoading(false);
      return;
    }
    checkSession();
  }, [pathname, checkSession]);

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: !!admin,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
