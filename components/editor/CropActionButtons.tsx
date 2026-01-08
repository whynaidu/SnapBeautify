'use client';

import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
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
            <div className="hidden md:flex md:flex-col gap-4 fixed right-0 top-0 bottom-0 w-80 bg-background border-l border-border p-6 justify-center z-40">
                <div className="space-y-4">
                    <div className="text-center mb-8">
                        <h3 className="text-lg font-semibold mb-2">Crop Image</h3>
                        <p className="text-sm text-muted-foreground">
                            Drag the handles to adjust the crop area
                        </p>
                    </div>

                    <Button
                        onClick={handleApply}
                        size="lg"
                        className="bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white shadow-lg h-14 w-full text-base font-semibold"
                    >
                        <Check className="w-5 h-5 mr-2" />
                        Apply Crop
                    </Button>
                    <Button
                        onClick={handleCancel}
                        size="lg"
                        variant="outline"
                        className="bg-background shadow-lg h-14 w-full text-base font-semibold border-2"
                    >
                        <X className="w-5 h-5 mr-2" />
                        Cancel
                    </Button>
                </div>
            </div>

            {/* Mobile: Bottom position (where Show Controls drawer button is) */}
            <div className="md:hidden fixed bottom-4 left-0 right-0 px-4 z-50">
                <div className="flex flex-row gap-3">
                    <Button
                        onClick={handleApply}
                        size="lg"
                        className="bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white shadow-2xl h-14 flex-1 text-base font-semibold"
                    >
                        <Check className="w-5 h-5 mr-2" />
                        Apply Crop
                    </Button>
                    <Button
                        onClick={handleCancel}
                        size="lg"
                        variant="outline"
                        className="bg-white dark:bg-zinc-900 shadow-2xl h-14 flex-1 text-base font-semibold border-2"
                    >
                        <X className="w-5 h-5 mr-2" />
                        Cancel
                    </Button>
                </div>
            </div>
        </>
    );
}
