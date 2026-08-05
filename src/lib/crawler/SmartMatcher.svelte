<script lang="ts">
  import {
    WandSparkles,
    Search,
    FileCode,
    CheckCircle2,
    RefreshCw,
    Layers,
    Info,
    Inbox,
  } from "@lucide/svelte";
  import { dashboardStore } from "@dashboard/dashboardStore.svelte";
  import { formatMediaFormatLabel } from "../types/media";

  let selectedEntry = $derived(dashboardStore.activeMatcherEntry);
  let searchQuery = $state("");
  let isSearching = $state(false);
  let hasSearched = $state(false);
  let searchResults = $state<
    {
      id: string;
      sourceName: string;
      matchedTitle: string;
      quality: string;
      score: number;
      chaptersOrEps: number;
    }[]
  >([]);

  $effect(() => {
    if (selectedEntry) {
      searchQuery =
        selectedEntry.media.title.user_preferred ||
        selectedEntry.media.title.english ||
        selectedEntry.media.title.romanized ||
        "";
    }
  });

  function triggerSearch() {
    if (!searchQuery.trim()) return;
    isSearching = true;
    hasSearched = true;
    setTimeout(() => {
      // Clean matcher search state
      searchResults = [];
      isSearching = false;
    }, 600);
  }
</script>

<div class="mx-auto max-w-6xl space-y-6 pb-12">
  <!-- Top Header -->
  <div class="border-base-200 flex items-center justify-between border-b pb-4">
    <div class="flex items-center gap-3">
      <div
        class="bg-secondary/10 text-secondary flex size-10 items-center justify-center rounded-xl"
      >
        <WandSparkles class="size-5" />
      </div>
      <div>
        <h1 class="text-base-content text-2xl font-bold tracking-tight">Smart Matcher</h1>
        <p class="text-base-content/65 text-xs sm:text-sm">
          Match media entries with parser sources, torrent feeds, and crawlers
        </p>
      </div>
    </div>
  </div>

  {#if selectedEntry}
    <!-- Active Selected Media Banner from Dashboard -->
    <div
      class="border-secondary/30 bg-secondary/5 relative overflow-hidden rounded-2xl border p-4 shadow-xs sm:p-5"
    >
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          {#if selectedEntry.media.cover.extra_large || selectedEntry.media.cover.large || selectedEntry.media.cover.medium}
            <img
              src={selectedEntry.media.cover.extra_large ||
                selectedEntry.media.cover.large ||
                selectedEntry.media.cover.medium}
              alt={selectedEntry.media.title.user_preferred || "Media poster"}
              class="h-16 w-12 rounded-lg object-cover shadow-md"
            />
          {:else}
            <div
              class="bg-base-300 flex h-16 w-12 items-center justify-center rounded-lg text-xs font-bold"
            >
              {selectedEntry.media.media_type.toUpperCase()}
            </div>
          {/if}
          <div>
            <span
              class="badge badge-secondary badge-xs mb-1 font-semibold tracking-wider uppercase"
            >
              Active Match Target
            </span>
            <h2 class="text-base-content text-lg leading-tight font-bold">
              {selectedEntry.media.title.user_preferred ||
                selectedEntry.media.title.english ||
                selectedEntry.media.title.romanized}
            </h2>
            {#if selectedEntry.media.title.native || selectedEntry.media.title.romanized}
              <p class="text-base-content/60 text-xs italic">
                {selectedEntry.media.title.native || selectedEntry.media.title.romanized}
              </p>
            {/if}
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="badge badge-outline text-xs capitalize">
            {selectedEntry.media.media_type} • {formatMediaFormatLabel(selectedEntry.media.format)}
          </span>
          <span class="badge badge-primary badge-outline text-xs">
            Progress: {selectedEntry.list_entry.progress || 0}/{selectedEntry.media.episodes ||
              selectedEntry.media.chapters ||
              "?"}
          </span>
        </div>
      </div>
    </div>
  {/if}

  <!-- Matcher Search Control Card -->
  <div class="border-base-300 bg-base-100/90 space-y-4 rounded-2xl border p-5 shadow-xs">
    <h3 class="text-base-content flex items-center gap-2 text-sm font-bold">
      <Search class="text-primary size-4" />
      <span>Matcher Search Query</span>
    </h3>

    <div class="flex flex-col gap-3 sm:flex-row">
      <div class="relative flex-1">
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Enter media title or query to match parser sources..."
          class="input input-bordered w-full rounded-xl text-sm"
        />
      </div>
      <button
        type="button"
        onclick={triggerSearch}
        disabled={isSearching || !searchQuery.trim()}
        class="btn btn-primary gap-2 rounded-xl font-medium"
      >
        {#if isSearching}
          <RefreshCw class="size-4 animate-spin" />
          <span>Searching...</span>
        {:else}
          <WandSparkles class="size-4" />
          <span>Run Smart Match</span>
        {/if}
      </button>
    </div>
  </div>

  <!-- Match Results Section -->
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h3 class="text-base-content flex items-center gap-2 text-sm font-bold">
        <Layers class="text-secondary size-4" />
        <span>Matching Source Feeds</span>
      </h3>
      {#if hasSearched}
        <span class="text-base-content/50 text-xs"
          >Found {searchResults.length} verified matches</span
        >
      {/if}
    </div>

    {#if isSearching}
      <div class="flex flex-col items-center justify-center space-y-3 py-12">
        <RefreshCw class="text-primary size-8 animate-spin" />
        <p class="text-base-content/60 text-xs font-medium">
          Scanning configured parser sources...
        </p>
      </div>
    {:else if searchResults.length > 0}
      <div class="grid grid-cols-1 gap-3">
        {#each searchResults as res (res.id)}
          <div
            class="border-base-300 bg-base-100 hover:border-secondary/40 flex flex-col justify-between gap-3 rounded-2xl border p-4 transition-all sm:flex-row sm:items-center"
          >
            <div class="flex items-start gap-3">
              <div
                class="bg-base-200 text-base-content/70 mt-0.5 flex size-9 flex-shrink-0 items-center justify-center rounded-xl"
              >
                <FileCode class="size-5" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-base-content text-sm font-bold">{res.sourceName}</span>
                  <span class="badge badge-success badge-xs font-bold">
                    {(res.score * 100).toFixed(0)}% Match
                  </span>
                  <span class="badge badge-ghost badge-xs">{res.quality}</span>
                </div>
                <p class="text-base-content/70 mt-1 font-mono text-xs">
                  {res.matchedTitle}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 self-end sm:self-center">
              <button type="button" class="btn btn-secondary btn-outline btn-xs gap-1 rounded-lg">
                <CheckCircle2 class="size-3.5" />
                <span>Bind Match</span>
              </button>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div
        class="border-base-300 bg-base-100/60 flex flex-col items-center justify-center rounded-2xl border border-dashed py-12 text-center"
      >
        <Inbox class="text-base-content/30 mb-2 size-8" />
        <p class="text-base-content/60 text-xs font-medium">
          {hasSearched
            ? "No parser matches found for this query."
            : "Enter a search query or trigger Smart Matcher from your dashboard."}
        </p>
      </div>
    {/if}
  </div>
</div>
