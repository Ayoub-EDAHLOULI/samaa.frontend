import axios, { InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // always send httpOnly cookies (refreshToken)
});

// Mutex state for coordinating concurrent refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// REQUEST INTERCEPTOR — attach accessToken from cookie
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

// RESPONSE INTERCEPTOR — catch 401s and silently refresh via httpOnly cookie
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip refresh for auth endpoints to avoid loops
      const url: string = originalRequest.url ?? "";
      if (url.includes("/auth/login") || url.includes("/auth/register") || url.includes("/auth/refresh-token")) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Backend reads refreshToken from httpOnly cookie — no body needed
        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        if (refreshResponse.data?.success) {
          const newAccessToken: string = refreshResponse.data.data.accessToken;
          Cookies.set("accessToken", newAccessToken, { expires: 7 });
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return apiClient(originalRequest);
        } else {
          throw new Error("Refresh failed");
        }
      } catch (refreshError) {
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

const forceLogout = () => {
  Cookies.remove("accessToken");
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    if (path.includes("/admin") || path.includes("/client") || path.includes("/agent")) {
      window.location.href = "/login";
    }
  }
};

export default apiClient;
