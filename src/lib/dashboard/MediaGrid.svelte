<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { dashboardStore } from "./dashboardStore.svelte";
  import { userManager } from "@user/user.svelte";
  import MediaTile from "./MediaTile.svelte";
  import { SearchX, Loader2, Sparkles, UserX, AlertCircle, RefreshCw } from "@lucide/svelte";

  let sentinelEl = $state<HTMLElement | null>(null);
  let observer: IntersectionObserver | null = null;

  onMount(() => {
    if (typeof window === "undefined") return;

    observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && dashboardStore.hasMore && !dashboardStore.isLoadingMore) {
          dashboardStore.loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    if (sentinelEl) {
      observer.observe(sentinelEl);
    }
  });

  onDestroy(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  $effect(() => {
    if (sentinelEl && observer) {
      observer.disconnect();
      observer.observe(sentinelEl);
    }
  });
</script>

<div class="space-y-6">
  {#if dashboardStore.isLoading && !dashboardStore.hasFetchedOnce}
    <!-- Initial Loading State -->
    <div class="flex flex-col items-center justify-center space-y-4 py-20 text-center">
      <div class="bg-primary/10 text-primary flex size-14 items-center justify-center rounded-2xl">
        <Loader2 class="size-8 animate-spin" />
      </div>
      <div>
        <h3 class="text-base-content text-base font-bold sm:text-lg">Fetching Library</h3>
        <p class="text-base-content/70 mt-1 text-sm">
          Connecting to server and retrieving media entries...
        </p>
      </div>
    </div>
  {:else if !userManager.currentUser}
    <!-- No Active User State -->
    <div
      class="border-base-300 bg-base-100/80 flex flex-col items-center justify-center rounded-3xl border border-dashed px-4 py-16 text-center backdrop-blur-sm"
    >
      <div
        class="bg-warning/10 text-warning mb-4 flex size-14 items-center justify-center rounded-2xl"
      >
        <UserX class="size-7" />
      </div>
      <h3 class="text-base-content text-lg font-bold">No User Profile Selected</h3>
      <p class="text-base-content/60 mt-1 max-w-md text-sm">
        Select or add a media profile (AniList / MyAnimeList) using the profile menu in the top
        navigation bar to load your media library.
      </p>
    </div>
  {:else if dashboardStore.error && dashboardStore.allEntries.length === 0}
    <!-- Server Error State -->
    <div
      class="border-error/30 bg-error/5 flex flex-col items-center justify-center rounded-3xl border px-4 py-14 text-center"
    >
      <div class="bg-error/15 text-error mb-3 flex size-12 items-center justify-center rounded-2xl">
        <AlertCircle class="size-6" />
      </div>
      <h3 class="text-base-content text-base font-bold sm:text-lg">Failed to Load Media</h3>
      <p class="text-base-content/70 mt-1 max-w-md font-mono text-sm">
        {dashboardStore.error}
      </p>
      <button
        type="button"
        onclick={() => dashboardStore.fetchMedia()}
        class="btn btn-error btn-outline btn-sm mt-4 gap-2 rounded-xl"
      >
        <RefreshCw class="size-3.5" />
        <span>Retry Connection</span>
      </button>
    </div>
  {:else if dashboardStore.paginatedEntries.length > 0}
    <!-- Grid Layout of Media Tiles -->
    <div
      class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
    >
      {#each dashboardStore.paginatedEntries as entry (entry.media.id)}
        <MediaTile {entry} />
      {/each}
    </div>

    <!-- Infinite Scroll Sentinel & Loading Indicator -->
    <div bind:this={sentinelEl} class="flex min-h-16 flex-col items-center justify-center py-6">
      {#if dashboardStore.isLoadingMore}
        <div
          class="bg-base-200/80 text-base-content/70 border-base-300 flex animate-pulse items-center gap-3 rounded-full border px-4 py-2 text-sm font-medium shadow-sm"
        >
          <Loader2 class="text-primary size-4 animate-spin" />
          <span>Loading more items...</span>
        </div>
      {:else if !dashboardStore.hasMore}
        <div class="text-base-content/60 flex items-center gap-2 text-sm font-medium">
          <Sparkles class="text-primary/60 size-4" />
          <span>End of library ({dashboardStore.allEntries.length} items loaded)</span>
        </div>
      {/if}
    </div>
  {:else}
    <!-- Empty Media Search / Filter State -->
    <div
      class="border-base-300 bg-base-100/60 flex flex-col items-center justify-center rounded-3xl border border-dashed px-4 py-16 text-center backdrop-blur-sm"
    >
      <div
        class="bg-base-200 text-base-content/40 mb-4 flex size-16 items-center justify-center rounded-2xl"
      >
        <SearchX class="size-8" />
      </div>
      <h3 class="text-base-content text-lg font-bold">No Media Entries Found</h3>
      <p class="text-base-content/60 mt-1 max-w-md text-sm">
        No anime or manga entries found matching your current filter settings or search query.
      </p>
      <div class="mt-5 flex gap-3">
        <button
          type="button"
          onclick={() => {
            dashboardStore.setSearch("");
            dashboardStore.setTypeFilter("anime");
            dashboardStore.setStatusFilter("ALL");
          }}
          class="btn btn-primary btn-sm rounded-xl"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  {/if}
</div>
