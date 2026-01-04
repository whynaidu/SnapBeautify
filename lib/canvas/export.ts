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
        typeof navigator !== 'undefined' &&
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

// Check if device is mobile
export function isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        (window.innerWidth <= 768);
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
export async function shareCanvas(canvas: HTMLCanvasElement, filename: string = 'snapbeautify'): Promise<void> {
    const blob = await exportCanvas(canvas, 'png');
    const file = new File([blob], `${filename}.png`, { type: 'image/png' });

    if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
        await navigator.share({
            files: [file],
            title: 'SnapBeautify',
            text: 'Check out my beautified screenshot!',
        });
    } else {
        throw new Error('Sharing not supported on this device');
    }
}

// Download using blob URL - works better on mobile
export async function downloadCanvas(
    canvas: HTMLCanvasElement,
    filename: string,
    format: ExportFormat
): Promise<void> {
    const blob = await exportCanvas(canvas, format);
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${format}`;
    link.style.display = 'none';

    // For mobile Safari and some other browsers
    document.body.appendChild(link);

    // Use setTimeout to ensure the link is in the DOM
    setTimeout(() => {
        link.click();

        // Cleanup after a delay
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
    }, 0);
}

// Alternative download method for mobile - opens image in new tab
export async function downloadCanvasMobile(
    canvas: HTMLCanvasElement,
    format: ExportFormat
): Promise<string> {
    const blob = await exportCanvas(canvas, format);
    const url = URL.createObjectURL(blob);

    // On mobile, open the image in a new tab for user to long-press and save
    const newWindow = window.open(url, '_blank');

    if (!newWindow) {
        // If popup blocked, return URL for user to use
        return url;
    }

    return url;
}

export function canvasToDataUrl(
    canvas: HTMLCanvasElement,
    format: ExportFormat = 'png',
    quality = 0.92
): string {
    const mimeType = format === 'jpeg' ? 'image/jpeg' : `image/${format}`;
    return canvas.toDataURL(mimeType, quality);
}
