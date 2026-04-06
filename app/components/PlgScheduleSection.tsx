"use client";

import { Badge } from "@/components/ui/badge";
import { plgScheduleTheme } from "../domain/leagueScheduleThemes";
import {
  getPlgGamePresentation,
  getScheduledFooterLabel,
} from "../domain/schedule";
import type { ScheduleGame, ScheduleSectionState } from "./scheduleTypes";
import ScheduleSection from "./ScheduleSection";

type Props = {
  schedule: ScheduleSectionState<ScheduleGame>;
  todayKey: string;
};

export default function PlgScheduleSection({ schedule, todayKey }: Props) {
  return (
    <ScheduleSection
      useCard={false}
      schedule={schedule}
      eyebrow="2025-26 Regular Season"
      title="P. LEAGUE+ 賽程"
      description="資料來源：P. LEAGUE+ 官方賽程整理"
      headerMetaClassName="text-sm text-white/60"
      cardClassName="w-full shrink-0 rounded-[2rem] border border-white/10 bg-[#050505] p-4 text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)] sm:p-6 lg:p-10"
      theme={plgScheduleTheme}
      getPresentation={(game) => {
        const mode = getPlgGamePresentation(game);

        return {
          mode,
          footerBadge:
            mode === "final" ? (
              <Badge
                variant="accent"
                className="mt-3 border-transparent bg-[#BB986C] text-white shadow-[0_8px_20px_rgba(187,152,108,0.28)]"
              >
                Final
              </Badge>
            ) : (
              <Badge variant="muted" className="mt-3">
                {getScheduledFooterLabel(game.date, todayKey)}
              </Badge>
            ),
        };
      }}
      renderTopMeta={(game) => (
        <Badge variant="dark" className="sm:text-sm">
          GAME {game.game_id.replace(/^G/i, "")}
        </Badge>
      )}
    />
  );
}
