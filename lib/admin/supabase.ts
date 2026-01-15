import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  AdminUser,
  AdminSession,
  Template,
  CreateTemplateInput,
  UpdateTemplateInput,
  AppSetting,
  DailyAnalytics,
  AuditLogEntry,
  AuditEntityType,
  UserWithSubscription,
  TemplateUsageStat,
} from './types';

let adminClient: SupabaseClient | null = null;

/**
 * Get the admin Supabase client (uses service role key)
 */
export function getAdminClient(): SupabaseClient | null {
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Try both possible env var names
  const serviceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error('Missing Supabase URL or service key. URL:', !!url, 'ServiceKey:', !!serviceKey);
    return null;
  }

  adminClient = createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}

// ============================================
// ADMIN USER OPERATIONS
// ============================================

export async function getAdminByEmail(email: string): Promise<AdminUser | null> {
  const client = getAdminClient();
  if (!client) {
    console.error('Admin client not available');
    return null;
  }

  const { data, error } = await client
    .from('admin_users')
    .select('*')
    .eq('email', email)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Admin lookup error:', error.message, error.code);
    return null;
  }

  if (!data) {
    console.log('No admin found with email:', email);
    return null;
  }

  return data as AdminUser;
}

export async function getAdminById(id: string): Promise<AdminUser | null> {
  const client = getAdminClient();
  if (!client) return null;

  const { data, error } = await client
    .from('admin_users')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as AdminUser;
}

export async function updateAdminLastLogin(adminId: string): Promise<void> {
  const client = getAdminClient();
  if (!client) return;

  await client
    .from('admin_users')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', adminId);
}

export async function createAdmin(
  email: string,
  passwordHash: string,
  name: string,
  role: 'admin' | 'super_admin' = 'admin'
): Promise<AdminUser | null> {
  const client = getAdminClient();
  if (!client) return null;

  const { data, error } = await client
    .from('admin_users')
    .insert({
      email,
      password_hash: passwordHash,
      name,
      role,
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Error creating admin:', error);
    return null;
  }

  return data as AdminUser;
}

// ============================================
// ADMIN SESSION OPERATIONS
// ============================================

export async function createAdminSession(
  adminId: string,
  tokenHash: string,
  expiresAt: Date,
  ipAddress?: string,
  userAgent?: string
): Promise<AdminSession | null> {
  const client = getAdminClient();
  if (!client) return null;

  const { data, error } = await client
    .from('admin_sessions')
    .insert({
      admin_id: adminId,
      token_hash: tokenHash,
      expires_at: expiresAt.toISOString(),
      ip_address: ipAddress,
      user_agent: userAgent,
    })
    .select()
    .single();

  if (error || !data) return null;
  return data as AdminSession;
}

export async function deleteAdminSession(adminId: string): Promise<void> {
  const client = getAdminClient();
  if (!client) return;

  await client.from('admin_sessions').delete().eq('admin_id', adminId);
}

export async function cleanExpiredSessions(): Promise<void> {
  const client = getAdminClient();
  if (!client) return;

  await client
    .from('admin_sessions')
    .delete()
    .lt('expires_at', new Date().toISOString());
}

// ============================================
// TEMPLATE OPERATIONS
// ============================================

export async function getTemplates(options?: {
  category?: string;
  isActive?: boolean;
  isFree?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ templates: Template[]; total: number }> {
  const client = getAdminClient();
  if (!client) return { templates: [], total: 0 };

  const page = options?.page || 1;
  const pageSize = options?.pageSize || 50;
  const offset = (page - 1) * pageSize;

  let query = client.from('templates').select('*', { count: 'exact' });

  if (options?.category) {
    query = query.eq('category', options.category);
  }
  if (options?.isActive !== undefined) {
    query = query.eq('is_active', options.isActive);
  }
  if (options?.isFree !== undefined) {
    query = query.eq('is_free', options.isFree);
  }
  if (options?.search) {
    query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
  }

  const { data, error, count } = await query
    .order('sort_order', { ascending: true })
    .range(offset, offset + pageSize - 1);

  if (error || !data) return { templates: [], total: 0 };

  return { templates: data as Template[], total: count || 0 };
}

export async function getTemplateById(id: string): Promise<Template | null> {
  const client = getAdminClient();
  if (!client) return null;

  const { data, error } = await client
    .from('templates')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as Template;
}

export async function createTemplate(
  input: CreateTemplateInput,
  adminId?: string
): Promise<Template | null> {
  const client = getAdminClient();
  if (!client) return null;

  // Generate ID if not provided
  const id = input.id || generateTemplateId(input.name, input.category);

  const { data, error } = await client
    .from('templates')
    .insert({
      id,
      name: input.name,
      description: input.description,
      category: input.category,
      preview: input.preview,
      settings: input.settings,
      is_free: input.is_free ?? false,
      is_active: input.is_active ?? true,
      sort_order: input.sort_order ?? 0,
      created_by: adminId,
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Error creating template:', error);
    return null;
  }

  return data as Template;
}

export async function updateTemplate(
  id: string,
  input: UpdateTemplateInput
): Promise<Template | null> {
  const client = getAdminClient();
  if (!client) return null;

  const { data, error } = await client
    .from('templates')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    console.error('Error updating template:', error);
    return null;
  }

  return data as Template;
}

export async function deleteTemplate(id: string): Promise<boolean> {
  const client = getAdminClient();
  if (!client) return false;

  const { error } = await client.from('templates').delete().eq('id', id);

  return !error;
}

export async function bulkUpdateTemplateOrder(
  updates: { id: string; sort_order: number }[]
): Promise<boolean> {
  const client = getAdminClient();
  if (!client) return false;

  for (const update of updates) {
    const { error } = await client
      .from('templates')
      .update({ sort_order: update.sort_order })
      .eq('id', update.id);

    if (error) {
      console.error('Error updating template order:', error);
      return false;
    }
  }

  return true;
}

function generateTemplateId(name: string, category: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${category}-${slug}`;
}

// ============================================
// APP SETTINGS OPERATIONS
// ============================================

export async function getAppSetting<T = unknown>(key: string): Promise<T | null> {
  const client = getAdminClient();
  if (!client) return null;

  const { data, error } = await client
    .from('app_settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error || !data) return null;
  return data.value as T;
}

export async function getAllAppSettings(): Promise<AppSetting[]> {
  const client = getAdminClient();
  if (!client) return [];

  const { data, error } = await client
    .from('app_settings')
    .select('*')
    .order('category');

  if (error || !data) return [];
  return data as AppSetting[];
}

export async function updateAppSetting(
  key: string,
  value: unknown,
  adminId?: string
): Promise<boolean> {
  const client = getAdminClient();
  if (!client) return false;

  const { error } = await client
    .from('app_settings')
    .update({
      value,
      updated_by: adminId,
      updated_at: new Date().toISOString(),
    })
    .eq('key', key);

  return !error;
}

// ============================================
// ANALYTICS OPERATIONS
// ============================================

export async function getDailyAnalytics(
  startDate: string,
  endDate: string
): Promise<DailyAnalytics[]> {
  const client = getAdminClient();
  if (!client) return [];

  // Try to use the RPC function that auto-generates missing data
  const { data: rpcData, error: rpcError } = await client.rpc('get_or_generate_analytics', {
    start_date: startDate,
    end_date: endDate,
  });

  if (!rpcError && rpcData) {
    return rpcData as DailyAnalytics[];
  }

  // Fallback to direct query if RPC fails (e.g., function doesn't exist yet)
  const { data, error } = await client
    .from('analytics_daily')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error || !data) {
    // If no data in analytics_daily, generate it from source tables
    return generateAnalyticsFromSource(client, startDate, endDate);
  }

  return data as DailyAnalytics[];
}

// Fallback function to generate analytics directly from source tables
async function generateAnalyticsFromSource(
  client: SupabaseClient,
  startDate: string,
  endDate: string
): Promise<DailyAnalytics[]> {
  const analytics: DailyAnalytics[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Get all users
  const { data: authData } = await client.auth.admin.listUsers({
    page: 1,
    perPage: 10000,
  });
  const users = authData?.users || [];

  // Get all payments
  const { data: payments } = await client
    .from('payments')
    .select('*')
    .gte('created_at', startDate)
    .lte('created_at', endDate + 'T23:59:59');

  // Get all daily exports
  const { data: exports } = await client
    .from('daily_exports')
    .select('*')
    .gte('export_date', startDate)
    .lte('export_date', endDate);

  // Get all subscriptions
  const { data: subscriptions } = await client
    .from('subscriptions')
    .select('*');

  // Generate analytics for each day in range
  for (let d = new Date(end); d >= start; d.setDate(d.getDate() - 1)) {
    const dateStr = d.toISOString().split('T')[0];

    // Count new users for this date
    const newUsers = users.filter(
      (u) => u.created_at && u.created_at.startsWith(dateStr)
    ).length;

    // Count active users (with exports on this date)
    const dayExports = exports?.filter((e) => e.export_date === dateStr) || [];
    const activeUsers = new Set(dayExports.map((e) => e.user_id)).size;

    // Sum exports
    const totalExports = dayExports.reduce((sum, e) => sum + (e.export_count || 0), 0);

    // Count new subscriptions
    const newSubs = subscriptions?.filter(
      (s) =>
        s.created_at?.startsWith(dateStr) &&
        ['active', 'lifetime'].includes(s.status)
    ).length || 0;

    // Sum revenue
    const dayPayments = payments?.filter(
      (p) => p.created_at?.startsWith(dateStr) && p.status === 'captured'
    ) || [];
    const revenue = dayPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // Count pro users as of this date
    const proUsers = subscriptions?.filter(
      (s) =>
        ['active', 'lifetime'].includes(s.status) &&
        new Date(s.created_at) <= d
    ).length || 0;

    analytics.push({
      id: `generated-${dateStr}`,
      date: dateStr,
      new_users: newUsers,
      active_users: activeUsers,
      total_exports: totalExports,
      new_subscriptions: newSubs,
      churned_subscriptions: 0,
      revenue_inr: revenue,
      revenue_usd: 0, // USD not tracked, only INR
      pro_users: proUsers,
    });
  }

  return analytics;
}

export async function getTemplateUsageStats(daysBack: number = 30): Promise<TemplateUsageStat[]> {
  const client = getAdminClient();
  if (!client) return [];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - daysBack);

  const { data, error } = await client
    .from('template_usage')
    .select('template_id, templates!inner(name)')
    .gte('used_at', startDate.toISOString());

  if (error || !data) return [];

  // Aggregate usage counts
  const usageMap = new Map<string, { name: string; count: number }>();
  for (const row of data) {
    const existing = usageMap.get(row.template_id);
    const templateName = (row.templates as unknown as { name: string })?.name || 'Unknown';
    if (existing) {
      existing.count++;
    } else {
      usageMap.set(row.template_id, { name: templateName, count: 1 });
    }
  }

  return Array.from(usageMap.entries())
    .map(([id, { name, count }]) => ({
      template_id: id,
      template_name: name,
      usage_count: count,
    }))
    .sort((a, b) => b.usage_count - a.usage_count)
    .slice(0, 20);
}

export async function recordTemplateUsage(templateId: string, userId?: string): Promise<void> {
  const client = getAdminClient();
  if (!client) return;

  await client.from('template_usage').insert({
    template_id: templateId,
    user_id: userId,
  });
}

// ============================================
// USER MANAGEMENT OPERATIONS
// ============================================

export async function getUsers(options?: {
  search?: string;
  isPro?: boolean;
  page?: number;
  pageSize?: number;
}): Promise<{
  users: UserWithSubscription[];
  total: number;
  stats: { totalUsers: number; proUsers: number; freeUsers: number };
}> {
  const client = getAdminClient();
  if (!client) return { users: [], total: 0, stats: { totalUsers: 0, proUsers: 0, freeUsers: 0 } };

  const page = options?.page || 1;
  const pageSize = options?.pageSize || 20;

  try {
    // Use Supabase Admin API to list users
    const { data: authData, error: authError } = await client.auth.admin.listUsers({
      page: page,
      perPage: pageSize,
    });

    if (authError || !authData?.users) {
      console.error('Error fetching users from auth:', authError);
      return { users: [], total: 0, stats: { totalUsers: 0, proUsers: 0, freeUsers: 0 } };
    }

    // Get all subscriptions
    const { data: subscriptions } = await client
      .from('subscriptions')
      .select('*');

    // Create subscription map for quick lookup
    const subscriptionMap = new Map<string, {
      id: string;
      plan: string;
      status: string;
      current_period_end: string | null;
    }>();

    subscriptions?.forEach((sub) => {
      subscriptionMap.set(sub.user_id, {
        id: sub.id,
        plan: sub.plan,
        status: sub.status,
        current_period_end: sub.current_period_end,
      });
    });

    // Calculate overall stats (not affected by filters)
    const totalUsers = authData.users.length;
    const proUsers = subscriptions?.filter(s => ['active', 'lifetime'].includes(s.status)).length || 0;
    const freeUsers = totalUsers - proUsers;

    // Filter users based on search and isPro
    let filteredUsers = authData.users;

    if (options?.search) {
      const searchLower = options.search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.email?.toLowerCase().includes(searchLower) ||
          user.user_metadata?.full_name?.toLowerCase().includes(searchLower) ||
          user.user_metadata?.name?.toLowerCase().includes(searchLower)
      );
    }

    if (options?.isPro !== undefined) {
      filteredUsers = filteredUsers.filter((user) => {
        const sub = subscriptionMap.get(user.id);
        const hasPro = sub && ['active', 'lifetime'].includes(sub.status);
        return options.isPro ? hasPro : !hasPro;
      });
    }

    // Map to UserWithSubscription type
    const users: UserWithSubscription[] = filteredUsers.map((user) => ({
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.full_name || user.user_metadata?.name || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      created_at: user.created_at || '',
      last_sign_in_at: user.last_sign_in_at || null,
      subscription: subscriptionMap.get(user.id) || null,
      export_count: 0,
    }));

    return {
      users,
      total: filteredUsers.length,
      stats: { totalUsers, proUsers, freeUsers }
    };
  } catch (error) {
    console.error('Error in getUsers:', error);
    return { users: [], total: 0, stats: { totalUsers: 0, proUsers: 0, freeUsers: 0 } };
  }
}

export async function getUserById(userId: string): Promise<UserWithSubscription | null> {
  const client = getAdminClient();
  if (!client) return null;

  try {
    // Get user from auth
    const { data: authData, error: authError } = await client.auth.admin.getUserById(userId);

    if (authError || !authData?.user) {
      console.error('Error fetching user:', authError);
      return null;
    }

    const user = authData.user;

    // Get subscription
    const { data: sub } = await client
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Get export count
    const { data: exportData } = await client
      .from('daily_exports')
      .select('export_count')
      .eq('user_id', userId)
      .eq('export_date', new Date().toISOString().split('T')[0])
      .single();

    return {
      id: userId,
      email: user.email || '',
      name: user.user_metadata?.full_name || user.user_metadata?.name || null,
      avatar_url: user.user_metadata?.avatar_url || null,
      created_at: user.created_at || '',
      last_sign_in_at: user.last_sign_in_at || null,
      subscription: sub
        ? {
            id: sub.id,
            plan: sub.plan,
            status: sub.status,
            current_period_end: sub.current_period_end,
          }
        : null,
      export_count: exportData?.export_count || 0,
    };
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return null;
  }
}

export async function grantProAccess(
  userId: string,
  plan: 'monthly' | 'annual' | 'lifetime',
  adminId: string
): Promise<boolean> {
  const client = getAdminClient();
  if (!client) return false;

  const now = new Date();
  let periodEnd: Date | null = null;

  if (plan === 'monthly') {
    periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  } else if (plan === 'annual') {
    periodEnd = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
  }

  const status = plan === 'lifetime' ? 'lifetime' : 'active';

  const { error } = await client.from('subscriptions').upsert(
    {
      user_id: userId,
      provider: 'admin' as 'razorpay' | 'stripe',
      status,
      plan,
      current_period_start: now.toISOString(),
      current_period_end: periodEnd?.toISOString() || null,
    },
    { onConflict: 'user_id' }
  );

  if (error) {
    console.error('Error granting pro access:', error);
    return false;
  }

  // Log audit
  await createAuditLog(adminId, 'grant_pro', 'user', userId, null, { plan, status });

  return true;
}

export async function revokeProAccess(userId: string, adminId: string): Promise<boolean> {
  const client = getAdminClient();
  if (!client) return false;

  // Get current subscription for audit
  const { data: currentSub } = await client
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  const { error } = await client
    .from('subscriptions')
    .update({
      status: 'cancelled',
      plan: 'free',
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Error revoking pro access:', error);
    return false;
  }

  // Log audit
  await createAuditLog(adminId, 'revoke_pro', 'user', userId, currentSub, { status: 'cancelled', plan: 'free' });

  return true;
}

// ============================================
// AUDIT LOG OPERATIONS
// ============================================

export async function createAuditLog(
  adminId: string,
  action: string,
  entityType: AuditEntityType,
  entityId: string | null,
  oldValue: unknown,
  newValue: unknown,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  const client = getAdminClient();
  if (!client) return;

  await client.from('admin_audit_log').insert({
    admin_id: adminId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    old_value: oldValue,
    new_value: newValue,
    ip_address: ipAddress,
    user_agent: userAgent,
  });
}

export async function getAuditLogs(options?: {
  adminId?: string;
  entityType?: AuditEntityType;
  page?: number;
  pageSize?: number;
}): Promise<{ logs: AuditLogEntry[]; total: number }> {
  const client = getAdminClient();
  if (!client) return { logs: [], total: 0 };

  const page = options?.page || 1;
  const pageSize = options?.pageSize || 50;
  const offset = (page - 1) * pageSize;

  let query = client.from('admin_audit_log').select('*', { count: 'exact' });

  if (options?.adminId) {
    query = query.eq('admin_id', options.adminId);
  }
  if (options?.entityType) {
    query = query.eq('entity_type', options.entityType);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error || !data) return { logs: [], total: 0 };

  return { logs: data as AuditLogEntry[], total: count || 0 };
}

// ============================================
// SUBSCRIPTION OPERATIONS
// ============================================

export async function getSubscriptions(options?: {
  search?: string;
  status?: string;
  plan?: string;
  page?: number;
  pageSize?: number;
}): Promise<{
  subscriptions: unknown[];
  total: number;
  stats: { total: number; active: number; lifetime: number; cancelled: number };
}> {
  const client = getAdminClient();
  const defaultStats = { total: 0, active: 0, lifetime: 0, cancelled: 0 };
  if (!client) return { subscriptions: [], total: 0, stats: defaultStats };

  const page = options?.page || 1;
  const pageSize = options?.pageSize || 20;
  const offset = (page - 1) * pageSize;

  // Get overall stats (not affected by filters)
  const { data: allSubs } = await client.from('subscriptions').select('status');
  const stats = {
    total: allSubs?.length || 0,
    active: allSubs?.filter(s => s.status === 'active').length || 0,
    lifetime: allSubs?.filter(s => s.status === 'lifetime').length || 0,
    cancelled: allSubs?.filter(s => s.status === 'cancelled').length || 0,
  };

  let query = client.from('subscriptions').select('*', { count: 'exact' });

  if (options?.status) {
    query = query.eq('status', options.status);
  }
  if (options?.plan) {
    query = query.eq('plan', options.plan);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error || !data) return { subscriptions: [], total: 0, stats };

  // Get user info for each subscription
  const subscriptionsWithUsers = await Promise.all(
    data.map(async (sub) => {
      try {
        const { data: userData } = await client.auth.admin.getUserById(sub.user_id);
        return {
          ...sub,
          user_email: userData?.user?.email || null,
          user_name: userData?.user?.user_metadata?.full_name || userData?.user?.user_metadata?.name || null,
        };
      } catch {
        return { ...sub, user_email: null, user_name: null };
      }
    })
  );

  // Apply search filter after fetching user data
  let filteredSubscriptions = subscriptionsWithUsers;
  if (options?.search) {
    const searchLower = options.search.toLowerCase();
    filteredSubscriptions = subscriptionsWithUsers.filter(
      (sub) => sub.user_email?.toLowerCase().includes(searchLower)
    );
  }

  return { subscriptions: filteredSubscriptions, total: count || 0, stats };
}

// ============================================
// PAYMENT OPERATIONS
// ============================================

export async function getPayments(options?: {
  userId?: string;
  search?: string;
  status?: string;
  plan?: string;
  page?: number;
  pageSize?: number;
}): Promise<{
  payments: unknown[];
  total: number;
  stats: { total: number; totalRevenue: number; pending: number; failed: number };
}> {
  const client = getAdminClient();
  const defaultStats = { total: 0, totalRevenue: 0, pending: 0, failed: 0 };
  if (!client) return { payments: [], total: 0, stats: defaultStats };

  const page = options?.page || 1;
  const pageSize = options?.pageSize || 20;
  const offset = (page - 1) * pageSize;

  // Get overall stats (not affected by filters)
  const { data: allPayments } = await client.from('payments').select('status, amount');
  const completedPayments = allPayments?.filter(p => p.status === 'completed' || p.status === 'captured') || [];
  const stats = {
    total: allPayments?.length || 0,
    totalRevenue: completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
    pending: allPayments?.filter(p => p.status === 'pending').length || 0,
    failed: allPayments?.filter(p => p.status === 'failed').length || 0,
  };

  let query = client.from('payments').select('*', { count: 'exact' });

  if (options?.userId) {
    query = query.eq('user_id', options.userId);
  }
  if (options?.status) {
    query = query.eq('status', options.status);
  }
  if (options?.plan) {
    query = query.eq('plan', options.plan);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (error || !data) return { payments: [], total: 0, stats };

  // Get user info for each payment
  const paymentsWithUsers = await Promise.all(
    data.map(async (payment) => {
      try {
        const { data: userData } = await client.auth.admin.getUserById(payment.user_id);
        return {
          ...payment,
          user_email: userData?.user?.email || null,
          user_name: userData?.user?.user_metadata?.full_name || userData?.user?.user_metadata?.name || null,
        };
      } catch {
        return { ...payment, user_email: null, user_name: null };
      }
    })
  );

  // Apply search filter after fetching user data
  let filteredPayments = paymentsWithUsers;
  if (options?.search) {
    const searchLower = options.search.toLowerCase();
    filteredPayments = paymentsWithUsers.filter(
      (p) => p.user_email?.toLowerCase().includes(searchLower)
    );
  }

  return { payments: filteredPayments, total: count || 0, stats };
}

// ============================================
// AGGREGATE STATS
// ============================================

export async function getOverviewStats(): Promise<{
  totalUsers: number;
  proUsers: number;
  freeUsers: number;
  totalRevenue: number;
  todayExports: number;
  todayNewUsers: number;
  activeSubscriptions: number;
  totalTemplates: number;
}> {
  const client = getAdminClient();
  const defaultStats = {
    totalUsers: 0,
    proUsers: 0,
    freeUsers: 0,
    totalRevenue: 0,
    todayExports: 0,
    todayNewUsers: 0,
    activeSubscriptions: 0,
    totalTemplates: 73,
  };

  if (!client) {
    return defaultStats;
  }

  try {
    // Get total users count from auth
    const { data: authData } = await client.auth.admin.listUsers({
      page: 1,
      perPage: 1000, // Get up to 1000 users for count
    });
    const totalUsers = authData?.users?.length || 0;

    // Get pro users count (active subscriptions)
    const { count: proCount } = await client
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .in('status', ['active', 'lifetime']);

    const proUsers = proCount || 0;
    const freeUsers = totalUsers - proUsers;

    // Get total revenue
    const { data: revenueData } = await client
      .from('payments')
      .select('amount')
      .eq('status', 'captured');

    const totalRevenue = revenueData?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

    // Get today's exports
    const today = new Date().toISOString().split('T')[0];
    const { data: exportData } = await client
      .from('daily_exports')
      .select('export_count')
      .eq('export_date', today);

    const todayExports = exportData?.reduce((sum, e) => sum + (e.export_count || 0), 0) || 0;

    // Get templates count
    const { count: templateCount } = await client
      .from('templates')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Get today's new users
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayNewUsers = authData?.users?.filter(
      (u) => new Date(u.created_at) >= todayStart
    ).length || 0;

    return {
      totalUsers,
      proUsers,
      freeUsers,
      totalRevenue,
      todayExports,
      todayNewUsers,
      activeSubscriptions: proUsers,
      totalTemplates: templateCount || 73,
    };
  } catch (error) {
    console.error('Error fetching overview stats:', error);
    return defaultStats;
  }
}
