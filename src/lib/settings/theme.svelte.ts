export interface ThemeOption {
  id: string;
  name: string;
  type: "light" | "dark";
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    base: string;
  };
}

export interface FontOption {
  id: string;
  name: string;
  category: "Sans-Serif" | "Monospace" | "Serif" | "Display";
  fontFamily: string;
  description: string;
  sample: string;
}

export const THEME_PRESETS: ThemeOption[] = [
  {
    id: "light",
    name: "Light",
    type: "light",
    description: "Clean and bright default light theme",
    colors: {
      primary: "#4f46e5",
      secondary: "#7c3aed",
      accent: "#06b6d4",
      neutral: "#1f2937",
      base: "#ffffff",
    },
  },
  {
    id: "dark",
    name: "Dark",
    type: "dark",
    description: "Sleek and easy on the eyes default dark theme",
    colors: {
      primary: "#6366f1",
      secondary: "#a855f7",
      accent: "#22d3ee",
      neutral: "#1f2937",
      base: "#1d232a",
    },
  },
  {
    id: "cupcake",
    name: "Cupcake",
    type: "light",
    description: "Soft pastel colors with sweet aesthetic",
    colors: {
      primary: "#65c3c8",
      secondary: "#ef9fbc",
      accent: "#eeaf3a",
      neutral: "#291ec4",
      base: "#faf7f5",
    },
  },
  {
    id: "nord",
    name: "Nord",
    type: "light",
    description: "Arctic, north-bluish palette",
    colors: {
      primary: "#5e81ac",
      secondary: "#81a1c1",
      accent: "#88c0d0",
      neutral: "#4c566a",
      base: "#eceff4",
    },
  },
  {
    id: "emerald",
    name: "Emerald",
    type: "light",
    description: "Fresh and professional emerald green accents",
    colors: {
      primary: "#66cc8a",
      secondary: "#377cfb",
      accent: "#ea5234",
      neutral: "#333c4d",
      base: "#ffffff",
    },
  },
  {
    id: "retro",
    name: "Retro",
    type: "light",
    description: "Vintage warm paper aesthetic",
    colors: {
      primary: "#ef9995",
      secondary: "#a4cbb4",
      accent: "#ebdc99",
      neutral: "#7d7259",
      base: "#e4d8b4",
    },
  },
  {
    id: "dracula",
    name: "Dracula",
    type: "dark",
    description: "Vibrant gothic dark palette",
    colors: {
      primary: "#ff79c6",
      secondary: "#bd93f9",
      accent: "#ffb86c",
      neutral: "#414458",
      base: "#282a36",
    },
  },
  {
    id: "synthwave",
    name: "Synthwave",
    type: "dark",
    description: "Neon 80s cyberpunk glow",
    colors: {
      primary: "#e779c1",
      secondary: "#58c7f3",
      accent: "#f3cc30",
      neutral: "#20134e",
      base: "#1a103c",
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    type: "light",
    description: "High-contrast yellow & bold colors",
    colors: {
      primary: "#ff7598",
      secondary: "#75d1f0",
      accent: "#c075f0",
      neutral: "#111111",
      base: "#fff200",
    },
  },
  {
    id: "dim",
    name: "Dim",
    type: "dark",
    description: "Muted dark mode for reduced eye fatigue",
    colors: {
      primary: "#9fe88d",
      secondary: "#ff7d7d",
      accent: "#f7c948",
      neutral: "#2a323c",
      base: "#2a303c",
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    type: "dark",
    description: "Warm evening gradient tones",
    colors: {
      primary: "#ff6e6c",
      secondary: "#f7a325",
      accent: "#10b981",
      neutral: "#1a1d24",
      base: "#121c24",
    },
  },
  {
    id: "coffee",
    name: "Coffee",
    type: "dark",
    description: "Rich dark espresso and warm mocha",
    colors: {
      primary: "#db924b",
      secondary: "#263e3f",
      accent: "#10576d",
      neutral: "#120b0e",
      base: "#20161f",
    },
  },
];

export const FONT_PRESETS: FontOption[] = [
  {
    id: "inter",
    name: "Inter",
    category: "Sans-Serif",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    description: "Clean, modern, highly legible sans-serif font designed for digital screens.",
    sample: "Komorebi • Modern Anime & Manga Desktop",
  },
  {
    id: "jakarta",
    name: "Plus Jakarta Sans",
    category: "Sans-Serif",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    description: "Sleek geometric typography with bold structure and fresh aesthetics.",
    sample: "Komorebi • Modern Anime & Manga Desktop",
  },
  {
    id: "outfit",
    name: "Outfit",
    category: "Sans-Serif",
    fontFamily: "'Outfit', sans-serif",
    description: "Contemporary geometric sans-serif built for bold headers and clean interfaces.",
    sample: "Komorebi • Modern Anime & Manga Desktop",
  },
  {
    id: "nunito",
    name: "Nunito",
    category: "Sans-Serif",
    fontFamily: "'Nunito', sans-serif",
    description: "Rounded curves delivering a warm, approachable, and friendly reading feel.",
    sample: "Komorebi • Modern Anime & Manga Desktop",
  },
  {
    id: "jetbrains",
    name: "JetBrains Mono",
    category: "Monospace",
    fontFamily: "'JetBrains Mono', monospace",
    description: "High-performance developer monospace font with distinct character shapes.",
    sample: "Komorebi • Modern Anime & Manga Desktop",
  },
  {
    id: "fira-code",
    name: "Fira Code",
    category: "Monospace",
    fontFamily: "'Fira Code', monospace",
    description: "Popular monospaced font with clean ligatures and technical clarity.",
    sample: "Komorebi • Modern Anime & Manga Desktop",
  },
  {
    id: "playfair",
    name: "Playfair Display",
    category: "Serif",
    fontFamily: "'Playfair Display', Georgia, serif",
    description: "High-contrast serif typeface providing editorial elegance and style.",
    sample: "Komorebi • Modern Anime & Manga Desktop",
  },
  {
    id: "space-grotesk",
    name: "Space Grotesk",
    category: "Display",
    fontFamily: "'Space Grotesk', sans-serif",
    description: "Tech-inspired proportional display font with quirky futuristic charm.",
    sample: "Komorebi • Modern Anime & Manga Desktop",
  },
  {
    id: "system",
    name: "System Default",
    category: "Sans-Serif",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    description: "Native operating system font stack optimized for speed and familiarity.",
    sample: "Komorebi • Modern Anime & Manga Desktop",
  },
];

class ThemeManager {
  mode = $state<string>("system");
  resolvedTheme = $state<string>("dark");
  font = $state<string>("inter");

  get presets(): ThemeOption[] {
    return THEME_PRESETS;
  }

  get activePreset(): ThemeOption | undefined {
    return THEME_PRESETS.find((p) => p.id === this.resolvedTheme);
  }

  get fonts(): FontOption[] {
    return FONT_PRESETS;
  }

  get activeFont(): FontOption {
    return FONT_PRESETS.find((f) => f.id === this.font) || FONT_PRESETS[0];
  }

  init() {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("komorebi-theme") || "system";
    this.setMode(saved);

    const savedFont = localStorage.getItem("komorebi-font") || "inter";
    this.setFont(savedFont);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", () => {
      if (this.mode === "system") {
        this.applyTheme();
      }
    });
  }

  setMode(newMode: string) {
    this.mode = newMode;
    localStorage.setItem("komorebi-theme", newMode);
    this.applyTheme();
  }

  setFont(fontId: string) {
    this.font = fontId;
    localStorage.setItem("komorebi-font", fontId);
    this.applyFont();
  }

  resetFont() {
    this.setFont("inter");
  }

  private applyTheme() {
    let effective = this.mode;
    if (this.mode === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      effective = prefersDark ? "dark" : "light";
    }
    this.resolvedTheme = effective;
    document.documentElement.setAttribute("data-theme", effective);
  }

  private applyFont() {
    if (typeof window === "undefined") return;
    const preset = FONT_PRESETS.find((f) => f.id === this.font) || FONT_PRESETS[0];
    document.documentElement.style.setProperty("--app-font-family", preset.fontFamily);
    document.documentElement.setAttribute("data-font", preset.id);
  }
}

export const themeManager = new ThemeManager();
