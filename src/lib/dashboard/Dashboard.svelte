<script lang="ts">
  import SearchPanel from "./SearchPanel.svelte";
  import MediaGrid from "./MediaGrid.svelte";
  import { dashboardStore } from "./dashboardStore.svelte";
  import { userManager } from "@user/user.svelte";
  import { RefreshCw, Server, WifiOff } from "@lucide/svelte";

  // Reactively trigger server fetch whenever current user changes
  $effect(() => {
    const user = userManager.currentUser;
    if (user) {
      dashboardStore.fetchMedia();
    }
  });
</script>

<div class="mx-auto max-w-7xl space-y-6 pb-12">
  <!-- Server Status Bar -->
  {#if userManager.currentUser}
    <div
      class="bg-base-200/50 border-base-300 flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm"
    >
      <div class="flex items-center gap-2">
        <Server class="text-primary size-4" />
        <span class="font-medium">Backend Server (http://localhost:8080/api/v1)</span>
        {#if dashboardStore.isLoading}
          <span class="badge badge-warning badge-sm gap-1 font-mono text-sm">
            <RefreshCw class="size-3.5 animate-spin" /> Fetching media...
          </span>
        {:else if dashboardStore.isConnected}
          <span class="badge badge-success badge-sm text-sm font-semibold">Connected</span>
        {:else}
          <span class="badge badge-ghost badge-sm text-base-content/70 gap-1 text-sm">
            <WifiOff class="size-3.5" /> Standby
          </span>
        {/if}
      </div>

      <button
        type="button"
        onclick={() => dashboardStore.fetchMedia()}
        disabled={dashboardStore.isLoading}
        class="tooltip tooltip-bottom btn btn-ghost btn-sm gap-1.5 rounded-lg text-sm"
        data-tip="Sync media from server"
      >
        <RefreshCw class={`size-3.5 ${dashboardStore.isLoading ? "animate-spin" : ""}`} />
        <span>Sync Server</span>
      </button>
    </div>
  {/if}

  <!-- Search & Filter Panel at the top -->
  <SearchPanel />

  <!-- Media Tiles Responsive Grid below Search Panel -->
  <MediaGrid />
</div>
