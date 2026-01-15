import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, extractToken } from '@/lib/admin/auth';
import { getTemplates, createTemplate, createAuditLog } from '@/lib/admin/supabase';
import { CreateTemplateInput } from '@/lib/admin/types';

// GET - List all templates
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
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const isFree = searchParams.get('is_free');
    const isActive = searchParams.get('is_active');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');

    const result = await getTemplates({
      category,
      search,
      isFree: isFree === 'true' ? true : isFree === 'false' ? false : undefined,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      page,
      pageSize,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Get templates error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new template
export async function POST(request: NextRequest) {
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

    const body: CreateTemplateInput = await request.json();

    // Validate required fields
    if (!body.name || !body.description || !body.category || !body.preview || !body.settings) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the template
    const template = await createTemplate(body, payload.id);

    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Failed to create template' },
        { status: 500 }
      );
    }

    // Get client info for audit log
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create audit log
    await createAuditLog(
      payload.id,
      'create_template',
      'template',
      template.id,
      null,
      template,
      ipAddress,
      userAgent
    );

    return NextResponse.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error('Create template error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
