"use client";

import { useMemo } from "react";
import plgScheduleData from "../../data/plg_schedule_2025_26.json";
import type { ScheduleGame } from "../components/scheduleTypes";
import { useBclGames } from "./useBclGames";
import { useTpblGames } from "./useTpblGames";

export function useLeagueData() {
  const plgGames = useMemo(() => plgScheduleData.games as ScheduleGame[], []);
  const tpblGames = useTpblGames();
  const bclGames = useBclGames();

  return useMemo(
    () => ({
      plgGames,
      tpblGames,
      bclGames,
    }),
    [bclGames, plgGames, tpblGames],
  );
}
