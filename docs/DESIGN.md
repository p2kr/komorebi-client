---
name: Komorebi Design System
description: >
  Production design specification for Komorebi Client, a desktop/web media library management dashboard built with Svelte 5, Tailwind CSS v4, and DaisyUI v5. Embedded with dynamic theme presets, high-density dashboard layouts, cursive brand identity accents ("Segoe Script"), modular sidebar drawer navigation, and accessible interactive state controls.
design_tokens:
  colors:
    primary: "#6366f1"
    secondary: "#a855f7"
    background: "#1d232a"
    surface: "#2a323c"
    text: "#a6adbb"
    accent: "#22d3ee"
  typography:
    font_family_sans: "ui-sans-serif, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji"
    font_family_mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace"
    font_family_brand: "'Segoe Script', 'Segoe Print', cursive, sans-serif"
    scale:
      xs: "12px/16px"
      sm: "14px/20px"
      base: "16px/24px"
      lg: "18px/28px"
      xl: "20px/28px"
  spacing:
    unit: "4px"
    scale: [1, 2, 3, 4, 5, 6, 8, 10, 12, 16]
  shapes:
    corner_radius_sm: "8px"
    corner_radius_md: "12px"
    corner_radius_lg: "16px"
---

# Overview & Aesthetic Summary

Komorebi (inspired by dappled sunlight filtering through trees) is a modern, high-density media management client. The design aesthetic balances utility-focused desktop application workflows with custom visual flair.

Key visual attributes:

- **Atmospheric Palette Flexibility**: Integrates 12 curated DaisyUI color presets (Dark, Light, Cupcake, Nord, Emerald, Retro, Dracula, Synthwave, Cyberpunk, Dim, Sunset, Coffee), with dark mode (`#1d232a`) as the default resolved baseline.
- **Organic & Technical Contrast**: Pairs clean, modern sans-serif functional UI elements (`system-ui`) with a signature decorative script typeface (`Segoe Script`) for top-level brand markers.
- **Tactile Depth & Radius System**: Employs layered surface elevation (`bg-base-100`, `bg-base-200`, `bg-base-300`) with generous pill/squircle geometry (`rounded-xl`, `rounded-2xl`) and hairline border contrast (`border-base-300`).
- **Micro-Interactions**: Features continuous state transitions (`duration-200`, `duration-300 ease-in-out`), customized delayed tooltips (`1s` hover delay), active state indicator glows, and smooth drawer expansion/collapse dynamics.

# Color System & Usage

The application uses DaisyUI semantic color abstractions mapped to Tailwind CSS variables:

- **Primary (`#6366f1`)**: Applied to active navigation items, primary call-to-action buttons (`btn-primary`), selected theme borders, and key brand highlights.
- **Secondary (`#a855f7`)**: Used for supportive interactive states, active badge indicator dots, and secondary decorative highlights.
- **Accent (`#22d3ee`)**: Used for specialized status indicators, analytical highlights, and tertiary badge accents.
- **Background (`#1d232a`)**: Global application container background (`bg-base-100` / `bg-base-200`), providing deep contrast for content containers.
- **Surface (`#2a323c`)**: Applied to elevated panels, sidebar drawers, navigation bars, dropdown cards, and modal backdrops (`bg-base-200`, `bg-base-300`).
- **Text (`#a6adbb`)**: Primary content readability color (`text-base-content`) with opacity modifiers (`text-base-content/70`, `text-base-content/60`, `text-base-content/50`) for visual hierarchy.

### Dynamic Preset Palette Matrix

| Theme Preset       | Primary   | Secondary | Accent    | Neutral   | Base      |
| :----------------- | :-------- | :-------- | :-------- | :-------- | :-------- |
| **Dark (Default)** | `#6366f1` | `#a855f7` | `#22d3ee` | `#1f2937` | `#1d232a` |
| **Light**          | `#4f46e5` | `#7c3aed` | `#06b6d4` | `#1f2937` | `#ffffff` |
| **Cupcake**        | `#65c3c8` | `#ef9fbc` | `#eeaf3a` | `#291ec4` | `#faf7f5` |
| **Nord**           | `#5e81ac` | `#81a1c1` | `#88c0d0` | `#4c566a` | `#eceff4` |
| **Emerald**        | `#66cc8a` | `#377cfb` | `#ea5234` | `#333c4d` | `#ffffff` |
| **Retro**          | `#ef9995` | `#a4cbb4` | `#ebdc99` | `#7d7259` | `#e4d8b4` |
| **Dracula**        | `#ff79c6` | `#bd93f9` | `#ffb86c` | `#414458` | `#282a36` |
| **Synthwave**      | `#e779c1` | `#58c7f3` | `#f3cc30` | `#20134e` | `#1a103c` |
| **Cyberpunk**      | `#ff7598` | `#75d1f0` | `#c075f0` | `#111111` | `#fff200` |
| **Dim**            | `#9fe88d` | `#ff7d7d` | `#f7c948` | `#2a323c` | `#2a303c` |
| **Sunset**         | `#ff6e6c` | `#f7a325` | `#10b981` | `#1a1d24` | `#121c24` |
| **Coffee**         | `#db924b` | `#263e3f` | `#10576d` | `#120b0e` | `#20161f` |

# Typography & Hierarchy

### Font Families

- **Sans (Default Body & UI)**: `ui-sans-serif, system-ui, sans-serif`
- **Monospace (Data / Tokens / Badges)**: `ui-monospace, SFMono-Regular, Consolas, monospace`
- **Brand Display Font**: `"Segoe Script", "Segoe Print", cursive, sans-serif` (`.font-segoe-script`)

### Type Scale & Hierarchy

- **Application Page Titles (`3xl` / `2xl`)**: `24px` to `30px` (`text-2xl sm:text-3xl`), `font-bold`, `tracking-tight`.
- **Section Headers (`lg`)**: `18px/28px`, `font-semibold`, `text-base-content`.
- **Subheaders & Card Headers (`base`)**: `16px/24px`, `font-bold` or `font-semibold`.
- **Body & Component Labels (`sm`)**: `14px/20px`, `font-medium` or `font-normal`.
- **Captions & Secondary Labels (`xs`)**: `12px/16px`, `text-base-content/70`.
- **Badges & Metadata (`11px` / `10px` / `9px` / `8px`)**: Monospace uppercase or bold pill tags (`font-mono text-[9px]`, `text-[10px] uppercase`).

# Layout & Spacing

### Spacing Scale

Built on an exact `4px` grid system using standard Tailwind spacing multipliers:

- `1` (4px): Micro padding between inline elements.
- `2` (8px): Icon gap, compact button padding, list item gaps.
- `3` (12px): Standard element gaps, drawer paddings.
- `4` (16px): Header padding (`px-4`), card container padding, section spacing.
- `6` (24px): Main view container padding (`p-6`).
- `8` (32px): Major layout section gaps (`space-y-8`).

### Structural Containers

- **Application Frame**: Fixed full-viewport viewport container (`h-screen w-screen flex flex-col overflow-hidden`).
- **App Bar (Header)**: Fixed height (`min-h-16`), horizontal flex alignment (`px-4 border-b shadow-xs z-30`).
- **Sidebar Drawer**: Collapsible left sidebar transition (`w-64` expanded, `w-16` collapsed) with smooth `duration-300 ease-in-out`.
- **Main View Area**: Scrollable content viewport (`flex-1 overflow-auto p-6`).

# Key Components

### Buttons (`btn`)

- **Primary Action**: `.btn.btn-primary` - High priority call-to-actions, rounded corner radius (`rounded-xl`), filled primary color.
- **Ghost / Icon Toggle**: `.btn.btn-ghost.btn-square` - Low footprint toolbar toggles, collapse buttons, hover background elevation.
- **Outline Accent**: `.btn.btn-outline.btn-primary` - Secondary actions (e.g., "Add Profile", "Reset").

### Navigation Links

- **Item State**: Rounded rectangle items (`rounded-lg px-3 py-2.5`).
- **Active State**: `.active.bg-primary.text-primary-content.font-medium` - Highlighted primary fill with contrasting text.
- **Collapsed State**: Displays right-anchored tooltip (`tooltip tooltip-right`), hides label text, centers icon (`justify-center px-0`).

### Cards & Panels

- **Theme Selection Card**: Bordered interactive container (`rounded-2xl border p-5 transition-all`). Selected state includes ring highlight (`ring-2 ring-primary/30 border-primary bg-primary/5`).
- **User Profile Pill & Card**: Elevated pill header (`rounded-xl border px-3 py-1.5`) expanding into a detailed dropdown panel (`rounded-2xl border p-3.5 shadow-2xl w-80`).

### Badges (`badge`)

- **Provider Indicators**: Compact metadata pills (`badge-xs font-mono text-[9px]`).
  - _AniList_: `badge-info text-info-content`
  - _MyAnimeList_: `badge-primary text-primary-content`
  - _Sandbox_: `badge-warning badge-xs`

### Search & Filter Controls Panel

- **Glassmorphic Container**: Bordered card with subtle blur backdrop (`border-base-300 bg-base-100/90 backdrop-blur-md rounded-2xl p-4 shadow-sm`).
- **Inline Filter Dropdowns**: Interactive popovers using DaisyUI dropdown utilities (`dropdown-content menu bg-base-100 border-base-200 mt-1.5 w-full rounded-xl border p-1 shadow-xl backdrop-blur-lg`).

### Modals & Dialogs

- **Preferences Modal**: Native HTML `<dialog>` element rendered via `.showModal()`, promoting it directly to the browser's native **Top Layer** (`modal modal-bottom sm:modal-middle`).
- **Account Connect Modal**: Native HTML `<dialog>` element rendered via `.showModal()`, promoting it directly to the browser's native **Top Layer** without CSS z-index hacks.

# Native Top Layer & Clean Stacking Architecture

To prevent z-index bloat and maintain a predictable layout, Komorebi relies on modern web standard stacking rules:

1. **Flexbox Layout Flow**: Structural application elements (`Header`, `Drawer`, `SearchPanel`, `MediaGrid`) are arranged via standard Flexbox document order without artificial `z-index` overrides.
2. **Native HTML Top Layer**: Overlay components (`DashboardSettingsModal`, `UserConnectModal`) utilize the native HTML `<dialog>` API (`.showModal()`). This places dialogs and backdrops in the browser's top layer automatically, bypassing all z-index stacking constraints.
3. **DaisyUI Built-in Dropdowns**: Dropdown menus rely on DaisyUI's built-in `.dropdown-content` styles rather than manual utility overrides.
