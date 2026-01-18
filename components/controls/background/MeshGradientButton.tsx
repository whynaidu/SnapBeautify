'use client';

import { memo } from 'react';
import { Check, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MeshGradientButtonProps } from './types';

export const MeshGradientButton = memo(function MeshGradientButton({
    mesh,
    isSelected,
    isPremium,
    onClick,
}: MeshGradientButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'relative w-full aspect-square rounded-lg transition-all overflow-hidden group mesh-grid-item',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                isSelected
                    ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-105'
                    : 'hover:scale-105'
            )}
            style={{ background: mesh.css, backgroundColor: '#0f172a' }}
            title={isPremium ? `${mesh.name} (PRO)` : mesh.name}
            aria-label={`Select mesh gradient ${mesh.name}${isPremium ? ' (Pro feature)' : ''}${isSelected ? ', currently selected' : ''}`}
        >
            {isSelected && (
                <Check className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow-lg" aria-hidden="true" />
            )}
            {isPremium && (
                <>
                    <Crown className="absolute top-0.5 right-0.5 w-3 h-3 text-orange-500 drop-shadow" aria-hidden="true" />
                    <span className="sr-only">Pro feature</span>
                </>
            )}
            <span className="absolute bottom-0 left-0 right-0 text-[8px] text-white bg-black/80 px-1 py-0.5 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity truncate">
                {mesh.name}
            </span>
        </button>
    );
});
