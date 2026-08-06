import { doApiCall, type SuccessResponse, type FailureResponse } from "@utils/api";
import type { MediaEntry, MediaProvider, ListStatus, PaginatedResponse } from "@type/media";

export interface FetchUserMediaOptions {
  userId: string;
  provider?: MediaProvider;
  status?: ListStatus;
  sort?: string;
  limit?: number;
  offset?: number;
}

export interface FetchMediaResult {
  entries: MediaEntry[];
  errors: string[];
}

/**
 * Dedicated Repository Seam for Media Data Access.
 * Isolates HTTP API fetching, endpoint synchronization, and error extraction
 * matching the Komorebi Server OpenAPI 3.1.0 specification.
 */
export class MediaRepository {
  /**
   * Retrieves the paginated anime list for a given user (`GET media/anime`).
   */
  async getUserAnimeList(options: FetchUserMediaOptions, signal?: AbortSignal) {
    return doApiCall<PaginatedResponse>(
      "media/anime",
      {
        user_id: options.userId,
        provider: options.provider || "MAL",
        status: options.status,
        sort: options.sort,
        limit: options.limit ?? 20,
        offset: options.offset ?? 0,
      },
      signal
    );
  }

  /**
   * Retrieves the paginated manga list for a given user (`POST media/manga`).
   */
  async getUserMangaList(options: FetchUserMediaOptions, signal?: AbortSignal) {
    return doApiCall<PaginatedResponse>(
      "media/manga",
      {
        user_id: options.userId,
        provider: options.provider || "MAL",
        status: options.status,
        sort: options.sort,
        limit: options.limit ?? 20,
        offset: options.offset ?? 0,
      },
      signal
    );
  }

  /**
   * Fetches anime and manga entries concurrently for a specific user profile and provider.
   */
  async fetchUserMedia(
    userId: string,
    provider: MediaProvider = "ANILIST",
    limit = 50,
    offset = 0,
    status?: ListStatus,
    sort?: string
  ): Promise<FetchMediaResult> {
    const opts: FetchUserMediaOptions = {
      userId,
      provider,
      limit,
      offset,
      status,
      sort,
    };

    const animePromise = this.getUserAnimeList(opts);
    const mangaPromise = this.getUserMangaList(opts);

    const [animeRes, mangaRes] = await Promise.all([animePromise, mangaPromise]);

    let entries: MediaEntry[] = [];
    const errors: string[] = [];

    if (animeRes.success) {
      const paginated = (animeRes as SuccessResponse<PaginatedResponse>).data;
      if (paginated && Array.isArray(paginated.data)) {
        entries = [...entries, ...paginated.data];
      }
    } else {
      const failure = animeRes as FailureResponse;
      if (failure.error?.msg) {
        errors.push(`Anime API: ${failure.error.msg}`);
      }
    }

    if (mangaRes.success) {
      const paginated = (mangaRes as SuccessResponse<PaginatedResponse>).data;
      if (paginated && Array.isArray(paginated.data)) {
        entries = [...entries, ...paginated.data];
      }
    } else {
      const failure = mangaRes as FailureResponse;
      if (failure.error?.msg) {
        errors.push(`Manga API: ${failure.error.msg}`);
      }
    }

    return { entries, errors };
  }
}

export const mediaRepository = new MediaRepository();
