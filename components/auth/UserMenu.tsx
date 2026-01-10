'use client';

import { useAuth } from '@/lib/auth/context';
import { useSubscription } from '@/lib/subscription/context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Crown, Settings } from 'lucide-react';

export function UserMenu() {
  const { user, isAuthenticated, signOut } = useAuth();
  const { isPro, plan } = useSubscription();

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

  if (!isAuthenticated) {
    return (
      <Button variant="outline" size="sm" onClick={handleLogin}>
        <User className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="max-w-[100px] truncate text-xs">
            {user?.email?.split('@')[0]}
          </span>
          {isPro && <Crown className="w-3.5 h-3.5 text-orange-500" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
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
        <DropdownMenuItem disabled className="cursor-pointer">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 focus:text-red-500">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
