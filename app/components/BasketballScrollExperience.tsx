"use client";

import { useRef } from "react";
import scheduleData from "../../data/plg_schedule_2025_26.json";
import bclScheduleData from "../../data/bcl_schedule_2026.json";
import BclScheduleSection from "./BclScheduleSection";
import PlgScheduleSection from "./PlgScheduleSection";
import TpblScheduleSection from "./TpblScheduleSection";
import VisitorCounter from "./VisitorCounter";
import { BclGame, BclRawGame, ScheduleGame } from "./scheduleTypes";
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
  const bclSectionRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const plgGames = scheduleData.games as ScheduleGame[];
  const bclGames = (bclScheduleData.games as BclRawGame[]).map((game) => ({
    ...game,
    away_team: {
      name: game.away_team,
      logo:
        game.away_team === "香港 南華籃球隊"
          ? "/bcl-logos/sca.webp"
          : game.away_team === "蒙古 烏蘭巴托野馬"
            ? "/bcl-logos/bro.webp"
            : game.away_team === "新北國王"
              ? "/tpbl-logos/kings.webp"
              : "https://d36fypkbmmogz6.cloudfront.net/upload/p_team/logo_2_1730454167.png",
    },
    home_team: {
      name: game.home_team,
      logo:
        game.home_team === "香港 南華籃球隊"
          ? "/bcl-logos/sca.webp"
          : game.home_team === "蒙古 烏蘭巴托野馬"
            ? "/bcl-logos/bro.webp"
            : game.home_team === "新北國王"
              ? "/tpbl-logos/kings.webp"
              : "https://d36fypkbmmogz6.cloudfront.net/upload/p_team/logo_2_1730454167.png",
    },
  })) as BclGame[];
  const tpblGames = useTpblGames();
  const todayKey = useTodayKey();

  const {
    isReady,
    isPastAnimation,
    backgroundReveal,
    activeNav,
    isThirdSectionActive,
  } =
    useBasketballAnimation({
      refs: {
        sectionRef,
        stageRef,
        contentSectionRef,
        thirdSectionRef,
        bclSectionRef,
        canvasRef,
      },
    });

  const plgSchedule = useSchedule(plgGames, todayKey, {
    getTeams: (game) => [game.away_team.name, game.home_team.name],
  });
  const tpblSchedule = useSchedule(tpblGames, todayKey, {
    getTeams: (game) => [game.away_team.name, game.home_team.name],
  });
  const bclSchedule = useSchedule(bclGames, todayKey, {
    getTeams: (game) => [game.away_team.name, game.home_team.name],
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
