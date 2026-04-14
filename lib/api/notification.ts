import { API_BASE_URL, requestJson } from "./client";
import type { LastReadAtResponse } from "../types/notification";

export async function fetchLastReadAt(accessToken: string) {
  const data = await requestJson<LastReadAtResponse>(
    "/api/notifications/last-read",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return data.lastReadAt;
}

export async function markAllNotificationsRead(accessToken: string) {
  const response = await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.error("markAllNotificationsRead failed", response.status);
    throw new Error(`Request failed with ${response.status}`);
  }
}
