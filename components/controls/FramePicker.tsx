'use client';

import { Label } from '@/components/ui/label';
import { useEditorStore } from '@/lib/store/editor-store';
import { cn } from '@/lib/utils';
import { FrameType } from '@/types/editor';
import { Monitor, AppWindow, Laptop, Smartphone, Square } from 'lucide-react';

interface FrameOption {
    type: FrameType;
    label: string;
    icon: React.ReactNode;
    description: string;
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
                        onClick={() => setFrameType(option.type)}
                        className={cn(
                            'flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200',
                            'hover:bg-accent hover:border-accent-foreground/20',
                            frameType === option.type
                                ? 'border-primary bg-primary/10 shadow-sm'
                                : 'border-border bg-card'
                        )}
                    >
                        <div
                            className={cn(
                                'p-2 rounded-lg transition-colors',
                                frameType === option.type ? 'text-primary' : 'text-muted-foreground'
                            )}
                        >
                            {option.icon}
                        </div>
                        <div className="text-center">
                            <p
                                className={cn(
                                    'text-sm font-medium transition-colors',
                                    frameType === option.type ? 'text-foreground' : 'text-muted-foreground'
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
