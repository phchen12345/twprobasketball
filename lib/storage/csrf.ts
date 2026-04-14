const CSRF_STORAGE_KEY = "basketball_csrf_token";

export function readCsrfToken() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedToken = window.localStorage.getItem(CSRF_STORAGE_KEY);

  if (storedToken) {
    return storedToken;
  }

  const cookieToken = document.cookie
    .split("; ")
    .find((part) => part.startsWith("basketball_csrf_token="));

  return cookieToken ? decodeURIComponent(cookieToken.split("=")[1]) : null;
}

export function storeCsrfToken(token: string) {
  window.localStorage.setItem(CSRF_STORAGE_KEY, token);
}

export function clearCsrfToken() {
  window.localStorage.removeItem(CSRF_STORAGE_KEY);
}
