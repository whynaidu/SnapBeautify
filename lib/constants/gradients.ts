import { GradientPreset, MeshGradient } from '@/types/editor';

export const PRESET_GRADIENTS: GradientPreset[] = [
    // Vibrant
    { name: "Sunset", colors: ["#f97316", "#ec4899"], angle: 135 },
    { name: "Ocean", colors: ["#0ea5e9", "#8b5cf6"], angle: 135 },
    { name: "Forest", colors: ["#22c55e", "#14b8a6"], angle: 135 },
    { name: "Candy", colors: ["#f472b6", "#c084fc"], angle: 135 },
    { name: "Fire", colors: ["#ef4444", "#f97316"], angle: 135 },

    // Professional
    { name: "Midnight", colors: ["#1e293b", "#0f172a"], angle: 180 },
    { name: "Slate", colors: ["#334155", "#1e293b"], angle: 180 },
    { name: "Purple Haze", colors: ["#7c3aed", "#4f46e5"], angle: 135 },
    { name: "Royal", colors: ["#6366f1", "#8b5cf6"], angle: 135 },
    { name: "Corporate", colors: ["#3b82f6", "#1d4ed8"], angle: 180 },

    // Soft & Pastel
    { name: "Cotton Candy", colors: ["#fce7f3", "#ddd6fe"], angle: 135 },
    { name: "Mint", colors: ["#d1fae5", "#a7f3d0"], angle: 135 },
    { name: "Lavender", colors: ["#ede9fe", "#ddd6fe"], angle: 135 },
    { name: "Peach", colors: ["#fed7aa", "#fecaca"], angle: 135 },
    { name: "Sky", colors: ["#e0f2fe", "#bae6fd"], angle: 180 },

    // Dark Mode Optimized
    { name: "Charcoal", colors: ["#18181b", "#27272a"], angle: 180 },
    { name: "Obsidian", colors: ["#09090b", "#18181b"], angle: 180 },
    { name: "Deep Space", colors: ["#020617", "#0f172a"], angle: 180 },
    { name: "Noir", colors: ["#171717", "#262626"], angle: 180 },
    { name: "Graphite", colors: ["#1f2937", "#111827"], angle: 180 },
];

export const SOLID_COLORS: string[] = [
    "#ffffff", "#f8fafc", "#f1f5f9", "#e2e8f0", // Whites & Grays
    "#0f172a", "#1e293b", "#334155", "#000000", // Dark
    "#ef4444", "#f97316", "#eab308", "#22c55e", // Vibrant
    "#0ea5e9", "#6366f1", "#8b5cf6", "#ec4899", // Cool
];

export const MESH_GRADIENTS: MeshGradient[] = [
    {
        name: "Aurora",
        css: "radial-gradient(at 40% 20%, #4f46e5 0px, transparent 50%), radial-gradient(at 80% 0%, #f472b6 0px, transparent 50%), radial-gradient(at 0% 50%, #0ea5e9 0px, transparent 50%), radial-gradient(at 80% 50%, #22c55e 0px, transparent 50%), radial-gradient(at 0% 100%, #f97316 0px, transparent 50%), radial-gradient(at 80% 100%, #8b5cf6 0px, transparent 50%)"
    },
    {
        name: "Cosmic",
        css: "radial-gradient(at 0% 0%, #1e3a8a 0px, transparent 50%), radial-gradient(at 100% 0%, #7c3aed 0px, transparent 50%), radial-gradient(at 100% 100%, #ec4899 0px, transparent 50%), radial-gradient(at 0% 100%, #0891b2 0px, transparent 50%)"
    },
    {
        name: "Nebula",
        css: "radial-gradient(at 20% 30%, #8b5cf6 0px, transparent 50%), radial-gradient(at 80% 20%, #ec4899 0px, transparent 50%), radial-gradient(at 40% 80%, #06b6d4 0px, transparent 50%), radial-gradient(at 90% 90%, #f97316 0px, transparent 50%)"
    },
    {
        name: "Twilight",
        css: "radial-gradient(at 0% 0%, #1e1b4b 0px, transparent 50%), radial-gradient(at 50% 0%, #4c1d95 0px, transparent 50%), radial-gradient(at 100% 50%, #7c2d12 0px, transparent 50%), radial-gradient(at 50% 100%, #1e3a5f 0px, transparent 50%)"
    },
    {
        name: "Sunrise",
        css: "radial-gradient(at 0% 100%, #fbbf24 0px, transparent 50%), radial-gradient(at 50% 50%, #f97316 0px, transparent 50%), radial-gradient(at 100% 0%, #ef4444 0px, transparent 50%), radial-gradient(at 50% 0%, #7c3aed 0px, transparent 50%)"
    },
    {
        name: "Ocean Depths",
        css: "radial-gradient(at 20% 20%, #0891b2 0px, transparent 50%), radial-gradient(at 80% 30%, #0ea5e9 0px, transparent 50%), radial-gradient(at 40% 70%, #1e3a8a 0px, transparent 50%), radial-gradient(at 90% 80%, #22d3ee 0px, transparent 50%)"
    },
    {
        name: "Tropical",
        css: "radial-gradient(at 10% 20%, #22c55e 0px, transparent 50%), radial-gradient(at 90% 10%, #eab308 0px, transparent 50%), radial-gradient(at 50% 60%, #f97316 0px, transparent 50%), radial-gradient(at 80% 90%, #14b8a6 0px, transparent 50%)"
    },
    {
        name: "Midnight Blue",
        css: "radial-gradient(at 0% 0%, #1e40af 0px, transparent 50%), radial-gradient(at 100% 0%, #0c4a6e 0px, transparent 50%), radial-gradient(at 50% 100%, #312e81 0px, transparent 50%), radial-gradient(at 100% 100%, #0e7490 0px, transparent 50%)"
    },
];
