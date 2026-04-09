"use client";

import { useBclGames } from "./useBclGames";
import { usePlgGames } from "./usePlgGames";
import { useTpblGames } from "./useTpblGames";

export function useLeagueData() {
  const plgGames = usePlgGames();
  const tpblGames = useTpblGames();
  const bclGames = useBclGames();

  return {
    plgGames,
    tpblGames,
    bclGames,
  };
}
