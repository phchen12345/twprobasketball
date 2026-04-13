const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_VISITOR_API_BASE_URL?.replace(/\/$/, "") ||
  "";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: string;
};

export type GoogleLoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export function getStoredAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("basketball_access_token");
}

export function storeAccessToken(token: string) {
  window.localStorage.setItem("basketball_access_token", token);
}

export function clearAccessToken() {
  window.localStorage.removeItem("basketball_access_token");
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("Backend API base URL is not configured");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
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
