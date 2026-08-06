import { doApiCall, type Response, type SuccessResponse, type FailureResponse } from "@utils/api";
import type { User, CreateUserPayload } from "@type/user";

export interface FetchUsersResult {
  users: User[];
  error: string | null;
}

export interface UserOperationResult {
  user: User | null;
  error: string | null;
}

export interface DeleteUserResult {
  success: boolean;
  deleted: boolean;
  error: string | null;
}

/**
 * Dedicated Service & Repository Seam for User Data Access.
 * Isolates HTTP API fetching, user creation/deletion/retrieval endpoints, and error extraction
 * matching the Komorebi Server OpenAPI 3.1.0 specification.
 */
export class UserService {
  /**
   * Retrieves all registered users (`GET user/all`).
   */
  async fetchUsers(): Promise<FetchUsersResult> {
    try {
      const response = await doApiCall<User[]>("user/all");

      if (response.success) {
        return {
          users: (response as SuccessResponse<User[]>).data || [],
          error: null,
        };
      }

      const failure = response as FailureResponse;
      return {
        users: [],
        error: `Failed to fetch users: ${failure.error?.msg || "Unknown error"}`,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error fetching users";
      return {
        users: [],
        error: msg,
      };
    }
  }

  /**
   * Alias for fetchUsers (`GET user/all`).
   */
  async getAllUsers(): Promise<FetchUsersResult> {
    return this.fetchUsers();
  }

  /**
   * Retrieves a single user profile by UUID (`GET user/one?user_id=...`).
   */
  async getUserById(userId: string): Promise<UserOperationResult> {
    try {
      const response = await doApiCall<User>("user/one", { user_id: userId });
      if (response.success) {
        return {
          user: (response as SuccessResponse<User>).data,
          error: null,
        };
      }
      const failure = response as FailureResponse;
      return {
        user: null,
        error: `Failed to fetch user: ${failure.error?.msg || "Unknown error"}`,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error fetching user by ID";
      return {
        user: null,
        error: msg,
      };
    }
  }

  /**
   * Adds or updates a user record with provider details (`POST user/add`).
   */
  async saveUser(payload: CreateUserPayload, signal?: AbortSignal): Promise<UserOperationResult> {
    try {
      const response = await doApiCall<User>(
        "user/add",
        {
          username: payload.username,
          provider: payload.provider,
          avatar_url: payload.avatar_url ?? null,
          access_token: payload.access_token ?? null,
        },
        signal
      );

      if (response.success) {
        return {
          user: (response as SuccessResponse<User>).data,
          error: null,
        };
      }
      const failure = response as FailureResponse;
      return {
        user: null,
        error: `Failed to add user: ${failure.error?.msg || "Unknown error"}`,
      };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        if (signal?.reason === "timeout") {
          return {
            user: null,
            error: "Sign-in timed out after 3 minutes. Please try again.",
          };
        }
        return { user: null, error: null };
      }
      const msg = err instanceof Error ? err.message : "Network error adding user";
      return {
        user: null,
        error: msg,
      };
    }
  }

  /**
   * Convenience alias for saveUser to maintain backwards compatibility.
   */
  async addUser(payload: CreateUserPayload, signal?: AbortSignal): Promise<UserOperationResult> {
    return this.saveUser(payload, signal);
  }

  /**
   * Deletes a user profile by UUID (`DELETE user/delete?user_id=...`).
   */
  async deleteUser(id: string): Promise<DeleteUserResult> {
    try {
      const response = await doApiCall<{ deleted: boolean }>("user/delete", { user_id: id });
      if (response.success) {
        const data = (response as SuccessResponse<{ deleted: boolean }>).data;
        return { success: true, deleted: data?.deleted ?? true, error: null };
      }
      const failure = response as FailureResponse;
      return {
        success: false,
        deleted: false,
        error: `Failed to delete user: ${failure.error?.msg || "Unknown error"}`,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error deleting user";
      return {
        success: false,
        deleted: false,
        error: msg,
      };
    }
  }

  /**
   * Lower-level raw API call wrapper for getting all users.
   */
  async getRawUsers(): Promise<Response<User[]>> {
    return doApiCall<User[]>("user/all");
  }
}

export const userService = new UserService();
export const userRepository = userService;
