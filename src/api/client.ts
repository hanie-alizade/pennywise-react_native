import { env } from "@/config";
import { ERROR_CODES } from "@/constants";
import { errorSchema } from "@/schemas";
import type { ErrorDetail } from "@/schemas";

export interface ApiErrorDetail {
  path?: string;
  message?: string;
}

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: ErrorDetail[];

  constructor(
    status: number,
    code: string,
    message: string,
    details?: ErrorDetail[]
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export interface RequestOptions {
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  auth?: boolean;
  timeoutMs?: number;
}

export interface AuthConfig {
  getAccessToken?: () => string | null;
  refresh?: () => Promise<string | null>;
  onSignedOut?: () => void;
}

let authConfig: AuthConfig = {};

/**
 * Configure authentication callbacks for the HTTP client.
 * Called by AuthProvider to avoid circular dependencies between api and providers.
 */
export function configureAuth(config: AuthConfig): void {
  authConfig = config;
}

const DEFAULT_TIMEOUT_MS = 15000;

/**
 * Unified HTTP request helper for Pennywise REST API.
 * Handles timeouts, bearer authentication, JSON parsing, and API error normalization.
 */
export async function request<T>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    body,
    query,
    headers: customHeaders = {},
    auth = true,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options;

  // 1. Build destination URL
  const baseUrl = env.EXPO_PUBLIC_API_URL.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${baseUrl}${normalizedPath}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // 2. Prepare request headers
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...customHeaders,
  };

  if (body !== undefined && method !== "GET") {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = authConfig.getAccessToken?.();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  // 3. Set up timeout with AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(url.toString(), {
      method,
      headers,
      body: body !== undefined && method !== "GET" ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // 4. Handle non-2xx HTTP responses
    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        errorData = null;
      }

      const parsedError = errorSchema.safeParse(errorData);

      if (parsedError.success) {
        throw new ApiError(
          response.status,
          parsedError.data.error.code,
          parsedError.data.error.message,
          parsedError.data.error.details
        );
      }

      throw new ApiError(
        response.status,
        response.statusText || `HTTP_${response.status}`,
        `Request failed with status ${response.status}`
      );
    }

    // 5. Handle successful responses
    if (response.status === 204) {
      return undefined as T;
    }

    const json = (await response.json()) as T;
    return json;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    // Map abort/timeout and network failures to normalized ApiError
    if (controller.signal.aborted) {
      throw new ApiError(
        0,
        ERROR_CODES.NETWORK_ERROR,
        "Network request timed out. Please check your connection."
      );
    }

    if (error instanceof Error) {
      throw new ApiError(
        0,
        ERROR_CODES.NETWORK_ERROR,
        `Network error: ${error.message}`
      );
    }

    throw new ApiError(
      0,
      ERROR_CODES.NETWORK_ERROR,
      "An unexpected network error occurred."
    );
  }
}
