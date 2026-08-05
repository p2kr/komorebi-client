<script lang="ts">
  import { Search, Clapperboard, BookOpen, X, ArrowUpDown, Check } from "@lucide/svelte";
  import { dashboardStore } from "./dashboardStore.svelte";
  import { formatListStatusLabel } from "../types/media";

  let searchInputValue = $state(dashboardStore.searchQuery);

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    searchInputValue = target.value;
    dashboardStore.setSearch(target.value);
  }

  function clearSearch() {
    searchInputValue = "";
    dashboardStore.setSearch("");
  }
</script>

<div
  class="border-base-300 bg-base-100/90 relative z-30 rounded-2xl border p-3.5 shadow-sm backdrop-blur-md"
>
  <!-- Single Line Search, Filters & Item Count Row -->
  <div class="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-center">
    <!-- Search Bar (Span 4 on desktop) -->
    <div class="relative sm:col-span-4">
      <div
        class="text-base-content/50 pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <Search class="size-4.5" />
      </div>
      <input
        type="text"
        placeholder="Search title..."
        value={searchInputValue}
        oninput={handleInput}
        class="input input-bordered focus:border-primary w-full rounded-xl pr-9 pl-10 text-sm transition-all focus:outline-none"
      />
      {#if searchInputValue}
        <button
          type="button"
          onclick={clearSearch}
          class="text-base-content/50 hover:text-base-content absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <X class="size-4" />
        </button>
      {/if}
    </div>

    <!-- Media Type Selector (Anime or Manga - Span 2 on desktop) -->
    <div class="sm:col-span-2">
      <div class="dropdown w-full">
        <div
          tabindex="0"
          role="button"
          class="btn btn-bordered bg-base-100 border-base-300 w-full justify-between rounded-xl text-sm font-normal"
        >
          <span class="flex items-center gap-2 truncate">
            {#if dashboardStore.selectedType === "anime"}
              <Clapperboard class="text-info size-4" />
              <span>Anime</span>
            {:else}
              <BookOpen class="text-accent size-4" />
              <span>Manga</span>
            {/if}
          </span>
          <span class="text-xs opacity-50">▼</span>
        </div>
        <ul
          class="dropdown-content menu bg-base-100 border-base-200 z-50 mt-1.5 w-full rounded-xl border p-1 shadow-xl backdrop-blur-lg"
        >
          <li>
            <button
              type="button"
              onclick={() => dashboardStore.setTypeFilter("anime")}
              class={`flex justify-between rounded-lg ${dashboardStore.selectedType === "anime" ? "active text-info font-semibold" : ""}`}
            >
              <span class="flex items-center gap-2">
                <Clapperboard class="size-4" /> Anime
              </span>
              {#if dashboardStore.selectedType === "anime"}<Check class="size-4" />{/if}
            </button>
          </li>
          <li>
            <button
              type="button"
              onclick={() => dashboardStore.setTypeFilter("manga")}
              class={`flex justify-between rounded-lg ${dashboardStore.selectedType === "manga" ? "active text-accent font-semibold" : ""}`}
            >
              <span class="flex items-center gap-2">
                <BookOpen class="size-4" /> Manga
              </span>
              {#if dashboardStore.selectedType === "manga"}<Check class="size-4" />{/if}
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Status Dropdown - Span 2 on desktop -->
    <div class="sm:col-span-2">
      <div class="dropdown w-full">
        <div
          tabindex="0"
          role="button"
          class="btn btn-bordered bg-base-100 border-base-300 w-full justify-between rounded-xl text-sm font-normal"
        >
          <span class="truncate">
            {formatListStatusLabel(dashboardStore.selectedStatus, dashboardStore.selectedType)}
          </span>
          <span class="text-xs opacity-50">▼</span>
        </div>
        <ul
          class="dropdown-content menu bg-base-100 border-base-200 z-50 mt-1.5 w-full rounded-xl border p-1 shadow-xl backdrop-blur-lg"
        >
          <li>
            <button
              type="button"
              onclick={() => dashboardStore.setStatusFilter("ALL")}
              class={dashboardStore.selectedStatus === "ALL" ? "active font-semibold" : ""}
            >
              All Statuses
            </button>
          </li>
          <li>
            <button
              type="button"
              onclick={() => dashboardStore.setStatusFilter("current")}
              class={dashboardStore.selectedStatus === "current" ? "active font-semibold" : ""}
            >
              {formatListStatusLabel("current", dashboardStore.selectedType)}
            </button>
          </li>
          <li>
            <button
              type="button"
              onclick={() => dashboardStore.setStatusFilter("completed")}
              class={dashboardStore.selectedStatus === "completed" ? "active font-semibold" : ""}
            >
              {formatListStatusLabel("completed", dashboardStore.selectedType)}
            </button>
          </li>
          <li>
            <button
              type="button"
              onclick={() => dashboardStore.setStatusFilter("paused")}
              class={dashboardStore.selectedStatus === "paused" ? "active font-semibold" : ""}
            >
              {formatListStatusLabel("paused", dashboardStore.selectedType)}
            </button>
          </li>
          <li>
            <button
              type="button"
              onclick={() => dashboardStore.setStatusFilter("dropped")}
              class={dashboardStore.selectedStatus === "dropped" ? "active font-semibold" : ""}
            >
              {formatListStatusLabel("dropped", dashboardStore.selectedType)}
            </button>
          </li>
          <li>
            <button
              type="button"
              onclick={() => dashboardStore.setStatusFilter("planning")}
              class={dashboardStore.selectedStatus === "planning" ? "active font-semibold" : ""}
            >
              {formatListStatusLabel("planning", dashboardStore.selectedType)}
            </button>
          </li>
          <li>
            <button
              type="button"
              onclick={() => dashboardStore.setStatusFilter("repeating")}
              class={dashboardStore.selectedStatus === "repeating" ? "active font-semibold" : ""}
            >
              {formatListStatusLabel("repeating", dashboardStore.selectedType)}
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Sort By Selector - Span 2 on desktop -->
    <div class="sm:col-span-2">
      <div class="dropdown dropdown-end w-full">
        <div
          tabindex="0"
          role="button"
          class="btn btn-bordered bg-base-100 border-base-300 w-full justify-between rounded-xl text-sm font-normal"
        >
          <span class="flex items-center gap-1.5 truncate">
            <ArrowUpDown class="size-3.5 opacity-60" />
            {#if dashboardStore.sortBy === "rating"}Rating
            {:else if dashboardStore.sortBy === "popularity"}Popularity
            {:else if dashboardStore.sortBy === "title"}Title
            {:else if dashboardStore.sortBy === "progress"}Progress
            {:else if dashboardStore.sortBy === "updated"}Updated
            {/if}
          </span>
          <span class="text-xs opacity-50">▼</span>
        </div>
        <ul
          class="dropdown-content menu bg-base-100 border-base-200 z-50 mt-1.5 w-44 rounded-xl border p-1 shadow-xl backdrop-blur-lg"
        >
          <li class="menu-title text-base-content/50 px-2 py-1 text-[10px] font-semibold uppercase">
            Sort Order
          </li>
          <li>
            <button
              type="button"
              onclick={() => dashboardStore.setSortBy("popularity")}
              class={dashboardStore.sortBy === "popularity" ? "active font-semibold" : ""}
            >
              Popularity (Rank)
            </button>
          </li>
          <li>
            <button
              type="button"
              onclick={() => dashboardStore.setSortBy("rating")}
              class={dashboardStore.sortBy === "rating" ? "active font-semibold" : ""}
            >
              Score / Rating
            </button>
          </li>
          <li>
            <button
              type="button"
              onclick={() => dashboardStore.setSortBy("title")}
              class={dashboardStore.sortBy === "title" ? "active font-semibold" : ""}
            >
              Title (A - Z)
            </button>
          </li>
          <li>
            <button
              type="button"
              onclick={() => dashboardStore.setSortBy("progress")}
              class={dashboardStore.sortBy === "progress" ? "active font-semibold" : ""}
            >
              Completion %
            </button>
          </li>
          <li>
            <button
              type="button"
              onclick={() => dashboardStore.setSortBy("updated")}
              class={dashboardStore.sortBy === "updated" ? "active font-semibold" : ""}
            >
              Recently Updated
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Item Count Badge - Span 2 on desktop (End aligned) -->
    <div class="flex items-center justify-end sm:col-span-2">
      <span
        class="badge badge-primary badge-md w-full justify-center rounded-xl px-3 py-2 text-center text-xs font-semibold sm:w-auto"
      >
        {dashboardStore.filteredEntries.length} items
      </span>
    </div>
  </div>
</div>
