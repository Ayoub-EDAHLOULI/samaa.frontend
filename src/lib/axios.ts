import axios, { InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Variables to handle simultaneous requests during a token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 1. REQUEST INTERCEPTOR: Attach the Access Token
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 2. RESPONSE INTERCEPTOR: Catch 401s and Refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If the error is 401 (Unauthorized) and we haven't retried this request yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If a refresh is already happening, add this request to the queue to wait
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Mark the request so we don't end up in an infinite loop
      originalRequest._retry = true;
      isRefreshing = true;

      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");

      // If there's no refresh token, the user is completely logged out
      if (!refreshToken) {
        isRefreshing = false;
        forceLogout();
        return Promise.reject(error);
      }

      try {
        // Ask the C# backend for new tokens
        // Note: We use a fresh axios instance here to avoid interceptor loops
        const refreshResponse = await axios.post(
          `${API_URL}/Auth/refresh-token`,
          {
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
        );

        if (refreshResponse.data.success) {
          const newAccessToken = refreshResponse.data.data.accessToken;
          const newRefreshToken = refreshResponse.data.data.refreshToken;

          // Save the new tokens
          Cookies.set("accessToken", newAccessToken, { expires: 7 });
          Cookies.set("refreshToken", newRefreshToken, { expires: 7 });

          // Update the failed request with the new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Release the queue for any other requests that were waiting
          processQueue(null, newAccessToken);

          // Retry the original request
          return apiClient(originalRequest);
        } else {
          throw new Error("Refresh failed");
        }
      } catch (refreshError) {
        // If the refresh token is expired or invalid, destroy the session
        processQueue(refreshError, null);
        forceLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// Utility function to cleanly boot the user out
const forceLogout = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  Cookies.remove("user");

  if (typeof window !== "undefined") {
    const path = window.location.pathname;

    // Only force a redirect to login if they are inside a protected dashboard area.
    // If they are on a public page (like /blog or /), let them stay there!
    if (
      path.startsWith("/admin") ||
      path.startsWith("/client") ||
      path.startsWith("/agent")
    ) {
      window.location.href = "/login";
    }
  }
};

export default apiClient;
