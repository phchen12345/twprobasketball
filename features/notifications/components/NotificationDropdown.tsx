"use client";

import NextImage from "next/image";
import { TeamNotificationGame } from "@/domain/teams/teamNotifications";
import { TeamNotificationsStatus } from "../hooks/useTeamNotifications";

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
      <div className="mt-1 truncate text-[11px] text-white/55">
        {game.venue}
      </div>
    </li>
  );
}

type NotificationDropdownProps = {
  games: TeamNotificationGame[];
  isCompact: boolean;
  status: TeamNotificationsStatus;
};

export function NotificationDropdown({
  games,
  isCompact,
  status,
}: NotificationDropdownProps) {
  return (
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
            <NotificationItem
              key={`${game.league}:${game.gameId}`}
              game={game}
            />
          ))}
        </ul>
      ) : (
        <div className="px-2 py-3 text-xs text-white/60">
          明日沒有收藏球隊賽程。
        </div>
      )}
    </div>
  );
}
