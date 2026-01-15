import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, extractToken } from '@/lib/admin/auth';
import { getOverviewStats } from '@/lib/admin/supabase';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const cookieHeader = request.headers.get('cookie');
    const authHeader = request.headers.get('authorization');
    const token = extractToken(cookieHeader, authHeader);

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = verifyAdminToken(token);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get overview stats
    const stats = await getOverviewStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
