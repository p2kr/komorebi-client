import type { MediaTitle, CoverImage, ListStatus, MediaType } from "../types/media";
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
 * Returns DaisyUI badge styling classes for ListStatus.
 */
export function getStatusBadgeClass(status: ListStatus): string {
  switch (status) {
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
  return type === "anime" ? "bg-info/90 text-info-content" : "bg-accent/90 text-accent-content";
}
