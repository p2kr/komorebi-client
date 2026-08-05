<script lang="ts">
  import { Sparkles, X, LogIn, HardDrive, Check, ExternalLink } from '@lucide/svelte';
  import { userManager, type MediaProvider } from './user.svelte';

  interface Props {
    modalRef?: HTMLDialogElement | null;
    onClose?: () => void;
  }

  let { modalRef = $bindable(null), onClose }: Props = $props();

  let selectedProvider = $state<MediaProvider>('AniList');
  let isSandboxMode = $state<boolean>(false);
  let sandboxUsername = $state('sandbox_user');

  const isLoading = $derived(userManager.isLoading);

  export function openModal() {
    selectedProvider = 'AniList';
    isSandboxMode = false;
    sandboxUsername = 'sandbox_user';
    modalRef?.showModal();
  }

  export function closeModal() {
    userManager.cancelOAuth();
    modalRef?.close();
    onClose?.();
  }

  async function handleConnectAccount() {
    if (isSandboxMode) {
      await userManager.addUser({
        username: sandboxUsername.trim() || 'sandbox_user',
        provider: selectedProvider,
        is_sandbox: true,
      });
    } else {
      await userManager.addUser({
        provider: selectedProvider,
        is_sandbox: false,
      });
    }
    closeModal();
  }
</script>

<dialog bind:this={modalRef} class="modal modal-bottom sm:modal-middle">
  <div class="modal-box bg-base-100 border-base-300 border rounded-3xl p-6 shadow-2xl space-y-5 max-w-md">
    <!-- Modal Header -->
    <div class="flex items-center justify-between border-b border-base-200 pb-3">
      <div class="flex items-center gap-2.5">
        <div class="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-xl">
          <Sparkles class="size-5" />
        </div>
        <div>
          <h3 class="text-base font-bold text-base-content">Connect Media Service</h3>
          <p class="text-xs text-base-content/60">Sign in or connect using username</p>
        </div>
      </div>
      <button
        type="button"
        onclick={closeModal}
        class="btn btn-ghost btn-sm btn-square rounded-xl"
        aria-label="Close modal"
      >
        <X class="size-4" />
      </button>
    </div>

    <!-- Provider Selector Tabs -->
    <div class="space-y-3">
      <span class="text-xs font-bold uppercase tracking-wider text-base-content/70">1. Select Service</span>
      <div class="grid grid-cols-2 gap-3">
        <!-- AniList Provider Card -->
        <button
          type="button"
          onclick={() => (selectedProvider = 'AniList')}
          class={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200 ${
            selectedProvider === 'AniList'
              ? 'border-info bg-info/10 ring-2 ring-info/30 shadow-sm'
              : 'border-base-300 bg-base-100 hover:border-base-content/20'
          }`}
        >
          <div class="bg-[#02A9FF]/15 flex size-8 items-center justify-center rounded-xl shrink-0">
            <svg class="size-4 text-[#02A9FF]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.361 2.977h3.639l6.361 18.046h-3.639l-1.425-4.148h-6.284l-1.425 4.148h-3.639l6.361-18.046zm1.78 4.795l-1.895 5.589h3.791l-1.896-5.589z"/>
            </svg>
          </div>
          <div class="min-w-0">
            <span class="font-bold text-xs text-base-content block truncate">AniList</span>
            <span class="text-[10px] text-base-content/60 block">AniList Library</span>
          </div>
        </button>

        <!-- MAL Provider Card -->
        <button
          type="button"
          onclick={() => (selectedProvider = 'MAL')}
          class={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200 ${
            selectedProvider === 'MAL'
              ? 'border-primary bg-primary/10 ring-2 ring-primary/30 shadow-sm'
              : 'border-base-300 bg-base-100 hover:border-base-content/20'
          }`}
        >
          <div class="bg-[#2E51A2]/15 flex size-8 items-center justify-center rounded-xl shrink-0">
            <svg class="size-4 text-[#2E51A2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.784 7.422v9.156h-2.14V9.658l-1.748 6.92h-1.63L.518 9.658v6.92H-1.6V7.422h2.956l1.83 6.425 1.83-6.425h2.768zm4.498 0v9.156h-2.14V7.422h2.14zm6.658 0v9.156h-2.14v-4.08h-2.22v4.08h-2.14V7.422h2.14v3.312h2.22V7.422h2.14z"/>
            </svg>
          </div>
          <div class="min-w-0">
            <span class="font-bold text-xs text-base-content block truncate">MyAnimeList</span>
            <span class="text-[10px] text-base-content/60 block">MAL Library</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Connection Mode Selection -->
    <div class="space-y-3 pt-1">
      <span class="text-xs font-bold uppercase tracking-wider text-base-content/70">2. Connection Method</span>

      <!-- Official Sign-In Option -->
      <button
        type="button"
        onclick={() => (isSandboxMode = false)}
        class={`w-full flex items-center justify-between rounded-2xl border p-3.5 text-left transition-all duration-200 ${
          !isSandboxMode
            ? 'border-primary bg-primary/10 ring-2 ring-primary/30 shadow-md'
            : 'border-base-300 bg-base-100 hover:border-base-content/20'
        }`}
      >
        <div class="flex items-center gap-2.5">
          <div class="bg-primary/20 text-primary flex size-7 items-center justify-center rounded-lg">
            <LogIn class="size-4 text-primary" />
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="font-bold text-xs text-base-content">Authenticated Sign-In</span>
            </div>
            <p class="text-[11px] text-base-content/60">Sign in securely with your provider account</p>
          </div>
        </div>
        {#if !isSandboxMode}
          <Check class="size-4 text-primary" />
        {/if}
      </button>

      <!-- Sandbox Connection (Username Only, No Auth) -->
      <div
        role="button"
        tabindex="0"
        onclick={() => (isSandboxMode = true)}
        onkeydown={(e) => e.key === 'Enter' && (isSandboxMode = true)}
        class={`w-full flex flex-col gap-2.5 rounded-2xl border p-3.5 transition-all duration-200 cursor-pointer ${
          isSandboxMode
            ? 'border-warning bg-warning/10 ring-2 ring-warning/30 shadow-md'
            : 'border-base-300 bg-base-100 hover:border-base-content/20'
        }`}
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="bg-warning/20 text-warning flex size-7 items-center justify-center rounded-lg">
              <HardDrive class="size-4 text-warning" />
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <span class="font-bold text-xs text-base-content">Sandbox Connection (Username Only)</span>
              </div>
              <p class="text-[11px] text-base-content/60">Connect to {selectedProvider} library using just username</p>
            </div>
          </div>
          {#if isSandboxMode}
            <Check class="size-4 text-warning" />
          {/if}
        </div>

        {#if isSandboxMode}
          <!-- Inlined Username Input -->
          <div class="flex items-center gap-2 pt-2 border-t border-warning/20">
            <label for="sandbox-username-input" class="text-xs font-semibold text-base-content/80 whitespace-nowrap">
              {selectedProvider} Username:
            </label>
            <input
              id="sandbox-username-input"
              type="text"
              bind:value={sandboxUsername}
              placeholder={`e.g. ${selectedProvider.toLowerCase()}_user`}
              required
              onclick={(e) => e.stopPropagation()}
              class="input input-xs input-bordered flex-1 rounded-lg text-xs font-semibold bg-base-100"
            />
          </div>
        {/if}
      </div>
    </div>

    {#if !isSandboxMode}
      <!-- Info Banner -->
      <div class="bg-base-200/40 rounded-2xl border border-base-300/80 p-3 text-xs text-base-content/70 flex items-center gap-2.5">
        <ExternalLink class="size-4 text-primary shrink-0" />
        <span>Redirects to sign-in page. You will have 3 minutes to complete sign-in.</span>
      </div>
    {/if}

    <!-- Actions Footer -->
    <div class="modal-action flex items-center justify-end gap-2 pt-2 border-t border-base-200">
      <button type="button" onclick={closeModal} class="btn btn-ghost btn-sm rounded-xl">
        Cancel
      </button>
      <button
        type="button"
        onclick={handleConnectAccount}
        disabled={isLoading || (isSandboxMode && !sandboxUsername.trim())}
        class="btn btn-primary btn-sm gap-2 rounded-xl font-semibold px-5"
      >
        {#if isLoading}
          <span class="loading loading-spinner loading-xs"></span>
          {isSandboxMode ? 'Connecting...' : 'Authenticating...'}
        {:else}
          {#if !isSandboxMode}
            <ExternalLink class="size-4" />
          {/if}
          Connect {selectedProvider} {isSandboxMode ? '(Sandbox)' : ''}
        {/if}
      </button>
    </div>
  </div>

  <form method="dialog" class="modal-backdrop">
    <button onclick={closeModal}>close</button>
  </form>
</dialog>
