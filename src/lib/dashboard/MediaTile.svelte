<script lang="ts">
  import {
    Star,
    Flame,
    Tv,
    BookOpen,
    Plus,
    Minus,
    Download,
    CheckCircle2,
    WandSparkles,
    Loader2,
    Building2,
    Calendar,
    FileText,
  } from "@lucide/svelte";
  import { dashboardStore } from "./dashboardStore.svelte";
  import { type MediaEntry, formatMediaFormatLabel, formatListStatusLabel } from "../types/media";
  import {
    resolveTitles,
    resolveCoverImage,
    getStatusBadgeClass,
    getMediaTypeBadgeClass,
  } from "@utils/mediaFormatter";

  let { entry }: { entry: MediaEntry } = $props();

  const media = $derived(entry.media);
  const listEntry = $derived(entry.list_entry);

  const titles = $derived(resolveTitles(media.title, dashboardStore.titleHierarchy));
  const coverSrc = $derived(resolveCoverImage(media.cover));

  const unitLabel = $derived(media.media_type === "anime" ? "Episode" : "Chapter");
  const totalUnits = $derived(
    media.media_type === "anime" ? media.episodes || 0 : media.chapters || 0
  );
  const currentProgress = $derived(listEntry.progress || 0);

  const progressPercent = $derived.by(() => {
    if (!totalUnits || totalUnits <= 0) return 0;
    return Math.min(100, Math.round((currentProgress / totalUnits) * 100));
  });

  const nextUnitNumber = $derived.by(() => {
    if (currentProgress < totalUnits || totalUnits === 0) {
      return currentProgress + 1;
    }
    return currentProgress;
  });

  const isNextInVault = $derived.by(() => {
    return nextUnitNumber <= (entry.vault_unit_count || 0);
  });
</script>

<div
  class="group border-base-300 bg-base-100/90 hover:border-primary/40 relative flex flex-col justify-between overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
>
  <!-- TOP HALF: Cover Image Left & Metadata Right -->
  <div class="flex gap-4 p-4">
    <!-- LEFT PORTION: Media Cover Image -->
    <div class="relative w-28 flex-shrink-0 sm:w-32">
      <div class="bg-base-300 aspect-[2/3] w-full overflow-hidden rounded-xl shadow-md">
        <img
          src={coverSrc}
          alt={titles.primary}
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
        ></div>
      </div>

      <!-- Format Overlay Pill -->
      <div class="absolute top-2 left-2 flex flex-col gap-1">
        <span
          class={`badge badge-sm font-semibold shadow-xs ${getMediaTypeBadgeClass(media.media_type)}`}
        >
          {formatMediaFormatLabel(media.format)}
        </span>
      </div>

      <!-- Status badge overlay bottom left -->
      <div class="absolute right-2 bottom-2 left-2">
        <span
          class={`badge badge-xs w-full py-1 text-[10px] font-bold tracking-wider uppercase shadow-xs ${getStatusBadgeClass(listEntry.status)}`}
        >
          {formatListStatusLabel(listEntry.status, media.media_type)}
        </span>
      </div>
    </div>

    <!-- RIGHT PORTION: Metadata -->
    <div class="flex min-w-0 flex-1 flex-col justify-between">
      <!-- Main Title & Romaji Title (ALWAYS SHOWN) -->
      <div class="space-y-1">
        <h3
          class="text-base-content group-hover:text-primary line-clamp-2 text-sm leading-tight font-bold transition-colors sm:text-base"
          title={titles.primary}
        >
          {titles.primary}
        </h3>
        {#if titles.romaji}
          <p
            class="text-base-content/65 line-clamp-1 text-xs leading-snug font-normal italic"
            title={titles.romaji}
          >
            {titles.romaji}
          </p>
        {/if}
      </div>

      <!-- Configurable Metadata Chips -->
      <div class="my-2.5 flex flex-wrap items-center gap-1.5">
        <!-- PERMANENT RATING CHIP (Cannot be removed) -->
        <span
          class="bg-warning/15 text-warning inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold"
          title="Community Score"
        >
          <Star class="fill-warning text-warning size-3" />
          <span>{media.mean_score ? media.mean_score.toFixed(2) : "N/A"}</span>
        </span>

        <!-- Optional Popularity Chip -->
        {#if dashboardStore.visibleChips.popularity && media.popularity}
          <span
            class="bg-error/10 text-error inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium"
            title="Popularity Rank"
          >
            <Flame class="text-error size-3" />
            <span>#{media.popularity}</span>
          </span>
        {/if}

        <!-- Optional Provider / Source Chip -->
        {#if dashboardStore.visibleChips.source}
          <span
            class="bg-base-200 text-base-content/80 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium"
            title="Media Provider"
          >
            <FileText class="size-3 opacity-70" />
            <span>{media.provider}</span>
          </span>
        {/if}

        <!-- Optional Format Chip -->
        {#if dashboardStore.visibleChips.format}
          <span
            class="bg-base-200 text-base-content/80 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium"
            title="Format"
          >
            {#if media.media_type === "anime"}<Tv class="size-3 opacity-70" />{:else}<BookOpen
                class="size-3 opacity-70"
              />{/if}
            <span>{formatMediaFormatLabel(media.format)}</span>
          </span>
        {/if}

        <!-- Optional Release Status Chip -->
        {#if dashboardStore.visibleChips.season}
          <span
            class="bg-base-200 text-base-content/80 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium capitalize"
            title="Release Status"
          >
            <Calendar class="size-3 opacity-70" />
            <span>{media.release_status.replace("_", " ")}</span>
          </span>
        {/if}

        <!-- Optional Genres Chip -->
        {#if dashboardStore.visibleChips.genres && media.genres.length > 0}
          <span
            class="bg-secondary/15 text-secondary inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium"
            title="Genres"
          >
            <span>{media.genres.slice(0, 2).join(", ")}</span>
          </span>
        {/if}
      </div>

      <!-- Progress Section -->
      <div class="bg-base-200/50 border-base-300/40 space-y-1.5 rounded-xl border p-2">
        <div class="flex items-center justify-between text-xs font-medium">
          <span class="text-base-content/75 flex items-center gap-1">
            <span>{unitLabel} Progress</span>
          </span>
          <div class="flex items-center gap-2">
            <span class="text-primary font-bold">
              {currentProgress} / {totalUnits > 0 ? totalUnits : "?"}
            </span>
            <span class="text-base-content/60 text-[10px] font-semibold">
              ({progressPercent}%)
            </span>
          </div>
        </div>

        <!-- Animated Progress Bar -->
        <div class="bg-base-300 relative h-2 w-full overflow-hidden rounded-full">
          <div
            class="from-primary via-secondary to-accent h-full bg-gradient-to-r transition-all duration-300"
            style:width="{progressPercent}%"
          ></div>
        </div>

        <!-- Quick Increment / Decrement Buttons -->
        <div class="flex items-center justify-between pt-0.5">
          <span class="text-base-content/50 text-[10px]">Quick Track</span>
          <div class="flex items-center gap-1">
            <button
              type="button"
              onclick={() => dashboardStore.decrementProgress(media.id)}
              disabled={currentProgress <= 0}
              class="btn btn-ghost btn-xs hover:bg-base-300 size-6 min-h-0 rounded-lg p-0 disabled:opacity-30"
              title="Decrease Progress (-1)"
            >
              <Minus class="size-3" />
            </button>
            <span class="min-w-4 px-1 text-center text-xs font-bold">{currentProgress}</span>
            <button
              type="button"
              onclick={() => dashboardStore.incrementProgress(media.id)}
              disabled={totalUnits > 0 && currentProgress >= totalUnits}
              class="btn btn-ghost btn-xs hover:bg-primary/20 hover:text-primary size-6 min-h-0 rounded-lg p-0 disabled:opacity-30"
              title="Increase Progress (+1)"
            >
              <Plus class="size-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- BOTTOM PORTION: Two Action Buttons -->
  <div class="border-base-200 bg-base-200/40 grid grid-cols-2 gap-2 border-t p-2.5">
    <!-- First Button: Download Next / Current Episode (Checks Vault) -->
    <button
      type="button"
      onclick={() => dashboardStore.downloadNextUnit(media.id)}
      disabled={entry.downloading}
      class={`btn btn-sm gap-1.5 rounded-xl text-xs font-medium transition-all ${
        isNextInVault ? "btn-success btn-soft hover:btn-success" : "btn-primary hover:shadow-md"
      }`}
      title={isNextInVault
        ? `Vault Check: ${unitLabel} ${nextUnitNumber} already exists in Vault`
        : `Download ${unitLabel} ${nextUnitNumber}`}
    >
      {#if entry.downloading}
        <Loader2 class="size-3.5 animate-spin" />
        <span>{entry.download_progress}%</span>
      {:else if isNextInVault}
        <CheckCircle2 class="text-success size-3.5" />
        <span class="truncate">In Vault ({unitLabel} {nextUnitNumber})</span>
      {:else}
        <Download class="size-3.5" />
        <span class="truncate">Download {unitLabel} {nextUnitNumber}</span>
      {/if}
    </button>

    <!-- Second Button: Smart Matcher Screen Trigger -->
    <button
      type="button"
      onclick={() => dashboardStore.openSmartMatcher(entry)}
      class="btn btn-outline btn-secondary btn-sm gap-1.5 rounded-xl text-xs font-medium transition-all hover:shadow-md"
      title="Open Smart Matcher for this media"
    >
      <WandSparkles class="size-3.5" />
      <span class="truncate">Smart Matcher</span>
    </button>
  </div>
</div>
