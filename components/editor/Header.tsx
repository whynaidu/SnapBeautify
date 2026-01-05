'use client';

import { Sparkles, RotateCcw, Settings, Moon, Sun, Laptop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useEditorStore } from '@/lib/store/editor-store';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

export function Header() {
    const { resetToDefaults, originalImage, clearImage } = useEditorStore();
    const { setTheme, theme } = useTheme();

    const handleReset = () => {
        resetToDefaults();
        toast.info('Settings reset to defaults');
    };

    const handleClear = () => {
        clearImage();
        toast.info('Image cleared');
    };

    return (
        <header className="h-14 bg-background/80 backdrop-blur-md border-b border-border px-4 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-semibold text-foreground">SnapBeautify</span>
                </div>
                <span className="text-xs text-muted-foreground hidden sm:inline-block">
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
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Clear
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleReset}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Reset
                        </Button>
                    </>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <Settings className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Theme</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            <Sun className="mr-2 h-4 w-4" />
                            <span>Light</span>
                            {theme === 'light' && <span className="ml-auto text-xs opacity-50">✓</span>}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            <Moon className="mr-2 h-4 w-4" />
                            <span>Dark</span>
                            {theme === 'dark' && <span className="ml-auto text-xs opacity-50">✓</span>}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            <Laptop className="mr-2 h-4 w-4" />
                            <span>System</span>
                            {theme === 'system' && <span className="ml-auto text-xs opacity-50">✓</span>}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
