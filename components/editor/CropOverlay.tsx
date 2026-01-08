'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useEditorStore } from '@/lib/store/editor-store';
import { CropArea } from '@/types/editor';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type DragHandle = 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w' | null;

interface CropOverlayProps {
    canvasWidth: number;
    canvasHeight: number;
    displayScale: number;
}

export function CropOverlay({ canvasWidth, canvasHeight, displayScale }: CropOverlayProps) {
    const { cropArea, setCropArea, applyCrop, exitCropMode } = useEditorStore();
    const [isDragging, setIsDragging] = useState(false);
    const [dragHandle, setDragHandle] = useState<DragHandle>(null);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [startCrop, setStartCrop] = useState<CropArea | null>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    if (!cropArea) return null;

    const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent, handle: DragHandle) => {
        e.preventDefault();
        e.stopPropagation();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        setIsDragging(true);
        setDragHandle(handle);
        setStartPos({ x: clientX, y: clientY });
        setStartCrop(cropArea);
    }, [cropArea]);

    const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
        if (!isDragging || !startCrop || !overlayRef.current) return;

        const rect = overlayRef.current.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const deltaX = ((clientX - startPos.x) / rect.width) * 100;
        const deltaY = ((clientY - startPos.y) / rect.height) * 100;

        let newCrop = { ...startCrop };

        switch (dragHandle) {
            case 'move':
                newCrop.x = Math.max(0, Math.min(100 - startCrop.width, startCrop.x + deltaX));
                newCrop.y = Math.max(0, Math.min(100 - startCrop.height, startCrop.y + deltaY));
                break;
            case 'nw':
                newCrop.x = Math.max(0, Math.min(startCrop.x + startCrop.width - 10, startCrop.x + deltaX));
                newCrop.y = Math.max(0, Math.min(startCrop.y + startCrop.height - 10, startCrop.y + deltaY));
                newCrop.width = startCrop.width - (newCrop.x - startCrop.x);
                newCrop.height = startCrop.height - (newCrop.y - startCrop.y);
                break;
            case 'ne':
                newCrop.y = Math.max(0, Math.min(startCrop.y + startCrop.height - 10, startCrop.y + deltaY));
                newCrop.width = Math.max(10, Math.min(100 - startCrop.x, startCrop.width + deltaX));
                newCrop.height = startCrop.height - (newCrop.y - startCrop.y);
                break;
            case 'sw':
                newCrop.x = Math.max(0, Math.min(startCrop.x + startCrop.width - 10, startCrop.x + deltaX));
                newCrop.width = startCrop.width - (newCrop.x - startCrop.x);
                newCrop.height = Math.max(10, Math.min(100 - startCrop.y, startCrop.height + deltaY));
                break;
            case 'se':
                newCrop.width = Math.max(10, Math.min(100 - startCrop.x, startCrop.width + deltaX));
                newCrop.height = Math.max(10, Math.min(100 - startCrop.y, startCrop.height + deltaY));
                break;
            case 'n':
                newCrop.y = Math.max(0, Math.min(startCrop.y + startCrop.height - 10, startCrop.y + deltaY));
                newCrop.height = startCrop.height - (newCrop.y - startCrop.y);
                break;
            case 's':
                newCrop.height = Math.max(10, Math.min(100 - startCrop.y, startCrop.height + deltaY));
                break;
            case 'e':
                newCrop.width = Math.max(10, Math.min(100 - startCrop.x, startCrop.width + deltaX));
                break;
            case 'w':
                newCrop.x = Math.max(0, Math.min(startCrop.x + startCrop.width - 10, startCrop.x + deltaX));
                newCrop.width = startCrop.width - (newCrop.x - startCrop.x);
                break;
        }

        setCropArea(newCrop);
    }, [isDragging, dragHandle, startPos, startCrop, setCropArea]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setDragHandle(null);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.addEventListener('touchmove', handleMouseMove);
            document.addEventListener('touchend', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.removeEventListener('touchmove', handleMouseMove);
                document.removeEventListener('touchend', handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const handleApply = async () => {
        await applyCrop();
    };

    return (
        <div
            ref={overlayRef}
            className="absolute top-0 left-0 z-10"
            style={{
                width: `${canvasWidth}px`,
                height: `${canvasHeight}px`,
                transform: `scale(${displayScale})`,
                transformOrigin: 'center center',
                touchAction: 'none',
            }}
        >
            {/* Darkened overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Crop area */}
            <div
                className="absolute border-2 border-white shadow-lg"
                style={{
                    left: `${cropArea.x}%`,
                    top: `${cropArea.y}%`,
                    width: `${cropArea.width}%`,
                    height: `${cropArea.height}%`,
                }}
            >
                {/* Semi-transparent overlay to show crop area */}
                <div className="absolute inset-0 bg-white/10" />

                {/* Grid lines */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="border border-white/30" />
                    ))}
                </div>

                {/* Move handle (center) */}
                <div
                    className="absolute inset-0 cursor-move"
                    onMouseDown={(e) => handleMouseDown(e, 'move')}
                    onTouchStart={(e) => handleMouseDown(e, 'move')}
                />

                {/* Corner handles */}
                <div
                    className={cn(
                        "absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full cursor-nwse-resize",
                        "hover:scale-125 transition-transform"
                    )}
                    onMouseDown={(e) => handleMouseDown(e, 'nw')}
                    onTouchStart={(e) => handleMouseDown(e, 'nw')}
                />
                <div
                    className={cn(
                        "absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full cursor-nesw-resize",
                        "hover:scale-125 transition-transform"
                    )}
                    onMouseDown={(e) => handleMouseDown(e, 'ne')}
                    onTouchStart={(e) => handleMouseDown(e, 'ne')}
                />
                <div
                    className={cn(
                        "absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full cursor-nesw-resize",
                        "hover:scale-125 transition-transform"
                    )}
                    onMouseDown={(e) => handleMouseDown(e, 'sw')}
                    onTouchStart={(e) => handleMouseDown(e, 'sw')}
                />
                <div
                    className={cn(
                        "absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full cursor-nwse-resize",
                        "hover:scale-125 transition-transform"
                    )}
                    onMouseDown={(e) => handleMouseDown(e, 'se')}
                    onTouchStart={(e) => handleMouseDown(e, 'se')}
                />

                {/* Edge handles */}
                <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-white border-2 border-indigo-500 rounded cursor-ns-resize hover:scale-125 transition-transform"
                    onMouseDown={(e) => handleMouseDown(e, 'n')}
                    onTouchStart={(e) => handleMouseDown(e, 'n')}
                />
                <div
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-white border-2 border-indigo-500 rounded cursor-ns-resize hover:scale-125 transition-transform"
                    onMouseDown={(e) => handleMouseDown(e, 's')}
                    onTouchStart={(e) => handleMouseDown(e, 's')}
                />
                <div
                    className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-white border-2 border-indigo-500 rounded cursor-ew-resize hover:scale-125 transition-transform"
                    onMouseDown={(e) => handleMouseDown(e, 'w')}
                    onTouchStart={(e) => handleMouseDown(e, 'w')}
                />
                <div
                    className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-white border-2 border-indigo-500 rounded cursor-ew-resize hover:scale-125 transition-transform"
                    onMouseDown={(e) => handleMouseDown(e, 'e')}
                    onTouchStart={(e) => handleMouseDown(e, 'e')}
                />
            </div>

            {/* Action buttons */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                <Button
                    onClick={handleApply}
                    size="sm"
                    className="bg-indigo-500 hover:bg-indigo-600 text-white"
                >
                    <Check className="w-4 h-4 mr-1" />
                    Apply Crop
                </Button>
                <Button
                    onClick={exitCropMode}
                    size="sm"
                    variant="outline"
                    className="bg-background"
                >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                </Button>
            </div>
        </div>
    );
}
