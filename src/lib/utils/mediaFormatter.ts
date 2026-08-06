import type { MediaTitle, CoverImage, ListStatus, MediaType, MediaFormat } from "../types/media";
import type { TitleHierarchyMode } from "../dashboard/dashboardStore.svelte";

export interface ResolvedTitles {
  primary: string;
  romaji: string;
}

/**
 * Resolves primary and romaji titles based on user preference hierarchy.
 * Both titles are always rendered.
 */
export function resolveTitles(
  title: MediaTitle,
  hierarchy: TitleHierarchyMode = "primary_first"
): ResolvedTitles {
  const main = title.user_preferred || title.english || title.romanized || "Untitled";
  const romaji = title.romanized || "";

  if (hierarchy === "alternate_first") {
    return {
      primary: romaji || main,
      romaji: romaji && romaji !== main ? main : "",
    };
  }

  return {
    primary: main,
    romaji: romaji && romaji !== main ? romaji : "",
  };
}

/**
 * Resolves the best available cover image URL.
 */
export function resolveCoverImage(cover: CoverImage): string {
  return cover.extra_large || cover.large || cover.medium || "";
}

/**
 * Helper function to format MediaFormat into human-readable label.
 */
export function formatMediaFormatLabel(format: MediaFormat): string {
  const norm = (format || "").toLowerCase();
  switch (norm) {
    case "tv":
      return "TV";
    case "tvshort":
    case "tv_short":
      return "TV Short";
    case "movie":
      return "Movie";
    case "special":
      return "Special";
    case "ova":
      return "OVA";
    case "ona":
      return "ONA";
    case "music":
      return "Music";
    case "manga":
      return "Manga";
    case "novel":
      return "Novel";
    case "oneshot":
    case "one_shot":
      return "One-Shot";
    case "doujinshi":
      return "Doujinshi";
    case "manhwa":
      return "Manhwa";
    case "manhua":
      return "Manhua";
    case "oel":
      return "OEL";
    default:
      return "Unknown";
  }
}

/**
 * Helper function to format ListStatus into human-readable label.
 */
export function formatListStatusLabel(status: ListStatus | "ALL", mediaType: MediaType): string {
  if (status === "ALL") return "All Statuses";
  const normStatus = (status || "").toLowerCase();
  const isAnime = (mediaType || "").toLowerCase() === "anime";

  switch (normStatus) {
    case "current":
      return isAnime ? "Watching" : "Reading";
    case "planning":
      return isAnime ? "Plan to Watch" : "Plan to Read";
    case "completed":
      return "Completed";
    case "paused":
      return "On Hold";
    case "dropped":
      return "Dropped";
    case "repeating":
      return isAnime ? "Re-watching" : "Re-reading";
    default:
      return "Unknown";
  }
}

/**
 * Returns DaisyUI badge styling classes for ListStatus.
 */
export function getStatusBadgeClass(status: ListStatus): string {
  const norm = (status || "").toLowerCase();
  switch (norm) {
    case "current":
      return "badge-primary";
    case "completed":
      return "badge-success";
    case "paused":
      return "badge-warning";
    case "dropped":
      return "badge-error";
    case "planning":
      return "badge-ghost";
    case "repeating":
      return "badge-secondary";
    default:
      return "badge-ghost";
  }
}

/**
 * Returns DaisyUI badge styling classes for MediaType format pill.
 */
export function getMediaTypeBadgeClass(type: MediaType): string {
  const isAnime = (type || "").toLowerCase() === "anime";
  return isAnime ? "bg-info/90 text-info-content" : "bg-accent/90 text-accent-content";
}
