"use client";

import { useEffect, useState } from "react";
import { fetchFavoriteTeams } from "@/lib/api/favorite";
import {
  fetchLastReadAt,
  markAllNotificationsRead,
} from "@/lib/api/notification";
import {
  getFavoriteTeamGamesInNotificationWindow,
  TeamNotificationGame,
} from "@/domain/teams/teamNotifications";
import { useAuth } from "@/context/AuthProvider";
import { useTpblGames } from "@/hooks/data/useTpblGames";

export type TeamNotificationsStatus = "idle" | "loading" | "success" | "error";

function getUnreadCount(games: TeamNotificationGame[], lastReadAt: string | null) {
  if (!lastReadAt) {
    return games.length;
  }

  const lastReadTime = new Date(lastReadAt).getTime();

  if (Number.isNaN(lastReadTime)) {
    return games.length;
  }

  return games.filter((game) => {
    const visibleFromTime = new Date(game.visibleFrom).getTime();

    return Number.isNaN(visibleFromTime) || visibleFromTime > lastReadTime;
  }).length;
}

export function useTeamNotifications() {
  const { accessToken, user } = useAuth();
  const tpblGames = useTpblGames();

  const [status, setStatus] = useState<TeamNotificationsStatus>("idle");
  const [games, setGames] = useState<TeamNotificationGame[]>([]);
  const [lastReadAt, setLastReadAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadNotifications() {
      if (!accessToken || !user) {
        setStatus("idle");
        setGames([]);
        setLastReadAt(null);
        return;
      }

      setStatus("loading");

      try {
        const [favoriteTeams, lastRead] = await Promise.all([
          fetchFavoriteTeams(accessToken),
          fetchLastReadAt(accessToken),
        ]);

        const notificationGames =
          getFavoriteTeamGamesInNotificationWindow(favoriteTeams, new Date(), {
            tpblGames,
          });

        if (!cancelled) {
          setGames(notificationGames);
          setLastReadAt(lastRead);
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

  const unreadCount = getUnreadCount(games, lastReadAt);

  async function markCurrentNotificationsRead() {
    if (!accessToken) return;

    await markAllNotificationsRead(accessToken);

    setLastReadAt(new Date().toISOString());
  }

  return {
    games,
    isAuthenticated: Boolean(user),
    markCurrentNotificationsRead,
    status,
    unreadCount,
  };
}
