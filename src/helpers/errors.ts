import { ApiError } from "@/api/client";
import { ERROR_CODES } from "@/constants";

/**
 * Extracts a human-readable error message from an unknown error object.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}

/**
 * Checks whether an error represents a network failure or timeout.
 */
export function isNetworkError(error: unknown): boolean {
  return error instanceof ApiError && error.code === ERROR_CODES.NETWORK_ERROR;
}

/**
 * Maps API validation error details into a dictionary of field error messages keyed by path.
 */
export function getFieldErrors(error: unknown): Record<string, string> {
  if (!(error instanceof ApiError) || !error.details) {
    return {};
  }

  const fieldErrors: Record<string, string> = {};

  for (const detail of error.details) {
    if (detail.path) {
      fieldErrors[detail.path] = detail.message ?? "Invalid value";
    }
  }

  return fieldErrors;
}
