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

export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<void> {
    const blob = await exportCanvas(canvas, 'png');
    await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
    ]);
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
