"use client";

import { useMemo } from "react";
import bclScheduleData from "@/data/bcl_schedule_2026.json";
import type {
  BclGame,
  BclRawGame,
} from "@/features/schedule/components/types/scheduleTypes";
import { mapBclRawGame } from "@/domain/mappers/bclMapper";

export function useBclGames() {
  return useMemo(() => {
    // console.count("useBclGames map");
    return (bclScheduleData.games as BclRawGame[]).map(
      mapBclRawGame,
    ) as BclGame[];
  }, []);
}
