<script lang="ts">
  import { User as UserIcon, ChevronDown, Check, Plus, Trash2, Key } from "@lucide/svelte";
  import { userManager, isUserSandbox, type MediaProvider } from "./user.svelte";
  import UserConnectModal from "./UserConnectModal.svelte";

  const currentUser = $derived(userManager.currentUser);
  const users = $derived(userManager.users);
  const isLoading = $derived(userManager.isLoading);
  const errorMsg = $derived(userManager.error);

  let isDropdownOpen = $state(false);
  let modalComponent = $state<UserConnectModal | null>(null);

  function getProviderBadgeClass(provider: MediaProvider) {
    switch (provider) {
      case "ANILIST":
        return "badge-info text-info-content";
      case "MAL":
        return "badge-primary text-primary-content";
      default:
        return "badge-neutral";
    }
  }

  function getInitials(name: string): string {
    if (!name) return "U";
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
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
</script>

<details bind:open={isDropdownOpen} class="dropdown dropdown-end">
  <summary
    class="btn btn-ghost hover:bg-base-200 border-base-300/60 h-auto min-h-10 cursor-pointer rounded-xl border px-3 py-1.5 transition-all duration-200"
  >
    {#if currentUser}
      {@const isSandbox = isUserSandbox(currentUser)}
      <!-- Active User Button -->
      <div class="flex items-center gap-2.5">
        <div class="avatar placeholder">
          <div
            class="bg-primary/10 text-primary border-primary/20 size-7 overflow-hidden rounded-full border text-sm font-bold"
          >
            {#if currentUser.avatar_url}
              <img
                src={currentUser.avatar_url}
                alt={currentUser.username}
                class="size-full object-cover"
              />
            {:else}
              <span>{getInitials(currentUser.username)}</span>
            {/if}
          </div>
        </div>

        <div class="flex flex-col items-start text-left leading-tight">
          <div class="flex items-center gap-1">
            <span class="text-base-content max-w-28 truncate text-sm font-bold"
              >{currentUser.username}</span
            >
          </div>
          <div class="flex items-center gap-1">
            <span
              class={`badge badge-sm ${getProviderBadgeClass(currentUser.provider)} px-1.5 py-0 font-mono text-sm`}
            >
              {currentUser.provider}
            </span>
            {#if isSandbox}
              <span class="badge badge-warning badge-sm px-1.5 py-0 font-mono text-sm">
                Sandbox
              </span>
            {/if}
          </div>
        </div>

        <ChevronDown class="text-base-content/50 size-3.5" />
      </div>
    {:else}
      <!-- Empty / Select User Button -->
      <div class="text-base-content/70 flex items-center gap-2">
        <div class="bg-base-200 flex size-7 items-center justify-center rounded-full">
          <UserIcon class="size-4" />
        </div>
        <span class="text-base-content text-sm font-semibold">Select User</span>
        <ChevronDown class="text-base-content/50 size-3.5" />
      </div>
    {/if}
  </summary>

  <!-- Dropdown Content Panel -->
  <div
    class="dropdown-content bg-base-100 border-base-300 z-50 mt-2 w-80 space-y-3 rounded-2xl border p-3.5 shadow-2xl"
  >
    {#if currentUser}
      {@const isSandbox = isUserSandbox(currentUser)}
      <!-- Current User Active Card -->
      <div class="bg-base-200/50 border-base-300/80 space-y-2 rounded-xl border p-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="avatar placeholder">
              <div
                class="bg-primary text-primary-content size-10 overflow-hidden rounded-full text-sm font-bold shadow-xs"
              >
                {#if currentUser.avatar_url}
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.username}
                    class="size-full object-cover"
                  />
                {:else}
                  <span>{getInitials(currentUser.username)}</span>
                {/if}
              </div>
            </div>

            <div class="flex flex-col">
              <span class="text-base-content text-sm font-bold">{currentUser.username}</span>
              <div class="mt-0.5 flex items-center gap-1">
                <span
                  class={`badge ${getProviderBadgeClass(currentUser.provider)} badge-sm text-sm font-semibold`}
                >
                  {currentUser.provider}
                </span>
                {#if isSandbox}
                  <span class="badge badge-warning badge-sm text-sm font-semibold">
                    Sandbox Mode
                  </span>
                {/if}
              </div>
            </div>
          </div>

          <span class="badge badge-success badge-sm gap-1 px-2 py-1 text-sm font-medium">
            Active
          </span>
        </div>

        <div
          class="text-base-content/70 border-base-300/40 flex items-center justify-between border-t pt-1 text-sm"
        >
          <span>Added {formatDate(currentUser.created_at)}</span>
          {#if currentUser.access_token}
            <span class="text-primary flex items-center gap-1 text-sm">
              <Key class="size-3.5" /> Authenticated
            </span>
          {:else}
            <span class="text-warning text-sm font-semibold">Unauthenticated (Sandbox)</span>
          {/if}
        </div>
      </div>
    {:else}
      <!-- Empty State Info -->
      <div
        class="bg-base-200/40 border-base-300 space-y-1.5 rounded-xl border border-dashed p-3 text-center"
      >
        <UserIcon class="text-base-content/40 mx-auto size-6" />
        <div class="text-base-content text-sm font-semibold">No Active Profile</div>
        <div class="text-base-content/70 text-sm">
          Connect or add a profile to manage media sources
        </div>
      </div>
    {/if}

    <!-- Accounts List Section -->
    <div class="space-y-1.5">
      <div
        class="text-base-content/70 flex items-center justify-between px-1 text-sm font-semibold tracking-wider uppercase"
      >
        <span>Profiles ({users.length})</span>
        {#if isLoading}
          <span class="loading loading-spinner loading-xs text-primary"></span>
        {/if}
      </div>

      {#if users.length === 0}
        <div class="text-base-content/50 px-1 py-1 text-sm italic">No user profiles added yet</div>
      {:else}
        <div class="max-h-48 space-y-1 overflow-y-auto pr-1">
          {#each users as user (user.id)}
            {@const isSelected = currentUser?.id === user.id}
            {@const isSandbox = isUserSandbox(user)}
            <div
              role="button"
              tabindex="0"
              onclick={() => handleSelectUser(user.id)}
              onkeydown={(e) => e.key === "Enter" && handleSelectUser(user.id)}
              class={`group flex w-full cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-left transition-all duration-150 ${
                isSelected
                  ? "bg-primary/10 border-primary/30 text-primary border"
                  : "hover:bg-base-200/80 text-base-content border border-transparent"
              }`}
            >
              <div class="flex min-w-0 items-center gap-2.5">
                <div class="avatar placeholder">
                  <div
                    class="bg-base-300 text-base-content size-7 overflow-hidden rounded-full text-sm font-bold"
                  >
                    {#if user.avatar_url}
                      <img
                        src={user.avatar_url}
                        alt={user.username}
                        class="size-full object-cover"
                      />
                    {:else}
                      <span>{getInitials(user.username)}</span>
                    {/if}
                  </div>
                </div>

                <div class="flex min-w-0 flex-col">
                  <span class="truncate text-sm leading-tight font-semibold">{user.username}</span>
                  <div class="flex items-center gap-1">
                    <span class="text-base-content/70 font-mono text-sm">{user.provider}</span>
                    {#if isSandbox}
                      <span class="text-warning text-sm font-semibold">(Sandbox)</span>
                    {/if}
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-1">
                {#if isSelected}
                  <Check class="text-primary size-4 shrink-0" />
                {/if}
                <button
                  type="button"
                  onclick={(e) => handleDeleteUser(e, user.id)}
                  class="tooltip tooltip-left btn btn-ghost btn-xs text-base-content/40 hover:text-error hover:bg-error/10 p-1 opacity-0 transition-opacity group-hover:opacity-100"
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
      <div class="alert alert-error alert-soft text-error-content rounded-lg p-2 text-sm">
        <span>{errorMsg}</span>
      </div>
    {/if}

    <div class="divider my-1"></div>

    <!-- Add User Modal Trigger -->
    <button
      type="button"
      onclick={openAddModal}
      class="btn btn-outline btn-primary btn-sm w-full gap-1.5 rounded-xl text-sm font-medium"
    >
      <Plus class="size-3.5" /> Add / Connect Profile
    </button>
  </div>
</details>

<!-- User Connect Modal Component -->
<UserConnectModal bind:this={modalComponent} />
