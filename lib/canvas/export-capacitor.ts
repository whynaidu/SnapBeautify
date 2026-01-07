import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { ExportFormat } from '@/types/editor';
import { exportCanvas } from './export';

// Check if app is running in Capacitor (native mobile)
export function isCapacitor(): boolean {
    return Capacitor.isNativePlatform();
}

// Save image using Capacitor Filesystem API
export async function saveImageCapacitor(
    canvas: HTMLCanvasElement,
    filename: string,
    format: ExportFormat
): Promise<string> {
    // Check and request permissions
    const permissions = await Filesystem.checkPermissions();

    if (permissions.publicStorage !== 'granted') {
        const requested = await Filesystem.requestPermissions();

        if (requested.publicStorage !== 'granted') {
            throw new Error('Storage permission denied. Please enable it in app settings.');
        }
    }

    // Export canvas to blob
    const blob = await exportCanvas(canvas, format);

    // Convert blob to base64
    const base64Data = await blobToBase64(blob);

    // Remove data URL prefix (e.g., "data:image/png;base64,")
    const base64 = base64Data.split(',')[1];

    // Save to Pictures/SnapBeautify folder in external storage
    // This makes it visible in Gallery and Files app
    const result = await Filesystem.writeFile({
        path: `Pictures/SnapBeautify/${filename}.${format}`,
        data: base64,
        directory: Directory.ExternalStorage,
        recursive: true,
    });

    return result.uri;
}

// Share image using Capacitor Share API
export async function shareImageCapacitor(
    canvas: HTMLCanvasElement,
    filename: string,
    format: ExportFormat
): Promise<void> {
    // First save the file
    const uri = await saveImageCapacitor(canvas, filename, format);

    // Then share it
    await Share.share({
        title: 'SnapBeautify',
        text: 'Check out my beautified screenshot!',
        url: uri,
        dialogTitle: 'Share your image',
    });
}

// Helper: Convert blob to base64
function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Failed to convert blob to base64'));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
