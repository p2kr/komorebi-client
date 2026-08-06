<script lang="ts">
  import {
    Star,
    Flame,
    Tv,
    Calendar,
    FileText,
    Clock,
    BookOpen,
    Layers,
    ShieldAlert,
    Sparkles,
    Tag,
    Eye,
  } from "@lucide/svelte";
  import { dashboardStore } from "./dashboardStore.svelte";

  // Mock data for live preview
  const sampleData = {
    englishTitle: "Demon Slayer: Kimetsu no Yaiba",
    romajiTitle: "Kimetsu no Yaiba",
    rating: 8.65,
    popularity: 14,
    provider: "ANILIST",
    format: "TV",
    releaseStatus: "Releasing",
    episodes: 26,
    duration: 24,
    chapters: 205,
    volumes: 23,
    genres: ["Action", "Fantasy"],
    nsfw: "Safe",
    personalScore: 9,
    userTags: ["Favorites", "Masterpiece"],
  };

  const primaryTitle = $derived(
    dashboardStore.titleHierarchy === "primary_first"
      ? sampleData.englishTitle
      : sampleData.romajiTitle
  );

  const secondaryTitle = $derived(
    dashboardStore.titleHierarchy === "primary_first"
      ? sampleData.romajiTitle
      : sampleData.englishTitle
  );
</script>

<div class="border-base-300 bg-base-200/40 space-y-3 rounded-2xl border p-4 shadow-sm">
  <!-- Header Label -->
  <div class="flex items-center justify-between">
    <div
      class="text-base-content/75 flex items-center gap-1.5 text-sm font-bold tracking-wider uppercase"
    >
      <Eye class="text-primary size-4" />
      <span>Preview</span>
    </div>
  </div>

  <!-- Mini Preview Card -->
  <div class="border-base-300 bg-base-100 flex gap-3 rounded-xl border p-3 shadow-xs">
    <!-- Left Cover Mock -->
    <div
      class="from-primary/30 via-secondary/20 to-accent/30 border-base-300 relative flex aspect-[2/3] w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-gradient-to-br sm:w-20"
    >
      <div class="text-primary/80 px-1 text-center text-sm font-black tracking-widest uppercase">
        Cover Art
      </div>
      <span class="badge badge-primary badge-sm absolute top-1 left-1 text-sm font-bold">TV</span>
    </div>

    <!-- Right Content -->
    <div class="flex min-w-0 flex-1 flex-col justify-between space-y-2">
      <!-- Title Hierarchy Preview -->
      <div class="space-y-0.5">
        <h4 class="text-base-content truncate text-base leading-snug font-bold sm:text-lg">
          {primaryTitle}
        </h4>
        <p class="text-base-content/70 truncate text-sm italic">
          {secondaryTitle}
        </p>
      </div>

      <!-- Live Metadata Chips Preview -->
      <div class="flex flex-wrap items-center gap-1">
        {#if dashboardStore.visibleChips.rating}
          <span
            class="bg-warning/15 text-warning inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-semibold"
          >
            <Star class="fill-warning text-warning size-3.5" />
            <span>{sampleData.rating}</span>
          </span>
        {/if}

        {#if dashboardStore.visibleChips.popularity}
          <span
            class="bg-error/10 text-error inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-medium"
          >
            <Flame class="text-error size-3.5" />
            <span>#{sampleData.popularity}</span>
          </span>
        {/if}

        {#if dashboardStore.visibleChips.personal_score}
          <span
            class="bg-primary/15 text-primary inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-semibold"
          >
            <Sparkles class="text-primary size-3.5" />
            <span>My: {sampleData.personalScore}/10</span>
          </span>
        {/if}

        {#if dashboardStore.visibleChips.source}
          <span
            class="bg-base-200 text-base-content/80 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-medium"
          >
            <FileText class="size-3.5 opacity-70" />
            <span>{sampleData.provider}</span>
          </span>
        {/if}

        {#if dashboardStore.visibleChips.format}
          <span
            class="bg-base-200 text-base-content/80 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-medium"
          >
            <Tv class="size-3.5 opacity-70" />
            <span>{sampleData.format}</span>
          </span>
        {/if}

        {#if dashboardStore.visibleChips.season}
          <span
            class="bg-base-200 text-base-content/80 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-medium"
          >
            <Calendar class="size-3.5 opacity-70" />
            <span>{sampleData.releaseStatus}</span>
          </span>
        {/if}

        {#if dashboardStore.visibleChips.episodes_duration}
          <span
            class="bg-base-200 text-base-content/80 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-medium"
          >
            <Clock class="size-3.5 opacity-70" />
            <span>{sampleData.episodes} Ep · {sampleData.duration}m</span>
          </span>
        {/if}

        {#if dashboardStore.visibleChips.chapters_volumes}
          <span
            class="bg-base-200 text-base-content/80 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-medium"
          >
            <BookOpen class="size-3.5 opacity-70" />
            <span>{sampleData.chapters} Ch · {sampleData.volumes} Vol</span>
          </span>
        {/if}

        {#if dashboardStore.visibleChips.genres}
          <span
            class="bg-secondary/15 text-secondary inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-medium"
          >
            <Layers class="text-secondary size-3.5" />
            <span>{sampleData.genres.join(", ")}</span>
          </span>
        {/if}

        {#if dashboardStore.visibleChips.nsfw}
          <span
            class="bg-base-200 text-base-content/80 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-medium uppercase"
          >
            <ShieldAlert class="size-3.5 opacity-70" />
            <span>{sampleData.nsfw}</span>
          </span>
        {/if}

        {#if dashboardStore.visibleChips.user_tags}
          <span
            class="bg-base-200 text-base-content/80 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-medium"
          >
            <Tag class="size-3.5 opacity-70" />
            <span>{sampleData.userTags.join(", ")}</span>
          </span>
        {/if}
      </div>
    </div>
  </div>
</div>
