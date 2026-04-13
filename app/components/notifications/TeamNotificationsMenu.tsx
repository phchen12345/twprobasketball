"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { fetchFavoriteTeams } from "@/app/lib/authClient";
import {
  getFavoriteTeamGamesByDate,
  getTomorrowDateKey,
  TeamNotificationGame,
} from "@/app/lib/teamNotifications";
import { useAuth } from "../auth/AuthProvider";

type Status = "idle" | "loading" | "success" | "error";

function BellIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.25 18.75a2.25 2.25 0 0 1-4.5 0m8.25-3.75V10a6 6 0 1 0-12 0v5l-1.5 1.5v.75h15v-.75L18 15Z"
      />
    </svg>
  );
}

function NotificationItem({ game }: { game: TeamNotificationGame }) {
  return (
    <li className="rounded-md border border-white/10 bg-white/5 px-3 py-2">
      <div className="flex items-center justify-between gap-3 text-[11px] text-white/55">
        <span>{game.league}</span>
        <span>{game.time}</span>
      </div>
      <div className="mt-2 flex min-w-0 items-center gap-2">
        <NextImage
          src={game.awayTeamLogo}
          alt={game.awayTeamName}
          width={28}
          height={28}
          className="size-7 shrink-0 object-contain"
        />
        <div className="min-w-0 flex-1 text-center text-xs font-semibold text-white">
          <div className="truncate">
            {game.awayTeamName} vs {game.homeTeamName}
          </div>
        </div>
        <NextImage
          src={game.homeTeamLogo}
          alt={game.homeTeamName}
          width={28}
          height={28}
          className="size-7 shrink-0 object-contain"
        />
      </div>
      <div className="mt-1 truncate text-[11px] text-white/55">{game.venue}</div>
    </li>
  );
}

type TeamNotificationsMenuProps = {
  isCompact?: boolean;
};

export function TeamNotificationsMenu({ isCompact = false }: TeamNotificationsMenuProps) {
  const { accessToken, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [games, setGames] = useState<TeamNotificationGame[]>([]);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const tomorrowDateKey = useMemo(() => getTomorrowDateKey(), []);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadNotifications() {
      if (!accessToken || !user) {
        setStatus("idle");
        setGames([]);
        return;
      }

      setStatus("loading");

      try {
        const favoriteTeams = await fetchFavoriteTeams(accessToken);
        const tomorrowGames = getFavoriteTeamGamesByDate(favoriteTeams, tomorrowDateKey);

        if (!cancelled) {
          setGames(tomorrowGames);
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

  if (!user) {
    return null;
  }

  const unreadCount = games.length;

  return (
    <div ref={menuRef} className="relative shrink-0">
      <Button
        variant="pill"
        size="pill"
        className="relative h-8 px-2 sm:h-9 sm:px-3"
        aria-label={`通知，${unreadCount} 則明日賽程`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((current) => !current)}
      >
        <BellIcon />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex min-w-4 items-center justify-center rounded-full bg-[#e11d48] px-1 text-[10px] font-semibold leading-4 text-white">
            {unreadCount}
          </span>
        ) : null}
      </Button>

      {isOpen ? (
        <div
          role="menu"
          className={`mt-2 w-[min(22rem,calc(100vw-1rem))] rounded-lg border border-white/15 bg-[#0f1117]/95 p-3 text-white shadow-[0_18px_48px_rgba(0,0,0,0.3)] backdrop-blur-xl ${
            isCompact
              ? "fixed left-1/2 -translate-x-1/2"
              : "absolute right-0 translate-x-0"
          }`}
        >
          <div className="px-2 pb-2 pt-1">
            <div className="text-xs font-semibold tracking-[0.12em]">通知</div>
          </div>

          {status === "loading" ? (
            <div className="px-2 py-3 text-xs text-white/60">載入通知中...</div>
          ) : status === "error" ? (
            <div className="px-2 py-3 text-xs text-[#fca5a5]">
              通知載入失敗，請稍後再試。
            </div>
          ) : games.length > 0 ? (
            <ul className="space-y-2" role="list">
              {games.map((game) => (
                <NotificationItem key={`${game.league}:${game.gameId}`} game={game} />
              ))}
            </ul>
          ) : (
            <div className="px-2 py-3 text-xs text-white/60">
              明天沒有已選球隊的比賽。
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
