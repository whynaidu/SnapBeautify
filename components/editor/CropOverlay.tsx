'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useEditorStore } from '@/lib/store/editor-store';
import { CropArea } from '@/types/editor';
import { cn } from '@/lib/utils';

type DragHandle = 'move' | 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w' | null;

interface CropOverlayProps {
    canvasWidth: number;
    canvasHeight: number;
    displayScale: number;
}

export function CropOverlay({ canvasWidth, canvasHeight, displayScale }: CropOverlayProps) {
    const { cropArea, setCropArea } = useEditorStore();
    const [isDragging, setIsDragging] = useState(false);
    const [dragHandle, setDragHandle] = useState<DragHandle>(null);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [startCrop, setStartCrop] = useState<CropArea | null>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

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

        const newCrop = { ...startCrop };

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

    // Early return after all hooks have been called
    if (!cropArea) return null;

    // The overlay needs to exactly match the canvas position and size
    // Since the canvas is in normal flow and scales from center,
    // the overlay must be positioned to overlay it exactly
    return (
        <>
            <div
                ref={overlayRef}
                className="absolute z-10 pointer-events-none"
                style={{
                    width: `${canvasWidth}px`,
                    height: `${canvasHeight}px`,
                    // Position at top-left, same as the canvas in the relative container
                    top: 0,
                    left: 0,
                    transform: `scale(${displayScale})`,
                    transformOrigin: 'top left',
                }}
            >
                {/* Darkened overlay */}
                <div className="absolute inset-0 bg-black/50 pointer-events-auto" style={{ touchAction: 'none' }} />

                {/* Crop area */}
                <div
                    className="absolute border-2 border-white shadow-lg pointer-events-none"
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
                        className="absolute inset-0 cursor-move pointer-events-auto"
                        onMouseDown={(e) => handleMouseDown(e, 'move')}
                        onTouchStart={(e) => handleMouseDown(e, 'move')}
                        style={{ touchAction: 'none' }}
                    />

                    {/* Corner handles - responsive sizing */}
                    <div
                        className={cn(
                            "absolute -top-3 -left-3 w-10 h-10 md:w-6 md:h-6 md:-top-2 md:-left-2",
                            "bg-white border-2 md:border-2 border-indigo-500 rounded-full shadow-lg pointer-events-auto",
                            "active:scale-95 hover:scale-110 transition-all duration-150",
                            "flex items-center justify-center z-10"
                        )}
                        onMouseDown={(e) => handleMouseDown(e, 'nw')}
                        onTouchStart={(e) => handleMouseDown(e, 'nw')}
                        style={{ touchAction: 'none' }}
                    >
                        <div className="w-2 h-2 md:w-1 md:h-1 bg-indigo-500 rounded-full" />
                    </div>
                    <div
                        className={cn(
                            "absolute -top-3 -right-3 w-10 h-10 md:w-6 md:h-6 md:-top-2 md:-right-2",
                            "bg-white border-2 md:border-2 border-indigo-500 rounded-full shadow-lg pointer-events-auto",
                            "active:scale-95 hover:scale-110 transition-all duration-150",
                            "flex items-center justify-center z-10"
                        )}
                        onMouseDown={(e) => handleMouseDown(e, 'ne')}
                        onTouchStart={(e) => handleMouseDown(e, 'ne')}
                        style={{ touchAction: 'none' }}
                    >
                        <div className="w-2 h-2 md:w-1 md:h-1 bg-indigo-500 rounded-full" />
                    </div>
                    <div
                        className={cn(
                            "absolute -bottom-3 -left-3 w-10 h-10 md:w-6 md:h-6 md:-bottom-2 md:-left-2",
                            "bg-white border-2 md:border-2 border-indigo-500 rounded-full shadow-lg pointer-events-auto",
                            "active:scale-95 hover:scale-110 transition-all duration-150",
                            "flex items-center justify-center z-10"
                        )}
                        onMouseDown={(e) => handleMouseDown(e, 'sw')}
                        onTouchStart={(e) => handleMouseDown(e, 'sw')}
                        style={{ touchAction: 'none' }}
                    >
                        <div className="w-2 h-2 md:w-1 md:h-1 bg-indigo-500 rounded-full" />
                    </div>
                    <div
                        className={cn(
                            "absolute -bottom-3 -right-3 w-10 h-10 md:w-6 md:h-6 md:-bottom-2 md:-right-2",
                            "bg-white border-2 md:border-2 border-indigo-500 rounded-full shadow-lg pointer-events-auto",
                            "active:scale-95 hover:scale-110 transition-all duration-150",
                            "flex items-center justify-center z-10"
                        )}
                        onMouseDown={(e) => handleMouseDown(e, 'se')}
                        onTouchStart={(e) => handleMouseDown(e, 'se')}
                        style={{ touchAction: 'none' }}
                    >
                        <div className="w-2 h-2 md:w-1 md:h-1 bg-indigo-500 rounded-full" />
                    </div>

                    {/* Edge handles - responsive sizing */}
                    <div
                        className={cn(
                            "absolute -top-2 md:-top-1 left-1/2 -translate-x-1/2",
                            "w-12 h-8 md:w-8 md:h-4",
                            "bg-white border-2 border-indigo-500 rounded-lg shadow-lg pointer-events-auto",
                            "active:scale-95 hover:scale-110 transition-all duration-150",
                            "flex items-center justify-center z-10"
                        )}
                        onMouseDown={(e) => handleMouseDown(e, 'n')}
                        onTouchStart={(e) => handleMouseDown(e, 'n')}
                        style={{ touchAction: 'none' }}
                    >
                        <div className="w-4 h-0.5 md:w-3 md:h-0.5 bg-indigo-500 rounded-full" />
                    </div>
                    <div
                        className={cn(
                            "absolute -bottom-2 md:-bottom-1 left-1/2 -translate-x-1/2",
                            "w-12 h-8 md:w-8 md:h-4",
                            "bg-white border-2 border-indigo-500 rounded-lg shadow-lg pointer-events-auto",
                            "active:scale-95 hover:scale-110 transition-all duration-150",
                            "flex items-center justify-center z-10"
                        )}
                        onMouseDown={(e) => handleMouseDown(e, 's')}
                        onTouchStart={(e) => handleMouseDown(e, 's')}
                        style={{ touchAction: 'none' }}
                    >
                        <div className="w-4 h-0.5 md:w-3 md:h-0.5 bg-indigo-500 rounded-full" />
                    </div>
                    <div
                        className={cn(
                            "absolute -left-2 md:-left-1 top-1/2 -translate-y-1/2",
                            "w-8 h-12 md:w-4 md:h-8",
                            "bg-white border-2 border-indigo-500 rounded-lg shadow-lg pointer-events-auto",
                            "active:scale-95 hover:scale-110 transition-all duration-150",
                            "flex items-center justify-center z-10"
                        )}
                        onMouseDown={(e) => handleMouseDown(e, 'w')}
                        onTouchStart={(e) => handleMouseDown(e, 'w')}
                        style={{ touchAction: 'none' }}
                    >
                        <div className="w-0.5 h-4 md:w-0.5 md:h-3 bg-indigo-500 rounded-full" />
                    </div>
                    <div
                        className={cn(
                            "absolute -right-2 md:-right-1 top-1/2 -translate-y-1/2",
                            "w-8 h-12 md:w-4 md:h-8",
                            "bg-white border-2 border-indigo-500 rounded-lg shadow-lg pointer-events-auto",
                            "active:scale-95 hover:scale-110 transition-all duration-150",
                            "flex items-center justify-center z-10"
                        )}
                        onMouseDown={(e) => handleMouseDown(e, 'e')}
                        onTouchStart={(e) => handleMouseDown(e, 'e')}
                        style={{ touchAction: 'none' }}
                    >
                        <div className="w-0.5 h-4 md:w-0.5 md:h-3 bg-indigo-500 rounded-full" />
                    </div>
                </div>
            </div>
        </>
    );
}
