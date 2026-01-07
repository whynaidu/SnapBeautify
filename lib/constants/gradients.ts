import { GradientPreset, MeshGradient, TextPattern } from '@/types/editor';

export const PRESET_GRADIENTS: GradientPreset[] = [
    // ===== VIBRANT & ENERGETIC =====
    { name: "Sunset", colors: ["#f97316", "#ec4899"], angle: 135 },
    { name: "Ocean", colors: ["#0ea5e9", "#8b5cf6"], angle: 135 },
    { name: "Forest", colors: ["#22c55e", "#14b8a6"], angle: 135 },
    { name: "Candy", colors: ["#f472b6", "#c084fc"], angle: 135 },
    { name: "Fire", colors: ["#ef4444", "#f97316"], angle: 135 },
    { name: "Tropical", colors: ["#10b981", "#06b6d4"], angle: 135 },
    { name: "Volcano", colors: ["#dc2626", "#ea580c"], angle: 90 },
    { name: "Emerald", colors: ["#059669", "#10b981"], angle: 180 },
    { name: "Ruby", colors: ["#be123c", "#e11d48"], angle: 135 },
    { name: "Sapphire", colors: ["#1e40af", "#3b82f6"], angle: 135 },

    // ===== NEON & ELECTRIC =====
    { name: "Cyber Pink", colors: ["#ff00ff", "#00ffff"], angle: 135 },
    { name: "Electric Blue", colors: ["#0000ff", "#00ff00"], angle: 90 },
    { name: "Neon Sunset", colors: ["#ff0080", "#ff8c00"], angle: 135 },
    { name: "Laser Lime", colors: ["#00ff00", "#ffff00"], angle: 180 },
    { name: "Hot Pink", colors: ["#ff1493", "#ff69b4"], angle: 135 },
    { name: "Acid", colors: ["#adff2f", "#00ff7f"], angle: 90 },
    { name: "Plasma", colors: ["#9d00ff", "#ff00de"], angle: 135 },
    { name: "Neon Nights", colors: ["#7928ca", "#ff0080"], angle: 135 },

    // ===== PROFESSIONAL & CORPORATE =====
    { name: "Midnight", colors: ["#1e293b", "#0f172a"], angle: 180 },
    { name: "Slate", colors: ["#334155", "#1e293b"], angle: 180 },
    { name: "Purple Haze", colors: ["#7c3aed", "#4f46e5"], angle: 135 },
    { name: "Royal", colors: ["#6366f1", "#8b5cf6"], angle: 135 },
    { name: "Corporate", colors: ["#3b82f6", "#1d4ed8"], angle: 180 },
    { name: "Executive", colors: ["#1f2937", "#374151"], angle: 180 },
    { name: "Navy", colors: ["#1e3a8a", "#1e40af"], angle: 135 },
    { name: "Steel", colors: ["#475569", "#64748b"], angle: 180 },
    { name: "Carbon", colors: ["#18181b", "#3f3f46"], angle: 180 },
    { name: "Professional", colors: ["#164e63", "#0e7490"], angle: 135 },

    // ===== PASTEL & SOFT =====
    { name: "Cotton Candy", colors: ["#fce7f3", "#ddd6fe"], angle: 135 },
    { name: "Mint", colors: ["#d1fae5", "#a7f3d0"], angle: 135 },
    { name: "Lavender", colors: ["#ede9fe", "#ddd6fe"], angle: 135 },
    { name: "Peach", colors: ["#fed7aa", "#fecaca"], angle: 135 },
    { name: "Sky", colors: ["#e0f2fe", "#bae6fd"], angle: 180 },
    { name: "Blush", colors: ["#fce7f3", "#fbcfe8"], angle: 135 },
    { name: "Cream", colors: ["#fef3c7", "#fde68a"], angle: 180 },
    { name: "Rose", colors: ["#ffe4e6", "#fecdd3"], angle: 135 },
    { name: "Baby Blue", colors: ["#dbeafe", "#bfdbfe"], angle: 180 },
    { name: "Lilac", colors: ["#f3e8ff", "#e9d5ff"], angle: 135 },

    // ===== DARK MODE OPTIMIZED =====
    { name: "Charcoal", colors: ["#18181b", "#27272a"], angle: 180 },
    { name: "Obsidian", colors: ["#09090b", "#18181b"], angle: 180 },
    { name: "Deep Space", colors: ["#020617", "#0f172a"], angle: 180 },
    { name: "Noir", colors: ["#171717", "#262626"], angle: 180 },
    { name: "Graphite", colors: ["#1f2937", "#111827"], angle: 180 },
    { name: "Onyx", colors: ["#000000", "#18181b"], angle: 180 },
    { name: "Shadow", colors: ["#0c0a09", "#1c1917"], angle: 180 },
    { name: "Abyss", colors: ["#030712", "#111827"], angle: 180 },

    // ===== WARM TONES =====
    { name: "Autumn", colors: ["#ea580c", "#b45309"], angle: 135 },
    { name: "Golden Hour", colors: ["#fbbf24", "#f59e0b"], angle: 135 },
    { name: "Terracotta", colors: ["#dc2626", "#b91c1c"], angle: 135 },
    { name: "Amber", colors: ["#f59e0b", "#d97706"], angle: 135 },
    { name: "Copper", colors: ["#c2410c", "#ea580c"], angle: 135 },
    { name: "Bronze", colors: ["#92400e", "#b45309"], angle: 135 },
    { name: "Honey", colors: ["#fde047", "#fbbf24"], angle: 135 },
    { name: "Caramel", colors: ["#d97706", "#b45309"], angle: 135 },

    // ===== COOL TONES =====
    { name: "Arctic", colors: ["#0891b2", "#06b6d4"], angle: 180 },
    { name: "Glacier", colors: ["#0369a1", "#0891b2"], angle: 180 },
    { name: "Ice", colors: ["#67e8f9", "#a5f3fc"], angle: 180 },
    { name: "Teal", colors: ["#14b8a6", "#0d9488"], angle: 135 },
    { name: "Cyan", colors: ["#06b6d4", "#0891b2"], angle: 135 },
    { name: "Aqua", colors: ["#22d3ee", "#06b6d4"], angle: 135 },
    { name: "Pool", colors: ["#67e8f9", "#22d3ee"], angle: 135 },

    // ===== NATURE INSPIRED =====
    { name: "Moss", colors: ["#65a30d", "#84cc16"], angle: 135 },
    { name: "Jungle", colors: ["#15803d", "#16a34a"], angle: 135 },
    { name: "Leaf", colors: ["#22c55e", "#4ade80"], angle: 135 },
    { name: "Lime", colors: ["#84cc16", "#a3e635"], angle: 135 },
    { name: "Sage", colors: ["#a3e635", "#d9f99d"], angle: 135 },
    { name: "Pine", colors: ["#14532d", "#166534"], angle: 135 },

    // ===== MODERN & TRENDY =====
    { name: "Instagram", colors: ["#f9ce34", "#ee2a7b"], angle: 135 },
    { name: "Discord", colors: ["#5865f2", "#7289da"], angle: 135 },
    { name: "Spotify", colors: ["#1db954", "#1ed760"], angle: 135 },
    { name: "Synthwave", colors: ["#ff00ff", "#00ffff"], angle: 135 },
    { name: "Vaporwave", colors: ["#ff71ce", "#01cdfe"], angle: 135 },
    { name: "Cyberpunk", colors: ["#fcee09", "#ff006e"], angle: 135 },
    { name: "Miami", colors: ["#ff0a78", "#ffd200"], angle: 135 },
    { name: "Retro", colors: ["#ff6b6b", "#4ecdc4"], angle: 135 },

    // ===== SUNSET & SUNRISE =====
    { name: "Dusk", colors: ["#ff6b9d", "#c94b4b"], angle: 135 },
    { name: "Dawn", colors: ["#f093fb", "#f5576c"], angle: 135 },
    { name: "Twilight", colors: ["#667eea", "#764ba2"], angle: 135 },
    { name: "Horizon", colors: ["#ff9966", "#ff5e62"], angle: 180 },
    { name: "Magic Hour", colors: ["#fa709a", "#fee140"], angle: 135 },

    // ===== LUXURY & PREMIUM =====
    { name: "Gold", colors: ["#fbbf24", "#f59e0b"], angle: 135 },
    { name: "Platinum", colors: ["#cbd5e1", "#94a3b8"], angle: 180 },
    { name: "Diamond", colors: ["#e2e8f0", "#cbd5e1"], angle: 135 },
    { name: "Crown", colors: ["#eab308", "#ca8a04"], angle: 135 },
    { name: "Velvet", colors: ["#6b21a8", "#581c87"], angle: 135 },
];

export const SOLID_COLORS: string[] = [
    // ===== WHITES & LIGHT GRAYS =====
    "#ffffff", "#fefefe", "#fafafa", "#f8fafc",
    "#f1f5f9", "#e2e8f0", "#cbd5e1", "#94a3b8",

    // ===== DARK GRAYS & BLACKS =====
    "#64748b", "#475569", "#334155", "#1e293b",
    "#0f172a", "#020617", "#09090b", "#000000",

    // ===== REDS =====
    "#fecaca", "#fca5a5", "#f87171", "#ef4444",
    "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d",

    // ===== ORANGES =====
    "#fed7aa", "#fdba74", "#fb923c", "#f97316",
    "#ea580c", "#c2410c", "#9a3412", "#7c2d12",

    // ===== YELLOWS =====
    "#fef3c7", "#fde68a", "#fde047", "#facc15",
    "#eab308", "#ca8a04", "#a16207", "#854d0e",

    // ===== GREENS =====
    "#d1fae5", "#a7f3d0", "#6ee7b7", "#34d399",
    "#10b981", "#059669", "#047857", "#065f46",

    // ===== BLUES =====
    "#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa",
    "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af",

    // ===== PURPLES =====
    "#f3e8ff", "#e9d5ff", "#d8b4fe", "#c084fc",
    "#a855f7", "#9333ea", "#7e22ce", "#6b21a8",

    // ===== PINKS =====
    "#fce7f3", "#fbcfe8", "#f9a8d4", "#f472b6",
    "#ec4899", "#db2777", "#be185d", "#9f1239",

    // ===== CYANS & TEALS =====
    "#cffafe", "#a5f3fc", "#67e8f9", "#22d3ee",
    "#06b6d4", "#0891b2", "#0e7490", "#155e75",
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
    {
        name: "Lava",
        css: "radial-gradient(at 30% 20%, #dc2626 0px, transparent 50%), radial-gradient(at 70% 30%, #ea580c 0px, transparent 50%), radial-gradient(at 20% 80%, #b91c1c 0px, transparent 50%), radial-gradient(at 80% 70%, #f97316 0px, transparent 50%)"
    },
    {
        name: "Northern Lights",
        css: "radial-gradient(at 10% 10%, #10b981 0px, transparent 50%), radial-gradient(at 90% 20%, #3b82f6 0px, transparent 50%), radial-gradient(at 30% 70%, #8b5cf6 0px, transparent 50%), radial-gradient(at 70% 90%, #06b6d4 0px, transparent 50%)"
    },
    {
        name: "Cotton Candy",
        css: "radial-gradient(at 20% 30%, #f472b6 0px, transparent 50%), radial-gradient(at 80% 20%, #c084fc 0px, transparent 50%), radial-gradient(at 50% 80%, #a78bfa 0px, transparent 50%), radial-gradient(at 90% 90%, #fbcfe8 0px, transparent 50%)"
    },
    {
        name: "Matrix",
        css: "radial-gradient(at 10% 20%, #15803d 0px, transparent 50%), radial-gradient(at 90% 10%, #166534 0px, transparent 50%), radial-gradient(at 40% 70%, #14532d 0px, transparent 50%), radial-gradient(at 80% 80%, #22c55e 0px, transparent 50%)"
    },
    {
        name: "Peacock",
        css: "radial-gradient(at 30% 20%, #0891b2 0px, transparent 50%), radial-gradient(at 70% 30%, #8b5cf6 0px, transparent 50%), radial-gradient(at 20% 70%, #14b8a6 0px, transparent 50%), radial-gradient(at 80% 80%, #06b6d4 0px, transparent 50%)"
    },
    {
        name: "Galaxy",
        css: "radial-gradient(at 20% 20%, #581c87 0px, transparent 50%), radial-gradient(at 80% 30%, #6b21a8 0px, transparent 50%), radial-gradient(at 40% 80%, #1e1b4b 0px, transparent 50%), radial-gradient(at 70% 70%, #7c3aed 0px, transparent 50%)"
    },
    {
        name: "Mint Chocolate",
        css: "radial-gradient(at 30% 30%, #10b981 0px, transparent 50%), radial-gradient(at 70% 20%, #1f2937 0px, transparent 50%), radial-gradient(at 20% 80%, #059669 0px, transparent 50%), radial-gradient(at 80% 70%, #374151 0px, transparent 50%)"
    },
    {
        name: "Sunset Beach",
        css: "radial-gradient(at 10% 90%, #f59e0b 0px, transparent 50%), radial-gradient(at 50% 50%, #f97316 0px, transparent 50%), radial-gradient(at 90% 10%, #ec4899 0px, transparent 50%), radial-gradient(at 70% 70%, #f472b6 0px, transparent 50%)"
    },
    {
        name: "Forest Mist",
        css: "radial-gradient(at 20% 20%, #065f46 0px, transparent 50%), radial-gradient(at 80% 30%, #047857 0px, transparent 50%), radial-gradient(at 30% 80%, #6ee7b7 0px, transparent 50%), radial-gradient(at 70% 70%, #10b981 0px, transparent 50%)"
    },
    {
        name: "Cyber",
        css: "radial-gradient(at 30% 20%, #ff00ff 0px, transparent 50%), radial-gradient(at 70% 30%, #00ffff 0px, transparent 50%), radial-gradient(at 20% 80%, #7928ca 0px, transparent 50%), radial-gradient(at 80% 70%, #ff0080 0px, transparent 50%)"
    },
    {
        name: "Desert",
        css: "radial-gradient(at 20% 30%, #f97316 0px, transparent 50%), radial-gradient(at 80% 20%, #fbbf24 0px, transparent 50%), radial-gradient(at 40% 80%, #b45309 0px, transparent 50%), radial-gradient(at 70% 70%, #ea580c 0px, transparent 50%)"
    },
    {
        name: "Unicorn",
        css: "radial-gradient(at 20% 20%, #ec4899 0px, transparent 50%), radial-gradient(at 80% 30%, #8b5cf6 0px, transparent 50%), radial-gradient(at 30% 80%, #06b6d4 0px, transparent 50%), radial-gradient(at 70% 70%, #f472b6 0px, transparent 50%)"
    },
    {
        name: "Monochrome",
        css: "radial-gradient(at 30% 20%, #64748b 0px, transparent 50%), radial-gradient(at 70% 30%, #475569 0px, transparent 50%), radial-gradient(at 20% 80%, #334155 0px, transparent 50%), radial-gradient(at 80% 70%, #94a3b8 0px, transparent 50%)"
    },
    {
        name: "Electric Storm",
        css: "radial-gradient(at 10% 10%, #6366f1 0px, transparent 50%), radial-gradient(at 90% 20%, #8b5cf6 0px, transparent 50%), radial-gradient(at 30% 90%, #3b82f6 0px, transparent 50%), radial-gradient(at 70% 70%, #a855f7 0px, transparent 50%)"
    },
    {
        name: "Blossom",
        css: "radial-gradient(at 20% 30%, #fda4af 0px, transparent 50%), radial-gradient(at 80% 20%, #f9a8d4 0px, transparent 50%), radial-gradient(at 40% 80%, #fbcfe8 0px, transparent 50%), radial-gradient(at 70% 70%, #fecdd3 0px, transparent 50%)"
    },
    {
        name: "Arctic Aurora",
        css: "radial-gradient(at 30% 20%, #06b6d4 0px, transparent 50%), radial-gradient(at 70% 30%, #3b82f6 0px, transparent 50%), radial-gradient(at 20% 80%, #22d3ee 0px, transparent 50%), radial-gradient(at 80% 70%, #0ea5e9 0px, transparent 50%)"
    },
];

export const TEXT_PATTERNS: TextPattern[] = [
    // Professional & Business
    { name: "Invoice", text: "INVOICE", colors: ["#1e40af", "#3b82f6"], angle: 135, textColor: "#ffffff", textOpacity: 0.08 },
    { name: "Project", text: "PROJECT", colors: ["#7c3aed", "#a855f7"], angle: 135, textColor: "#ffffff", textOpacity: 0.08 },
    { name: "Portfolio", text: "PORTFOLIO", colors: ["#6366f1", "#8b5cf6"], angle: 135, textColor: "#ffffff", textOpacity: 0.1 },
    { name: "Proposal", text: "PROPOSAL", colors: ["#0891b2", "#06b6d4"], angle: 135, textColor: "#ffffff", textOpacity: 0.08 },
    { name: "Report", text: "REPORT", colors: ["#475569", "#64748b"], angle: 180, textColor: "#ffffff", textOpacity: 0.07 },
    { name: "Document", text: "DOCUMENT", colors: ["#334155", "#475569"], angle: 180, textColor: "#ffffff", textOpacity: 0.08 },

    // Creative & Design
    { name: "Welcome", text: "WELCOME", colors: ["#f472b6", "#c084fc"], angle: 135, textColor: "#ffffff", textOpacity: 0.1 },
    { name: "Creative", text: "CREATIVE", colors: ["#ec4899", "#8b5cf6"], angle: 135, textColor: "#ffffff", textOpacity: 0.1 },
    { name: "Design", text: "DESIGN", colors: ["#8b5cf6", "#6366f1"], angle: 135, textColor: "#ffffff", textOpacity: 0.09 },
    { name: "Studio", text: "STUDIO", colors: ["#4f46e5", "#6366f1"], angle: 135, textColor: "#ffffff", textOpacity: 0.08 },
    { name: "Modern", text: "MODERN", colors: ["#06b6d4", "#8b5cf6"], angle: 135, textColor: "#ffffff", textOpacity: 0.09 },
    { name: "Brand", text: "BRAND", colors: ["#f97316", "#ec4899"], angle: 135, textColor: "#ffffff", textOpacity: 0.1 },

    // Marketing & Social
    { name: "Launch", text: "LAUNCH", colors: ["#ef4444", "#f97316"], angle: 135, textColor: "#ffffff", textOpacity: 0.1 },
    { name: "Announce", text: "ANNOUNCE", colors: ["#f59e0b", "#eab308"], angle: 135, textColor: "#ffffff", textOpacity: 0.09 },
    { name: "Event", text: "EVENT", colors: ["#22c55e", "#14b8a6"], angle: 135, textColor: "#ffffff", textOpacity: 0.09 },
    { name: "Success", text: "SUCCESS", colors: ["#10b981", "#06b6d4"], angle: 135, textColor: "#ffffff", textOpacity: 0.09 },
    { name: "Trending", text: "TRENDING", colors: ["#ff0080", "#ff8c00"], angle: 135, textColor: "#ffffff", textOpacity: 0.1 },
    { name: "Viral", text: "VIRAL", colors: ["#ff00ff", "#00ffff"], angle: 135, textColor: "#ffffff", textOpacity: 0.1 },

    // Tech & Innovation
    { name: "Tech", text: "TECH", colors: ["#1e3a8a", "#3b82f6"], angle: 135, textColor: "#ffffff", textOpacity: 0.08 },
    { name: "Digital", text: "DIGITAL", colors: ["#6366f1", "#8b5cf6"], angle: 135, textColor: "#ffffff", textOpacity: 0.09 },
    { name: "Innovation", text: "INNOVATION", colors: ["#0ea5e9", "#8b5cf6"], angle: 135, textColor: "#ffffff", textOpacity: 0.08 },
    { name: "Future", text: "FUTURE", colors: ["#7c3aed", "#ec4899"], angle: 135, textColor: "#ffffff", textOpacity: 0.09 },
    { name: "AI", text: "AI", colors: ["#4f46e5", "#ec4899"], angle: 135, textColor: "#ffffff", textOpacity: 0.12 },
    { name: "Code", text: "CODE", colors: ["#14b8a6", "#22c55e"], angle: 135, textColor: "#ffffff", textOpacity: 0.09 },

    // Motivational
    { name: "Dream", text: "DREAM", colors: ["#f472b6", "#fbbf24"], angle: 135, textColor: "#ffffff", textOpacity: 0.1 },
    { name: "Believe", text: "BELIEVE", colors: ["#8b5cf6", "#06b6d4"], angle: 135, textColor: "#ffffff", textOpacity: 0.09 },
    { name: "Inspire", text: "INSPIRE", colors: ["#f97316", "#ec4899"], angle: 135, textColor: "#ffffff", textOpacity: 0.1 },
    { name: "Achieve", text: "ACHIEVE", colors: ["#22c55e", "#10b981"], angle: 135, textColor: "#ffffff", textOpacity: 0.09 },
    { name: "Grow", text: "GROW", colors: ["#84cc16", "#22c55e"], angle: 135, textColor: "#ffffff", textOpacity: 0.1 },
    { name: "Focus", text: "FOCUS", colors: ["#0891b2", "#06b6d4"], angle: 135, textColor: "#ffffff", textOpacity: 0.09 },

    // Seasonal & Events
    { name: "Summer", text: "SUMMER", colors: ["#f59e0b", "#f97316"], angle: 135, textColor: "#ffffff", textOpacity: 0.1 },
    { name: "Winter", text: "WINTER", colors: ["#0ea5e9", "#06b6d4"], angle: 135, textColor: "#ffffff", textOpacity: 0.09 },
    { name: "Spring", text: "SPRING", colors: ["#22c55e", "#84cc16"], angle: 135, textColor: "#ffffff", textOpacity: 0.1 },
    { name: "Holiday", text: "HOLIDAY", colors: ["#dc2626", "#22c55e"], angle: 135, textColor: "#ffffff", textOpacity: 0.09 },
    { name: "Party", text: "PARTY", colors: ["#ec4899", "#f97316"], angle: 135, textColor: "#ffffff", textOpacity: 0.11 },
    { name: "Celebrate", text: "CELEBRATE", colors: ["#eab308", "#f97316"], angle: 135, textColor: "#ffffff", textOpacity: 0.09 },
];
