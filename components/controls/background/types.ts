// Background picker types and constants

export const FREE_SOLID_COLORS = 24;    // First 24 out of 72
export const FREE_GRADIENTS = 20;       // First 20 out of 78
export const FREE_MESH_GRADIENTS = 5;   // First 5 out of 15+
export const FREE_FONTS = 10;           // First 10 fonts (Popular category)
export const MAX_LOGO_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface ColorButtonProps {
    color: string;
    isSelected: boolean;
    isPremium: boolean;
    onClick: () => void;
}

export interface GradientPresetButtonProps {
    gradient: { name: string; colors: [string, string]; angle: number };
    isSelected: boolean;
    isPremium: boolean;
    onClick: () => void;
}

export interface MeshGradientButtonProps {
    mesh: { name: string; css: string };
    isSelected: boolean;
    isPremium: boolean;
    onClick: () => void;
}

export interface FontButtonProps {
    font: { name: string; fontFamily: string };
    isSelected: boolean;
    isPremium: boolean;
    onClick: () => void;
}
