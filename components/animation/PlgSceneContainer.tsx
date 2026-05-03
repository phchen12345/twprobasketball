"use client";

import { ReactNode, RefObject } from "react";
import type { ScheduleThemeMode } from "@/domain/schedules/leagueScheduleThemes";

type Props = {
  contentSectionRef: RefObject<HTMLDivElement | null>;
  backgroundReveal: number;
  themeMode: ScheduleThemeMode;
  isPastAnimation: boolean;
  children: ReactNode;
};

export default function PlgSceneContainer({
  contentSectionRef,
  backgroundReveal,
  themeMode,
  isPastAnimation,
  children,
}: Props) {
  const isPlgBackgroundComplete = backgroundReveal >= 0.999;
  const isPlgTheme = themeMode === "plg";
  const plgBackgroundClass = isPlgBackgroundComplete ? "bg-[#BB986C]" : "bg-zinc-200";

  return (
    <div
      ref={contentSectionRef}
      id="plg-schedule"
      className={`relative overflow-hidden ${isPlgTheme ? "bg-black" : "bg-transparent"}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 transition-transform duration-300 ease-out ${
          isPlgTheme ? plgBackgroundClass : "bg-transparent"
        }`}
        style={{ transform: `translateX(${(1 - backgroundReveal) * -100}%)` }}
      />
      <div
        className={`relative mx-auto min-h-[120vh] max-w-[92rem] gap-4 px-4 pt-16 pb-24 sm:min-h-[130vh] sm:px-6 sm:pt-20 lg:px-8 ${
          isPlgTheme && !isPastAnimation ? "bg-black" : "bg-transparent"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
