'use client';

import { Sparkles, RotateCcw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '@/lib/store/editor-store';
import { toast } from 'sonner';

export function Header() {
    const { resetToDefaults, originalImage, clearImage } = useEditorStore();

    const handleReset = () => {
        resetToDefaults();
        toast.info('Settings reset to defaults');
    };

    const handleClear = () => {
        clearImage();
        toast.info('Image cleared');
    };

    return (
        <header className="h-14 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-white">SnapBeautify</span>
                </div>
                <span className="text-xs text-zinc-500 hidden sm:inline-block">
                    Beautiful screenshots instantly
                </span>
            </div>

            <div className="flex items-center gap-2">
                {originalImage && (
                    <>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClear}
                            className="text-zinc-400 hover:text-white"
                        >
                            Clear
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleReset}
                            className="text-zinc-400 hover:text-white"
                        >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Reset
                        </Button>
                    </>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-zinc-400 hover:text-white"
                >
                    <Settings className="w-4 h-4" />
                </Button>
            </div>
        </header>
    );
}
