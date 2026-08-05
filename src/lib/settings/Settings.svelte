<script lang="ts">
  import { Palette, SlidersHorizontal, Info, LayoutDashboard } from "@lucide/svelte";
  import Appearance from "./Appearance.svelte";
  import DashboardSettings from "./DashboardSettings.svelte";
  import About from "./About.svelte";

  let activeTab = $state<"appearance" | "dashboard" | "about">("appearance");
</script>

<div class="mx-auto max-w-6xl space-y-8 pb-12">
  <!-- Page Header -->
  <div
    class="border-base-300 flex flex-col justify-between gap-4 border-b pb-6 sm:flex-row sm:items-center"
  >
    <div>
      <div class="flex items-center gap-3">
        <div class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
          <SlidersHorizontal class="size-6" />
        </div>
        <div>
          <h1 class="text-base-content text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
          <p class="text-base-content/70 text-sm">
            Customize your visual workspace, dashboard preferences, and application behavior
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Navigation Tabs -->
  <div class="role-tablist tabs tabs-box bg-base-200 flex w-fit items-center p-1">
    <button
      type="button"
      role="tab"
      onclick={() => (activeTab = "appearance")}
      class={`tab text-sm font-medium transition-all ${activeTab === "appearance" ? "tab-active bg-primary text-primary-content shadow-xs" : ""}`}
    >
      <Palette class="mr-2 size-4" />
      Appearance
    </button>

    <div class="bg-base-content/20 h-4 w-px shrink-0 self-center" aria-hidden="true"></div>

    <button
      type="button"
      role="tab"
      onclick={() => (activeTab = "dashboard")}
      class={`tab text-sm font-medium transition-all ${activeTab === "dashboard" ? "tab-active bg-primary text-primary-content shadow-xs" : ""}`}
    >
      <LayoutDashboard class="mr-2 size-4" />
      Dashboard
    </button>

    <div class="bg-base-content/20 h-4 w-px shrink-0 self-center" aria-hidden="true"></div>

    <button
      type="button"
      role="tab"
      onclick={() => (activeTab = "about")}
      class={`tab text-sm font-medium transition-all ${activeTab === "about" ? "tab-active bg-primary text-primary-content shadow-xs" : ""}`}
    >
      <Info class="mr-2 size-4" />
      About
    </button>
  </div>

  {#if activeTab === "appearance"}
    <!-- Main Appearance Section -->
    <Appearance />
  {:else if activeTab === "dashboard"}
    <!-- Dashboard Preferences Section -->
    <DashboardSettings />
  {:else if activeTab === "about"}
    <!-- About Section -->
    <About />
  {/if}
</div>
