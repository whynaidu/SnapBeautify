'use client';

import { motion } from 'framer-motion';
import {
    Star,
    Camera,
    Layers,
    Sparkles,
    Wand2,
} from 'lucide-react';

// Animated background blob - static on mobile or when user prefers reduced motion
export function AnimatedBlob({
    className,
    isMobile,
    reducedMotion
}: {
    className?: string;
    isMobile?: boolean;
    reducedMotion?: boolean;
}) {
    // On mobile or when reduced motion is preferred, render a static blob without animations
    if (isMobile || reducedMotion) {
        return <div className={className} style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }} />;
    }
    return (
        <motion.div
            className={className}
            animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 180, 270, 360],
                borderRadius: ['30% 70% 70% 30% / 30% 30% 70% 70%', '70% 30% 30% 70% / 70% 70% 30% 30%', '30% 70% 70% 30% / 30% 30% 70% 70%'],
            }}
            transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
            }}
        />
    );
}

// Floating icon component - static on mobile or when user prefers reduced motion
export function FloatingIcon({
    icon: Icon,
    x,
    y,
    delay,
    isMobile,
    reducedMotion
}: {
    icon: React.ComponentType<{ className?: string }>;
    x: string;
    y: string;
    delay: number;
    isMobile?: boolean;
    reducedMotion?: boolean;
}) {
    // On mobile or when reduced motion is preferred, render a static icon without animations
    if (isMobile || reducedMotion) {
        return (
            <div
                className="absolute text-zinc-300 dark:text-zinc-700 opacity-40"
                style={{ left: x, top: y }}
            >
                <Icon className="w-6 h-6" />
            </div>
        );
    }
    return (
        <motion.div
            className="absolute text-zinc-300 dark:text-zinc-700"
            style={{ left: x, top: y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
            }}
            transition={{
                duration: 6,
                delay,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
        >
            <Icon className="w-6 h-6" />
        </motion.div>
    );
}

// Pre-generated particle positions for stable rendering (reduced count for performance)
const particleData = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    left: `${(i * 17 + 5) % 100}%`,
    top: `${(i * 23 + 10) % 100}%`,
    duration: 3 + (i % 5) * 0.4,
    delay: (i % 4) * 0.5,
}));

// Particle effect - disabled on mobile or when user prefers reduced motion
export function Particles({
    isMobile,
    reducedMotion
}: {
    isMobile?: boolean;
    reducedMotion?: boolean;
}) {
    // Skip particles entirely on mobile or when reduced motion is preferred
    if (isMobile || reducedMotion) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particleData.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute w-1 h-1 bg-zinc-400/30 dark:bg-zinc-600/30 rounded-full"
                    style={{
                        left: particle.left,
                        top: particle.top,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
}

// Floating icons configuration
export const floatingIcons = [
    { icon: Star, x: '10%', y: '20%', delay: 0 },
    { icon: Camera, x: '85%', y: '15%', delay: 0.5 },
    { icon: Layers, x: '75%', y: '70%', delay: 1 },
    { icon: Sparkles, x: '15%', y: '75%', delay: 1.5 },
    { icon: Wand2, x: '90%', y: '45%', delay: 2 },
];
