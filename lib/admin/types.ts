// Admin Dashboard Types

export type AdminRole = 'admin' | 'super_admin';

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: AdminRole;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminSession {
  id: string;
  admin_id: string;
  token_hash: string;
  expires_at: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface AdminTokenPayload {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  iat: number;
  exp: number;
}

// Template Types
export type TemplateCategory = 'minimal' | 'vibrant' | 'professional' | 'creative' | 'wave' | 'text';

export interface TemplatePreview {
  backgroundType: string;
  backgroundColor?: string;
  gradientColors?: [string, string];
  gradientAngle?: number;
  meshGradientCSS?: string;
  textPatternText?: string;
  waveSplitFlipped?: boolean;
}

export interface TextOverlay {
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
}

export interface TemplateSettings {
  backgroundType: string;
  backgroundColor?: string;
  gradientColors?: [string, string];
  gradientAngle?: number;
  meshGradientCSS?: string;
  textPatternText?: string;
  textPatternColor?: string;
  textPatternOpacity?: number;
  textPatternPositions?: string[];
  textPatternFontFamily?: string;
  textPatternFontSize?: number;
  textPatternFontWeight?: number;
  textPatternRows?: number;
  waveSplitFlipped?: boolean;
  padding: number;
  shadowBlur: number;
  shadowOpacity: number;
  borderRadius: number;
  imageScale: number;
  textOverlays?: TextOverlay[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  preview: TemplatePreview;
  settings: TemplateSettings;
  is_free: boolean;
  is_active: boolean;
  sort_order: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTemplateInput {
  id?: string;
  name: string;
  description: string;
  category: TemplateCategory;
  preview: TemplatePreview;
  settings: TemplateSettings;
  is_free?: boolean;
  is_active?: boolean;
  sort_order?: number;
}

export interface UpdateTemplateInput {
  name?: string;
  description?: string;
  category?: TemplateCategory;
  preview?: TemplatePreview;
  settings?: TemplateSettings;
  is_free?: boolean;
  is_active?: boolean;
  sort_order?: number;
}

// App Settings Types
export interface FreeTierLimits {
  exportsPerDay: number;
  solidColorCount: number;
  gradientPresetCount: number;
  meshGradientCount: number;
  maxTextOverlays: number;
  freeFontCount: number;
  freeFontSizes: number[];
  freeFontWeights: number[];
  freeTextColors: number;
  freePaddingPresets: number[];
  fixedShadowBlur: number;
  fixedShadowOpacity: number;
  freeBorderRadiusPresets: number[];
  imageScaleMin: number;
  imageScaleMax: number;
  freeExportFormats: string[];
  freeExportScales: number[];
  freeAspectRatios: string[];
}

export interface PricingConfig {
  monthly: number;
  annual: number;
  lifetime: number;
  currency: string;
  symbol: string;
}

export interface MaintenanceMode {
  enabled: boolean;
  message: string;
}

export interface AppSetting {
  key: string;
  value: unknown;
  description: string | null;
  category: string;
  updated_by: string | null;
  updated_at: string;
}

// Analytics Types
export interface DailyAnalytics {
  id: string;
  date: string;
  new_users: number;
  active_users: number;
  total_exports: number;
  new_subscriptions: number;
  churned_subscriptions: number;
  revenue_inr: number;
  revenue_usd: number;
  pro_users: number;
}

export interface TemplateUsageStat {
  template_id: string;
  template_name: string;
  usage_count: number;
}

export interface AnalyticsOverview {
  totalUsers: number;
  proUsers: number;
  freeUsers: number;
  totalRevenue: number;
  todayExports: number;
  todayNewUsers: number;
  activeSubscriptions: number;
}

// Audit Log Types
export type AuditEntityType = 'user' | 'template' | 'subscription' | 'setting' | 'payment';

export interface AuditLogEntry {
  id: string;
  admin_id: string;
  action: string;
  entity_type: AuditEntityType;
  entity_id: string | null;
  old_value: unknown;
  new_value: unknown;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// User Management Types
export interface UserWithSubscription {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  subscription: {
    id: string;
    plan: string;
    status: string;
    current_period_end: string | null;
  } | null;
  export_count: number;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
