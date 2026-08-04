<script lang="ts">
  import {
    Sun,
    Moon,
    Monitor,
    Palette,
    Check,
    RotateCcw,
    Sparkles,
    SlidersHorizontal,
    Info,
    CircleCheck,
  } from '@lucide/svelte';
  import { themeManager, THEME_PRESETS } from '@utils/theme.svelte';
  import { Constants } from '@utils/constants';

  let activeTab = $state<'appearance' | 'about'>('appearance');

  const currentMode = $derived(themeManager.mode);
  const resolvedTheme = $derived(themeManager.resolvedTheme);

  const mainModes = [
    {
      id: 'system',
      name: 'System Default',
      description: 'Automatically adjust theme based on operating system preferences',
      icon: Monitor,
    },
    {
      id: 'light',
      name: 'Light Mode',
      description: 'Clean and vibrant light appearance',
      icon: Sun,
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      description: 'Sleek dark theme to reduce eye strain',
      icon: Moon,
    },
  ];

  function handleSelectMode(modeId: string) {
    themeManager.setMode(modeId);
  }

  function handleResetTheme() {
    themeManager.setMode('system');
  }
</script>

<div class="mx-auto max-w-6xl space-y-8 pb-12">
  <!-- Page Header -->
  <div class="flex flex-col justify-between gap-4 border-b border-base-300 pb-6 sm:flex-row sm:items-center">
    <div>
      <div class="flex items-center gap-3">
        <div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
          <SlidersHorizontal class="size-6" />
        </div>
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">Settings</h1>
          <p class="text-sm text-base-content/70">
            Customize your visual workspace, application behavior, and preferences
          </p>
        </div>
      </div>
    </div>

    <!-- Quick Action / Active Badge -->
    <div class="flex items-center gap-2">
      <span class="badge badge-primary badge-outline gap-1 py-3 px-3 text-xs font-semibold">
        <Sparkles class="size-3.5" />
        Active: <span class="capitalize">{currentMode === 'system' ? `System (${resolvedTheme})` : currentMode}</span>
      </span>
      {#if currentMode !== 'system'}
        <button
          type="button"
          onclick={handleResetTheme}
          class="tooltip tooltip-bottom btn btn-ghost btn-sm gap-1.5 text-xs text-base-content/70 hover:text-base-content"
          data-tip="Reset to system theme"
        >
          <RotateCcw class="size-3.5" />
          Reset
        </button>
      {/if}
    </div>
  </div>

  <!-- Navigation Tabs -->
  <div class="role-tablist tabs tabs-box max-w-xs bg-base-200 p-1">
    <button
      type="button"
      role="tab"
      onclick={() => (activeTab = 'appearance')}
      class={`tab text-sm font-medium transition-all ${activeTab === 'appearance' ? 'tab-active bg-primary text-primary-content shadow-xs' : ''}`}
    >
      <Palette class="mr-2 size-4" />
      Appearance
    </button>
    <button
      type="button"
      role="tab"
      onclick={() => (activeTab = 'about')}
      class={`tab text-sm font-medium transition-all ${activeTab === 'about' ? 'tab-active bg-primary text-primary-content shadow-xs' : ''}`}
    >
      <Info class="mr-2 size-4" />
      About
    </button>
  </div>

  {#if activeTab === 'appearance'}
    <!-- Main Appearance Section -->
    <div class="space-y-8">
      <!-- Mode Selection (System / Light / Dark) -->
      <div class="space-y-4">
        <div>
          <h2 class="text-lg font-semibold text-base-content flex items-center gap-2">
            <Monitor class="size-5 text-primary" />
            Base Theme Mode
          </h2>
          <p class="text-xs text-base-content/70">Select your preferred color scheme mode</p>
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
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/30 shadow-md'
                  : 'border-base-300 bg-base-100 hover:border-base-content/30 hover:bg-base-200/50'
              }`}
            >
              <div class="flex items-start justify-between">
                <div
                  class={`flex size-10 items-center justify-center rounded-xl transition-colors ${
                    isSelected ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content group-hover:bg-base-300'
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
                <div class="font-semibold text-base-content">{mode.name}</div>
                <div class="mt-1 text-xs text-base-content/60 leading-relaxed">{mode.description}</div>
              </div>
            </button>
          {/each}
        </div>
      </div>

      <!-- Custom DaisyUI Theme Presets Gallery -->
      <div class="space-y-4 pt-4 border-t border-base-300">
        <div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 class="text-lg font-semibold text-base-content flex items-center gap-2">
              <Palette class="size-5 text-primary" />
              Theme Presets Gallery
            </h2>
            <p class="text-xs text-base-content/70">
              Choose from curated color themes to match your personal style
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {#each THEME_PRESETS as preset (preset.id)}
            {@const isSelected = currentMode === preset.id}
            <button
              type="button"
              data-theme={preset.id}
              onclick={() => handleSelectMode(preset.id)}
              class={`group relative flex flex-col justify-between overflow-hidden rounded-xl border p-4 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-base-100 shadow-lg'
                  : 'border-base-300 hover:border-primary/50 hover:shadow-md'
              }`}
            >
              <!-- Card Top Header inside Theme's native environment -->
              <div class="bg-base-100 text-base-content -mx-4 -mt-4 mb-3 p-3 border-b border-base-200 flex items-center justify-between">
                <span class="font-bold text-sm tracking-wide">{preset.name}</span>
                <div class="flex items-center gap-1.5">
                  <span class="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-base-200 text-base-content/70">
                    {preset.type}
                  </span>
                  {#if isSelected}
                    <CircleCheck class="size-4 text-primary" />
                  {/if}
                </div>
              </div>

              <!-- Live Color Palette Swatches -->
              <div class="space-y-3">
                <div class="text-[11px] text-base-content/70 leading-tight">
                  {preset.description}
                </div>

                <div class="flex h-6 w-full rounded-lg border border-base-300 shadow-inner">
                  <div class="tooltip tooltip-top h-full flex-1 first:rounded-l-lg" style={`background-color: ${preset.colors.primary}`} data-tip="Primary"></div>
                  <div class="tooltip tooltip-top h-full flex-1" style={`background-color: ${preset.colors.secondary}`} data-tip="Secondary"></div>
                  <div class="tooltip tooltip-top h-full flex-1" style={`background-color: ${preset.colors.accent}`} data-tip="Accent"></div>
                  <div class="tooltip tooltip-top h-full flex-1" style={`background-color: ${preset.colors.neutral}`} data-tip="Neutral"></div>
                  <div class="tooltip tooltip-top h-full flex-1 last:rounded-r-lg" style={`background-color: ${preset.colors.base}`} data-tip="Base"></div>
                </div>
              </div>

              <!-- Active Status Footer -->
              <div class="mt-4 pt-2 flex items-center justify-between text-xs border-t border-base-200">
                <span class="text-xs text-base-content/60 group-hover:text-primary transition-colors">
                  {isSelected ? 'Active Theme' : 'Click to apply'}
                </span>
                <div class="flex gap-1">
                  <span class="size-2 rounded-full bg-primary"></span>
                  <span class="size-2 rounded-full bg-secondary"></span>
                  <span class="size-2 rounded-full bg-accent"></span>
                </div>
              </div>
            </button>
          {/each}
        </div>
      </div>
    </div>
  {:else if activeTab === 'about'}
    <!-- About Section -->
    <div class="rounded-2xl border border-base-300 bg-base-100 p-6 space-y-4">
      <div class="flex items-center gap-3">
        <div class="bg-primary text-primary-content flex size-12 items-center justify-center rounded-2xl font-bold text-xl">
          K
        </div>
        <div>
          <h2 class="text-xl font-bold text-base-content">{Constants.APP_NAME}</h2>
          <p class="text-xs text-base-content/70">Client Version 0.0.1</p>
        </div>
      </div>
      <div class="divider my-2"></div>
      <p class="text-sm text-base-content/80 leading-relaxed">
        Komorebi is a modern web crawler, selector sandbox, parser, and smart matcher suite built with Svelte 5 and Tailwind CSS.
      </p>
    </div>
  {/if}
</div>
