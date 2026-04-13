const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL?.replace(/\/$/, "") || "";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: string;
};

export type GoogleLoginResponse = {
  accessToken: string;
  csrfToken: string;
  user: AuthUser;
};

export function readCsrfToken() {
  if (typeof window === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split("; ")
    .find((part) => part.startsWith("basketball_csrf_token="));

  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("Backend API base URL is not configured");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function loginWithGoogleIdToken(idToken: string) {
  return requestJson<GoogleLoginResponse>("/api/auth/google", {
    method: "POST",
    body: JSON.stringify({ idToken }),
  });
}

export async function fetchCurrentUser(accessToken: string) {
  const data = await requestJson<{ user: AuthUser }>("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data.user;
}

export async function refreshAuthSession(csrfToken: string) {
  return requestJson<GoogleLoginResponse>("/api/auth/refresh", {
    method: "POST",
    headers: {
      "X-CSRF-Token": csrfToken,
    },
  });
}

export async function logoutAuthSession(csrfToken: string) {
  if (!API_BASE_URL) {
    throw new Error("Backend API base URL is not configured");
  }

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
