import { router } from "@store/router.svelte";
import { userManager } from "@user/user.svelte";
import { mediaRepository } from "@services/mediaRepository";
import type { MediaEntry, MediaType, ListStatus } from "../types/media";

export type TitleHierarchyMode = "primary_first" | "alternate_first";

export interface MetadataChipSettings {
  rating: boolean;
  popularity: boolean;
  source: boolean;
  format: boolean;
  season: boolean;
  episodes_duration: boolean;
  chapters_volumes: boolean;
  genres: boolean;
  nsfw: boolean;
  personal_score: boolean;
  user_tags: boolean;
}

class DashboardStore {
  // Server media entries state
  allEntries = $state.raw<MediaEntry[]>([]);

  // Network & Request States
  isLoading = $state<boolean>(false);
  error = $state<string | null>(null);
  hasFetchedOnce = $state<boolean>(false);
  isConnected = $state<boolean>(false);

  // Filters: selectedType is strictly MediaType ("anime" | "manga"), NO "ALL" option!
  searchQuery = $state<string>("");
  selectedType = $state<MediaType>("anime");
  selectedStatus = $state<ListStatus | "ALL">("ALL");
  sortBy = $state<"rating" | "popularity" | "title" | "progress" | "updated">("popularity");

  // Settings
  titleHierarchy = $state<TitleHierarchyMode>("primary_first");
  visibleChips = $state<MetadataChipSettings>({
    rating: true,
    popularity: true,
    source: true,
    format: true,
    season: true,
    episodes_duration: true,
    chapters_volumes: true,
    genres: false,
    nsfw: false,
    personal_score: true,
    user_tags: false,
  });

  // Infinite Scroll Pagination
  pageSize = 12;
  displayedCount = $state<number>(12);
  isLoadingMore = $state<boolean>(false);

  // Selected item context passed to Smart Matcher
  activeMatcherEntry = $state<MediaEntry | null>(null);

  /**
   * Fetches media entries via the MediaRepository seam
   */
  async fetchMedia() {
    const user = userManager.currentUser;
    if (!user) {
      this.allEntries = [];
      this.hasFetchedOnce = true;
      this.isConnected = false;
      this.error = "No active user profile selected.";
      return;
    }

    this.isLoading = true;
    this.error = null;

    try {
      const provider = user.provider || "ANILIST";
      const { entries, errors } = await mediaRepository.fetchUserMedia(user.id, provider);

      this.allEntries = entries;
      this.hasFetchedOnce = true;
      this.isConnected = errors.length === 0 || entries.length > 0;

      if (entries.length === 0 && errors.length > 0) {
        this.error = errors.join(" | ");
      }
      this.resetPagination();
    } catch (err: unknown) {
      this.allEntries = [];
      this.hasFetchedOnce = true;
      this.isConnected = false;
      this.error = err instanceof Error ? err.message : "Failed to connect to server";
    } finally {
      this.isLoading = false;
    }
  }

  // Derived filtered items list
  filteredEntries = $derived.by(() => {
    let list = this.allEntries;

    // Filter strictly by selected Media Type ("anime" | "manga")
    list = list.filter(
      (e) => (e.media.media_type || "").toLowerCase() === this.selectedType.toLowerCase()
    );

    // Filter by List Status
    if (this.selectedStatus !== "ALL") {
      list = list.filter(
        (e) => (e.list_entry.status || "").toLowerCase() === this.selectedStatus.toLowerCase()
      );
    }

    // Filter by Search Query
    if (this.searchQuery.trim() !== "") {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter((e) => {
        const title = e.media.title;
        const mainTitle = (
          title.user_preferred ||
          title.english ||
          title.romanized ||
          ""
        ).toLowerCase();
        const altTitle = (title.native || title.romanized || "").toLowerCase();
        const genresMatch = e.media.genres?.some((g) => g.toLowerCase().includes(q)) ?? false;
        return mainTitle.includes(q) || altTitle.includes(q) || genresMatch;
      });
    }

    // Sort items
    return [...list].sort((a, b) => {
      if (this.sortBy === "rating") return (b.media.mean_score || 0) - (a.media.mean_score || 0);
      if (this.sortBy === "popularity")
        return (a.media.popularity || 9999) - (b.media.popularity || 9999);
      if (this.sortBy === "title") {
        const titleA =
          a.media.title.user_preferred || a.media.title.english || a.media.title.romanized || "";
        const titleB =
          b.media.title.user_preferred || b.media.title.english || b.media.title.romanized || "";
        return titleA.localeCompare(titleB);
      }
      if (this.sortBy === "progress") {
        const totalA = a.media.episodes || a.media.chapters || 1;
        const totalB = b.media.episodes || b.media.chapters || 1;
        const pA = (a.list_entry.progress || 0) / totalA;
        const pB = (b.list_entry.progress || 0) / totalB;
        return pB - pA;
      }
      if (this.sortBy === "updated") {
        const uA = a.list_entry.updated_at || "";
        const uB = b.list_entry.updated_at || "";
        return uB.localeCompare(uA);
      }
      return 0;
    });
  });

  // Paginated subset for infinite scrolling
  paginatedEntries = $derived.by(() => {
    return this.filteredEntries.slice(0, this.displayedCount);
  });

  hasMore = $derived(this.displayedCount < this.filteredEntries.length);

  // Stats summaries
  stats = $derived.by(() => {
    const total = this.allEntries.length;
    const animeCount = this.allEntries.filter(
      (e) => (e.media.media_type || "").toLowerCase() === "anime"
    ).length;
    const mangaCount = this.allEntries.filter(
      (e) => (e.media.media_type || "").toLowerCase() === "manga"
    ).length;
    const watchingCount = this.allEntries.filter(
      (e) => (e.list_entry.status || "").toLowerCase() === "current"
    ).length;
    const completedCount = this.allEntries.filter(
      (e) => (e.list_entry.status || "").toLowerCase() === "completed"
    ).length;
    return { total, animeCount, mangaCount, watchingCount, completedCount };
  });

  loadMore() {
    if (this.isLoadingMore || !this.hasMore) return;
    this.isLoadingMore = true;
    setTimeout(() => {
      this.displayedCount += this.pageSize;
      this.isLoadingMore = false;
    }, 300);
  }

  resetPagination() {
    this.displayedCount = this.pageSize;
  }

  setSearch(query: string) {
    this.searchQuery = query;
    this.resetPagination();
  }

  setTypeFilter(type: MediaType) {
    this.selectedType = type;
    this.resetPagination();
  }

  setStatusFilter(status: ListStatus | "ALL") {
    this.selectedStatus = status;
    this.resetPagination();
  }

  setSortBy(sort: "rating" | "popularity" | "title" | "progress" | "updated") {
    this.sortBy = sort;
    this.resetPagination();
  }

  setTitleHierarchy(hierarchy: TitleHierarchyMode) {
    this.titleHierarchy = hierarchy;
  }

  toggleChipSetting(chipKey: keyof MetadataChipSettings) {
    if (chipKey === "rating") return;
    this.visibleChips = {
      ...this.visibleChips,
      [chipKey]: !this.visibleChips[chipKey],
    };
  }

  incrementProgress(id: string) {
    this.allEntries = this.allEntries.map((entry) => {
      if (entry.media.id === id) {
        const total = entry.media.episodes || entry.media.chapters || 999;
        const current = entry.list_entry.progress || 0;
        const next = Math.min(total, current + 1);
        const inVault = next <= (entry.vault_unit_count || 0);
        const isCompleted = next === total && total > 0;
        return {
          ...entry,
          list_entry: {
            ...entry.list_entry,
            progress: next,
            status: isCompleted ? "completed" : entry.list_entry.status,
          },
          in_vault: inVault,
        };
      }
      return entry;
    });
  }

  decrementProgress(id: string) {
    this.allEntries = this.allEntries.map((entry) => {
      if (entry.media.id === id) {
        const current = entry.list_entry.progress || 0;
        const prev = Math.max(0, current - 1);
        const inVault = prev <= (entry.vault_unit_count || 0);
        return {
          ...entry,
          list_entry: {
            ...entry.list_entry,
            progress: prev,
          },
          in_vault: inVault,
        };
      }
      return entry;
    });
  }

  downloadNextUnit(id: string) {
    const entry = this.allEntries.find((e) => e.media.id === id);
    if (!entry) return;

    const total = entry.media.episodes || entry.media.chapters || 999;
    const current = entry.list_entry.progress || 0;
    const targetUnit = current < total ? current + 1 : current;

    this.allEntries = this.allEntries.map((e) =>
      e.media.id === id ? { ...e, downloading: true, download_progress: 0 } : e
    );

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      if (progress >= 100) {
        clearInterval(interval);
        this.allEntries = this.allEntries.map((e) => {
          if (e.media.id === id) {
            const newVaultCount = Math.max(e.vault_unit_count || 0, targetUnit);
            const isCompleted = targetUnit === total && total > 0;
            return {
              ...e,
              downloading: false,
              download_progress: 100,
              in_vault: true,
              vault_unit_count: newVaultCount,
              list_entry: {
                ...e.list_entry,
                progress: targetUnit,
                status: isCompleted ? "completed" : e.list_entry.status,
              },
            };
          }
          return e;
        });
      } else {
        this.allEntries = this.allEntries.map((e) =>
          e.media.id === id ? { ...e, download_progress: progress } : e
        );
      }
    }, 300);
  }

  openSmartMatcher(entry: MediaEntry) {
    this.activeMatcherEntry = entry;
    router.navigate("smartMatcher");
  }
}

export const dashboardStore = new DashboardStore();
