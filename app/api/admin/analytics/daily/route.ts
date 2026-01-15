import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, extractToken } from '@/lib/admin/auth';
import { getDailyAnalytics } from '@/lib/admin/supabase';

// GET - Get daily analytics
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();

    switch (range) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '30d':
      default:
        startDate.setDate(endDate.getDate() - 30);
        break;
    }

    const result = await getDailyAnalytics(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Get daily analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
