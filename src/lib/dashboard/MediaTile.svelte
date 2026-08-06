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
    Calendar,
    FileText,
    Clock,
    Layers,
    ShieldAlert,
    Sparkles,
    Tag,
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
    <div class="relative w-28 shrink-0 sm:w-32">
      <div class="bg-base-300 aspect-2/3 w-full overflow-hidden rounded-xl shadow-md">
        <img
          src={coverSrc}
          alt={titles.primary}
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div
          class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
        ></div>
      </div>

      <!-- Format Overlay Pill -->
      <div class="absolute top-2 left-2 flex flex-col gap-1">
        <span
          class={`badge badge-sm text-sm font-semibold shadow-xs ${getMediaTypeBadgeClass(media.media_type)}`}
        >
          {formatMediaFormatLabel(media.format)}
        </span>
      </div>

      <!-- Status badge overlay bottom left -->
      <div class="absolute right-2 bottom-2 left-2">
        <span
          class={`badge badge-sm w-full py-1 text-sm font-bold tracking-wider uppercase shadow-xs ${getStatusBadgeClass(listEntry.status)}`}
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
          class="tooltip tooltip-top text-base-content group-hover:text-primary line-clamp-2 text-left text-base leading-tight font-bold transition-colors sm:text-lg"
          data-tip={titles.primary}
        >
          {titles.primary}
        </h3>
        {#if titles.romaji}
          <p
            class="tooltip tooltip-top text-base-content/65 line-clamp-1 text-left text-sm leading-snug font-normal italic"
            data-tip={titles.romaji}
          >
            {titles.romaji}
          </p>
        {/if}
      </div>

      <!-- Configurable Metadata Chips -->
      <div class="my-2 flex flex-wrap items-center gap-1.5">
        <!-- PERMANENT RATING CHIP (Cannot be removed) -->
        {#if dashboardStore.visibleChips.rating}
          <span
            class="tooltip tooltip-top bg-warning/15 text-warning inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-semibold"
            data-tip="Community Score"
          >
            <Star class="fill-warning text-warning size-3.5" />
            <span>{media.mean_score ? media.mean_score.toFixed(2) : "N/A"}</span>
          </span>
        {/if}

        <!-- Optional Popularity Chip -->
        {#if dashboardStore.visibleChips.popularity && media.popularity}
          <span
            class="tooltip tooltip-top bg-error/10 text-error inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-medium"
            data-tip="Popularity Rank"
          >
            <Flame class="text-error size-3.5" />
            <span>#{media.popularity}</span>
          </span>
        {/if}

        <!-- Optional Personal Score Chip -->
        {#if dashboardStore.visibleChips.personal_score && listEntry.score}
          <span
            class="tooltip tooltip-top bg-primary/15 text-primary inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-semibold"
            data-tip="Personal Rating"
          >
            <Sparkles class="text-primary size-3.5" />
            <span>{listEntry.score}/10</span>
          </span>
        {/if}

        <!-- Optional Provider / Source Chip -->
        {#if dashboardStore.visibleChips.source}
          <span
            class="tooltip tooltip-top bg-base-200 text-base-content/80 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-medium"
            data-tip="Media Provider"
          >
            <FileText class="size-3.5 opacity-70" />
            <span>{media.provider}</span>
          </span>
        {/if}

        <!-- Optional Format Chip -->
        {#if dashboardStore.visibleChips.format}
          <span
            class="tooltip tooltip-top bg-base-200 text-base-content/80 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-medium"
            data-tip="Format"
          >
            {#if media.media_type === "anime"}<Tv class="size-3.5 opacity-70" />{:else}<BookOpen
                class="size-3.5 opacity-70"
              />{/if}
            <span>{formatMediaFormatLabel(media.format)}</span>
          </span>
        {/if}

        <!-- Optional Release Status Chip -->
        {#if dashboardStore.visibleChips.season}
          <span
            class="tooltip tooltip-top bg-base-200 text-base-content/80 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-medium capitalize"
            data-tip="Release Status"
          >
            <Calendar class="size-3.5 opacity-70" />
            <span>{media.release_status.replace("_", " ")}</span>
          </span>
        {/if}

        <!-- Optional Episodes & Duration Chip -->
        {#if dashboardStore.visibleChips.episodes_duration && (media.episodes || media.duration)}
          <span
            class="tooltip tooltip-top bg-base-200 text-base-content/80 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-medium"
            data-tip="Episodes & Runtime"
          >
            <Clock class="size-3.5 opacity-70" />
            <span>
              {media.episodes ? `${media.episodes} Ep` : ""}{media.episodes && media.duration
                ? " · "
                : ""}{media.duration ? `${media.duration}m` : ""}
            </span>
          </span>
        {/if}

        <!-- Optional Chapters & Volumes Chip -->
        {#if dashboardStore.visibleChips.chapters_volumes && (media.chapters || media.volumes)}
          <span
            class="tooltip tooltip-top bg-base-200 text-base-content/80 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-medium"
            data-tip="Chapters & Volumes"
          >
            <BookOpen class="size-3.5 opacity-70" />
            <span>
              {media.chapters ? `${media.chapters} Ch` : ""}{media.chapters && media.volumes
                ? " · "
                : ""}{media.volumes ? `${media.volumes} Vol` : ""}
            </span>
          </span>
        {/if}

        <!-- Optional Genres Chip -->
        {#if dashboardStore.visibleChips.genres && media.genres?.length > 0}
          <span
            class="tooltip tooltip-top bg-secondary/15 text-secondary inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-medium"
            data-tip="Genres"
          >
            <Layers class="text-secondary size-3.5" />
            <span>{media.genres.slice(0, 2).join(", ")}</span>
          </span>
        {/if}

        <!-- Optional NSFW / Content Level Chip -->
        {#if dashboardStore.visibleChips.nsfw && media.nsfw}
          <span
            class="tooltip tooltip-top bg-base-200 text-base-content/80 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-medium uppercase"
            data-tip="Content Rating"
          >
            <ShieldAlert class="size-3.5 opacity-70" />
            <span>{media.nsfw}</span>
          </span>
        {/if}

        <!-- Optional User Tags Chip -->
        {#if dashboardStore.visibleChips.user_tags && listEntry.tags?.length > 0}
          <span
            class="tooltip tooltip-top bg-base-200 text-base-content/80 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-medium"
            data-tip="Personal Tags"
          >
            <Tag class="size-3.5 opacity-70" />
            <span>{listEntry.tags.slice(0, 2).join(", ")}</span>
          </span>
        {/if}
      </div>

      <!-- Progress Section -->
      <div class="bg-base-200/50 border-base-300/40 space-y-1.5 rounded-xl border p-2">
        <div class="flex items-center justify-between text-sm font-medium">
          <span class="text-base-content/75 flex items-center gap-1">
            <span>{unitLabel} Progress</span>
          </span>
          <div class="flex items-center gap-2">
            <span class="text-primary font-bold">
              {currentProgress} / {totalUnits > 0 ? totalUnits : "?"}
            </span>
            <span class="text-base-content/70 text-sm font-semibold">
              ({progressPercent}%)
            </span>
          </div>
        </div>

        <!-- Animated Progress Bar -->
        <div class="bg-base-300 relative h-2 w-full overflow-hidden rounded-full">
          <div
            class="from-primary via-secondary to-accent h-full bg-linear-to-r transition-all duration-300"
            style:width="{progressPercent}%"
          ></div>
        </div>

        <!-- Quick Increment / Decrement Buttons -->
        <div class="flex items-center justify-between pt-0.5">
          <span class="text-base-content/60 text-sm font-medium">Quick Track</span>
          <div class="flex items-center gap-1">
            <button
              type="button"
              onclick={() => dashboardStore.decrementProgress(media.id)}
              disabled={currentProgress <= 0}
              class="tooltip tooltip-top btn btn-ghost btn-xs hover:bg-base-300 size-6 min-h-0 rounded-lg p-0 disabled:opacity-30"
              data-tip="Decrease Progress (-1)"
            >
              <Minus class="size-3.5" />
            </button>
            <span class="min-w-4 px-1 text-center text-sm font-bold">{currentProgress}</span>
            <button
              type="button"
              onclick={() => dashboardStore.incrementProgress(media.id)}
              disabled={totalUnits > 0 && currentProgress >= totalUnits}
              class="tooltip tooltip-top btn btn-ghost btn-xs hover:bg-primary/20 hover:text-primary size-6 min-h-0 rounded-lg p-0 disabled:opacity-30"
              data-tip="Increase Progress (+1)"
            >
              <Plus class="size-3.5" />
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
      class={`tooltip tooltip-top btn btn-sm gap-1.5 rounded-xl text-sm font-medium transition-all ${
        isNextInVault ? "btn-success btn-soft hover:btn-success" : "btn-primary hover:shadow-md"
      }`}
      data-tip={isNextInVault
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
      class="tooltip tooltip-top btn btn-outline btn-secondary btn-sm gap-1.5 rounded-xl text-sm font-medium transition-all hover:shadow-md"
      data-tip="Open Smart Matcher for this media"
    >
      <WandSparkles class="size-3.5" />
      <span class="truncate">Smart Matcher</span>
    </button>
  </div>
</div>
