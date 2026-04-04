"use client";

import { useEffect, useMemo, useState } from "react";
import { ScheduleView } from "../components/scheduleTypes";

const gamesPerPage = 6;

type SchedulableGame = {
  date: string;
  time?: string;
  away_score?: number;
  home_score?: number;
  status?: string;
};

type Options<T> = {
  getTeams: (game: T) => string[];
};

function getMonthKey(date: string) {
  return date.slice(0, 7);
}

// 只要有最終比分，或資料明確標示已完賽，就視為已完成，
// 不完全依賴日期切分，避免像 G32 這種剛打完但仍被歸在 upcoming。
function getScheduledAt(date: string, time?: string) {
  if (!time) {
    return new Date(`${date}T00:00:00`);
  }

  return new Date(`${date}T${time}:00`);
}

function isCompletedGame<T extends SchedulableGame>(game: T, todayKey: string) {
  if (game.status === "COMPLETED") {
    return true;
  }

  // 只要資料有明確 status，且不是 COMPLETED，就一律不要提前歸到已完成。
  if (typeof game.status === "string" && game.status.length > 0) {
    return false;
  }

  if (typeof game.away_score === "number" && typeof game.home_score === "number") {
    return true;
  }

  // 沒有明確完賽狀態時，不只看日期，避免當天進行中的比賽被提早歸到 completed。
  if (game.time) {
    const scheduledAt = getScheduledAt(game.date, game.time);
    const now = new Date();
    const elapsedMs = now.getTime() - scheduledAt.getTime();
    const completionGraceMs = 5 * 60 * 60 * 1000;

    return elapsedMs >= completionGraceMs;
  }

  return game.date < todayKey;
}

export function useSchedule<T extends SchedulableGame>(
  games: T[],
  todayKey: string,
  options: Options<T>,
) {
  // 這裡管理賽程區共用的 UI 狀態，PLG 和 TPBL 都會用到。
  const [scheduleView, setScheduleView] = useState<ScheduleView>("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState("all");

  // 先把 completed / upcoming 分好並排序，後面的篩選只需要處理目前分頁那一組資料。
  const completedGames = useMemo(
    () =>
      [...games]
        .filter((game) => isCompletedGame(game, todayKey))
        .sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [games, todayKey],
  );

  const upcomingGames = useMemo(
    () =>
      [...games]
        .filter((game) => !isCompletedGame(game, todayKey))
        .sort((a, b) => +new Date(a.date) - +new Date(b.date)),
    [games, todayKey],
  );

  const baseGames = scheduleView === "completed" ? completedGames : upcomingGames;

  // 月份與隊伍選項只根據目前這個 tab 的資料產生。
  const monthOptions = useMemo(
    () => ["all", ...Array.from(new Set(baseGames.map((game) => getMonthKey(game.date))))],
    [baseGames],
  );

  const teamOptions = useMemo(
    () => ["all", ...Array.from(new Set(baseGames.flatMap((game) => options.getTeams(game))))],
    [baseGames, options],
  );

  // 先套用月份與隊伍篩選，再進入分頁。
  const activeGames = useMemo(
    () =>
      baseGames.filter((game) => {
        const matchesMonth = selectedMonth === "all" || getMonthKey(game.date) === selectedMonth;
        const matchesTeam =
          selectedTeam === "all" || options.getTeams(game).includes(selectedTeam);
        return matchesMonth && matchesTeam;
      }),
    [baseGames, options, selectedMonth, selectedTeam],
  );

  // 切換 tab 或篩選條件時，頁碼回到第一頁。
  useEffect(() => {
    setCurrentPage(1);
  }, [scheduleView, selectedMonth, selectedTeam]);

  // 如果目前選到的月份不在新選項裡，就重設成全部月份。
  useEffect(() => {
    if (selectedMonth !== "all" && !monthOptions.includes(selectedMonth)) {
      setSelectedMonth("all");
    }
  }, [monthOptions, selectedMonth]);

  // 如果目前選到的隊伍不在新選項裡，就重設成全部隊伍。
  useEffect(() => {
    if (selectedTeam !== "all" && !teamOptions.includes(selectedTeam)) {
      setSelectedTeam("all");
    }
  }, [selectedTeam, teamOptions]);

  // 把篩選後的資料切成固定頁數，供賽程卡片顯示。
  const totalPages = Math.max(1, Math.ceil(activeGames.length / gamesPerPage));
  const pagedGames = activeGames.slice(
    (currentPage - 1) * gamesPerPage,
    currentPage * gamesPerPage,
  );

  return {
    scheduleView,
    setScheduleView,
    currentPage,
    setCurrentPage,
    totalPages,
    pagedGames,
    activeGames,
    selectedMonth,
    setSelectedMonth,
    selectedTeam,
    setSelectedTeam,
    monthOptions,
    teamOptions,
  };
}
