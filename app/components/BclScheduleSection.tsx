"use client";

import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import type { BclGame, BclSectionProps } from "./scheduleTypes";
import { formatWeekday } from "./scheduleTypes";

function formatDisplayDate(date: string) {
  return date.slice(5).replace("-", "/");
}

function formatMonthLabel(month: string) {
  return month === "all" ? "全部月份" : month.replace("-", " / ");
}

function TeamBadge({
  team,
  variant,
}: {
  team: BclGame["away_team"];
  variant: "away" | "home";
}) {
  return (
    <div
      className={`flex min-w-0 flex-col items-center gap-2 text-center ${
        variant === "away" ? "sm:flex-row sm:gap-4 sm:text-right" : "sm:flex-row sm:gap-4 sm:text-left"
      }`}
    >
      <NextImage
        src={team.logo}
        alt={team.name}
        width={96}
        height={96}
        className="h-12 w-12 object-contain sm:h-14 sm:w-14 lg:h-[4.25rem] lg:w-[4.25rem] xl:h-24 xl:w-24"
        unoptimized
      />
      <div className="min-w-0">
        <p className="whitespace-nowrap text-xs font-semibold leading-tight text-[#13233d] sm:text-sm lg:text-base xl:text-2xl">
          {team.name}
        </p>
        <Badge variant={variant === "away" ? "away" : "home"} className="mt-2 sm:mt-3">
          {variant === "away" ? "客隊" : "主隊"}
        </Badge>
      </div>
    </div>
  );
}

export default function BclScheduleSection({
  isBclSectionActive,
  schedule,
  todayKey,
}: BclSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const {
    scheduleView,
    setScheduleView,
    currentPage,
    setCurrentPage,
    totalPages,
    activeGames,
    pagedGames,
    selectedMonth,
    setSelectedMonth,
    selectedTeam,
    setSelectedTeam,
    monthOptions,
    teamOptions,
  } = schedule;

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
    <section
      ref={sectionRef}
      id="bcl-schedule"
      className={`mx-auto max-w-[92rem] px-4 pt-12 pb-24 transition-all duration-700 ease-out sm:px-6 sm:pt-16 lg:px-8 lg:pt-20 lg:pb-28 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-24 opacity-0"
      }`}
    >
      <Card
        className={`border-white/15 p-4 sm:p-6 lg:p-10 ${
          isBclSectionActive ? "bg-[#5e4f1f]/84" : "bg-[#0b3150]/78"
        }`}
      >
        <CardHeader className="border-b border-white/20 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
              2026 Asia-East Qualifiers
            </p>
            <h2 className="mt-3 font-serif text-2xl text-white sm:text-4xl">BCL 賽程</h2>
            <p className="mt-2 text-xs text-white/60">
              資料來源：BCL Asia-East 官方賽程整理
            </p>
          </div>
          <p className="text-sm text-white/70">共 {activeGames.length} 場</p>
        </CardHeader>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            type="button"
            size="pill"
            variant={scheduleView === "upcoming" ? "accent" : "pill"}
            className={
              scheduleView === "upcoming"
                ? "bg-[#C5A649] shadow-[0_12px_32px_rgba(197,166,73,0.34)] hover:bg-[#b2943f]"
                : isBclSectionActive
                  ? "border-[#ddcf9c] bg-[#f7f1dc] text-[#8a742d] hover:bg-[#f1e7c5]"
                  : "border-[#8fb3d1] bg-[#eaf2f9] text-[#0f4c81] hover:bg-[#dceaf7]"
            }
            onClick={() => setScheduleView("upcoming")}
          >
            即將開賽
          </Button>
          <Button
            type="button"
            size="pill"
            variant={scheduleView === "completed" ? "accent" : "pill"}
            className={
              scheduleView === "completed"
                ? "bg-[#C5A649] shadow-[0_12px_32px_rgba(197,166,73,0.34)] hover:bg-[#b2943f]"
                : isBclSectionActive
                  ? "border-[#ddcf9c] bg-[#f7f1dc] text-[#8a742d] hover:bg-[#f1e7c5]"
                  : "border-[#8fb3d1] bg-[#eaf2f9] text-[#0f4c81] hover:bg-[#dceaf7]"
            }
            onClick={() => setScheduleView("completed")}
          >
            已完成
          </Button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              依月份選擇
            </span>
            <Select
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className={`border-white/20 bg-white text-[#13233d] ${
                isBclSectionActive ? "focus:border-[#C5A649]" : "focus:border-[#0f4c81]"
              }`}
            >
              {monthOptions.map((month) => (
                <option key={month} value={month}>
                  {formatMonthLabel(month)}
                </option>
              ))}
            </Select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              依隊伍選擇
            </span>
            <Select
              value={selectedTeam}
              onChange={(event) => setSelectedTeam(event.target.value)}
              className={`border-white/20 bg-white text-[#13233d] ${
                isBclSectionActive ? "focus:border-[#C5A649]" : "focus:border-[#0f4c81]"
              }`}
            >
              <option value="all">全部隊伍</option>
              {teamOptions
                .filter((team) => team !== "all")
                .map((team) => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
            </Select>
          </label>
        </div>

        <div className="mt-6 min-h-[640px] space-y-4">
          {pagedGames.map((game) => (
            <article
              key={game.game_id}
              className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white px-4 py-5 shadow-[0_12px_36px_rgba(15,23,42,0.08)] sm:px-6 sm:py-6 lg:px-7"
            >
              <div className="grid gap-5 xl:grid-cols-[150px_minmax(0,1fr)_200px] xl:items-center">
                <div className="flex items-end justify-between gap-4 border-b border-[#d7dce5] pb-4 xl:block xl:border-r xl:border-b-0 xl:pb-0 xl:pr-6">
                  <div className="flex items-start gap-2">
                    <p className="text-[1.75rem] font-semibold leading-none text-[#13233d] sm:text-[2rem]">
                      {formatDisplayDate(game.date)}
                    </p>
                    <p className="pt-1 text-sm font-semibold text-[#13233d]">
                      {formatWeekday(game.date)}
                    </p>
                  </div>
                  <p
                    className={`mt-2 text-[1.75rem] font-medium leading-none md:mt-0 sm:text-[2rem] ${
                      isBclSectionActive ? "text-[#C5A649]" : "text-[#24508f]"
                    }`}
                  >
                    {game.time}
                  </p>
                </div>

                <div className="grid grid-cols-[minmax(0,1fr)_108px_minmax(0,1fr)] items-center gap-3 border-[#d7dce5] sm:gap-4 lg:grid-cols-[minmax(0,1fr)_132px_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_168px_minmax(0,1fr)] xl:border-r xl:px-8">
                  <TeamBadge team={game.away_team} variant="away" />

                  <div className="flex flex-col items-center justify-center text-center">
                    {typeof game.away_score === "number" && typeof game.home_score === "number" ? (
                      <>
                        <span className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#7e8797] sm:mb-3 sm:text-sm">
                          VS
                        </span>
                        <div className="flex items-end justify-center gap-4 sm:gap-6">
                          <span className="text-3xl font-semibold leading-none text-[#13233d] sm:text-[2.25rem] xl:text-5xl">
                            {game.away_score}
                          </span>
                          <span className="text-3xl font-semibold leading-none text-[#13233d] sm:text-[2.25rem] xl:text-5xl">
                            {game.home_score}
                          </span>
                        </div>
                        <span className="mt-2 max-w-[11rem] text-xs font-medium leading-snug text-[#5d6675] sm:mt-3 sm:text-sm">
                          {game.venue}
                        </span>
                        <Badge variant="accent" className="mt-3">Final</Badge>
                      </>
                    ) : (
                      <>
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7e8797] sm:text-sm">
                          VS
                        </span>
                        <span className="mt-2 text-xs font-medium text-[#5d6675] sm:mt-3 sm:text-sm">
                          {game.venue}
                        </span>
                        <Badge variant="muted" className="mt-3">
                          {game.date < todayKey ? "Played" : "Upcoming"}
                        </Badge>
                      </>
                    )}
                  </div>

                  <TeamBadge team={game.home_team} variant="home" />
                </div>

                <div className="border-t border-[#d7dce5] pt-4 sm:flex sm:justify-end xl:block xl:border-t-0 xl:pt-0 xl:pl-4">
                  <div className="flex min-h-[88px] flex-col justify-center gap-3">
                    {game.live_url ? (
                      <a
                        href={game.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex"
                      >
                        <Button
                          type="button"
                          size="pill"
                          variant="ivory"
                          className={`pointer-events-none ${
                            isBclSectionActive
                              ? "border-[#ddcf9c] bg-[#f7f1dc] text-[#8a742d] hover:bg-[#f1e7c5]"
                              : "border-[#8fb3d1] bg-[#eaf2f9] text-[#0f4c81] hover:bg-[#dceaf7]"
                          }`}
                        >
                          觀看直播
                        </Button>
                      </a>
                    ) : (
                      <span className="h-5" />
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Button
            type="button"
            size="pill"
            variant="ivory"
            className={
              isBclSectionActive
                ? "border-[#ddcf9c] bg-[#f7f1dc] text-[#8a742d] hover:bg-[#f1e7c5]"
                : "border-[#8fb3d1] bg-[#eaf2f9] text-[#0f4c81] hover:bg-[#dceaf7]"
            }
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            上一頁
          </Button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <Button
              key={page}
              type="button"
              size="pill"
              variant={currentPage === page ? "slate" : "ivory"}
              className={`min-w-10 ${
                currentPage === page
                  ? "bg-[#C5A649] text-white shadow-[0_12px_32px_rgba(197,166,73,0.34)] hover:bg-[#b2943f]"
                  : isBclSectionActive
                    ? "border-[#ddcf9c] bg-[#f7f1dc] text-[#8a742d] hover:bg-[#f1e7c5]"
                    : "border-[#8fb3d1] bg-[#eaf2f9] text-[#0f4c81] hover:bg-[#dceaf7]"
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            type="button"
            size="pill"
            variant="ivory"
            className={
              isBclSectionActive
                ? "border-[#ddcf9c] bg-[#f7f1dc] text-[#8a742d] hover:bg-[#f1e7c5]"
                : "border-[#8fb3d1] bg-[#eaf2f9] text-[#0f4c81] hover:bg-[#dceaf7]"
            }
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
          >
            下一頁
          </Button>
        </div>
      </Card>
    </section>
  );
}
