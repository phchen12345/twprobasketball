"use client";

import { useMemo } from "react";
import bclScheduleData from "../../data/bcl_schedule_2026.json";
import type { BclGame, BclRawGame } from "../components/scheduleTypes";
import { mapBclRawGame } from "../lib/bclMapper";

export function useBclGames() {
  return useMemo(
    () => (bclScheduleData.games as BclRawGame[]).map(mapBclRawGame) as BclGame[],
    [],
  );
}
