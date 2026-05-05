"use client";

import { useRef } from "react";
import AnimationStage from "../animation/AnimationStage";
import PlgSceneContainer from "../animation/PlgSceneContainer";
import BclScheduleSection from "@/features/schedule/components/BclScheduleSection";
import PlgScheduleSection from "@/features/schedule/components/PlgScheduleSection";
import TpblScheduleSection from "@/features/schedule/components/TpblScheduleSection";
import ScrollHeader from "../navigation/ScrollHeader";
import VisitorCounter from "../metrics/VisitorCounter";
import type { ScheduleThemeMode } from "@/domain/schedules/leagueScheduleThemes";
import { useBasketballAnimation } from "@/hooks/animation/useBasketballAnimation";
import { useLeagueData } from "@/hooks/data/useLeagueData";
import { useLeagueSchedules } from "@/hooks/schedule/useLeagueSchedules";
import { useTodayKey } from "@/hooks/schedule/useTodayKey";

export default function HomePageExperience() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const plgSectionRef = useRef<HTMLDivElement | null>(null);
  const tpblSectionRef = useRef<HTMLElement | null>(null);
  const bclSectionRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const todayKey = useTodayKey();
  const { plgGames, tpblGames, bclGames } = useLeagueData();

  const {
    isReady,
    isPastAnimation,
    backgroundReveal,
    activeNav,
  } = useBasketballAnimation({
    refs: {
      sectionRef,
      stageRef,
      plgSectionRef,
      tpblSectionRef,
      bclSectionRef,
      canvasRef,
    },
  });

  const { plgSchedule, tpblSchedule, bclSchedule } = useLeagueSchedules({
    plgGames,
    tpblGames,
    bclGames,
    todayKey,
  });

  const isPlgBackgroundComplete = backgroundReveal >= 0.999;
  const themeMode: ScheduleThemeMode = activeNav ?? "plg";
  const scheduleBackground =
    themeMode === "bcl"
      ? "linear-gradient(180deg, #7a6627 0%, #7a6627 52%, #5c4d1d 52%, #5c4d1d 100%)"
      : themeMode === "tpbl"
        ? "linear-gradient(180deg, #002B48 0%, #002B48 52%, #003C64 52%, #003C64 100%)"
        : isPlgBackgroundComplete
          ? "#8F724E"
          : "#e4e4e7";

  return (
    <div ref={sectionRef} className="relative">
      <ScrollHeader isPastAnimation={isPastAnimation} activeNav={activeNav} />
      <VisitorCounter />

      <AnimationStage
        stageRef={stageRef}
        canvasRef={canvasRef}
        isReady={isReady}
      />

      <div
        className="relative overflow-hidden transition-colors duration-500"
        style={{ background: scheduleBackground }}
      >
        <div className="relative z-10">
          <PlgSceneContainer
            plgSectionRef={plgSectionRef}
            backgroundReveal={backgroundReveal}
            themeMode={themeMode}
            isPastAnimation={isPastAnimation}
          >
            <PlgScheduleSection
              themeMode={themeMode}
              schedule={plgSchedule}
              todayKey={todayKey}
            />
          </PlgSceneContainer>

          <TpblScheduleSection
            themeMode={themeMode}
            tpblSectionRef={tpblSectionRef}
            schedule={tpblSchedule}
            todayKey={todayKey}
          />

          <BclScheduleSection
            themeMode={themeMode}
            bclSectionRef={bclSectionRef}
            schedule={bclSchedule}
            todayKey={todayKey}
          />
        </div>
      </div>
    </div>
  );
}
