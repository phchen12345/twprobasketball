"use client";

import { useMemo } from "react";
import plgScheduleData from "@/data/plg_schedule_2025_26.json";
import type {
  PlgRawGame,
  ScheduleGame,
} from "@/features/schedule/components/types/scheduleTypes";
import { mapPlgRawGame } from "@/domain/mappers/plgMapper";

export function usePlgGames() {
  return useMemo(
    () =>
      (plgScheduleData.games as PlgRawGame[]).map(
        mapPlgRawGame,
      ) as ScheduleGame[],
    [],
  );
}
