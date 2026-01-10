'use client';

import { ReactNode } from 'react';
import { useFeatureGate } from '@/hooks/useFeatureGate';
import type { FeatureId } from '@/lib/subscription/types';
import { Lock } from 'lucide-react';
import { ProLabel } from './ProBadge';

interface FeatureGateProps {
  featureId: FeatureId;
  children: ReactNode;
  fallback?: ReactNode;
  showLock?: boolean;
  showProLabel?: boolean;
}

/**
 * Component that gates content behind a subscription feature
 */
export function FeatureGate({
  featureId,
  children,
  fallback,
  showLock = true,
  showProLabel = false,
}: FeatureGateProps) {
  const { hasAccess, upgradeMessage, showUpgradePrompt } = useFeatureGate(featureId);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showLock) {
    return (
      <div
        onClick={showUpgradePrompt}
        className="relative cursor-pointer group"
        title={upgradeMessage}
      >
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-lg shadow-lg">
            <Lock className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-white font-medium">Pro</span>
          </div>
        </div>
        {showProLabel && (
          <div className="absolute top-1 right-1">
            <ProLabel />
          </div>
        )}
      </div>
    );
  }

  return null;
}

interface FeatureButtonProps {
  featureId: FeatureId;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

/**
 * Button that checks feature access before allowing action
 */
export function FeatureButton({
  featureId,
  children,
  onClick,
  className = '',
  disabled = false,
}: FeatureButtonProps) {
  const { hasAccess, showUpgradePrompt } = useFeatureGate(featureId);

  const handleClick = () => {
    if (hasAccess) {
      onClick?.();
    } else {
      showUpgradePrompt();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`relative ${className}`}
    >
      {children}
      {!hasAccess && (
        <div className="absolute -top-1 -right-1">
          <ProLabel />
        </div>
      )}
    </button>
  );
}

interface FeatureIndicatorProps {
  featureId: FeatureId;
  label?: string;
}

/**
 * Small indicator showing if a feature requires Pro
 */
export function FeatureIndicator({ featureId, label }: FeatureIndicatorProps) {
  const { hasAccess } = useFeatureGate(featureId);

  if (hasAccess) {
    return label ? <span>{label}</span> : null;
  }

  return (
    <span className="inline-flex items-center gap-1">
      {label && <span className="opacity-60">{label}</span>}
      <ProLabel />
    </span>
  );
}
