import { IMAGE_LOADING, FILE_VALIDATION } from '@/lib/constants/rendering';

export function loadImageFromFile(file: File | Blob): Promise<{ image: HTMLImageElement; dataUrl: string }> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            if (!dataUrl) {
                reject(new Error('Failed to read file - no data'));
                return;
            }

            const img = new Image();

            // Add timeout for Android content URIs
            const timeout = setTimeout(() => {
                reject(new Error('Image loading timeout - please try selecting the image again'));
            }, IMAGE_LOADING.TIMEOUT_MS);

            img.onload = () => {
                clearTimeout(timeout);
                resolve({ image: img, dataUrl });
            };

            img.onerror = (error) => {
                clearTimeout(timeout);
                console.error('Image load error:', error);
                reject(new Error('Failed to load image - please try selecting it again'));
            };

            img.src = dataUrl;
        };

        reader.onerror = (error) => {
            console.error('FileReader error:', error);
            reject(new Error('Failed to read file'));
        };

        // Start reading the file
        try {
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('FileReader readAsDataURL error:', error);
            reject(new Error('Failed to start reading file'));
        }
    });
}

export function loadImageFromUrl(url: string): Promise<{ image: HTMLImageElement; dataUrl: string }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            // Convert to data URL
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Failed to create canvas context'));
                return;
            }
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/png');
            resolve({ image: img, dataUrl });
        };

        img.onerror = () => {
            reject(new Error('Failed to load image from URL'));
        };

        img.src = url;
    });
}

export function validateImageFile(file: File): boolean {
    const validTypes = FILE_VALIDATION.ALLOWED_TYPES;
    return validTypes.includes(file.type as typeof validTypes[number]);
}

export function getImageDimensions(image: HTMLImageElement): { width: number; height: number } {
    return {
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height,
    };
}
