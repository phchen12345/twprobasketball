import { API_BASE_URL, assertApiBaseUrl, requestJson } from "./client";
import { readCsrfToken } from "../storage/csrf";
import type { FavoriteTeam, FavoriteTeamInput } from "../types/favorite";

export async function fetchFavoriteTeams(accessToken: string) {
  const data = await requestJson<{ favoriteTeams: FavoriteTeam[] }>(
    "/api/me/favorite-teams",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return data.favoriteTeams;
}

export async function addFavoriteTeam(
  accessToken: string,
  team: FavoriteTeamInput,
) {
  const csrfToken = readCsrfToken();

  const data = await requestJson<{ favoriteTeam: FavoriteTeam }>(
    "/api/me/favorite-teams",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
      },
      body: JSON.stringify(team),
    },
  );

  return data.favoriteTeam;
}

export async function removeFavoriteTeam(
  accessToken: string,
  favoriteTeamId: string,
) {
  const csrfToken = readCsrfToken();

  assertApiBaseUrl();

  const response = await fetch(
    `${API_BASE_URL}/api/me/favorite-teams/${favoriteTeamId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }
}
