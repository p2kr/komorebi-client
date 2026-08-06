<script lang="ts">
  import { Monitor, Sun, Moon, Type, Palette, RotateCcw, Check } from "@lucide/svelte";
  import { themeManager } from "./theme.svelte";

  const currentMode = $derived(themeManager.mode);
  const currentFont = $derived(themeManager.font);
  const activeFont = $derived(themeManager.activeFont);
  const presets = $derived(themeManager.presets);
  const fonts = $derived(themeManager.fonts);

  const mainModes = [
    { id: "system", name: "System", icon: Monitor },
    { id: "light", name: "Light", icon: Sun },
    { id: "dark", name: "Dark", icon: Moon },
  ];

  function handleSelectMode(modeId: string) {
    themeManager.setMode(modeId);
  }

  function handleSelectFont(fontId: string) {
    themeManager.setFont(fontId);
  }

  function handleResetAll() {
    themeManager.setMode("system");
    themeManager.resetFont();
  }
</script>

<div class="max-w-4xl space-y-6">
  <!-- Minimal Header & Reset -->
  <div class="border-base-300 flex items-center justify-between border-b pb-4">
    <div>
      <h2 class="text-base-content text-lg font-bold sm:text-xl">Appearance & Display</h2>
      <p class="text-base-content/70 text-sm">
        Customize theme mode, color schemes, and typography
      </p>
    </div>
    {#if currentMode !== "system" || currentFont !== "inter"}
      <button
        type="button"
        onclick={handleResetAll}
        class="btn btn-ghost btn-sm text-base-content/70 hover:text-base-content gap-1.5 text-sm"
      >
        <RotateCcw class="size-3.5" />
        Reset to Default
      </button>
    {/if}
  </div>

  <!-- Mode Switcher (Compact Segmented Control) -->
  <div class="border-base-300 bg-base-100 space-y-3 rounded-2xl border p-4">
    <div class="flex items-center gap-2">
      <Sun class="text-primary size-4" />
      <span class="text-base-content/70 text-sm font-semibold tracking-wider uppercase"
        >Theme Mode</span
      >
    </div>

    <div class="grid grid-cols-3 gap-2">
      {#each mainModes as mode (mode.id)}
        {@const Icon = mode.icon}
        {@const isSelected = currentMode === mode.id}
        <button
          type="button"
          onclick={() => handleSelectMode(mode.id)}
          class={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
            isSelected
              ? "bg-primary text-primary-content font-semibold shadow-xs"
              : "bg-base-200/60 text-base-content/80 hover:bg-base-200"
          }`}
        >
          <Icon class="size-4" />
          <span>{mode.name}</span>
        </button>
      {/each}
    </div>
  </div>

  <!-- Minimal Theme Presets Grid (Color Presets Before Fonts) -->
  <div class="border-base-300 bg-base-100 space-y-3 rounded-2xl border p-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Palette class="text-primary size-4" />
        <span class="text-base-content/70 text-sm font-semibold tracking-wider uppercase"
          >Color Presets</span
        >
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
      {#each presets as preset (preset.id)}
        {@const isSelected = currentMode === preset.id}
        <button
          type="button"
          data-theme={preset.id}
          onclick={() => handleSelectMode(preset.id)}
          class={`flex items-center justify-between rounded-xl border p-2.5 text-left transition-all ${
            isSelected
              ? "border-primary ring-primary bg-base-100 shadow-xs ring-1"
              : "border-base-300 hover:border-base-content/20 bg-base-100"
          }`}
        >
          <span class="text-base-content truncate text-sm font-semibold">{preset.name}</span>

          <div class="flex items-center gap-1">
            <div class="border-base-300 flex h-3.5 w-7 overflow-hidden rounded border">
              <div class="h-full w-1/3" style={`background-color: ${preset.colors.primary}`}></div>
              <div
                class="h-full w-1/3"
                style={`background-color: ${preset.colors.secondary}`}
              ></div>
              <div class="h-full w-1/3" style={`background-color: ${preset.colors.accent}`}></div>
            </div>
            {#if isSelected}
              <Check class="text-primary ml-1 size-3.5 shrink-0" />
            {/if}
          </div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Minimal Font Switcher -->
  <div class="border-base-300 bg-base-100 space-y-3 rounded-2xl border p-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Type class="text-primary size-4" />
        <span class="text-base-content/70 text-sm font-semibold tracking-wider uppercase"
          >Typography Font</span
        >
      </div>
      <span class="text-base-content/70 text-sm font-medium"
        >Active: <span class="text-primary font-bold">{activeFont.name}</span></span
      >
    </div>

    <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
      {#each fonts as fontPreset (fontPreset.id)}
        {@const isSelected = currentFont === fontPreset.id}
        <button
          type="button"
          onclick={() => handleSelectFont(fontPreset.id)}
          class={`flex flex-col justify-between rounded-xl border p-3 text-left transition-all ${
            isSelected
              ? "border-primary bg-primary/5 ring-primary ring-1"
              : "border-base-300 hover:border-base-content/20 hover:bg-base-200/40"
          }`}
        >
          <div class="flex items-center justify-between">
            <span class="text-base-content text-sm font-bold">{fontPreset.name}</span>
            {#if isSelected}
              <Check class="text-primary size-4" />
            {/if}
          </div>
          <div
            class="text-base-content/70 mt-2 truncate text-sm"
            style={`font-family: ${fontPreset.fontFamily}`}
          >
            {fontPreset.sample}
          </div>
        </button>
      {/each}
    </div>
  </div>
</div>
