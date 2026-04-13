import { fetchWithAuth } from "./fetchWithAuth";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export const apiClient = {
  async get<T>(endpoint: string, accessToken?: string | null): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return fetchWithAuth<T>(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });
  },

  async post<TResponse, TBody = unknown>(
    endpoint: string,
    body: TBody,
    accessToken?: string | null,
    isFormData = false,
  ): Promise<TResponse> {
    const headers: Record<string, string> = {};

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return fetchWithAuth<TResponse>(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers,
      // Safe casting for FormData vs JSON
      body: isFormData ? (body as unknown as FormData) : JSON.stringify(body),
    });
  },

  async put<TResponse, TBody = unknown>(
    endpoint: string,
    body: TBody,
    accessToken?: string | null,
    isFormData = false,
  ): Promise<TResponse> {
    const headers: Record<string, string> = {};

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return fetchWithAuth<TResponse>(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers,
      body: isFormData ? (body as unknown as FormData) : JSON.stringify(body),
    });
  },

  // Added PATCH just in case you need it later, using the same pattern
  async patch<TResponse, TBody = unknown>(
    endpoint: string,
    body: TBody,
    accessToken?: string | null,
    isFormData = false,
  ): Promise<TResponse> {
    const headers: Record<string, string> = {};

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return fetchWithAuth<TResponse>(`${BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers,
      body: isFormData ? (body as unknown as FormData) : JSON.stringify(body),
    });
  },

  async delete<T>(endpoint: string, accessToken?: string | null): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return fetchWithAuth<T>(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers,
    });
  },
};
