import { API_BASE_URL, assertApiBaseUrl, requestJson } from "./client";
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
  const data = await requestJson<{ favoriteTeam: FavoriteTeam }>(
    "/api/me/favorite-teams",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
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
  assertApiBaseUrl();

  const response = await fetch(
    `${API_BASE_URL}/api/me/favorite-teams/${favoriteTeamId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }
}
