'use client';

import { memo } from 'react';
import { Check, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FontButtonProps } from './types';

export const FontButton = memo(function FontButton({
    font,
    isSelected,
    isPremium,
    onClick,
}: FontButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-all group relative',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
                isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted/80'
            )}
            aria-label={`Select font ${font.name}${isPremium ? ' (Pro feature)' : ''}${isSelected ? ', currently selected' : ''}`}
        >
            {/* Font Preview */}
            <span
                className={cn(
                    'text-base leading-none w-6 text-center',
                    !isSelected && 'text-muted-foreground group-hover:text-foreground'
                )}
                style={{ fontFamily: font.fontFamily }}
                aria-hidden="true"
            >
                Aa
            </span>
            {/* Font Name */}
            <span
                className="flex-1 text-xs truncate"
                style={{ fontFamily: font.fontFamily }}
            >
                {font.name}
            </span>
            {/* PRO Badge or Check Icon */}
            {isPremium ? (
                <>
                    <Crown className="w-3 h-3 shrink-0 text-orange-500" aria-hidden="true" />
                    <span className="sr-only">Pro feature</span>
                </>
            ) : isSelected ? (
                <Check className="w-3 h-3 shrink-0" aria-hidden="true" />
            ) : null}
        </button>
    );
});
