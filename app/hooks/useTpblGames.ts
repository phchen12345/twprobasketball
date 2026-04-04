"use client";

import { useEffect, useMemo, useState } from "react";
import tpblScheduleData from "../../data/tpbl_schedule_2025_26_openers.json";
import { TPBL_API_URL } from "../constants/tpbl";
import { TpblApiGame, TpblFallbackGame, TpblGame } from "../components/scheduleTypes";
import { mapFallbackTpblGame, mapTpblApiGame } from "../lib/tpblMapper";

export function useTpblGames() {
  // 先準備本地 fallback，避免 TPBL API 失敗時整個區塊沒有資料。
  const fallbackTpblGames = useMemo(
    () => (tpblScheduleData.games as TpblFallbackGame[]).map(mapFallbackTpblGame),
    [],
  );
  const [tpblGames, setTpblGames] = useState<TpblGame[]>(fallbackTpblGames);

  useEffect(() => {
    let cancelled = false;

    async function loadTpblGames() {
      try {
        // 直接使用專案既有的 TPBL 官方 API。
        const response = await fetch(TPBL_API_URL, { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`TPBL API request failed with ${response.status}`);
        }

        const data = (await response.json()) as TpblApiGame[];
        if (!cancelled) {
          setTpblGames(data.map(mapTpblApiGame));
        }
      } catch {
        // 如果 API 抓不到，就退回專案內建的備援資料。
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
