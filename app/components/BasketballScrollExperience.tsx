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
  // 這些 ref 會交給 GSAP / ScrollTrigger，用來控制 hero 與兩個賽程區塊。
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const contentSectionRef = useRef<HTMLDivElement | null>(null);
  const thirdSectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const plgGames = scheduleData.games as ScheduleGame[];
  const tpblGames = useTpblGames();
  const todayKey = useTodayKey();

  // 把所有跟捲動動畫有關的狀態集中在 hook 裡，主元件只負責組裝。
  const { isReady, isPastAnimation, backgroundReveal, activeNav, isThirdSectionActive } =
    useBasketballAnimation({
      sectionRef,
      stageRef,
      contentSectionRef,
      thirdSectionRef,
      canvasRef,
    });

  // PLG 與 TPBL 共用同一套篩選、排序、分頁邏輯。
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
        {/* 這層是第二、三區塊共用的背景，用來做 PLG 到 TPBL 的色彩切換。 */}
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
          {/* PLG 賽程區塊，背景 reveal 進度由前段動畫的 scroll 狀態控制。 */}
          <ScheduleContainer
            contentSectionRef={contentSectionRef}
            backgroundReveal={backgroundReveal}
            isThirdSectionActive={isThirdSectionActive}
            isPastAnimation={isPastAnimation}
          >
            <PlgScheduleSection schedule={plgSchedule} todayKey={todayKey} />
          </ScheduleContainer>

          {/* TPBL 賽程區塊重用相同卡片系統，但資料來源改成 TPBL API。 */}
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
