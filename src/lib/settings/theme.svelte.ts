export interface ThemeOption {
  id: string;
  name: string;
  type: 'light' | 'dark';
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    base: string;
  };
}

export const THEME_PRESETS: ThemeOption[] = [
  {
    id: 'light',
    name: 'Light',
    type: 'light',
    description: 'Clean and bright default light theme',
    colors: { primary: '#4f46e5', secondary: '#7c3aed', accent: '#06b6d4', neutral: '#1f2937', base: '#ffffff' },
  },
  {
    id: 'dark',
    name: 'Dark',
    type: 'dark',
    description: 'Sleek and easy on the eyes default dark theme',
    colors: { primary: '#6366f1', secondary: '#a855f7', accent: '#22d3ee', neutral: '#1f2937', base: '#1d232a' },
  },
  {
    id: 'cupcake',
    name: 'Cupcake',
    type: 'light',
    description: 'Soft pastel colors with sweet aesthetic',
    colors: { primary: '#65c3c8', secondary: '#ef9fbc', accent: '#eeaf3a', neutral: '#291ec4', base: '#faf7f5' },
  },
  {
    id: 'nord',
    name: 'Nord',
    type: 'light',
    description: 'Arctic, north-bluish palette',
    colors: { primary: '#5e81ac', secondary: '#81a1c1', accent: '#88c0d0', neutral: '#4c566a', base: '#eceff4' },
  },
  {
    id: 'emerald',
    name: 'Emerald',
    type: 'light',
    description: 'Fresh and professional emerald green accents',
    colors: { primary: '#66cc8a', secondary: '#377cfb', accent: '#ea5234', neutral: '#333c4d', base: '#ffffff' },
  },
  {
    id: 'retro',
    name: 'Retro',
    type: 'light',
    description: 'Vintage warm paper aesthetic',
    colors: { primary: '#ef9995', secondary: '#a4cbb4', accent: '#ebdc99', neutral: '#7d7259', base: '#e4d8b4' },
  },
  {
    id: 'dracula',
    name: 'Dracula',
    type: 'dark',
    description: 'Vibrant gothic dark palette',
    colors: { primary: '#ff79c6', secondary: '#bd93f9', accent: '#ffb86c', neutral: '#414458', base: '#282a36' },
  },
  {
    id: 'synthwave',
    name: 'Synthwave',
    type: 'dark',
    description: 'Neon 80s cyberpunk glow',
    colors: { primary: '#e779c1', secondary: '#58c7f3', accent: '#f3cc30', neutral: '#20134e', base: '#1a103c' },
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    type: 'light',
    description: 'High-contrast yellow & bold colors',
    colors: { primary: '#ff7598', secondary: '#75d1f0', accent: '#c075f0', neutral: '#111111', base: '#fff200' },
  },
  {
    id: 'dim',
    name: 'Dim',
    type: 'dark',
    description: 'Muted dark mode for reduced eye fatigue',
    colors: { primary: '#9fe88d', secondary: '#ff7d7d', accent: '#f7c948', neutral: '#2a323c', base: '#2a303c' },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    type: 'dark',
    description: 'Warm evening gradient tones',
    colors: { primary: '#ff6e6c', secondary: '#f7a325', accent: '#10b981', neutral: '#1a1d24', base: '#121c24' },
  },
  {
    id: 'coffee',
    name: 'Coffee',
    type: 'dark',
    description: 'Rich dark espresso and warm mocha',
    colors: { primary: '#db924b', secondary: '#263e3f', accent: '#10576d', neutral: '#120b0e', base: '#20161f' },
  },
];

class ThemeManager {
  mode = $state<string>('system');
  resolvedTheme = $state<string>('dark');

  get presets(): ThemeOption[] {
    return THEME_PRESETS;
  }

  get activePreset(): ThemeOption | undefined {
    return THEME_PRESETS.find((p) => p.id === this.resolvedTheme);
  }

  init() {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('komorebi-theme') || 'system';
    this.setMode(saved);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      if (this.mode === 'system') {
        this.applyTheme();
      }
    });
  }

  setMode(newMode: string) {
    this.mode = newMode;
    localStorage.setItem('komorebi-theme', newMode);
    this.applyTheme();
  }

  private applyTheme() {
    let effective = this.mode;
    if (this.mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      effective = prefersDark ? 'dark' : 'light';
    }
    this.resolvedTheme = effective;
    document.documentElement.setAttribute('data-theme', effective);
  }
}

export const themeManager = new ThemeManager();

