"use client";

import { useRef } from "react";
import BclScheduleSection from "./BclScheduleSection";
import PlgScheduleSection from "./PlgScheduleSection";
import PlgSceneContainer from "./PlgSceneContainer";
import ScrollHeader from "./ScrollHeader";
import TpblScheduleSection from "./TpblScheduleSection";
import VisitorCounter from "./VisitorCounter";
import AnimationStage from "./AnimationStage";
import { useBasketballAnimation } from "../hooks/useBasketballAnimation";
import { useLeagueData } from "../hooks/useLeagueData";
import { useLeagueSchedules } from "../hooks/useLeagueSchedules";
import { useTodayKey } from "../hooks/useTodayKey";

export default function HomePageExperience() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const contentSectionRef = useRef<HTMLDivElement | null>(null);
  const thirdSectionRef = useRef<HTMLElement | null>(null);
  const bclSectionRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const todayKey = useTodayKey();
  const { plgGames, tpblGames, bclGames } = useLeagueData();

  const {
    isReady,
    isPastAnimation,
    backgroundReveal,
    activeNav,
    isThirdSectionActive,
  } = useBasketballAnimation({
    refs: {
      sectionRef,
      stageRef,
      contentSectionRef,
      thirdSectionRef,
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

      <AnimationStage stageRef={stageRef} canvasRef={canvasRef} isReady={isReady} />

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
            isThirdSectionActive || isBclSectionActive ? "opacity-100" : "opacity-0"
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
            isThirdSectionActive={isThirdSectionActive}
            isPastAnimation={isPastAnimation}
          >
            <PlgScheduleSection
              isBclSectionActive={isBclSectionActive}
              isThirdSectionActive={isThirdSectionActive}
              schedule={plgSchedule}
              todayKey={todayKey}
            />
          </PlgSceneContainer>

          <TpblScheduleSection
            isThirdSectionActive={isThirdSectionActive}
            isBclSectionActive={isBclSectionActive}
            thirdSectionRef={thirdSectionRef}
            schedule={tpblSchedule}
            todayKey={todayKey}
          />

          <div
            ref={bclSectionRef}
            className={
              isBclSectionActive
                ? "bg-[linear-gradient(180deg,#8a742c_0%,#6a5922_45%,#4f4219_100%)]"
                : "bg-[linear-gradient(180deg,#002B48_0%,#002B48_52%,#003C64_52%,#003C64_100%)]"
            }
          >
            <BclScheduleSection
              isBclSectionActive={isBclSectionActive}
              schedule={bclSchedule}
              todayKey={todayKey}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
