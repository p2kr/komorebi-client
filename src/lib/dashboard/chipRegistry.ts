import type { Component } from "svelte";
import {
  Star,
  Flame,
  FileText,
  Tv,
  Calendar,
  Clock,
  BookOpen,
  Layers,
  ShieldAlert,
  Sparkles,
  Tag,
} from "@lucide/svelte";
import type { MetadataChipSettings } from "./dashboardStore.svelte";

/**
 * Dedicated Icon Map for Metadata Chips
 */
export const CHIP_ICON_MAP: Record<keyof MetadataChipSettings, Component> = {
  rating: Star,
  popularity: Flame,
  source: FileText,
  format: Tv,
  season: Calendar,
  episodes_duration: Clock,
  chapters_volumes: BookOpen,
  genres: Layers,
  nsfw: ShieldAlert,
  personal_score: Sparkles,
  user_tags: Tag,
};

export interface ChipDefinition {
  key: keyof MetadataChipSettings;
  label: string;
  description: string;
  icon: Component;
  isPermanent?: boolean;
}

/**
 * Dynamic registry of all metadata chip definitions available in the Media / ListEntry models.
 */
export const CHIP_DEFINITIONS: ChipDefinition[] = [
  {
    key: "rating",
    label: "Community Score (⭐ Rating)",
    description: "Mean score rated by the community",
    icon: CHIP_ICON_MAP.rating,
    isPermanent: true,
  },
  {
    key: "popularity",
    label: "Popularity Rank (#)",
    description: "Global popularity rank across users",
    icon: CHIP_ICON_MAP.popularity,
  },
  {
    key: "source",
    label: "Adaptation Source",
    description: "Media provider source (MAL / AniList)",
    icon: CHIP_ICON_MAP.source,
  },
  {
    key: "format",
    label: "Format & Type",
    description: "TV, Movie, OVA, Manga, Manhwa, etc.",
    icon: CHIP_ICON_MAP.format,
  },
  {
    key: "season",
    label: "Release Status",
    description: "Releasing, Finished, Hiatus, etc.",
    icon: CHIP_ICON_MAP.season,
  },
  {
    key: "episodes_duration",
    label: "Episodes & Duration",
    description: "Total episode count and runtime",
    icon: CHIP_ICON_MAP.episodes_duration,
  },
  {
    key: "chapters_volumes",
    label: "Chapters & Volumes",
    description: "Total chapter and volume counts for manga",
    icon: CHIP_ICON_MAP.chapters_volumes,
  },
  {
    key: "genres",
    label: "Genres List",
    description: "Primary genre tags assigned to media",
    icon: CHIP_ICON_MAP.genres,
  },
  {
    key: "nsfw",
    label: "Content Rating (NSFW)",
    description: "Age appropriateness level (Safe / Gray / NSFW)",
    icon: CHIP_ICON_MAP.nsfw,
  },
  {
    key: "personal_score",
    label: "Personal Rating",
    description: "Your assigned personal list score",
    icon: CHIP_ICON_MAP.personal_score,
  },
  {
    key: "user_tags",
    label: "Personal Tags",
    description: "Custom user tags on list entry",
    icon: CHIP_ICON_MAP.user_tags,
  },
];
