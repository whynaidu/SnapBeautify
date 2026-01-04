import { ExportFormat } from '@/types/editor';

export async function exportCanvas(
    canvas: HTMLCanvasElement,
    format: ExportFormat,
    quality = 0.92
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const mimeType = format === 'jpeg' ? 'image/jpeg' : `image/${format}`;
        canvas.toBlob(
            (blob) => {
                if (blob) resolve(blob);
                else reject(new Error('Failed to export canvas'));
            },
            mimeType,
            quality
        );
    });
}

// Check if clipboard API is supported for images
export function isClipboardSupported(): boolean {
    return !!(
        navigator.clipboard &&
        typeof ClipboardItem !== 'undefined' &&
        navigator.clipboard.write
    );
}

// Check if Web Share API is supported
export function isShareSupported(): boolean {
    return typeof navigator !== 'undefined' &&
        typeof navigator.share === 'function' &&
        typeof navigator.canShare === 'function';
}

export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<void> {
    // Check if Clipboard API with ClipboardItem is supported
    if (!isClipboardSupported()) {
        throw new Error('Clipboard not supported on this device. Use Share or Download instead.');
    }

    const blob = await exportCanvas(canvas, 'png');
    await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
    ]);
}

// Share image using Web Share API (works on mobile)
export async function shareCanvas(canvas: HTMLCanvasElement): Promise<void> {
    const blob = await exportCanvas(canvas, 'png');
    const file = new File([blob], 'snapbeautify.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
            files: [file],
            title: 'SnapBeautify',
            text: 'Check out my beautified screenshot!',
        });
    } else {
        throw new Error('Sharing not supported on this device');
    }
}

export function downloadCanvas(
    canvas: HTMLCanvasElement,
    filename: string,
    format: ExportFormat
): void {
    const mimeType = format === 'jpeg' ? 'image/jpeg' : `image/${format}`;
    const link = document.createElement('a');
    link.download = `${filename}.${format}`;
    link.href = canvas.toDataURL(mimeType, 0.92);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function canvasToDataUrl(
    canvas: HTMLCanvasElement,
    format: ExportFormat = 'png',
    quality = 0.92
): string {
    const mimeType = format === 'jpeg' ? 'image/jpeg' : `image/${format}`;
    return canvas.toDataURL(mimeType, quality);
}
