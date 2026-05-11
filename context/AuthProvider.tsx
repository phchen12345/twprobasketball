"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  loginWithGoogleToken,
  logoutAuthSession,
  refreshAuthSession,
} from "@/lib/api/auth";
import {
  clearCsrfToken,
  readCsrfToken,
  storeCsrfToken,
} from "@/lib/storage/csrf";
import {
  clearRefreshToken,
  readRefreshToken,
  storeRefreshToken,
} from "@/lib/storage/refreshToken";
import type { AuthUser } from "@/lib/types/user";

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  accessToken: string | null;
  loginWithGoogle: (googleAccessToken: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      const csrfToken = readCsrfToken();
      const refreshToken = readRefreshToken();

      if (!csrfToken || !refreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        const refreshed = await refreshAuthSession(csrfToken, refreshToken);

        if (!cancelled) {
          storeCsrfToken(refreshed.csrfToken);
          storeRefreshToken(refreshed.refreshToken);
          setAccessToken(refreshed.accessToken);
          setUser(refreshed.user);
        }
      } catch {
        clearCsrfToken();
        clearRefreshToken();
        setAccessToken(null);
        setUser(null);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const loginWithGoogle = useCallback(async (googleAccessToken: string) => {
    const result = await loginWithGoogleToken(googleAccessToken);

    storeCsrfToken(result.csrfToken);
    storeRefreshToken(result.refreshToken);
    setAccessToken(result.accessToken);
    setUser(result.user);
  }, []);

  const logout = useCallback(async () => {
    const csrfToken = readCsrfToken();
    const refreshToken = readRefreshToken();

    if (csrfToken && refreshToken) {
      await logoutAuthSession(csrfToken, refreshToken).catch(() => undefined);
    }

    clearCsrfToken();
    clearRefreshToken();
    setAccessToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      accessToken,
      loginWithGoogle,
      logout,
    }),
    [accessToken, isLoading, loginWithGoogle, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return value;
}
