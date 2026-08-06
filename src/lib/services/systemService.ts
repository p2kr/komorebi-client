import { doApiCall, type Response, type SuccessResponse, type FailureResponse } from "@utils/api";

export interface HealthCheckData {
  base_url: string;
  uptime: number;
  version: string;
}

export interface HealthCheckResult {
  healthy: boolean;
  data: HealthCheckData | null;
  error: string | null;
}

/**
 * Service for System & Server Health Check Endpoints
 * matching the Komorebi Server OpenAPI 3.1.0 specification.
 */
export class SystemService {
  /**
   * Performs an API v1 health check request (`GET /api/v1/health`).
   */
  async getHealthCheck(): Promise<HealthCheckResult> {
    try {
      const response = await doApiCall<HealthCheckData>("health");
      if (response.success) {
        return {
          healthy: true,
          data: (response as SuccessResponse<HealthCheckData>).data,
          error: null,
        };
      }
      const failure = response as FailureResponse;
      return {
        healthy: false,
        data: null,
        error: failure.error?.msg || "Health check failed",
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error checking health";
      return {
        healthy: false,
        data: null,
        error: msg,
      };
    }
  }

  /**
   * Performs a root endpoint check (`GET /`).
   */
  async getRoot(): Promise<Response<unknown>> {
    return doApiCall("../");
  }
}

export const systemService = new SystemService();
