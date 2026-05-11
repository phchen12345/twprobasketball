import { API_BASE_URL, assertApiBaseUrl, requestJson } from "./client";
import type { GoogleLoginResponse } from "../types/auth";

export async function loginWithGoogleToken(accessToken: string) {
  return requestJson<GoogleLoginResponse>("/api/auth/google", {
    method: "POST",
    body: JSON.stringify({ accessToken }),
  });
}

export async function refreshAuthSession(csrfToken: string, refreshToken: string) {
  return requestJson<GoogleLoginResponse>("/api/auth/refresh", {
    method: "POST",
    headers: {
      "X-CSRF-Token": csrfToken,
      "X-Refresh-Token": refreshToken,
    },
  });
}

export async function logoutAuthSession(csrfToken: string, refreshToken: string) {
  assertApiBaseUrl();

  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
      "X-Refresh-Token": refreshToken,
    },
  });

  if (!response.ok && response.status !== 401 && response.status !== 403) {
    throw new Error(`Request failed with ${response.status}`);
  }
}
