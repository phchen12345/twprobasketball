"use client";

import { useEffect, useMemo, useState } from "react";
import { ScheduleView } from "../components/scheduleTypes";

const gamesPerPage = 6;

type SchedulableGame = {
  date: string;
};

type Options<T> = {
  getTeams: (game: T) => string[];
};

function getMonthKey(date: string) {
  return date.slice(0, 7);
}

export function useSchedule<T extends SchedulableGame>(
  games: T[],
  todayKey: string,
  options: Options<T>,
) {
  const [scheduleView, setScheduleView] = useState<ScheduleView>("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState("all");

  const completedGames = useMemo(
    () =>
      [...games]
        .filter((game) => game.date < todayKey)
        .sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [games, todayKey],
  );

  const upcomingGames = useMemo(
    () =>
      [...games]
        .filter((game) => game.date >= todayKey)
        .sort((a, b) => +new Date(a.date) - +new Date(b.date)),
    [games, todayKey],
  );

  const baseGames = scheduleView === "completed" ? completedGames : upcomingGames;

  const monthOptions = useMemo(
    () => ["all", ...Array.from(new Set(baseGames.map((game) => getMonthKey(game.date))))],
    [baseGames],
  );

  const teamOptions = useMemo(
    () => ["all", ...Array.from(new Set(baseGames.flatMap((game) => options.getTeams(game))))],
    [baseGames, options],
  );

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
