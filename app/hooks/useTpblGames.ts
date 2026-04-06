"use client";

import { useEffect, useMemo, useState } from "react";
import tpblScheduleData from "../../data/tpbl_schedule_2025_26_openers.json";
import { TpblApiGame, TpblFallbackGame, TpblGame } from "../components/scheduleTypes";
import { mapFallbackTpblGame, mapTpblApiGame } from "../lib/tpblMapper";

const TPBL_GAMES_API_PATH = "/api/tpbl/games";

export function useTpblGames() {
  // Use bundled opener data first, then hydrate with the latest TPBL data when available.
  const fallbackTpblGames = useMemo(
    () => (tpblScheduleData.games as TpblFallbackGame[]).map(mapFallbackTpblGame),
    [],
  );
  const [tpblGames, setTpblGames] = useState<TpblGame[]>(fallbackTpblGames);

  useEffect(() => {
    let cancelled = false;

    async function loadTpblGames() {
      try {
        const response = await fetch(TPBL_GAMES_API_PATH, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`TPBL API request failed with ${response.status}`);
        }

        const data = (await response.json()) as TpblApiGame[];
        if (!cancelled) {
          setTpblGames(data.map(mapTpblApiGame));
        }
      } catch {
        // Keep the bundled opener data when the live API is unavailable.
        if (!cancelled) {
          setTpblGames(fallbackTpblGames);
        }
      }
    }

    void loadTpblGames();

    return () => {
      cancelled = true;
    };
  }, [fallbackTpblGames]);

  return tpblGames;
}
