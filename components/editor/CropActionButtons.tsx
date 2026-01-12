'use client';

import { Button } from '@/components/ui/button';
import { Check, X, Crop } from 'lucide-react';
import { useEditorStore } from '@/lib/store/editor-store';
import { toast } from 'sonner';

export function CropActionButtons() {
    const { applyCrop, exitCropMode } = useEditorStore();

    const handleApply = async () => {
        await applyCrop();
        toast.success('Crop applied successfully');
    };

    const handleCancel = () => {
        exitCropMode();
        toast.info('Crop cancelled');
    };

    return (
        <>
            {/* Desktop: Sidebar position (where control panel normally is) */}
            <div
                className="hidden md:flex md:flex-col gap-4 fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 p-6 justify-center z-40"
            >
                <div className="space-y-6">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-2xl bg-black dark:bg-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-black/10 dark:shadow-white/10">
                            <Crop className="w-8 h-8 text-white dark:text-black" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Crop Image</h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Drag the handles to adjust the crop area
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={handleApply}
                            size="lg"
                            className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-lg shadow-black/10 dark:shadow-white/10 h-14 w-full text-base font-semibold rounded-xl"
                        >
                            <Check className="w-5 h-5 mr-2" />
                            Apply Crop
                        </Button>
                        <Button
                            onClick={handleCancel}
                            size="lg"
                            variant="outline"
                            className="bg-white dark:bg-zinc-800 shadow-lg h-14 w-full text-base font-semibold border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-xl"
                        >
                            <X className="w-5 h-5 mr-2" />
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile: Bottom position (where Show Controls drawer button is) */}
            <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
                <div className="flex flex-row gap-3 p-3 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-black/10 dark:shadow-black/30">
                    <Button
                        onClick={handleApply}
                        size="lg"
                        className="bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-lg h-12 flex-1 text-sm font-semibold rounded-xl"
                    >
                        <Check className="w-4 h-4 mr-1.5" />
                        Apply
                    </Button>
                    <Button
                        onClick={handleCancel}
                        size="lg"
                        variant="outline"
                        className="bg-white dark:bg-zinc-800 shadow-lg h-12 flex-1 text-sm font-semibold border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 rounded-xl"
                    >
                        <X className="w-4 h-4 mr-1.5" />
                        Cancel
                    </Button>
                </div>
            </div>
        </>
    );
}
