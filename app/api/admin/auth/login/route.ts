import { NextRequest, NextResponse } from 'next/server';
import {
  verifyPassword,
  generateAdminToken,
  isValidEmail,
  hashToken,
} from '@/lib/admin/auth';
import {
  getAdminByEmail,
  createAdminSession,
  updateAdminLastLogin,
  createAuditLog,
} from '@/lib/admin/supabase';
import { checkRateLimit, getClientIdentifier, RATE_LIMIT_PRESETS } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for brute force protection
    const clientId = getClientIdentifier(request);
    const rateLimit = checkRateLimit(`admin:login:${clientId}`, RATE_LIMIT_PRESETS.auth);
    if (!rateLimit.success) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000);
      return NextResponse.json(
        {
          success: false,
          error: 'Too many login attempts. Please try again later.',
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
          },
        }
      );
    }

    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get admin user
    const admin = await getAdminByEmail(email);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if admin is active
    if (!admin.is_active) {
      return NextResponse.json(
        { success: false, error: 'Account is disabled' },
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, admin.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateAdminToken(admin);
    const tokenHash = await hashToken(token);

    // Get client info for session tracking
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Calculate session expiry (24 hours)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create session in database
    await createAdminSession(admin.id, tokenHash, expiresAt, ipAddress, userAgent);

    // Update last login time
    await updateAdminLastLogin(admin.id);

    // Create audit log
    await createAuditLog(
      admin.id,
      'login',
      'user',
      admin.id,
      null,
      null,
      ipAddress,
      userAgent
    );

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      data: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
