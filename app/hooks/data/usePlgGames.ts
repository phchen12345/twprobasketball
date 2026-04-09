"use client";

import { useMemo } from "react";
import plgScheduleData from "../../../data/plg_schedule_2025_26.json";
import type { PlgRawGame, ScheduleGame } from "../../components/schedule/scheduleTypes";
import { mapPlgRawGame } from "../../lib/plgMapper";

export function usePlgGames() {
  return useMemo(
    () => (plgScheduleData.games as PlgRawGame[]).map(mapPlgRawGame) as ScheduleGame[],
    [],
  );
}
