"use client";

import { useEffect, useMemo, useState } from "react";
import { ScheduleView } from "@/features/schedule/components/types/scheduleTypes";
import { getMonthKey, isCompletedGame } from "@/domain/schedules/schedule";

const GAMES_PER_PAGE = 6;

type SchedulableGame = {
  date: string;
  time?: string;
  awayScore?: number;
  homeScore?: number;
  status?: string;
};

export type ScheduleOptions<T> = {
  getTeams: (game: T) => string[];
};

export function useSchedule<T extends SchedulableGame>(
  games: T[],
  todayKey: string,
  options: ScheduleOptions<T>,
) {
  const [scheduleView, setScheduleView] = useState<ScheduleView>("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState("all");

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

  const baseGames =
    scheduleView === "completed" ? completedGames : upcomingGames;

  const monthOptions = useMemo(
    () => [
      "all",
      ...Array.from(new Set(baseGames.map((game) => getMonthKey(game.date)))),
    ],
    [baseGames],
  );

  const teamOptions = useMemo(
    () => [
      "all",
      ...Array.from(
        new Set(baseGames.flatMap((game) => options.getTeams(game))),
      ),
    ],
    [baseGames, options],
  );

  const activeGames = useMemo(
    () =>
      baseGames.filter((game) => {
        const matchesMonth =
          selectedMonth === "all" || getMonthKey(game.date) === selectedMonth;
        const matchesTeam =
          selectedTeam === "all" ||
          options.getTeams(game).includes(selectedTeam);
        return matchesMonth && matchesTeam;
      }),
    [baseGames, options, selectedMonth, selectedTeam],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [scheduleView, selectedMonth, selectedTeam]);

  useEffect(() => {
    if (selectedMonth !== "all" && !monthOptions.includes(selectedMonth)) {
      setSelectedMonth("all");
    }
  }, [monthOptions, selectedMonth]);

  useEffect(() => {
    if (selectedTeam !== "all" && !teamOptions.includes(selectedTeam)) {
      setSelectedTeam("all");
    }
  }, [selectedTeam, teamOptions]);

  const totalPages = Math.max(
    1,
    Math.ceil(activeGames.length / GAMES_PER_PAGE),
  );
  const pagedGames = activeGames.slice(
    (currentPage - 1) * GAMES_PER_PAGE,
    currentPage * GAMES_PER_PAGE,
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
