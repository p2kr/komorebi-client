import { doApiCall, type SuccessResponse, type FailureResponse } from "@utils/api";
import type { MediaEntry, MediaProvider, PaginatedResponse } from "../types/media";

export interface FetchMediaResult {
  entries: MediaEntry[];
  errors: string[];
}

/**
 * Dedicated Repository Seam for Media Data Access.
 * Isolates HTTP API fetching, endpoint synchronization, and error extraction.
 */
export class MediaRepository {
  /**
   * Fetches anime and manga entries concurrently for a specific user profile and provider.
   */
  async fetchUserMedia(
    userId: string,
    provider: MediaProvider = "ANILIST",
    limit = 50
  ): Promise<FetchMediaResult> {
    const animePromise = doApiCall<PaginatedResponse>("media/anime", {
      user_id: userId,
      provider,
      limit,
    });

    const mangaPromise = doApiCall<PaginatedResponse>("media/manga", {
      user_id: userId,
      provider,
      limit,
    });

    const [animeRes, mangaRes] = await Promise.all([animePromise, mangaPromise]);

    let entries: MediaEntry[] = [];
    let errors: string[] = [];

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
