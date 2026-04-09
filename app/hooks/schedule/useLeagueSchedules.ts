"use client";

import type { BclGame, ScheduleGame, TpblGame } from "../../components/schedule/scheduleTypes";
import { getTeamNames } from "../../domain/schedule";
import { useSchedule } from "./useSchedule";

type Params = {
  plgGames: ScheduleGame[];
  tpblGames: TpblGame[];
  bclGames: BclGame[];
  todayKey: string;
};

export function useLeagueSchedules({ plgGames, tpblGames, bclGames, todayKey }: Params) {
  const plgSchedule = useSchedule(plgGames, todayKey, { getTeams: getTeamNames });
  const tpblSchedule = useSchedule(tpblGames, todayKey, { getTeams: getTeamNames });
  const bclSchedule = useSchedule(bclGames, todayKey, { getTeams: getTeamNames });

  return {
    plgSchedule,
    tpblSchedule,
    bclSchedule,
  };
}
