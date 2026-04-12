"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (t: Theme) => void;
}

const STORAGE_KEY = "samaa-theme";
const DEFAULT: Theme = "dark";

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT,
  resolvedTheme: DEFAULT,
  setTheme: () => {},
});

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.classList.remove("light");
  } else {
    root.classList.remove("dark");
    root.classList.add("light");
  }
  // Persist to both localStorage and cookie (cookie allows server-side read)
  try {
    localStorage.setItem(STORAGE_KEY, theme);
    document.cookie = `${STORAGE_KEY}=${theme};path=/;max-age=31536000;SameSite=Lax`;
  } catch {
    // storage unavailable — ignore
  }
}

export function ThemeProvider({ children, initialTheme }: { children: React.ReactNode; initialTheme?: Theme }) {
  const [theme, setThemeState] = useState<Theme>(initialTheme ?? DEFAULT);

  // On first mount, read from storage and reconcile
  useEffect(() => {
    let stored: Theme | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    } catch {
      // ignore
    }
    const resolved: Theme = stored === "light" || stored === "dark" ? stored : DEFAULT;
    if (resolved !== theme) {
      setThemeState(resolved);
    }
    applyTheme(resolved);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    applyTheme(t);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme: theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
