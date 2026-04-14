"use client";

import { useEffect, useState } from "react";
import { fetchFavoriteTeams } from "@/lib/api/favorite";
import {
  fetchNotificationReadKeys,
  markNotificationsRead,
} from "@/lib/api/notification";
import {
  getFavoriteTeamGamesInNotificationWindow,
  TeamNotificationGame,
} from "@/domain/teams/teamNotifications";
import { useAuth } from "@/context/AuthProvider";
import { useTpblGames } from "@/hooks/data/useTpblGames";

export type TeamNotificationsStatus = "idle" | "loading" | "success" | "error";

function getUnreadCount(games: TeamNotificationGame[], readKeys: string[]) {
  const readKeySet = new Set(readKeys);

  return games.filter((game) => !readKeySet.has(game.notificationKey)).length;
}

export function useTeamNotifications() {
  const { accessToken, user } = useAuth();
  const tpblGames = useTpblGames();

  const [status, setStatus] = useState<TeamNotificationsStatus>("idle");
  const [games, setGames] = useState<TeamNotificationGame[]>([]);
  const [readKeys, setReadKeys] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadNotifications() {
      if (!accessToken || !user) {
        setStatus("idle");
        setGames([]);
        setReadKeys([]);
        return;
      }

      setStatus("loading");

      try {
        const [favoriteTeams, nextReadKeys] = await Promise.all([
          fetchFavoriteTeams(accessToken),
          fetchNotificationReadKeys(accessToken),
        ]);

        const notificationGames =
          getFavoriteTeamGamesInNotificationWindow(favoriteTeams, new Date(), {
            tpblGames,
          });

        if (!cancelled) {
          setGames(notificationGames);
          setReadKeys(nextReadKeys);
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
  }, [accessToken, tpblGames, user]);

  const unreadCount = getUnreadCount(games, readKeys);

  async function markCurrentNotificationsRead() {
    if (!accessToken) return;

    const notificationKeys = games.map((game) => game.notificationKey);

    if (notificationKeys.length === 0) return;

    await markNotificationsRead(accessToken, notificationKeys);

    setReadKeys((current) =>
      Array.from(new Set([...current, ...notificationKeys])),
    );
  }

  return {
    games,
    isAuthenticated: Boolean(user),
    markCurrentNotificationsRead,
    status,
    unreadCount,
  };
}
