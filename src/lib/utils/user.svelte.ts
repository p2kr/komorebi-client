export type MediaProvider = 'MAL' | 'AniList';

export interface User {
  id: string; // Uuid v7
  username: string;
  avatar_url: string | null;
  provider: MediaProvider;
  access_token?: string | null;
  is_sandbox?: boolean;
  created_at: number; // timestamp millis
  updated_at: number; // timestamp millis
}

export interface CreateUserPayload {
  username?: string;
  provider: MediaProvider;
  avatar_url?: string | null;
  access_token?: string | null;
  is_sandbox?: boolean;
}

export function isUserSandbox(user: User | null | undefined): boolean {
  if (!user) return true;
  return user.is_sandbox ?? (!user.access_token || user.access_token.trim() === '');
}

const STORAGE_ACTIVE_USER_KEY = 'komorebi_active_user_id';

class UserManager {
  users = $state<User[]>([]);
  currentUser = $state<User | null>(null);
  isLoading = $state<boolean>(false);
  error = $state<string | null>(null);

  async init() {
    await this.fetchUsers();
  }

  async fetchUsers() {
    this.isLoading = true;
    this.error = null;
    try {
      const response = await fetch('/api/v1/user/all');
      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/json')) {
        const data: User[] = await response.json();
        this.users = data;
        this.restoreActiveUser();
      } else {
        // Backend API endpoint not active or returning HTML fallback
        this.restoreActiveUser();
      }
    } catch (err: unknown) {
      // In local dev without active backend endpoint, fallback gracefully
      this.error = err instanceof Error ? err.message : 'Network error fetching users';
      this.restoreActiveUser();
    } finally {
      this.isLoading = false;
    }
  }

  private restoreActiveUser() {
    if (typeof window === 'undefined') return;
    const activeId = localStorage.getItem(STORAGE_ACTIVE_USER_KEY);
    if (activeId && this.users.length > 0) {
      const found = this.users.find((u) => u.id === activeId);
      if (found) {
        this.currentUser = found;
        return;
      }
    }

    if (this.users.length > 0) {
      this.currentUser = this.users[0];
      localStorage.setItem(STORAGE_ACTIVE_USER_KEY, this.users[0].id);
    } else {
      this.currentUser = null;
    }
  }

  selectUser(id: string | null) {
    if (!id) {
      this.currentUser = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_ACTIVE_USER_KEY);
      }
      return;
    }

    const found = this.users.find((u) => u.id === id);
    if (found) {
      this.currentUser = found;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_ACTIVE_USER_KEY, found.id);
      }
    }
  }

  private currentAbortController: AbortController | null = null;

  cancelOAuth() {
    if (this.currentAbortController) {
      this.currentAbortController.abort();
      this.currentAbortController = null;
    }
    this.isLoading = false;
    this.error = null;
  }

  async addUser(providerOrPayload: MediaProvider | CreateUserPayload = 'AniList'): Promise<User | null> {
    this.cancelOAuth(); // Cancel any existing pending OAuth flow
    this.isLoading = true;
    this.error = null;

    const isPayloadObj = typeof providerOrPayload === 'object';
    const provider: MediaProvider = isPayloadObj ? providerOrPayload.provider : providerOrPayload;
    const is_sandbox = isPayloadObj ? (providerOrPayload.is_sandbox ?? !providerOrPayload.access_token) : false;

    const username =
      isPayloadObj && providerOrPayload.username && providerOrPayload.username.trim()
        ? providerOrPayload.username.trim()
        : is_sandbox
          ? `sandbox_${provider.toLowerCase()}`
          : `${provider} Account`;

    const avatar_url = isPayloadObj ? providerOrPayload.avatar_url ?? null : null;
    const access_token = is_sandbox ? null : (isPayloadObj ? providerOrPayload.access_token ?? null : null);

    const OAUTH_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes
    const controller = new AbortController();
    this.currentAbortController = controller;

    const timeoutId = setTimeout(() => {
      controller.abort('timeout');
    }, OAUTH_TIMEOUT_MS);

    try {
      const response = await fetch('/api/v1/user/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          provider,
          username,
          avatar_url,
          access_token,
        }),
      });

      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/json')) {
        const newUser: User = await response.json();
        this.users = [...this.users, newUser];
        this.selectUser(newUser.id);
        return newUser;
      } else if (!response.ok) {
        const errText = await response.text();
        this.error = `Failed to add user: ${errText || response.statusText}`;
      } else {
        // Dev fallback if server returned HTML (e.g. Vite SPA fallback)
        throw new Error('Non-JSON response received from server');
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        if (controller.signal.reason === 'timeout') {
          this.error = 'Sign-in timed out after 3 minutes. Please try again.';
        }
        return null;
      }
      // Local development fallback simulation if backend server is not running
      const now = Date.now();
      const fallbackUser: User = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `usr_${now}`,
        username,
        avatar_url,
        provider,
        access_token,
        is_sandbox,
        created_at: now,
        updated_at: now,
      };
      this.users = [...this.users, fallbackUser];
      this.selectUser(fallbackUser.id);
      return fallbackUser;
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
      const response = await fetch('/api/v1/user/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok || response.status === 204) {
        this.handleLocalDelete(id);
        return true;
      } else {
        const errText = await response.text();
        this.error = `Failed to delete user: ${errText || response.statusText}`;
      }
    } catch {
      // Local fallback delete
      this.handleLocalDelete(id);
      return true;
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
