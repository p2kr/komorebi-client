<script lang="ts">
  import { Type, Tag, LayoutDashboard, Languages, Globe } from "@lucide/svelte";
  import { dashboardStore } from "@dashboard/dashboardStore.svelte";
  import { CHIP_DEFINITIONS } from "@dashboard/chipRegistry";
  import LiveCardPreview from "@dashboard/LiveCardPreview.svelte";
</script>

<div class="space-y-8">
  <!-- Section Title -->
  <div class="space-y-1">
    <h2 class="text-base-content flex items-center gap-2 text-xl font-bold">
      <LayoutDashboard class="text-primary size-5" />
      <span>Dashboard Display Preferences</span>
    </h2>
    <p class="text-base-content/70 text-sm sm:text-base">
      Customize how media titles and metadata chips are rendered on media cards
    </p>
  </div>

  <!-- Unified Live Card Preview -->
  <LiveCardPreview />

  <!-- Setting 1: Sleek Title Hierarchy Switcher -->
  <div class="border-base-300 bg-base-100/90 space-y-4 rounded-2xl border p-5 shadow-xs sm:p-6">
    <div class="text-base-content flex items-center gap-2 text-base font-bold">
      <Type class="text-primary size-4.5" />
      <span>Title Typography Hierarchy</span>
    </div>
    <p class="text-base-content/70 text-sm leading-relaxed">
      Choose which title format takes primary bold placement on media card headers. Both primary and
      alternate titles remain visible.
    </p>

    <!-- Sleek Segmented Pill Switcher -->
    <div class="bg-base-200/70 border-base-300 flex items-center rounded-xl border p-1 sm:max-w-md">
      <button
        type="button"
        onclick={() => dashboardStore.setTitleHierarchy("primary_first")}
        class={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold transition-all ${
          dashboardStore.titleHierarchy === "primary_first"
            ? "bg-primary text-primary-content shadow-xs"
            : "text-base-content/70 hover:text-base-content"
        }`}
      >
        <Languages class="size-4" />
        <span>English First</span>
      </button>

      <button
        type="button"
        onclick={() => dashboardStore.setTitleHierarchy("alternate_first")}
        class={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold transition-all ${
          dashboardStore.titleHierarchy === "alternate_first"
            ? "bg-primary text-primary-content shadow-xs"
            : "text-base-content/70 hover:text-base-content"
        }`}
      >
        <Globe class="size-4" />
        <span>Romanized First</span>
      </button>
    </div>
  </div>

  <!-- Setting 2: Dynamic Metadata Chips -->
  <div class="border-base-300 bg-base-100/90 space-y-4 rounded-2xl border p-5 shadow-xs sm:p-6">
    <div class="flex items-center justify-between">
      <div class="text-base-content flex items-center gap-2 text-base font-bold">
        <Tag class="text-primary size-4.5" />
        <span>Metadata Chips Visibility</span>
      </div>
    </div>
    <p class="text-base-content/70 text-sm leading-relaxed">
      Choose which metadata chips to display on media card headers. Rating score is permanent across
      all cards.
    </p>

    <!-- Toggleable Chips Grid dynamically loaded from registry -->
    <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
      {#each CHIP_DEFINITIONS as chip (chip.key)}
        {@const isPermanent = chip.isPermanent}
        {@const isChecked = dashboardStore.visibleChips[chip.key]}
        <label
          class={`border-base-300 tooltip tooltip-top flex items-center justify-between rounded-xl border p-3 text-sm font-medium transition-all ${
            isPermanent
              ? "bg-base-200/50 cursor-not-allowed opacity-80"
              : "bg-base-100 hover:bg-base-200/60 cursor-pointer"
          }`}
          data-tip={chip.description}
        >
          <span class="flex min-w-0 items-center gap-2.5 pr-2">
            <chip.icon
              class={`size-4 shrink-0 ${isPermanent ? "text-warning" : "text-base-content/70"}`}
            />
            <span class="truncate">{chip.label}</span>
            {#if isPermanent}
              <span class="badge badge-ghost badge-sm text-base-content/70 text-sm font-bold"
                >Fixed</span
              >
            {/if}
          </span>
          <input
            type="checkbox"
            checked={isChecked}
            disabled={isPermanent}
            onchange={() => dashboardStore.toggleChipSetting(chip.key)}
            class="checkbox checkbox-primary checkbox-sm shrink-0 rounded-md disabled:opacity-60"
          />
        </label>
      {/each}
    </div>
  </div>
</div>
