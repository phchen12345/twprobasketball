import { API_BASE_URL, requestJson } from "./client";
import type {
  LastReadAtResponse,
  NotificationReadKeysResponse,
} from "../types/notification";

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

export async function fetchNotificationReadKeys(accessToken: string) {
  const data = await requestJson<NotificationReadKeysResponse>(
    "/api/notifications/read-keys",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return data.readKeys;
}

export async function markNotificationsRead(
  accessToken: string,
  notificationKeys: string[],
) {
  const response = await fetch(`${API_BASE_URL}/api/notifications/read`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ notificationKeys }),
  });

  if (!response.ok) {
    console.error("markNotificationsRead failed", response.status);
    throw new Error(`Request failed with ${response.status}`);
  }
}
