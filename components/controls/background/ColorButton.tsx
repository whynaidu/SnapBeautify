'use client';

import { memo } from 'react';
import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ColorButtonProps } from './types';

export const ColorButton = memo(function ColorButton({
    color,
    isSelected,
    isPremium,
    onClick,
}: ColorButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'w-full aspect-square rounded-md border-2 transition-all relative color-grid-item',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                isSelected
                    ? 'border-foreground/80 scale-110 z-10'
                    : 'border-transparent hover:scale-105'
            )}
            style={{ backgroundColor: color }}
            title={isPremium ? `${color} (PRO)` : color}
            aria-label={`Select color ${color}${isPremium ? ' (Pro feature)' : ''}${isSelected ? ', currently selected' : ''}`}
        >
            {isPremium && (
                <Crown className="absolute -top-1 -right-1 w-2.5 h-2.5 text-orange-500" aria-hidden="true" />
            )}
            {isPremium && <span className="sr-only">Pro feature</span>}
        </button>
    );
});
