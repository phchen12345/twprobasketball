"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getTpblScheduleTheme } from "../domain/leagueScheduleThemes";
import {
  getScheduledFooterLabel,
  getTpblGamePresentation,
} from "../domain/schedule";
import type { TpblSectionProps } from "./scheduleTypes";
import ScheduleSection from "./ScheduleSection";

export default function TpblScheduleSection({
  isThirdSectionActive,
  isBclSectionActive,
  thirdSectionRef,
  schedule,
  todayKey,
}: TpblSectionProps) {
  const theme = getTpblScheduleTheme(isThirdSectionActive, isBclSectionActive);

  return (
    <ScheduleSection
      id="tpbl-schedule"
      sectionRef={thirdSectionRef}
      outerClassName={`transition-colors duration-200 ${
        isBclSectionActive
          ? "bg-[#4b421d]"
          : isThirdSectionActive
            ? "bg-[#003C64]"
            : "bg-[#8F724E]"
      }`}
      containerClassName="mx-auto max-w-[92rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      cardClassName="border-white/15 bg-white/10 p-4 sm:p-6 lg:p-10"
      schedule={schedule}
      eyebrow="2025-26 Official Games"
      title="TPBL 賽程"
      description="資料來源：TPBL 官方 API 與官方賽程資訊"
      headerMetaClassName="text-sm text-white/70"
      theme={theme}
      renderTopMeta={(game) => (
        <>
          <Badge variant="dark" className="sm:text-sm">
            GAME {game.gameId}
          </Badge>
          <span className="h-7" />
        </>
      )}
      getPresentation={(game) => {
        const mode = getTpblGamePresentation(game);

        return {
          mode,
          footerBadge:
            mode === "final" ? (
              <Badge
                variant="accent"
                className={`mt-3 border-transparent text-white shadow-[0_8px_20px_rgba(15,23,42,0.18)] ${
                  isBclSectionActive
                    ? "bg-[#C5A649]"
                    : isThirdSectionActive
                      ? "bg-[#0f4c81]"
                      : "bg-[#8F724E]"
                }`}
              >
                Final
              </Badge>
            ) : mode === "scheduled" ? (
              <Badge variant="muted" className="mt-3">
                {getScheduledFooterLabel(game.date, todayKey)}
              </Badge>
            ) : undefined,
        };
      }}
      renderActions={(game) => (
        <>
          {game.replayUrl ? (
            <a href={game.replayUrl} target="_blank" rel="noreferrer" className="inline-flex">
              <Button
                type="button"
                size="pill"
                variant="ivory"
                className={`pointer-events-none ${theme.paginationClassName}`}
              >
                觀看重播
              </Button>
            </a>
          ) : (
            <span className="h-5" />
          )}
          {game.recapUrl ? (
            <a href={game.recapUrl} target="_blank" rel="noreferrer" className="inline-flex">
              <Button
                type="button"
                size="pill"
                variant="ivory"
                className={`pointer-events-none ${theme.paginationClassName}`}
              >
                賽事回顧
              </Button>
            </a>
          ) : (
            <span className="h-5" />
          )}
        </>
      )}
    />
  );
}
