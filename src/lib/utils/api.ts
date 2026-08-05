import axios from "axios";

export interface SuccessResponse<T> {
  success: boolean;
  data: T;
}

export interface FailureResponse {
  success: boolean;
  error: {
    code: string;
    msg: string;
  };
}

export type Response<T> = SuccessResponse<T> | FailureResponse;

const BASE_URL = "http://localhost:8080/api/v1";

export async function doApiCall<T>(
  url: string,
  params?: object,
  method: "GET" | "POST" | "DELETE" = "GET",
  signal?: AbortSignal
): Promise<Response<T>> {
  try {
    const resp = await axios({
      baseURL: BASE_URL,
      url: url,
      params: method === "GET" ? params : undefined,
      data: method !== "GET" ? params : undefined,
      method: method,
      signal: signal,
    });
    return resp.data;
  } catch (e: unknown) {
    if (axios.isCancel(e) || (e instanceof Error && e.name === "CanceledError")) {
      const abortError = new Error("Request canceled");
      abortError.name = "AbortError";
      throw abortError;
    }
    const msg = e instanceof Error ? e.message : String(e);
    return Promise.reject(new Error(`failed to do api call due to ${msg}`));
  }
}
