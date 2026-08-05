<script lang="ts">
  import { PanelLeftClose, PanelLeftOpen } from "@lucide/svelte";
  import { Constants } from "@utils/constants";
  import UserSelector from "@user/UserSelector.svelte";

  interface Props {
    isCollapsed?: boolean;
    onToggleDrawer?: () => void;
  }

  let { isCollapsed = false, onToggleDrawer }: Props = $props();
</script>

<header
  class="navbar bg-base-100 border-base-300 z-30 flex min-h-16 w-full items-center justify-between border-b px-4 shadow-xs"
>
  <!-- Left Side: Sidebar Toggle & App Brand -->
  <div class="flex items-center gap-3">
    <button
      type="button"
      onclick={() => onToggleDrawer?.()}
      class="tooltip tooltip-right btn btn-square btn-ghost btn-sm"
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      data-tip={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {#if isCollapsed}
        <PanelLeftOpen class="size-5" />
      {:else}
        <PanelLeftClose class="size-5" />
      {/if}
    </button>

    <!-- LOGO -->
    <span
      class="text-primary font-segoe-script flex items-center gap-2 text-xl font-bold tracking-tight select-none"
    >
      {Constants.APP_NAME}
    </span>
  </div>

  <!-- Right Side: Deep User Profile Module -->
  <div class="flex items-center gap-2">
    <UserSelector />
  </div>
</header>
