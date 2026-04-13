"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchFavoriteTeams,
  fetchReadNotificationKeys,
  markNotificationsRead,
} from "@/app/lib/authClient";
import {
  getFavoriteTeamGamesByDate,
  getTomorrowDateKey,
  TeamNotificationGame,
} from "@/app/lib/teamNotifications";
import { useAuth } from "../auth/AuthProvider";

export type TeamNotificationsStatus = "idle" | "loading" | "success" | "error";

function getNotificationKey(game: TeamNotificationGame) {
  return `${game.date}:${game.league}:${game.gameId}`;
}

export function useTeamNotifications() {
  const { accessToken, user } = useAuth();
  const [status, setStatus] = useState<TeamNotificationsStatus>("idle");
  const [games, setGames] = useState<TeamNotificationGame[]>([]);
  const [readNotificationKeys, setReadNotificationKeys] = useState<Set<string>>(
    () => new Set(),
  );
  const tomorrowDateKey = useMemo(() => getTomorrowDateKey(), []);

  useEffect(() => {
    let cancelled = false;

    async function loadNotifications() {
      if (!accessToken || !user) {
        setStatus("idle");
        setGames([]);
        setReadNotificationKeys(new Set());
        return;
      }

      setStatus("loading");

      try {
        const [favoriteTeams, readKeys] = await Promise.all([
          fetchFavoriteTeams(accessToken),
          fetchReadNotificationKeys(accessToken),
        ]);
        const tomorrowGames = getFavoriteTeamGamesByDate(favoriteTeams, tomorrowDateKey);

        if (!cancelled) {
          setGames(tomorrowGames);
          setReadNotificationKeys(new Set(readKeys));
          setStatus("success");
        }
      } catch {
        if (!cancelled) {
          setGames([]);
          setStatus("error");
        }
      }
    }

    void loadNotifications();

    return () => {
      cancelled = true;
    };
  }, [accessToken, tomorrowDateKey, user]);

  const unreadCount = games.filter(
    (game) => !readNotificationKeys.has(getNotificationKey(game)),
  ).length;

  function markCurrentNotificationsRead() {
    if (!accessToken || games.length === 0) {
      return;
    }

    const unreadKeys = games
      .map(getNotificationKey)
      .filter((key) => !readNotificationKeys.has(key));

    if (unreadKeys.length === 0) {
      return;
    }

    setReadNotificationKeys((currentKeys) => {
      const nextKeys = new Set(currentKeys);

      unreadKeys.forEach((key) => {
        nextKeys.add(key);
      });

      return nextKeys;
    });

    void markNotificationsRead(accessToken, unreadKeys).catch(() => {
      setReadNotificationKeys((currentKeys) => {
        const nextKeys = new Set(currentKeys);

        unreadKeys.forEach((key) => {
          nextKeys.delete(key);
        });

        return nextKeys;
      });
    });
  }

  return {
    games,
    isAuthenticated: Boolean(user),
    markCurrentNotificationsRead,
    status,
    unreadCount,
  };
}
