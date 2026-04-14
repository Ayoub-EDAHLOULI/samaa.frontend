"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/services/auth.service";
import { User, LoginDto, RegisterDto } from "@/types/auth.types";
import { TOKEN_REFRESHED_EVENT } from "@/api/fetchWithAuth";
import { getLocaleFromPathname } from "@/api/utils";
import Cookies from "js-cookie";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ref to prevent double execution in Strict Mode
  const initialized = useRef(false);

  const logout = useCallback(async () => {
    try {
      if (accessToken) await authService.logout(accessToken);
    } catch {
    } finally {
      setAccessToken(null);
      setUser(null);
      setIsLoading(false);

      const currentLocale = getLocaleFromPathname(pathname);
      router.replace(`/${currentLocale}/login`);
    }
  }, [accessToken, pathname, router]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      attemptSilentRefresh();
    }

    // Listen for refresh events from fetchWithAuth
    const handleTokenRefresh = (event: Event) => {
      const customEvent = event as CustomEvent<{ accessToken: string }>;
      if (customEvent.detail?.accessToken) {
        setAccessToken(customEvent.detail.accessToken);
      }
    };

    // Listen for logout events (if triggered by interceptor)
    const handleLogout = () => {
      logout();
    };

    window.addEventListener(TOKEN_REFRESHED_EVENT, handleTokenRefresh);
    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener(TOKEN_REFRESHED_EVENT, handleTokenRefresh);
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [logout]);

  // 1. On Page Load: Try to get a new Access Token using the HttpOnly Cookie
  const attemptSilentRefresh = async () => {
    try {
      const data = await authService.refreshToken();
      setAccessToken(data.accessToken);

      // Now fetch user profile with the new access token
      const profile = await authService.getProfile(data.accessToken);
      setUser(profile);
    } catch {
      // Cookie invalid or missing. User is Guest.
      setAccessToken(null);
      setUser(null);
      Cookies.remove("accessToken");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginDto) => {
    try {
      const response = await authService.login(credentials);

      // Rely on the interface, remove `any` casting
      if (response?.tokens?.accessToken && response?.user) {
        setAccessToken(response.tokens.accessToken);
        setUser(response.user);
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterDto) => {
    try {
      const response = await authService.register(data);

      // Rely on the interface, remove `any` casting
      if (response?.tokens?.accessToken && response?.user) {
        setAccessToken(response.tokens.accessToken);
        setUser(response.user);
      }
    } catch (error) {
      throw error;
    }
  };

  const updateUser = (newUser: User) => {
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
