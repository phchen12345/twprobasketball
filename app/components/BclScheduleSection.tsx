"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBclScheduleTheme } from "../domain/leagueScheduleThemes";
import {
  getBclGamePresentation,
  getScheduledFooterLabel,
} from "../domain/schedule";
import type { BclSectionProps } from "./scheduleTypes";
import ScheduleSection from "./ScheduleSection";

export default function BclScheduleSection({
  isBclSectionActive,
  schedule,
  todayKey,
}: BclSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const theme = getBclScheduleTheme(isBclSectionActive);

  useEffect(() => {
    const node = sectionRef.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <ScheduleSection
      id="bcl-schedule"
      sectionRef={sectionRef}
      outerClassName={`mx-auto max-w-[92rem] px-4 pt-12 pb-24 transition-all duration-700 ease-out sm:px-6 sm:pt-16 lg:px-8 lg:pt-20 lg:pb-28 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
      }`}
      cardClassName={`border-white/15 p-4 sm:p-6 lg:p-10 ${
        isBclSectionActive ? "bg-[#5e4f1f]/84" : "bg-[#0b3150]/78"
      }`}
      articleClassName="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white px-4 py-5 shadow-[0_12px_36px_rgba(15,23,42,0.08)] sm:px-6 sm:py-6 lg:px-7"
      schedule={schedule}
      eyebrow="2026 Asia-East Qualifiers"
      title="BCL 賽程"
      description="資料來源：BCL Asia-East 官方賽程整理"
      headerMetaClassName="text-sm text-white/70"
      theme={theme}
      getPresentation={(game) => {
        const mode = getBclGamePresentation(game);

        return {
          mode,
          footerBadge:
            mode === "final" ? (
              <Badge
                variant="accent"
                className={`mt-3 border-transparent text-white shadow-[0_8px_20px_rgba(15,23,42,0.18)] ${
                  isBclSectionActive ? "bg-[#C5A649]" : "bg-[#24508f]"
                }`}
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
      renderActions={(game) =>
        game.liveUrl ? (
          <a href={game.liveUrl} target="_blank" rel="noreferrer" className="inline-flex">
            <Button
              type="button"
              size="pill"
              variant="ivory"
              className={`pointer-events-none ${theme.paginationClassName}`}
            >
              觀看直播
            </Button>
          </a>
        ) : (
          <span className="h-5" />
        )
      }
    />
  );
}
