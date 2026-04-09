"use client";

import { useRef } from "react";
import AnimationStage from "../animation/AnimationStage";
import PlgSceneContainer from "../animation/PlgSceneContainer";
import BclScheduleSection from "../schedule/BclScheduleSection";
import PlgScheduleSection from "../schedule/PlgScheduleSection";
import TpblScheduleSection from "../schedule/TpblScheduleSection";
import ScrollHeader from "../navigation/ScrollHeader";
import VisitorCounter from "../metrics/VisitorCounter";
import { useBasketballAnimation } from "../../hooks/animation/useBasketballAnimation";
import { useLeagueData } from "../../hooks/data/useLeagueData";
import { useLeagueSchedules } from "../../hooks/schedule/useLeagueSchedules";
import { useTodayKey } from "../../hooks/schedule/useTodayKey";

export default function HomePageExperience() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const contentSectionRef = useRef<HTMLDivElement | null>(null);
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
    isTpblSectionActive,
  } = useBasketballAnimation({
    refs: {
      sectionRef,
      stageRef,
      contentSectionRef,
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
  const isBclSectionActive = activeNav === "bcl";

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
        className={`relative overflow-hidden transition-colors duration-500 ${
          isBclSectionActive
            ? "bg-[#5c4d1d]"
            : isPlgBackgroundComplete
              ? "bg-[#8F724E]"
              : "bg-zinc-200"
        }`}
      >
        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
            isTpblSectionActive || isBclSectionActive
              ? "opacity-100"
              : "opacity-0"
          }`}
          style={{
            background: isBclSectionActive
              ? "linear-gradient(180deg, #7a6627 0%, #7a6627 52%, #5c4d1d 52%, #5c4d1d 100%)"
              : "linear-gradient(180deg, #002B48 0%, #002B48 52%, #003C64 52%, #003C64 100%)",
          }}
        />

        <div className="relative z-10">
          <PlgSceneContainer
            contentSectionRef={contentSectionRef}
            backgroundReveal={backgroundReveal}
            isTpblSectionActive={isTpblSectionActive}
            isPastAnimation={isPastAnimation}
          >
            <PlgScheduleSection
              isBclSectionActive={isBclSectionActive}
              isTpblSectionActive={isTpblSectionActive}
              schedule={plgSchedule}
              todayKey={todayKey}
            />
          </PlgSceneContainer>

          <TpblScheduleSection
            isTpblSectionActive={isTpblSectionActive}
            isBclSectionActive={isBclSectionActive}
            tpblSectionRef={tpblSectionRef}
            schedule={tpblSchedule}
            todayKey={todayKey}
          />

          <BclScheduleSection
            isBclSectionActive={isBclSectionActive}
            bclSectionRef={bclSectionRef}
            schedule={bclSchedule}
            todayKey={todayKey}
          />
        </div>
      </div>
    </div>
  );
}
