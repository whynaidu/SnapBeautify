'use client';

import { useState } from 'react';
import { Sparkles, RotateCcw, Settings, Moon, Sun, Laptop, Crop, Undo } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useEditorStore } from '@/lib/store/editor-store';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

export function Header() {
    const { resetToDefaults, originalImage, enterCropMode, isCropping, uncroppedImage, revertCrop } = useEditorStore();
    const { setTheme, theme } = useTheme();
    const [showResetDialog, setShowResetDialog] = useState(false);

    const handleResetConfirm = () => {
        resetToDefaults();
        setShowResetDialog(false);
        toast.info('All settings reset to defaults');
    };

    const handleCrop = () => {
        enterCropMode();
        toast.info('Drag and resize the crop area, then click Apply');
    };

    const handleRevertCrop = () => {
        revertCrop();
        toast.success('Crop reverted to original image');
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
                            onClick={handleCrop}
                            disabled={isCropping}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <Crop className="w-4 h-4 mr-1" />
                            Crop
                        </Button>
                        {uncroppedImage && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleRevertCrop}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <Undo className="w-4 h-4 mr-1" />
                                Revert Crop
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowResetDialog(true)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Reset All
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

            <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Reset all settings?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will reset all adjustments to their default values. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleResetConfirm}>
                            Reset All
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </header>
    );
}
