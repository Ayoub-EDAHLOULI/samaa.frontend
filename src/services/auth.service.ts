import Cookies from "js-cookie";
import apiClient from "../lib/axios";
import { User, LoginDto, RegisterDto, AuthResponse } from "../types/auth.types";

// Helper: unwrap the standard ApiResponse envelope and throw on failure
function unwrap<T>(responseData: {
  success: boolean;
  data: T | null;
  message?: string;
}): T {
  if (!responseData.success || responseData.data == null) {
    throw new Error(responseData.message || "Request failed");
  }
  return responseData.data;
}

export const authService = {
  // POST /auth/login
  // Backend returns { user, accessToken } in body; sets refreshToken as httpOnly cookie
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/login", credentials, {
      withCredentials: true,
    });
    const payload = unwrap<{ user: User; accessToken: string }>(response.data);
    Cookies.set("accessToken", payload.accessToken, { expires: 7 });
    return {
      user: payload.user,
      tokens: { accessToken: payload.accessToken },
    };
  },

  // POST /auth/register
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/register", data, {
      withCredentials: true,
    });
    const payload = unwrap<{ user: User; accessToken: string }>(response.data);
    Cookies.set("accessToken", payload.accessToken, { expires: 7 });
    return {
      user: payload.user,
      tokens: { accessToken: payload.accessToken },
    };
  },

  // POST /auth/refresh-token
  // Backend reads refreshToken from httpOnly cookie — no body needed
  refreshToken: async (): Promise<{ accessToken: string }> => {
    const response = await apiClient.post(
      "/auth/refresh-token",
      {},
      { withCredentials: true },
    );
    const payload = unwrap<{ accessToken: string }>(response.data);
    Cookies.set("accessToken", payload.accessToken, { expires: 7 });
    return { accessToken: payload.accessToken };
  },

  // GET /auth/profile
  getProfile: async (accessToken: string): Promise<User> => {
    const response = await apiClient.get("/auth/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });
    return unwrap<User>(response.data);
  },

  // POST /auth/logout
  logout: async (accessToken?: string): Promise<void> => {
    try {
      await apiClient.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
          headers: accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {},
        },
      );
    } catch {
      // Always clear client-side state even if request fails
    } finally {
      Cookies.remove("accessToken");
    }
  },

  // POST /auth/forgot-password
  forgotPassword: async (email: string): Promise<void> => {
    const response = await apiClient.post("/auth/forgot-password", { email });
    unwrap(response.data);
  },
};
