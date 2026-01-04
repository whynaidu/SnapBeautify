'use client';

import { Label } from '@/components/ui/label';
import { useEditorStore } from '@/lib/store/editor-store';
import { cn } from '@/lib/utils';
import { ASPECT_RATIO_PRESETS } from '@/lib/constants/frames';

export function AspectRatioPicker() {
    const { aspectRatio, setAspectRatio, originalImage, padding, frameType } = useEditorStore();

    const handleAspectRatioChange = (preset: typeof ASPECT_RATIO_PRESETS[number]) => {
        setAspectRatio(preset.value);

        // If we have an image and a specific aspect ratio, resize the canvas
        if (originalImage && preset.width && preset.height) {
            // Calculate frame offset
            let frameOffset = 0;
            if (frameType === 'browser') frameOffset = 40;
            else if (frameType === 'macos') frameOffset = 32;
            else if (frameType === 'windows') frameOffset = 32;

            // For social media presets (absolute sizes), use those dimensions
            if (preset.value === 'twitter' || preset.value === 'linkedin' ||
                preset.value === 'instagram' || preset.value === 'story') {
                // These are absolute pixel dimensions
                useEditorStore.setState({
                    canvasWidth: preset.width,
                    canvasHeight: preset.height,
                });
            } else {
                // For ratios like 16:9, 4:3, etc., calculate based on current image
                const imgWidth = originalImage.width;
                const imgHeight = originalImage.height;
                const totalPadding = padding * 2;

                const targetRatio = preset.width / preset.height;
                const currentWidth = imgWidth + totalPadding;
                const currentHeight = imgHeight + totalPadding + frameOffset;
                const currentRatio = currentWidth / currentHeight;

                let newWidth, newHeight;

                if (currentRatio > targetRatio) {
                    // Current is wider than target, adjust height
                    newWidth = currentWidth;
                    newHeight = currentWidth / targetRatio;
                } else {
                    // Current is taller than target, adjust width
                    newHeight = currentHeight;
                    newWidth = currentHeight * targetRatio;
                }

                useEditorStore.setState({
                    canvasWidth: Math.round(newWidth),
                    canvasHeight: Math.round(newHeight),
                });
            }
        }
    };

    return (
        <div className="space-y-3">
            <Label className="text-zinc-400 text-xs uppercase tracking-wider">
                Aspect Ratio
            </Label>

            <div className="grid grid-cols-3 gap-2">
                {ASPECT_RATIO_PRESETS.slice(0, 6).map((preset) => (
                    <button
                        key={preset.name}
                        onClick={() => handleAspectRatioChange(preset)}
                        className={cn(
                            'py-2 px-3 text-xs rounded-lg border transition-all',
                            aspectRatio === preset.value
                                ? 'border-indigo-500 bg-indigo-500/10 text-white'
                                : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50 text-zinc-400'
                        )}
                    >
                        {preset.name}
                    </button>
                ))}
            </div>

            <Label className="text-zinc-500 text-xs block pt-2">Social Media</Label>
            <div className="grid grid-cols-2 gap-2">
                {ASPECT_RATIO_PRESETS.slice(6).map((preset) => (
                    <button
                        key={preset.name}
                        onClick={() => handleAspectRatioChange(preset)}
                        className={cn(
                            'py-2 px-3 text-xs rounded-lg border transition-all',
                            aspectRatio === preset.value
                                ? 'border-indigo-500 bg-indigo-500/10 text-white'
                                : 'border-zinc-700 hover:border-zinc-600 bg-zinc-800/50 text-zinc-400'
                        )}
                    >
                        {preset.name}
                    </button>
                ))}
            </div>

            {/* Info about current aspect ratio */}
            {aspectRatio && (
                <p className="text-xs text-zinc-500 mt-2">
                    {aspectRatio === 'twitter' && '1600×900px - Twitter/X Post'}
                    {aspectRatio === 'linkedin' && '1200×628px - LinkedIn Post'}
                    {aspectRatio === 'instagram' && '1080×1080px - Instagram Post'}
                    {aspectRatio === 'story' && '1080×1920px - Instagram/Facebook Story'}
                    {!['twitter', 'linkedin', 'instagram', 'story'].includes(aspectRatio) && `Ratio: ${aspectRatio}`}
                </p>
            )}
        </div>
    );
}
