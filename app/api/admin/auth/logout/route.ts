import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, extractToken } from '@/lib/admin/auth';
import { deleteAdminSession, createAuditLog } from '@/lib/admin/supabase';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie or header
    const cookieHeader = request.headers.get('cookie');
    const authHeader = request.headers.get('authorization');
    const token = extractToken(cookieHeader, authHeader);

    if (token) {
      // Verify token to get admin ID for audit log
      const payload = verifyAdminToken(token);

      if (payload) {
        // Delete session from database
        await deleteAdminSession(payload.id);

        // Get client info for audit log
        const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        // Create audit log
        await createAuditLog(
          payload.id,
          'logout',
          'user',
          payload.id,
          null,
          null,
          ipAddress,
          userAgent
        );
      }
    }

    // Create response and clear cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear the admin token cookie
    response.cookies.set('admin_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Admin logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
