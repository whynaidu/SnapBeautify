'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { useSubscription } from '@/lib/subscription/context';
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

export function UserMenu() {
  const { user, isAuthenticated, signOut } = useAuth();
  const { isPro, plan } = useSubscription();
  const { setTheme, theme } = useTheme();

  const handleSignOut = async () => {
    await signOut();
    // Force navigation to home page to trigger re-render with cleared auth state
    window.location.href = '/';
  };

  const handleLogin = () => {
    window.dispatchEvent(new CustomEvent('show-auth-modal', {
      detail: { defaultTab: 'login' }
    }));
  };

  // Common settings menu items (shown for both authenticated and non-authenticated users)
  const SettingsMenuContent = () => (
    <>
      {/* Theme submenu */}
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="cursor-pointer">
          <Sun className="w-4 h-4 mr-2" />
          Theme
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent className="rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-zinc-200 dark:border-zinc-800">
            <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
              {theme === 'light' && <Check className="ml-auto h-4 w-4 text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
              {theme === 'dark' && <Check className="ml-auto h-4 w-4 text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
              <Laptop className="mr-2 h-4 w-4" />
              <span>System</span>
              {theme === 'system' && <Check className="ml-auto h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>

      <DropdownMenuSeparator />
      <DropdownMenuLabel className="text-xs text-muted-foreground">Legal</DropdownMenuLabel>
      <DropdownMenuItem asChild className="cursor-pointer">
        <Link href="/terms">
          <FileText className="mr-2 h-4 w-4" />
          <span>Terms & Conditions</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild className="cursor-pointer">
        <Link href="/privacy">
          <Shield className="mr-2 h-4 w-4" />
          <span>Privacy Policy</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild className="cursor-pointer">
        <Link href="/refund">
          <RefreshCcw className="mr-2 h-4 w-4" />
          <span>Refund Policy</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild className="cursor-pointer">
        <Link href="/shipping">
          <Truck className="mr-2 h-4 w-4" />
          <span>Delivery Policy</span>
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild className="cursor-pointer">
        <Link href="/contact">
          <Mail className="mr-2 h-4 w-4" />
          <span>Contact Us</span>
        </Link>
      </DropdownMenuItem>
    </>
  );

  if (!isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 rounded-full">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-zinc-200 dark:border-zinc-800">
          <DropdownMenuItem onClick={handleLogin} className="cursor-pointer">
            <User className="w-4 h-4 mr-2" />
            Sign In
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <SettingsMenuContent />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 rounded-full">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="max-w-[100px] truncate text-xs hidden sm:inline">
            {user?.email?.split('@')[0]}
          </span>
          {isPro && <Crown className="w-3.5 h-3.5 text-orange-500" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-zinc-200 dark:border-zinc-800">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.email}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
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
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!isPro && (
          <DropdownMenuItem
            onClick={() => window.dispatchEvent(new CustomEvent('show-upgrade-modal', {
              detail: { featureId: 'pro', message: 'Upgrade to Pro for all features!' }
            }))}
            className="cursor-pointer"
          >
            <Crown className="w-4 h-4 mr-2 text-orange-500" />
            Upgrade to Pro
          </DropdownMenuItem>
        )}
        <SettingsMenuContent />
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 focus:text-red-500">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
