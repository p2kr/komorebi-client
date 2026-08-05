<script lang="ts">
  import {
    User as UserIcon,
    ChevronDown,
    Check,
    Plus,
    Trash2,
    Key,
  } from '@lucide/svelte';
  import { userManager, isUserSandbox, type MediaProvider } from './user.svelte';
  import UserConnectModal from './UserConnectModal.svelte';

  const currentUser = $derived(userManager.currentUser);
  const users = $derived(userManager.users);
  const isLoading = $derived(userManager.isLoading);
  const errorMsg = $derived(userManager.error);

  let isDropdownOpen = $state(false);
  let modalComponent = $state<UserConnectModal | null>(null);

  function getProviderBadgeClass(provider: MediaProvider) {
    switch (provider) {
      case 'AniList':
        return 'badge-info text-info-content';
      case 'MAL':
        return 'badge-primary text-primary-content';
      default:
        return 'badge-neutral';
    }
  }

  function getInitials(name: string): string {
    if (!name) return 'U';
    return name.slice(0, 2).toUpperCase();
  }

  function handleSelectUser(id: string) {
    userManager.selectUser(id);
    isDropdownOpen = false;
  }

  function openAddModal() {
    isDropdownOpen = false;
    modalComponent?.openModal();
  }

  async function handleDeleteUser(e: MouseEvent, id: string) {
    e.stopPropagation();
    await userManager.deleteUser(id);
  }

  function formatDate(timestamp: number): string {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
</script>

<details bind:open={isDropdownOpen} class="dropdown dropdown-end">
  <summary
    class="btn btn-ghost hover:bg-base-200 h-auto min-h-10 border border-base-300/60 px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer"
  >
    {#if currentUser}
      {@const isSandbox = isUserSandbox(currentUser)}
      <!-- Active User Button -->
      <div class="flex items-center gap-2.5">
        <div class="avatar placeholder">
          <div class="bg-primary/10 text-primary size-7 rounded-full font-bold text-xs border border-primary/20 overflow-hidden">
            {#if currentUser.avatar_url}
              <img src={currentUser.avatar_url} alt={currentUser.username} class="object-cover size-full" />
            {:else}
              <span>{getInitials(currentUser.username)}</span>
            {/if}
          </div>
        </div>

        <div class="flex flex-col items-start text-left leading-tight">
          <div class="flex items-center gap-1">
            <span class="text-xs font-bold text-base-content max-w-28 truncate">{currentUser.username}</span>
          </div>
          <div class="flex items-center gap-1">
            <span class={`badge badge-xs ${getProviderBadgeClass(currentUser.provider)} font-mono text-[9px] px-1 py-0`}>
              {currentUser.provider}
            </span>
            {#if isSandbox}
              <span class="badge badge-warning badge-xs font-mono text-[8px] px-1 py-0">
                Sandbox
              </span>
            {/if}
          </div>
        </div>

        <ChevronDown class="size-3.5 text-base-content/50" />
      </div>
    {:else}
      <!-- Empty / Select User Button -->
      <div class="flex items-center gap-2 text-base-content/70">
        <div class="bg-base-200 flex size-7 items-center justify-center rounded-full">
          <UserIcon class="size-4" />
        </div>
        <span class="text-xs font-semibold text-base-content">Select User</span>
        <ChevronDown class="size-3.5 text-base-content/50" />
      </div>
    {/if}
  </summary>

  <!-- Dropdown Content Panel -->
  <div
    class="dropdown-content bg-base-100 border-base-300 z-50 mt-2 w-80 rounded-2xl border p-3.5 shadow-2xl space-y-3"
  >
    {#if currentUser}
      {@const isSandbox = isUserSandbox(currentUser)}
      <!-- Current User Active Card -->
      <div class="bg-base-200/50 border-base-300/80 rounded-xl border p-3 space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="avatar placeholder">
              <div class="bg-primary text-primary-content size-10 rounded-full font-bold text-sm shadow-xs overflow-hidden">
                {#if currentUser.avatar_url}
                  <img src={currentUser.avatar_url} alt={currentUser.username} class="object-cover size-full" />
                {:else}
                  <span>{getInitials(currentUser.username)}</span>
                {/if}
              </div>
            </div>

            <div class="flex flex-col">
              <span class="font-bold text-sm text-base-content">{currentUser.username}</span>
              <div class="flex items-center gap-1 mt-0.5">
                <span class={`badge ${getProviderBadgeClass(currentUser.provider)} badge-xs font-semibold`}>
                  {currentUser.provider}
                </span>
                {#if isSandbox}
                  <span class="badge badge-warning badge-xs font-semibold">
                    Sandbox Mode
                  </span>
                {/if}
              </div>
            </div>
          </div>

          <span class="badge badge-success badge-xs gap-1 py-1 px-2 text-[10px] font-medium">
            Active
          </span>
        </div>

        <div class="text-[11px] text-base-content/60 flex items-center justify-between pt-1 border-t border-base-300/40">
          <span>Added {formatDate(currentUser.created_at)}</span>
          {#if currentUser.access_token}
            <span class="flex items-center gap-1 text-primary text-[10px]">
              <Key class="size-3" /> Authenticated
            </span>
          {:else}
            <span class="text-warning text-[10px] font-semibold">Unauthenticated (Sandbox)</span>
          {/if}
        </div>
      </div>
    {:else}
      <!-- Empty State Info -->
      <div class="bg-base-200/40 rounded-xl p-3 text-center space-y-1.5 border border-dashed border-base-300">
        <UserIcon class="size-6 text-base-content/40 mx-auto" />
        <div class="text-xs font-semibold text-base-content">No Active Profile</div>
        <div class="text-[11px] text-base-content/60">Connect or add a profile to manage media sources</div>
      </div>
    {/if}

    <!-- Accounts List Section -->
    <div class="space-y-1.5">
      <div class="flex items-center justify-between px-1 text-[11px] font-semibold text-base-content/60 uppercase tracking-wider">
        <span>Profiles ({users.length})</span>
        {#if isLoading}
          <span class="loading loading-spinner loading-xs text-primary"></span>
        {/if}
      </div>

      {#if users.length === 0}
        <div class="text-xs text-base-content/50 italic px-1 py-1">No user profiles added yet</div>
      {:else}
        <div class="max-h-48 overflow-y-auto space-y-1 pr-1">
          {#each users as user (user.id)}
            {@const isSelected = currentUser?.id === user.id}
            {@const isSandbox = isUserSandbox(user)}
            <div
              role="button"
              tabindex="0"
              onclick={() => handleSelectUser(user.id)}
              onkeydown={(e) => e.key === 'Enter' && handleSelectUser(user.id)}
              class={`group flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-primary/10 border-primary/30 border text-primary'
                  : 'hover:bg-base-200/80 text-base-content border border-transparent'
              }`}
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <div class="avatar placeholder">
                  <div class="bg-base-300 text-base-content size-7 rounded-full font-bold text-xs overflow-hidden">
                    {#if user.avatar_url}
                      <img src={user.avatar_url} alt={user.username} class="object-cover size-full" />
                    {:else}
                      <span>{getInitials(user.username)}</span>
                    {/if}
                  </div>
                </div>

                <div class="flex flex-col min-w-0">
                  <span class="text-xs font-semibold truncate leading-tight">{user.username}</span>
                  <div class="flex items-center gap-1">
                    <span class="text-[10px] text-base-content/60 font-mono">{user.provider}</span>
                    {#if isSandbox}
                      <span class="text-[9px] text-warning font-semibold">(Sandbox)</span>
                    {/if}
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-1">
                {#if isSelected}
                  <Check class="size-4 text-primary shrink-0" />
                {/if}
                <button
                  type="button"
                  onclick={(e) => handleDeleteUser(e, user.id)}
                  class="tooltip tooltip-left btn btn-ghost btn-xs text-base-content/40 hover:text-error hover:bg-error/10 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  data-tip="Delete profile"
                >
                  <Trash2 class="size-3.5" />
                </button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    {#if errorMsg}
      <div class="alert alert-error alert-soft p-2 text-xs text-error-content rounded-lg">
        <span>{errorMsg}</span>
      </div>
    {/if}

    <div class="divider my-1"></div>

    <!-- Add User Modal Trigger -->
    <button
      type="button"
      onclick={openAddModal}
      class="btn btn-outline btn-primary btn-sm w-full gap-1.5 rounded-xl font-medium text-xs"
    >
      <Plus class="size-3.5" /> Add / Connect Profile
    </button>
  </div>
</details>

<!-- User Connect Modal Component -->
<UserConnectModal bind:this={modalComponent} />
