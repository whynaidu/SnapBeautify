'use client';

import { Label } from '@/components/ui/label';
import { useEditorStore } from '@/lib/store/editor-store';
import { cn } from '@/lib/utils';
import { FrameType } from '@/types/editor';
import { Monitor, AppWindow, Laptop, Smartphone, Square, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

interface FrameOption {
    type: FrameType;
    label: string;
    icon: React.ReactNode;
    description: string;
    disabled?: boolean;
    comingSoon?: boolean;
}

const FRAME_OPTIONS: FrameOption[] = [
    {
        type: 'none',
        label: 'None',
        icon: <Square className="w-5 h-5" />,
        description: 'No frame',
    },
    {
        type: 'browser',
        label: 'Browser',
        icon: <Monitor className="w-5 h-5" />,
        description: 'Chrome-style',
    },
    {
        type: 'macos',
        label: 'macOS',
        icon: <AppWindow className="w-5 h-5" />,
        description: 'Window frame',
    },
    {
        type: 'windows',
        label: 'Windows',
        icon: <Laptop className="w-5 h-5" />,
        description: 'Windows 11',
    },
    {
        type: 'iphone',
        label: 'iPhone',
        icon: <Smartphone className="w-5 h-5" />,
        description: 'iOS Style',
    },
    {
        type: 'android',
        label: 'Android',
        icon: <Smartphone className="w-5 h-5" />,
        description: 'Android Style',
    },
    {
        type: 'linkedin',
        label: 'LinkedIn',
        icon: <Linkedin className="w-5 h-5" />,
        description: 'LI Post',
    },
    {
        type: 'instagram',
        label: 'Instagram',
        icon: <Instagram className="w-5 h-5" />,
        description: 'Coming Soon',
        disabled: true,
        comingSoon: true,
    },
    {
        type: 'facebook',
        label: 'Facebook',
        icon: <Facebook className="w-5 h-5" />,
        description: 'Coming Soon',
        disabled: true,
        comingSoon: true,
    },
    {
        type: 'twitter',
        label: 'Twitter',
        icon: <Twitter className="w-5 h-5" />,
        description: 'Coming Soon',
        disabled: true,
        comingSoon: true,
    },

];

export function FramePicker() {
    const { frameType, setFrameType } = useEditorStore();

    return (
        <div className="space-y-3">
            <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                Frame
            </Label>

            <div className="grid grid-cols-2 gap-2">
                {FRAME_OPTIONS.map((option) => (
                    <button
                        key={option.type}
                        onClick={() => !option.disabled && setFrameType(option.type)}
                        disabled={option.disabled}
                        className={cn(
                            'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 relative',
                            option.disabled
                                ? 'opacity-50 cursor-not-allowed bg-muted/50 border-border'
                                : 'hover:bg-accent hover:border-accent-foreground/20',
                            frameType === option.type && !option.disabled
                                ? 'border-primary bg-primary/10 shadow-sm'
                                : 'border-border bg-card'
                        )}
                    >
                        {option.comingSoon && (
                            <span className="absolute top-1 right-1 text-[9px] font-semibold px-1.5 py-0.5 bg-primary/20 text-primary rounded">
                                SOON
                            </span>
                        )}
                        <div
                            className={cn(
                                'p-2 rounded-lg transition-colors',
                                frameType === option.type && !option.disabled ? 'text-primary' : 'text-muted-foreground'
                            )}
                        >
                            {option.icon}
                        </div>
                        <div className="text-center">
                            <p
                                className={cn(
                                    'text-sm font-medium transition-colors',
                                    frameType === option.type && !option.disabled ? 'text-foreground' : 'text-muted-foreground'
                                )}
                            >
                                {option.label}
                            </p>
                            <p className="text-xs text-muted-foreground/70">{option.description}</p>
                        </div>
                    </button>
                ))}
            </div>

            {frameType !== 'none' && (
                <p className="text-xs text-muted-foreground text-center">
                    Frame adds a title bar above your screenshot
                </p>
            )}
        </div>
    );
}
