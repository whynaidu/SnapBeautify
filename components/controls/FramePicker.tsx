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
];

export function FramePicker() {
    const { frameType, setFrameType } = useEditorStore();

    return (
        <div className="space-y-3">
            <Label className="text-zinc-400 text-xs uppercase tracking-wider">
                Frame
            </Label>

            <div className="grid grid-cols-2 gap-2">
                {FRAME_OPTIONS.map((option) => (
                    <button
                        key={option.type}
                        onClick={() => setFrameType(option.type)}
                        className={cn(
                            'flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
                            frameType === option.type
                                ? 'border-indigo-500 bg-indigo-500/10'
                                : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50'
                        )}
                    >
                        <div
                            className={cn(
                                'p-2 rounded-lg',
                                frameType === option.type ? 'text-indigo-400' : 'text-zinc-400'
                            )}
                        >
                            {option.icon}
                        </div>
                        <div className="text-center">
                            <p
                                className={cn(
                                    'text-sm font-medium',
                                    frameType === option.type ? 'text-white' : 'text-zinc-300'
                                )}
                            >
                                {option.label}
                            </p>
                            <p className="text-xs text-zinc-500">{option.description}</p>
                        </div>
                    </button>
                ))}
            </div>

            {frameType !== 'none' && (
                <p className="text-xs text-zinc-500 text-center">
                    Frame adds a title bar above your screenshot
                </p>
            )}
        </div>
    );
}
