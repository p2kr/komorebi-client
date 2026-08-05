<script lang="ts">
  import {
    Type,
    Tag,
    Star,
    Check,
    Flame,
    FileText,
    Tv,
    Calendar,
    Building2,
    Layers,
    LayoutDashboard,
  } from "@lucide/svelte";
  import { dashboardStore, type MetadataChipSettings } from "@dashboard/dashboardStore.svelte";

  const chipOptions: { key: keyof MetadataChipSettings; label: string; icon: any }[] = [
    { key: "popularity", label: "Popularity Rank (#)", icon: Flame },
    { key: "source", label: "Adaptation Source (Manga/LN)", icon: FileText },
    { key: "format", label: "Format (TV/Movie/Manhwa)", icon: Tv },
    { key: "season", label: "Release Season (Spring/Fall)", icon: Calendar },
    { key: "studio", label: "Studio / Publisher", icon: Building2 },
    { key: "genres", label: "Genres List", icon: Layers },
  ];
</script>

<div class="space-y-8">
  <!-- Section Title -->
  <div class="space-y-1">
    <h2 class="text-base-content flex items-center gap-2 text-xl font-bold">
      <LayoutDashboard class="text-primary size-5" />
      <span>Dashboard Display Preferences</span>
    </h2>
    <p class="text-base-content/65 text-xs sm:text-sm">
      Customize how media titles and metadata chips are rendered on media cards
    </p>
  </div>

  <!-- Setting 1: Title Hierarchy -->
  <div class="border-base-300 bg-base-100/90 space-y-4 rounded-2xl border p-5 shadow-xs sm:p-6">
    <div class="text-base-content flex items-center gap-2 text-base font-bold">
      <Type class="text-primary size-4.5" />
      <span>Title Typography Hierarchy</span>
    </div>
    <p class="text-base-content/65 text-xs leading-relaxed">
      Both the primary title and <strong>Romanized title</strong> are displayed on media cards. Select
      which title receives primary font size and bold emphasis.
    </p>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <button
        type="button"
        onclick={() => dashboardStore.setTitleHierarchy("primary_first")}
        class={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
          dashboardStore.titleHierarchy === "primary_first"
            ? "border-primary bg-primary/10 shadow-xs"
            : "border-base-300 hover:border-base-400 bg-base-200/40"
        }`}
      >
        <div class="flex w-full items-center justify-between text-xs font-bold">
          <span>English Title First</span>
          {#if dashboardStore.titleHierarchy === "primary_first"}
            <Check class="text-primary size-4" />
          {/if}
        </div>
        <span class="text-base-content mt-1.5 line-clamp-1 text-xs font-bold">
          Demon Slayer (English)
        </span>
        <span class="text-base-content/60 line-clamp-1 text-[11px] italic">
          Kimetsu no Yaiba (Romanized)
        </span>
      </button>

      <button
        type="button"
        onclick={() => dashboardStore.setTitleHierarchy("alternate_first")}
        class={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
          dashboardStore.titleHierarchy === "alternate_first"
            ? "border-primary bg-primary/10 shadow-xs"
            : "border-base-300 hover:border-base-400 bg-base-200/40"
        }`}
      >
        <div class="flex w-full items-center justify-between text-xs font-bold">
          <span>Romanized Title First</span>
          {#if dashboardStore.titleHierarchy === "alternate_first"}
            <Check class="text-primary size-4" />
          {/if}
        </div>
        <span class="text-base-content mt-1.5 line-clamp-1 text-xs font-bold">
          Kimetsu no Yaiba (Romanized)
        </span>
        <span class="text-base-content/60 line-clamp-1 text-[11px] italic">
          Demon Slayer (English)
        </span>
      </button>
    </div>
  </div>

  <!-- Setting 2: Visible Chips -->
  <div class="border-base-300 bg-base-100/90 space-y-4 rounded-2xl border p-5 shadow-xs sm:p-6">
    <div class="flex items-center justify-between">
      <div class="text-base-content flex items-center gap-2 text-base font-bold">
        <Tag class="text-primary size-4.5" />
        <span>Metadata Chips Visibility</span>
      </div>
    </div>
    <p class="text-base-content/65 text-xs leading-relaxed">
      Choose which metadata chips to display on media card headers. Rating is permanent and cannot
      be hidden.
    </p>

    <!-- Permanent Rating Chip Notice -->
    <div
      class="bg-warning/10 border-warning/30 text-warning flex items-center justify-between rounded-xl border p-3 text-xs font-medium"
    >
      <div class="flex items-center gap-2">
        <Star class="fill-warning size-4" />
        <span>Community Score (⭐ Rating)</span>
      </div>
      <span class="badge badge-warning badge-sm font-bold uppercase">Permanent</span>
    </div>

    <!-- Toggleable Chips -->
    <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
      {#each chipOptions as chip (chip.key)}
        <label
          class="border-base-300 bg-base-100 hover:bg-base-200/60 flex cursor-pointer items-center justify-between rounded-xl border p-3 text-xs font-medium transition-colors"
        >
          <span class="flex items-center gap-2.5">
            <chip.icon class="text-base-content/70 size-4" />
            <span>{chip.label}</span>
          </span>
          <input
            type="checkbox"
            checked={dashboardStore.visibleChips[chip.key]}
            onchange={() => dashboardStore.toggleChipSetting(chip.key)}
            class="checkbox checkbox-primary checkbox-sm rounded-md"
          />
        </label>
      {/each}
    </div>
  </div>
</div>
