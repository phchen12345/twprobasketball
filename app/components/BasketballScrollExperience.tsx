"use client";

import { useRef } from "react";
import scheduleData from "../../data/plg_schedule_2025_26.json";
import PlgScheduleSection from "./PlgScheduleSection";
import TpblScheduleSection from "./TpblScheduleSection";
import { ScheduleGame } from "./scheduleTypes";
import ScrollHeader from "./ScrollHeader";
import AnimationStage from "./AnimationStage";
import ScheduleContainer from "./ScheduleContainer";
import { useBasketballAnimation } from "../hooks/useBasketballAnimation";
import { useSchedule } from "../hooks/useSchedule";
import { useTodayKey } from "../hooks/useTodayKey";
import { useTpblGames } from "../hooks/useTpblGames";

export default function BasketballScrollExperience() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const contentSectionRef = useRef<HTMLDivElement | null>(null);
  const thirdSectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const plgGames = scheduleData.games as ScheduleGame[];
  const tpblGames = useTpblGames();
  const todayKey = useTodayKey();

  const { isReady, isPastAnimation, backgroundReveal, activeNav, isThirdSectionActive } =
    useBasketballAnimation({
      sectionRef,
      stageRef,
      contentSectionRef,
      thirdSectionRef,
      canvasRef,
    });

  const plgSchedule = useSchedule(plgGames, todayKey, {
    getTeams: (game) => [game.away_team.name, game.home_team.name],
  });
  const tpblSchedule = useSchedule(tpblGames, todayKey, {
    getTeams: (game) => [game.away_team.name, game.home_team.name],
  });
  const isPlgBackgroundComplete = backgroundReveal >= 0.999;

  return (
    <div ref={sectionRef} className="relative">
      <ScrollHeader isPastAnimation={isPastAnimation} activeNav={activeNav} />

      <AnimationStage stageRef={stageRef} canvasRef={canvasRef} isReady={isReady} />

      <div
        className={`relative overflow-hidden transition-colors duration-500 ${
          isPlgBackgroundComplete ? "bg-[#8F724E]" : "bg-zinc-200"
        }`}
      >
        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
            isThirdSectionActive ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(180deg, #002B48 0%, #002B48 52%, #003C64 52%, #003C64 100%)",
          }}
        />

        <div className="relative z-10">
          <ScheduleContainer
            contentSectionRef={contentSectionRef}
            backgroundReveal={backgroundReveal}
            isThirdSectionActive={isThirdSectionActive}
            isPastAnimation={isPastAnimation}
          >
            <PlgScheduleSection schedule={plgSchedule} todayKey={todayKey} />
          </ScheduleContainer>

          <TpblScheduleSection
            isThirdSectionActive={isThirdSectionActive}
            thirdSectionRef={thirdSectionRef}
            schedule={tpblSchedule}
            todayKey={todayKey}
          />
        </div>
      </div>
    </div>
  );
}
