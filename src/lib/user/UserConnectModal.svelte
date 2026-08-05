<script lang="ts">
  import { Sparkles, X, LogIn, HardDrive, Check, ExternalLink } from "@lucide/svelte";
  import { userManager, type MediaProvider } from "./user.svelte";

  interface Props {
    modalRef?: HTMLDialogElement | null;
    onClose?: () => void;
  }

  let { modalRef = $bindable(null), onClose }: Props = $props();

  let selectedProvider = $state<MediaProvider>("ANILIST");
  let isSandboxMode = $state<boolean>(false);
  let sandboxUsername = $state("sandbox_user");

  const isLoading = $derived(userManager.isLoading);

  export function openModal() {
    selectedProvider = "ANILIST";
    isSandboxMode = false;
    sandboxUsername = "sandbox_user";
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
        username: sandboxUsername.trim() || "sandbox_user",
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
  <div
    class="modal-box bg-base-100 border-base-300 max-w-md space-y-5 rounded-3xl border p-6 shadow-2xl"
  >
    <!-- Modal Header -->
    <div class="border-base-200 flex items-center justify-between border-b pb-3">
      <div class="flex items-center gap-2.5">
        <div class="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-xl">
          <Sparkles class="size-5" />
        </div>
        <div>
          <h3 class="text-base-content text-base font-bold">Connect Media Service</h3>
          <p class="text-base-content/60 text-xs">Sign in or connect using username</p>
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
      <span class="text-base-content/70 text-xs font-bold tracking-wider uppercase"
        >1. Select Service</span
      >
      <div class="grid grid-cols-2 gap-3">
        <!-- AniList Provider Card -->
        <button
          type="button"
          onclick={() => (selectedProvider = "ANILIST")}
          class={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200 ${
            selectedProvider === "ANILIST"
              ? "border-info bg-info/10 ring-info/30 shadow-sm ring-2"
              : "border-base-300 bg-base-100 hover:border-base-content/20"
          }`}
        >
          <div class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#02A9FF]/15">
            <svg class="size-4 text-[#02A9FF]" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M6.361 2.977h3.639l6.361 18.046h-3.639l-1.425-4.148h-6.284l-1.425 4.148h-3.639l6.361-18.046zm1.78 4.795l-1.895 5.589h3.791l-1.896-5.589z"
              />
            </svg>
          </div>
          <div class="min-w-0">
            <span class="text-base-content block truncate text-xs font-bold">AniList</span>
            <span class="text-base-content/60 block text-[10px]">AniList Library</span>
          </div>
        </button>

        <!-- MAL Provider Card -->
        <button
          type="button"
          onclick={() => (selectedProvider = "MAL")}
          class={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200 ${
            selectedProvider === "MAL"
              ? "border-primary bg-primary/10 ring-primary/30 shadow-sm ring-2"
              : "border-base-300 bg-base-100 hover:border-base-content/20"
          }`}
        >
          <div class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#2E51A2]/15">
            <svg class="size-4 text-[#2E51A2]" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M7.784 7.422v9.156h-2.14V9.658l-1.748 6.92h-1.63L.518 9.658v6.92H-1.6V7.422h2.956l1.83 6.425 1.83-6.425h2.768zm4.498 0v9.156h-2.14V7.422h2.14zm6.658 0v9.156h-2.14v-4.08h-2.22v4.08h-2.14V7.422h2.14v3.312h2.22V7.422h2.14z"
              />
            </svg>
          </div>
          <div class="min-w-0">
            <span class="text-base-content block truncate text-xs font-bold">MyAnimeList</span>
            <span class="text-base-content/60 block text-[10px]">MAL Library</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Connection Mode Selection -->
    <div class="space-y-3 pt-1">
      <span class="text-base-content/70 text-xs font-bold tracking-wider uppercase"
        >2. Connection Method</span
      >

      <!-- Official Sign-In Option -->
      <button
        type="button"
        onclick={() => (isSandboxMode = false)}
        class={`flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition-all duration-200 ${
          !isSandboxMode
            ? "border-primary bg-primary/10 ring-primary/30 shadow-md ring-2"
            : "border-base-300 bg-base-100 hover:border-base-content/20"
        }`}
      >
        <div class="flex items-center gap-2.5">
          <div
            class="bg-primary/20 text-primary flex size-7 items-center justify-center rounded-lg"
          >
            <LogIn class="text-primary size-4" />
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <span class="text-base-content text-xs font-bold">Authenticated Sign-In</span>
            </div>
            <p class="text-base-content/60 text-[11px]">
              Sign in securely with your provider account
            </p>
          </div>
        </div>
        {#if !isSandboxMode}
          <Check class="text-primary size-4" />
        {/if}
      </button>

      <!-- Sandbox Connection (Username Only, No Auth) -->
      <div
        role="button"
        tabindex="0"
        onclick={() => (isSandboxMode = true)}
        onkeydown={(e) => e.key === "Enter" && (isSandboxMode = true)}
        class={`flex w-full cursor-pointer flex-col gap-2.5 rounded-2xl border p-3.5 transition-all duration-200 ${
          isSandboxMode
            ? "border-warning bg-warning/10 ring-warning/30 shadow-md ring-2"
            : "border-base-300 bg-base-100 hover:border-base-content/20"
        }`}
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div
              class="bg-warning/20 text-warning flex size-7 items-center justify-center rounded-lg"
            >
              <HardDrive class="text-warning size-4" />
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <span class="text-base-content text-xs font-bold"
                  >Sandbox Connection (Username Only)</span
                >
              </div>
              <p class="text-base-content/60 text-[11px]">
                Connect to {selectedProvider} library using just username
              </p>
            </div>
          </div>
          {#if isSandboxMode}
            <Check class="text-warning size-4" />
          {/if}
        </div>

        {#if isSandboxMode}
          <!-- Inlined Username Input -->
          <div class="border-warning/20 flex items-center gap-2 border-t pt-2">
            <label
              for="sandbox-username-input"
              class="text-base-content/80 text-xs font-semibold whitespace-nowrap"
            >
              {selectedProvider} Username:
            </label>
            <input
              id="sandbox-username-input"
              type="text"
              bind:value={sandboxUsername}
              placeholder={`e.g. ${selectedProvider.toLowerCase()}_user`}
              required
              onclick={(e) => e.stopPropagation()}
              class="input input-xs input-bordered bg-base-100 flex-1 rounded-lg text-xs font-semibold"
            />
          </div>
        {/if}
      </div>
    </div>

    {#if !isSandboxMode}
      <!-- Info Banner -->
      <div
        class="bg-base-200/40 border-base-300/80 text-base-content/70 flex items-center gap-2.5 rounded-2xl border p-3 text-xs"
      >
        <ExternalLink class="text-primary size-4 shrink-0" />
        <span>Redirects to sign-in page. You will have 3 minutes to complete sign-in.</span>
      </div>
    {/if}

    <!-- Actions Footer -->
    <div class="modal-action border-base-200 flex items-center justify-end gap-2 border-t pt-2">
      <button type="button" onclick={closeModal} class="btn btn-ghost btn-sm rounded-xl">
        Cancel
      </button>
      <button
        type="button"
        onclick={handleConnectAccount}
        disabled={isLoading || (isSandboxMode && !sandboxUsername.trim())}
        class="btn btn-primary btn-sm gap-2 rounded-xl px-5 font-semibold"
      >
        {#if isLoading}
          <span class="loading loading-spinner loading-xs"></span>
          {isSandboxMode ? "Connecting..." : "Authenticating..."}
        {:else}
          {#if !isSandboxMode}
            <ExternalLink class="size-4" />
          {/if}
          Connect {selectedProvider}
          {isSandboxMode ? "(Sandbox)" : ""}
        {/if}
      </button>
    </div>
  </div>

  <form method="dialog" class="modal-backdrop">
    <button onclick={closeModal}>close</button>
  </form>
</dialog>
