<script lang="ts">
  import { ChevronLeft, ChevronRight } from "@lucide/svelte";
  import clsx from "clsx";
  import { router } from "@store/router.svelte";

  interface Props {
    isCollapsed?: boolean;
    onToggle?: () => void;
  }

  let { isCollapsed = $bindable(false), onToggle }: Props = $props();

  const mainNavItems = $derived(router.mainNavItems);
  const settingsItem = $derived(router.settingsNavItem);
  const SettingsIcon = $derived(settingsItem.icon);
</script>

<aside
  class={`bg-base-200 text-base-content border-base-300 relative flex h-full flex-col border-r transition-all duration-300 ease-in-out select-none ${
    isCollapsed ? "w-16" : "w-64"
  }`}
>
  <!-- Main Navigation Menu -->
  <div
    class={clsx("flex-1 p-2", {
      "overflow-visible": isCollapsed,
      "overflow-x-hidden overflow-y-auto": !isCollapsed,
    })}
  >
    <ul class="menu menu-md w-full space-y-1 p-0">
      {#each mainNavItems as item (item.id)}
        {@const Icon = item.icon}
        {@const isActive = router.activeRoute === item.id}
        <li>
          <button
            type="button"
            onclick={() => router.navigate(item.id)}
            class={clsx("flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors", {
              "active bg-primary text-primary-content font-medium": isActive,
              "hover:bg-base-300": !isActive,
              "tooltip tooltip-right justify-center px-0": isCollapsed,
            })}
            data-tip={isCollapsed ? item.label : undefined}
          >
            <Icon class="size-5 shrink-0" />
            {#if !isCollapsed}
              <span class="truncate">{item.label}</span>
            {/if}
          </button>
        </li>
      {/each}
    </ul>
  </div>

  <!-- Bottom Section (Settings & Collapse toggle) -->
  <div class="border-base-300 space-y-1 border-t p-2">
    <ul class="menu menu-md w-full p-0">
      <li>
        <button
          type="button"
          onclick={() => router.navigate("settings")}
          class={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
            router.activeRoute === "settings"
              ? "active bg-primary text-primary-content font-medium"
              : "hover:bg-base-300"
          } ${isCollapsed ? "tooltip tooltip-right justify-center px-0" : ""}`}
          data-tip={isCollapsed ? settingsItem.label : undefined}
        >
          <SettingsIcon class="size-5 shrink-0" />
          {#if !isCollapsed}
            <span class="truncate">{settingsItem.label}</span>
          {/if}
        </button>
      </li>
    </ul>

    <button
      type="button"
      onclick={() => {
        if (onToggle) onToggle();
        else isCollapsed = !isCollapsed;
      }}
      class={`btn btn-ghost btn-sm flex w-full items-center gap-2 ${
        isCollapsed ? "tooltip tooltip-right justify-center px-0" : "justify-between px-3"
      }`}
      data-tip={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
    >
      {#if !isCollapsed}
        <span class="text-base-content/70 text-sm font-medium">Collapse</span>
        <ChevronLeft class="size-4" />
      {:else}
        <ChevronRight class="size-4" />
      {/if}
    </button>
  </div>
</aside>
