'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/context';
import { useSubscription } from '@/lib/subscription/context';
import { showAuthModal, showUpgradeModal } from '@/lib/events';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Crown, Sun, Moon, Laptop, FileText, Shield, RefreshCcw, Mail, Truck, Check } from 'lucide-react';

// Theme-aware color helper
function getThemeColors(isDark: boolean) {
  return {
    bg: isDark ? '#18181b' : '#ffffff',
    text: isDark ? '#fafafa' : '#18181b',
    textMuted: isDark ? '#a1a1aa' : '#71717a',
    border: isDark ? '#27272a' : '#e4e4e7',
  };
}

// Avatar component with fallback
function UserAvatar({ src, name, size = 'sm' }: { src?: string | null; name?: string; size?: 'sm' | 'md' }) {
  const sizeClasses = size === 'sm' ? 'w-7 h-7' : 'w-10 h-10';
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const ringClasses = size === 'md' ? 'ring-2 ring-zinc-300 dark:ring-zinc-700' : '';

  if (src) {
    return (
      <div className={`${sizeClasses} rounded-full overflow-hidden ${ringClasses} flex-shrink-0`}>
        <Image
          src={src}
          alt={name || 'User avatar'}
          width={size === 'sm' ? 28 : 40}
          height={size === 'sm' ? 28 : 40}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Fallback to initials or icon
  const initial = name?.charAt(0).toUpperCase();
  return (
    <div className={`${sizeClasses} rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 ${ringClasses}`}>
      {initial ? (
        <span className={`${size === 'sm' ? 'text-xs' : 'text-sm'} font-medium`}>{initial}</span>
      ) : (
        <User className={iconSize} />
      )}
    </div>
  );
}

// Extracted outside to avoid recreating on each render
function SettingsMenuContent({
  theme,
  setTheme,
  colors
}: {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  colors: ReturnType<typeof getThemeColors>;
}) {
  return (
    <>
      {/* Theme submenu */}
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="cursor-pointer" style={{ color: colors.text }}>
          <Sun className="w-4 h-4 mr-2" style={{ color: colors.textMuted }} />
          <span>Theme</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent
            className="rounded-xl"
            style={{ backgroundColor: colors.bg, borderColor: colors.border }}
          >
            <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer" style={{ color: colors.text }}>
              <Sun className="mr-2 h-4 w-4" style={{ color: colors.textMuted }} />
              <span>Light</span>
              {theme === 'light' && <Check className="ml-auto h-4 w-4 text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer" style={{ color: colors.text }}>
              <Moon className="mr-2 h-4 w-4" style={{ color: colors.textMuted }} />
              <span>Dark</span>
              {theme === 'dark' && <Check className="ml-auto h-4 w-4 text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer" style={{ color: colors.text }}>
              <Laptop className="mr-2 h-4 w-4" style={{ color: colors.textMuted }} />
              <span>System</span>
              {theme === 'system' && <Check className="ml-auto h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>

      <DropdownMenuSeparator style={{ backgroundColor: colors.border }} />
      <DropdownMenuLabel style={{ color: colors.textMuted }} className="text-xs">Legal</DropdownMenuLabel>
      <DropdownMenuItem asChild className="cursor-pointer">
        <Link href="/terms" className="flex items-center gap-2" style={{ color: colors.text }}>
          <FileText className="h-4 w-4" style={{ color: colors.textMuted }} />
          <span>Terms & Conditions</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild className="cursor-pointer">
        <Link href="/privacy" className="flex items-center gap-2" style={{ color: colors.text }}>
          <Shield className="h-4 w-4" style={{ color: colors.textMuted }} />
          <span>Privacy Policy</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild className="cursor-pointer">
        <Link href="/refund" className="flex items-center gap-2" style={{ color: colors.text }}>
          <RefreshCcw className="h-4 w-4" style={{ color: colors.textMuted }} />
          <span>Refund Policy</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild className="cursor-pointer">
        <Link href="/shipping" className="flex items-center gap-2" style={{ color: colors.text }}>
          <Truck className="h-4 w-4" style={{ color: colors.textMuted }} />
          <span>Delivery Policy</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild className="cursor-pointer">
        <Link href="/contact" className="flex items-center gap-2" style={{ color: colors.text }}>
          <Mail className="h-4 w-4" style={{ color: colors.textMuted }} />
          <span>Contact Us</span>
        </Link>
      </DropdownMenuItem>
    </>
  );
}

export function UserMenu() {
  const { user, isAuthenticated, signOut } = useAuth();
  const { isPro, plan } = useSubscription();
  const { setTheme, theme, resolvedTheme } = useTheme();

  // Get resolved theme (actual light/dark, not "system")
  const isDark = resolvedTheme === 'dark';
  const colors = getThemeColors(isDark);

  // Get avatar URL and display name from user metadata
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0];

  const handleSignOut = async () => {
    await signOut();
    // Redirect with flag to skip loading animation
    window.location.replace('/app?fromLogout=true');
  };

  const handleLogin = () => {
    showAuthModal({ defaultTab: 'login' });
  };

  if (!isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 rounded-full">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 rounded-xl"
          style={{ backgroundColor: colors.bg, borderColor: colors.border }}
        >
          <DropdownMenuItem onClick={handleLogin} className="cursor-pointer" style={{ color: colors.text }}>
            <User className="w-4 h-4 mr-2" style={{ color: colors.textMuted }} />
            <span>Sign In</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator style={{ backgroundColor: colors.border }} />
          <SettingsMenuContent theme={theme} setTheme={setTheme} colors={colors} />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative flex items-center gap-1.5 sm:gap-2 h-8.5 pl-0.5 pr-0.5 sm:pr-3 rounded-full border border-zinc-300 dark:border-zinc-700 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
          <UserAvatar src={avatarUrl} name={displayName} size="sm" />
          <span className="max-w-[100px] truncate text-sm hidden sm:inline">
            {displayName}
          </span>
          {isPro && (
            <>
              {/* Desktop crown - inline */}
              <Crown className="w-3.5 h-3.5 text-orange-500 hidden sm:block" />
              {/* Mobile crown - small badge positioned on avatar */}
              <Crown className="w-3 h-3 text-orange-500 sm:hidden absolute -top-0.5 -right-0.5 bg-white dark:bg-zinc-900 rounded-full p-0.5 box-content border border-zinc-300 dark:border-zinc-700" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 rounded-xl"
        style={{ backgroundColor: colors.bg, borderColor: colors.border }}
      >
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <UserAvatar src={avatarUrl} name={displayName} size="md" />
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: colors.text }}>{displayName}</p>
              <p className="text-xs truncate" style={{ color: colors.textMuted }}>{user?.email}</p>
              <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: colors.textMuted }}>
                {isPro ? (
                  <>
                    <Crown className="w-3 h-3 text-orange-500" />
                    Pro ({plan})
                  </>
                ) : (
                  'Free Plan'
                )}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator style={{ backgroundColor: colors.border }} />
        {!isPro && (
          <DropdownMenuItem
            onClick={() => showUpgradeModal({ feature: 'pro' })}
            className="cursor-pointer"
            style={{ color: colors.text }}
          >
            <Crown className="w-4 h-4 mr-2 text-orange-500" />
            <span>Upgrade to Pro</span>
          </DropdownMenuItem>
        )}
        <SettingsMenuContent theme={theme} setTheme={setTheme} colors={colors} />
        <DropdownMenuSeparator style={{ backgroundColor: colors.border }} />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer" style={{ color: '#ef4444' }}>
          <LogOut className="w-4 h-4 mr-2" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
