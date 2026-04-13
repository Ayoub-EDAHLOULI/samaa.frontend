// src/lib/api/fetchWithAuth.ts
import { authService } from "@/services/auth.service";

export const TOKEN_REFRESHED_EVENT = "auth:token-refreshed";
export const RATE_LIMIT_EVENT = "api:rate-limit";

// ----------------------------------------------------------------------
//  MUTEX LOCKING VARIABLES (Must be outside the function scope)
// ----------------------------------------------------------------------
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

export async function fetchWithAuth<T>(
  input: string,
  options: RequestInit,
): Promise<T> {
  const optionsWithCredentials = {
    ...options,
    credentials: "include" as RequestCredentials,
  };

  // 1. Initial Request
  const response = await fetch(input, optionsWithCredentials);

  // 2. HANDLE THE SPAMMER (429 Too Many Requests)
  if (response.status === 429) {
    if (typeof window !== "undefined") {
      // Fire the global event so the React component can play the sound
      window.dispatchEvent(new Event(RATE_LIMIT_EVENT));
    }
    throw new Error("Whoa there! Slow down."); // Stop the request immediately
  }

  // --- 2. Handle 401 Unauthorized (With Locking) ---
  if (response.status === 401) {
    // Don't try to refresh if this was a LOGIN or REGISTER attempt.
    if (input.includes("/auth/login") || input.includes("/auth/register")) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Invalid credentials");
    }

    // Safety check: Don't try to refresh if the failed request WAS a refresh attempt
    if (input.includes("/auth/refresh-token")) {
      throw new Error("Refresh token failed");
    }

    try {
      // If no refresh is currently happening, start one
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = authService
          .refreshToken()
          .then((data) => {
            if (typeof window !== "undefined") {
              window.dispatchEvent(
                new CustomEvent(TOKEN_REFRESHED_EVENT, {
                  detail: { accessToken: data.accessToken },
                }),
              );
            }
            return data.accessToken;
          })
          .catch((error) => {
            throw error;
          })
          .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
          });
      }

      // Wait for the existing (or just started) refresh to finish
      const newAccessToken = await refreshPromise;

      // Retry the original request with the NEW Access Token
      // ✅ Use optionsWithCredentials to ensure cookies are sent in retry too
      const retryOptions = {
        ...optionsWithCredentials,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      };

      const retryResponse = await fetch(input, retryOptions);

      if (!retryResponse.ok) {
        const errorData = await retryResponse.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Retry failed with status ${retryResponse.status}`,
        );
      }

      return parseResponse<T>(retryResponse);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Session expired. Please login again.";
      console.error("Fetch with Auth Error:", message);
      throw new Error(message);
    }
  }

  // --- 3. Handle Other Errors (400, 404, 500, etc.) ---
  if (!response.ok) {
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {}
    throw new Error(errorMessage);
  }

  // --- 4. Handle Success Response ---
  return parseResponse<T>(response);
}

// Helper to clean up response parsing logic
async function parseResponse<T>(response: Response): Promise<T> {
  // Check if response has no content (204 No Content)
  if (response.status === 204) {
    return null as unknown as T;
  }

  const text = await response.text();
  if (!text) return null as unknown as T;

  const data: unknown = JSON.parse(text);

  // Standard API Response Wrapping
  if (
    typeof data === "object" &&
    data !== null &&
    "success" in data &&
    "data" in data
  ) {
    return (data as Record<string, unknown>).data as T;
  }

  return data as T;
}
