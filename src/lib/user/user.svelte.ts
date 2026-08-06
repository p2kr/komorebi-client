import { StorageKeys } from "../utils/constants";
import { userService } from "@services/userService";
import type { User, CreateUserPayload, MediaProvider } from "@type/user";

export { isUserSandbox } from "@type/user";
export type { User, CreateUserPayload, MediaProvider };

class UserManager {
  users = $state<User[]>([]);
  currentUser = $state<User | null>(null);
  isLoading = $state<boolean>(false);
  error = $state<string | null>(null);

  private currentAbortController: AbortController | null = null;

  async init() {
    await this.fetchUsers();
  }

  async fetchUsers() {
    this.isLoading = true;
    this.error = null;
    try {
      const result = await userService.fetchUsers();
      if (result.error) {
        this.error = result.error;
      } else {
        this.users = result.users;
      }
      this.restoreActiveUser();
    } catch (err: unknown) {
      this.error = err instanceof Error ? err.message : "Network error fetching users";
      this.restoreActiveUser();
    } finally {
      this.isLoading = false;
    }
  }

  private restoreActiveUser() {
    if (typeof window === "undefined") return;
    const activeId = localStorage.getItem(StorageKeys.ACTIVE_USER_KEY);
    if (activeId && this.users.length > 0) {
      const found = this.users.find((u) => u.id === activeId);
      if (found) {
        this.currentUser = found;
        return;
      }
    }

    if (this.users.length > 0) {
      this.currentUser = this.users[0];
      localStorage.setItem(StorageKeys.ACTIVE_USER_KEY, this.users[0].id);
    } else {
      this.currentUser = null;
    }
  }

  selectUser(id: string | null) {
    if (!id) {
      this.currentUser = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem(StorageKeys.ACTIVE_USER_KEY);
      }
      return;
    }

    const found = this.users.find((u) => u.id === id);
    if (found) {
      this.currentUser = found;
      if (typeof window !== "undefined") {
        localStorage.setItem(StorageKeys.ACTIVE_USER_KEY, found.id);
      }
    }
  }

  cancelOAuth() {
    if (this.currentAbortController) {
      this.currentAbortController.abort();
      this.currentAbortController = null;
    }
    this.isLoading = false;
    this.error = null;
  }

  async addUser(
    providerOrPayload: MediaProvider | CreateUserPayload = "ANILIST"
  ): Promise<User | null> {
    this.cancelOAuth(); // Cancel any existing pending OAuth flow
    this.isLoading = true;
    this.error = null;

    const isPayloadObj = typeof providerOrPayload === "object";
    const provider: MediaProvider = isPayloadObj ? providerOrPayload.provider : providerOrPayload;
    const is_sandbox = isPayloadObj
      ? (providerOrPayload.is_sandbox ?? !providerOrPayload.access_token)
      : false;

    const username =
      isPayloadObj && providerOrPayload.username && providerOrPayload.username.trim()
        ? providerOrPayload.username.trim()
        : is_sandbox
          ? `sandbox_${provider.toLowerCase()}`
          : `${provider} Account`;

    const avatar_url = isPayloadObj ? (providerOrPayload.avatar_url ?? null) : null;
    const access_token = is_sandbox
      ? null
      : isPayloadObj
        ? (providerOrPayload.access_token ?? null)
        : null;

    const OAUTH_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes
    const controller = new AbortController();
    this.currentAbortController = controller;

    const timeoutId = setTimeout(() => {
      controller.abort("timeout");
    }, OAUTH_TIMEOUT_MS);

    try {
      const result = await userService.addUser(
        {
          provider,
          username,
          avatar_url,
          access_token,
          is_sandbox,
        },
        controller.signal
      );

      if (result.user) {
        this.users = [...this.users, result.user];
        this.selectUser(result.user.id);
        return result.user;
      } else if (result.error) {
        this.error = result.error;
      }
    } catch (err: unknown) {
      this.error = err instanceof Error ? err.message : "Network error adding user";
    } finally {
      clearTimeout(timeoutId);
      if (this.currentAbortController === controller) {
        this.currentAbortController = null;
      }
      this.isLoading = false;
    }
    return null;
  }

  async deleteUser(id: string): Promise<boolean> {
    this.isLoading = true;
    this.error = null;
    try {
      const result = await userService.deleteUser(id);
      if (result.success) {
        this.handleLocalDelete(id);
        return true;
      } else if (result.error) {
        this.error = result.error;
      }
    } catch (err: unknown) {
      this.error = err instanceof Error ? err.message : "Network error deleting user";
    } finally {
      this.isLoading = false;
    }
    return false;
  }

  private handleLocalDelete(id: string) {
    this.users = this.users.filter((u) => u.id !== id);
    if (this.currentUser?.id === id) {
      const nextUser = this.users.length > 0 ? this.users[0] : null;
      this.selectUser(nextUser ? nextUser.id : null);
    }
  }
}

export const userManager = new UserManager();
