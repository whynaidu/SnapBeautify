/**
 * Authentication utilities for payment endpoints
 * Verifies that the requesting user matches the userId in the request
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export interface AuthResult {
  authenticated: boolean;
  userId: string | null;
  error?: string;
}

/**
 * Get authenticated user from Supabase session
 * @returns The authenticated user or null
 */
export async function getAuthenticatedUser() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
    },
  });

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

/**
 * Verify that the authenticated user matches the requested userId
 * Use this in payment endpoints to ensure users can only create payments for themselves
 *
 * @param requestedUserId - The userId from the request body
 * @returns AuthResult with authentication status
 */
export async function verifyPaymentAuth(requestedUserId: string): Promise<AuthResult> {
  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(requestedUserId)) {
    return {
      authenticated: false,
      userId: null,
      error: 'Invalid user ID format',
    };
  }

  const authenticatedUser = await getAuthenticatedUser();

  if (!authenticatedUser) {
    return {
      authenticated: false,
      userId: null,
      error: 'Unauthorized - please sign in',
    };
  }

  if (authenticatedUser.id !== requestedUserId) {
    return {
      authenticated: false,
      userId: authenticatedUser.id,
      error: 'Forbidden - cannot create payment for another user',
    };
  }

  return {
    authenticated: true,
    userId: authenticatedUser.id,
  };
}

/**
 * Create an unauthorized response
 */
export function unauthorizedResponse(error: string, status: 401 | 403 = 401) {
  return NextResponse.json({ error }, { status });
}
