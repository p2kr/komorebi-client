<script lang="ts">
  import { X, SlidersHorizontal, Type, Tag, Languages, Globe } from "@lucide/svelte";
  import { dashboardStore } from "./dashboardStore.svelte";
  import { CHIP_DEFINITIONS } from "./chipRegistry";
  import LiveCardPreview from "./LiveCardPreview.svelte";

  let { isOpen, onClose }: { isOpen: boolean; onClose: () => void } = $props();

  let dialogRef = $state<HTMLDialogElement | null>(null);

  $effect(() => {
    if (isOpen) {
      dialogRef?.showModal();
    } else {
      dialogRef?.close();
    }
  });
</script>

<dialog bind:this={dialogRef} class="modal modal-bottom sm:modal-middle" onclose={onClose}>
  <!-- Modal Box -->
  <div class="modal-box border-base-300 max-w-lg space-y-5 rounded-3xl border p-6 shadow-2xl">
    <!-- Modal Header -->
    <div class="border-base-200 flex items-center justify-between border-b pb-4">
      <div class="flex items-center gap-3">
        <div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
          <SlidersHorizontal class="size-5" />
        </div>
        <div>
          <h3 class="text-base-content text-lg font-bold">Dashboard Preferences</h3>
          <p class="text-base-content/70 text-sm">
            Configure title hierarchy and metadata chips display
          </p>
        </div>
      </div>
      <button type="button" onclick={onClose} class="btn btn-ghost btn-circle btn-sm">
        <X class="size-4" />
      </button>
    </div>

    <!-- Unified Live Preview Card -->
    <LiveCardPreview />

    <!-- Section 1: Title Display Preference -->
    <div class="space-y-3">
      <div class="text-base-content flex items-center gap-2 text-sm font-bold">
        <Type class="text-primary size-4" />
        <span>Title Typography Hierarchy</span>
      </div>

      <!-- Segmented Control Switcher -->
      <div class="bg-base-200/70 border-base-300 flex items-center rounded-xl border p-1">
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

    <!-- Section 2: Visible Metadata Chips Settings -->
    <div class="border-base-200 space-y-3 border-t pt-3">
      <div class="flex items-center justify-between">
        <div class="text-base-content flex items-center gap-2 text-sm font-bold">
          <Tag class="text-primary size-4" />
          <span>Metadata Chips Configuration</span>
        </div>
      </div>

      <div class="grid max-h-56 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
        {#each CHIP_DEFINITIONS as chip (chip.key)}
          {@const isPermanent = chip.isPermanent}
          {@const isChecked = dashboardStore.visibleChips[chip.key]}
          <label
            class={`border-base-300 tooltip tooltip-top flex items-center justify-between rounded-xl border p-2.5 text-sm font-medium transition-colors ${
              isPermanent
                ? "bg-base-200/50 cursor-not-allowed opacity-80"
                : "bg-base-100 hover:bg-base-200/50 cursor-pointer"
            }`}
            data-tip={chip.description}
          >
            <span class="flex min-w-0 items-center gap-2 pr-2">
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
              class="checkbox checkbox-primary checkbox-xs shrink-0 rounded-md disabled:opacity-60"
            />
          </label>
        {/each}
      </div>
    </div>

    <!-- Modal Footer -->
    <div class="border-base-200 flex justify-end border-t pt-3">
      <button type="button" onclick={onClose} class="btn btn-primary btn-sm rounded-xl px-6">
        Done
      </button>
    </div>
  </div>

  <form method="dialog" class="modal-backdrop">
    <button onclick={onClose}>close</button>
  </form>
</dialog>
