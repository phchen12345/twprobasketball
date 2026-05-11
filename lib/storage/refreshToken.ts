const REFRESH_TOKEN_STORAGE_KEY = "basketball_refresh_token";

export function readRefreshToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function storeRefreshToken(token: string) {
  window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
}

export function clearRefreshToken() {
  window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}
