"use client";

import { Badge } from "@/components/ui/badge";
import {
  getPlgPaginationTheme,
  plgScheduleTheme,
} from "@/domain/schedules/leagueScheduleThemes";
import {
  getPlgGamePresentation,
  getScheduledFooterLabel,
} from "@/domain/schedules";
import type { ScheduleGame, ScheduleSectionState } from "./types/scheduleTypes";
import ScheduleSection from "./ScheduleSection";

type Props = {
  isBclSectionActive: boolean;
  isTpblSectionActive: boolean;
  schedule: ScheduleSectionState<ScheduleGame>;
  todayKey: string;
};

export default function PlgScheduleSection({
  isBclSectionActive,
  isTpblSectionActive,
  schedule,
  todayKey,
}: Props) {
  const paginationTheme = getPlgPaginationTheme(
    isTpblSectionActive,
    isBclSectionActive,
  );
  const theme = {
    ...plgScheduleTheme,
    ...paginationTheme,
  };
  const cardClassName =
    isBclSectionActive || isTpblSectionActive
      ? "w-full shrink-0 rounded-[2rem] border border-white/15 bg-white/10 p-4 text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)] sm:p-6 lg:p-10"
      : "w-full shrink-0 rounded-[2rem] border border-white/10 bg-[#050505] p-4 text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)] sm:p-6 lg:p-10";

  return (
    <ScheduleSection
      useCard={false}
      schedule={schedule}
      eyebrow="2025-26 Regular Season"
      title="P. LEAGUE+ 賽程"
      description="資料來源：P. LEAGUE+ 官方賽程整理"
      headerMetaClassName="text-sm text-white/60"
      cardClassName={cardClassName}
      theme={theme}
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
          GAME {game.gameId.replace(/^G/i, "")}
        </Badge>
      )}
    />
  );
}
