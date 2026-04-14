"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addFavoriteTeam,
  fetchFavoriteTeams,
  removeFavoriteTeam,
} from "@/lib/api/favorite";
import type { FavoriteTeam } from "@/lib/types/favorite";
import { SelectableTeam } from "@/domain/teams/teams";
import { getCanonicalFavoriteTeamId } from "@/domain/teams/teamIdentity";

type FavoriteTeamsStatus = "idle" | "loading" | "success" | "error";

type FavoriteTeamsError = {
  action: "load" | "add" | "remove";
  message: string;
};

function getTeamKey(team: Pick<SelectableTeam, "league" | "teamId">) {
  return team.teamId;
}

function getFavoriteTeamKey(team: FavoriteTeam) {
  return getCanonicalFavoriteTeamId(team);
}

function createOptimisticFavorite(team: SelectableTeam): FavoriteTeam {
  return {
    id: `optimistic:${getTeamKey(team)}`,
    league: team.league,
    teamId: team.teamId,
    teamName: team.teamName,
    teamLogo: team.teamLogo,
    createdAt: new Date().toISOString(),
  };
}

export function useFavoriteTeams({
  accessToken,
  enabled,
}: {
  accessToken: string | null;
  enabled: boolean;
}) {
  const [favoriteTeams, setFavoriteTeams] = useState<FavoriteTeam[]>([]);
  const [pendingTeamKeys, setPendingTeamKeys] = useState<Set<string>>(
    () => new Set(),
  );
  const [error, setError] = useState<FavoriteTeamsError | null>(null);
  const [status, setStatus] = useState<FavoriteTeamsStatus>("idle");

  useEffect(() => {
    let cancelled = false;

    async function loadFavoriteTeams() {
      if (!enabled || !accessToken) {
        setStatus("idle");
        return;
      }

      setStatus("loading");

      try {
        const result = await fetchFavoriteTeams(accessToken);

        if (!cancelled) {
          setFavoriteTeams(result);
          setError(null);
          setStatus("success");
        }
      } catch {
        if (!cancelled) {
          setError({
            action: "load",
            message: "無法載入已選球隊，請稍後再試。",
          });
          setStatus("error");
        }
      }
    }

    void loadFavoriteTeams();

    return () => {
      cancelled = true;
    };
  }, [accessToken, enabled]);

  const favoriteByKey = useMemo(() => {
    return new Map(
      favoriteTeams.map((team) => [getFavoriteTeamKey(team), team]),
    );
  }, [favoriteTeams]);

  const setTeamPending = useCallback((teamKey: string, isPending: boolean) => {
    setPendingTeamKeys((current) => {
      const next = new Set(current);

      if (isPending) {
        next.add(teamKey);
      } else {
        next.delete(teamKey);
      }

      return next;
    });
  }, []);

  const toggleFavorite = useCallback(
    async (team: SelectableTeam) => {
      if (!accessToken) {
        setError({
          action: "add",
          message: "請先登入後再選擇球隊。",
        });
        return;
      }

      const teamKey = getTeamKey(team);
      const existing = favoriteByKey.get(teamKey);
      const previousFavoriteTeams = favoriteTeams;

      setError(null);
      setTeamPending(teamKey, true);

      if (existing) {
        setFavoriteTeams((current) =>
          current.filter((favorite) => favorite.id !== existing.id),
        );

        try {
          await removeFavoriteTeam(accessToken, existing.id);
        } catch {
          setFavoriteTeams(previousFavoriteTeams);
          setError({
            action: "remove",
            message: "取消選擇失敗，已還原原本狀態。",
          });
        } finally {
          setTeamPending(teamKey, false);
        }

        return;
      }

      const optimisticFavorite = createOptimisticFavorite(team);

      setFavoriteTeams((current) => [...current, optimisticFavorite]);

      try {
        const savedFavorite = await addFavoriteTeam(accessToken, team);

        setFavoriteTeams((current) =>
          current.map((favorite) =>
            favorite.id === optimisticFavorite.id ? savedFavorite : favorite,
          ),
        );
      } catch {
        setFavoriteTeams(previousFavoriteTeams);
        setError({
          action: "add",
          message: "選擇球隊失敗，已還原原本狀態。",
        });
      } finally {
        setTeamPending(teamKey, false);
      }
    },
    [accessToken, favoriteByKey, favoriteTeams, setTeamPending],
  );

  const isTeamFavorite = useCallback(
    (team: SelectableTeam) => favoriteByKey.has(getTeamKey(team)),
    [favoriteByKey],
  );

  const isTeamPending = useCallback(
    (team: SelectableTeam) => pendingTeamKeys.has(getTeamKey(team)),
    [pendingTeamKeys],
  );

  return {
    error,
    favoriteTeams,
    isTeamFavorite,
    isTeamPending,
    status,
    toggleFavorite,
  };
}
