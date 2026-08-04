<script lang="ts">
  import Header from '@appbar/Header.svelte';
  import Drawer from '@appbar/Drawer.svelte';
  import { router } from '@navigation/router.svelte';

  let isCollapsed = $state(false);

  const ActiveComponent = $derived(router.activeComponent);
</script>

<div class="bg-base-100 text-base-content flex h-screen w-screen flex-col overflow-hidden">
  <!-- Header / App bar at the top -->
  <Header {isCollapsed} onToggleDrawer={() => (isCollapsed = !isCollapsed)} />

  <!-- Main area below Header -->
  <div class="relative flex flex-1 overflow-hidden">
    <!-- Collapsible Drawer below Header -->
    <Drawer bind:isCollapsed onToggle={() => (isCollapsed = !isCollapsed)} />

    <!-- Main Content Area -->
    <main class="bg-base-100 flex-1 overflow-auto p-6">
      <ActiveComponent />
    </main>
  </div>
</div>
