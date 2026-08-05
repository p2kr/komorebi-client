<script lang="ts">
  import {
    Monitor,
    Sun,
    Moon,
    Check,
    CircleCheck,
    RotateCcw,
    Sparkles,
    Palette,
  } from "@lucide/svelte";
  import { themeManager } from "./theme.svelte";

  const currentMode = $derived(themeManager.mode);
  const resolvedTheme = $derived(themeManager.resolvedTheme);
  const presets = $derived(themeManager.presets);

  const mainModes = [
    {
      id: "system",
      name: "System Default",
      description: "Automatically adjust theme based on operating system preferences",
      icon: Monitor,
    },
    {
      id: "light",
      name: "Light Mode",
      description: "Clean and vibrant light appearance",
      icon: Sun,
    },
    {
      id: "dark",
      name: "Dark Mode",
      description: "Sleek dark theme to reduce eye strain",
      icon: Moon,
    },
  ];

  function handleSelectMode(modeId: string) {
    themeManager.setMode(modeId);
  }

  function handleResetTheme() {
    themeManager.setMode("system");
  }
</script>

<div class="flex items-center gap-2">
  <span class="badge badge-primary badge-outline gap-1 px-3 py-3 text-xs font-semibold">
    <Sparkles class="size-3.5" />
    Active:
    <span class="capitalize"
      >{currentMode === "system" ? `System (${resolvedTheme})` : currentMode}</span
    >
  </span>
  {#if currentMode !== "system"}
    <button
      type="button"
      onclick={handleResetTheme}
      class="tooltip tooltip-bottom btn btn-ghost btn-sm text-base-content/70 hover:text-base-content gap-1.5 text-xs"
      data-tip="Reset to system theme"
    >
      <RotateCcw class="size-3.5" />
      Reset
    </button>
  {/if}
</div>
<div class="space-y-8">
  <!-- Mode Selection (System / Light / Dark) -->
  <div class="space-y-4">
    <div>
      <h2 class="text-base-content flex items-center gap-2 text-lg font-semibold">
        <Monitor class="text-primary size-5" />
        Base Theme Mode
      </h2>
      <p class="text-base-content/70 text-xs">Select your preferred color scheme mode</p>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {#each mainModes as mode (mode.id)}
        {@const Icon = mode.icon}
        {@const isSelected = currentMode === mode.id}
        <button
          type="button"
          onclick={() => handleSelectMode(mode.id)}
          class={`group relative flex flex-col justify-between rounded-2xl border p-5 text-left transition-all duration-200 ${
            isSelected
              ? "border-primary bg-primary/5 ring-primary/30 shadow-md ring-2"
              : "border-base-300 bg-base-100 hover:border-base-content/30 hover:bg-base-200/50"
          }`}
        >
          <div class="flex items-start justify-between">
            <div
              class={`flex size-10 items-center justify-center rounded-xl transition-colors ${
                isSelected
                  ? "bg-primary text-primary-content"
                  : "bg-base-200 text-base-content group-hover:bg-base-300"
              }`}
            >
              <Icon class="size-5" />
            </div>
            {#if isSelected}
              <span class="badge badge-primary badge-sm gap-1">
                <Check class="size-3" /> Selected
              </span>
            {/if}
          </div>

          <div class="mt-4">
            <div class="text-base-content font-semibold">{mode.name}</div>
            <div class="text-base-content/60 mt-1 text-xs leading-relaxed">{mode.description}</div>
          </div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Custom DaisyUI Theme Presets Gallery -->
  <div class="border-base-300 space-y-4 border-t pt-4">
    <div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
      <div>
        <h2 class="text-base-content flex items-center gap-2 text-lg font-semibold">
          <Palette class="text-primary size-5" />
          Theme Presets Gallery
        </h2>
        <p class="text-base-content/70 text-xs">
          Choose from curated color themes to match your personal style
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {#each presets as preset (preset.id)}
        {@const isSelected = currentMode === preset.id}
        <button
          type="button"
          data-theme={preset.id}
          onclick={() => handleSelectMode(preset.id)}
          class={`group relative flex flex-col justify-between overflow-hidden rounded-xl border p-4 text-left transition-all duration-200 ${
            isSelected
              ? "border-primary ring-primary ring-offset-base-100 shadow-lg ring-2 ring-offset-2"
              : "border-base-300 hover:border-primary/50 hover:shadow-md"
          }`}
        >
          <!-- Card Top Header inside Theme's native environment -->
          <div
            class="bg-base-100 text-base-content border-base-200 -mx-4 -mt-4 mb-3 flex items-center justify-between border-b p-3"
          >
            <span class="text-sm font-bold tracking-wide">{preset.name}</span>
            <div class="flex items-center gap-1.5">
              <span
                class="bg-base-200 text-base-content/70 rounded px-1.5 py-0.5 font-mono text-[10px] uppercase"
              >
                {preset.type}
              </span>
              {#if isSelected}
                <CircleCheck class="text-primary size-4" />
              {/if}
            </div>
          </div>

          <!-- Live Color Palette Swatches -->
          <div class="space-y-3">
            <div class="text-base-content/70 text-[11px] leading-tight">
              {preset.description}
            </div>

            <div class="border-base-300 flex h-6 w-full rounded-lg border shadow-inner">
              <div
                class="tooltip tooltip-top h-full flex-1 first:rounded-l-lg"
                style={`background-color: ${preset.colors.primary}`}
                data-tip="Primary"
              ></div>
              <div
                class="tooltip tooltip-top h-full flex-1"
                style={`background-color: ${preset.colors.secondary}`}
                data-tip="Secondary"
              ></div>
              <div
                class="tooltip tooltip-top h-full flex-1"
                style={`background-color: ${preset.colors.accent}`}
                data-tip="Accent"
              ></div>
              <div
                class="tooltip tooltip-top h-full flex-1"
                style={`background-color: ${preset.colors.neutral}`}
                data-tip="Neutral"
              ></div>
              <div
                class="tooltip tooltip-top h-full flex-1 last:rounded-r-lg"
                style={`background-color: ${preset.colors.base}`}
                data-tip="Base"
              ></div>
            </div>
          </div>

          <!-- Active Status Footer -->
          <div class="border-base-200 mt-4 flex items-center justify-between border-t pt-2 text-xs">
            <span class="text-base-content/60 group-hover:text-primary text-xs transition-colors">
              {isSelected ? "Active Theme" : "Click to apply"}
            </span>
            <div class="flex gap-1">
              <span class="bg-primary size-2 rounded-full"></span>
              <span class="bg-secondary size-2 rounded-full"></span>
              <span class="bg-accent size-2 rounded-full"></span>
            </div>
          </div>
        </button>
      {/each}
    </div>
  </div>
</div>
