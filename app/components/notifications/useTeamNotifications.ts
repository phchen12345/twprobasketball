"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchFavoriteTeams,
  fetchLastReadAt,
  markAllNotificationsRead,
} from "@/app/lib/authClient";
import {
  getFavoriteTeamGamesByDate,
  getTomorrowDateKey,
  TeamNotificationGame,
} from "@/app/lib/teamNotifications";
import { useAuth } from "../auth/AuthProvider";

export type TeamNotificationsStatus = "idle" | "loading" | "success" | "error";

export function useTeamNotifications() {
  const { accessToken, user } = useAuth();

  const [status, setStatus] = useState<TeamNotificationsStatus>("idle");
  const [games, setGames] = useState<TeamNotificationGame[]>([]);
  const [lastReadAt, setLastReadAt] = useState<string | null>(null);

  const tomorrowDateKey = useMemo(() => getTomorrowDateKey(), []);

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

        const tomorrowGames = getFavoriteTeamGamesByDate(
          favoriteTeams,
          tomorrowDateKey,
        );

        if (!cancelled) {
          setGames(tomorrowGames);
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
  }, [accessToken, tomorrowDateKey, user]);

  const unreadCount = lastReadAt ? 0 : games.length;

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
