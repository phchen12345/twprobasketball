import { requestJson } from "./client";
import type { AdminAccessResponse, AuthUser } from "../types/user";

export async function fetchCurrentUser(accessToken: string) {
  const data = await requestJson<{ user: AuthUser }>("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data.user;
}

export async function verifyAdminAccess(accessToken: string) {
  return requestJson<AdminAccessResponse>("/api/admin/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
