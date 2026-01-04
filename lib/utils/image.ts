export function loadImageFromFile(file: File | Blob): Promise<{ image: HTMLImageElement; dataUrl: string }> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            const img = new Image();

            img.onload = () => {
                resolve({ image: img, dataUrl });
            };

            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };

            img.src = dataUrl;
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsDataURL(file);
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
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    return validTypes.includes(file.type);
}

export function getImageDimensions(image: HTMLImageElement): { width: number; height: number } {
    return {
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height,
    };
}
