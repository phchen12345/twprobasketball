"use client";

import { useMemo } from "react";
import plgScheduleData from "../../data/plg_schedule_2025_26.json";
import type { PlgRawGame } from "../components/scheduleTypes";
import { mapPlgRawGame } from "../lib/plgMapper";
import { useBclGames } from "./useBclGames";
import { useTpblGames } from "./useTpblGames";

export function useLeagueData() {
  const plgGames = useMemo(
    () => (plgScheduleData.games as PlgRawGame[]).map(mapPlgRawGame),
    [],
  );
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
