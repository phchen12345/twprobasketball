import { API_BASE_URL, assertApiBaseUrl, requestJson } from "./client";
import type { GoogleLoginResponse } from "../types/auth";

export async function loginWithGoogleToken(accessToken: string) {
  return requestJson<GoogleLoginResponse>("/api/auth/google", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ accessToken }),
  });
}

export async function refreshAuthSession(csrfToken: string) {
  return requestJson<GoogleLoginResponse>("/api/auth/refresh", {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRF-Token": csrfToken,
    },
  });
}

export async function logoutAuthSession(csrfToken: string) {
  assertApiBaseUrl();

  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
  });

  if (!response.ok && response.status !== 401 && response.status !== 403) {
    throw new Error(`Request failed with ${response.status}`);
  }
}
