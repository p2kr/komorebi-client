<script lang="ts">
  import {
    X,
    SlidersHorizontal,
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
  } from "@lucide/svelte";
  import { dashboardStore, type MetadataChipSettings } from "./dashboardStore.svelte";

  let { isOpen, onClose }: { isOpen: boolean; onClose: () => void } = $props();

  let dialogRef = $state<HTMLDialogElement | null>(null);

  $effect(() => {
    if (isOpen) {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });

  const chipOptions: { key: keyof MetadataChipSettings; label: string; icon: any }[] = [
    { key: "popularity", label: "Popularity Rank (#)", icon: Flame },
    { key: "source", label: "Adaptation Source (Manga/LN)", icon: FileText },
    { key: "format", label: "Format (TV/Movie/Manhwa)", icon: Tv },
    { key: "season", label: "Release Season (Spring/Fall)", icon: Calendar },
    { key: "studio", label: "Studio / Publisher", icon: Building2 },
    { key: "genres", label: "Genres List", icon: Layers },
  ];
</script>

<dialog bind:this={dialogRef} class="modal modal-bottom sm:modal-middle" onclose={onClose}>
  <!-- Modal Box -->
  <div class="modal-box border-base-300 max-w-lg space-y-6 rounded-3xl border p-6 shadow-2xl">
    <!-- Modal Header -->
    <div class="border-base-200 flex items-center justify-between border-b pb-4">
      <div class="flex items-center gap-3">
        <div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
          <SlidersHorizontal class="size-5" />
        </div>
        <div>
          <h3 class="text-base-content text-lg font-bold">Dashboard Preferences</h3>
          <p class="text-base-content/65 text-xs">
            Configure title hierarchy and metadata chips display
          </p>
        </div>
      </div>
      <button type="button" onclick={onClose} class="btn btn-ghost btn-circle btn-sm">
        <X class="size-4" />
      </button>
    </div>

    <!-- Section 1: Title Display Preference -->
    <div class="space-y-3">
      <div class="text-base-content flex items-center gap-2 text-sm font-bold">
        <Type class="text-primary size-4" />
        <span>Title Typography Hierarchy</span>
      </div>
      <p class="text-base-content/60 text-xs">
        Both titles are always displayed on media cards. Select which title gets primary font size &
        prominence.
      </p>

      <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <button
          type="button"
          onclick={() => dashboardStore.setTitleHierarchy("primary_first")}
          class={`flex flex-col items-start rounded-2xl border p-3.5 text-left transition-all ${
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
          <span class="text-base-content/75 mt-1 line-clamp-1 text-[11px] font-medium">
            Demon Slayer (English)
          </span>
          <span class="text-base-content/50 line-clamp-1 text-[10px] italic">
            Kimetsu no Yaiba (Alt)
          </span>
        </button>

        <button
          type="button"
          onclick={() => dashboardStore.setTitleHierarchy("alternate_first")}
          class={`flex flex-col items-start rounded-2xl border p-3.5 text-left transition-all ${
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
          <span class="text-base-content/75 mt-1 line-clamp-1 text-[11px] font-medium">
            鬼滅の刃 (Alternate)
          </span>
          <span class="text-base-content/50 line-clamp-1 text-[10px] italic">
            Demon Slayer (English)
          </span>
        </button>
      </div>
    </div>

    <!-- Section 2: Visible Metadata Chips Settings -->
    <div class="border-base-200 space-y-3 border-t pt-2">
      <div class="flex items-center justify-between">
        <div class="text-base-content flex items-center gap-2 text-sm font-bold">
          <Tag class="text-primary size-4" />
          <span>Metadata Chips Configuration</span>
        </div>
      </div>

      <!-- Permanent Rating Badge Warning/Notice -->
      <div
        class="bg-warning/10 border-warning/30 text-warning flex items-center justify-between rounded-xl border p-2.5 text-xs font-medium"
      >
        <div class="flex items-center gap-2">
          <Star class="fill-warning size-4" />
          <span>Rating Score (⭐)</span>
        </div>
        <span class="badge badge-warning badge-xs font-bold uppercase">Permanent</span>
      </div>

      <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {#each chipOptions as chip (chip.key)}
          <label
            class="border-base-300 bg-base-100 hover:bg-base-200/50 flex cursor-pointer items-center justify-between rounded-xl border p-2.5 text-xs font-medium transition-colors"
          >
            <span class="flex items-center gap-2">
              <chip.icon class="text-base-content/70 size-3.5" />
              <span>{chip.label}</span>
            </span>
            <input
              type="checkbox"
              checked={dashboardStore.visibleChips[chip.key]}
              onchange={() => dashboardStore.toggleChipSetting(chip.key)}
              class="checkbox checkbox-primary checkbox-xs rounded-md"
            />
          </label>
        {/each}
      </div>
    </div>

    <!-- Modal Footer -->
    <div class="border-base-200 flex justify-end border-t pt-4">
      <button type="button" onclick={onClose} class="btn btn-primary btn-sm rounded-xl px-6">
        Done
      </button>
    </div>
  </div>

  <form method="dialog" class="modal-backdrop">
    <button onclick={onClose}>close</button>
  </form>
</dialog>
