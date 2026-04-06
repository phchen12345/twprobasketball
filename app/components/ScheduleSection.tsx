"use client";

import type { ReactNode, RefObject } from "react";
import NextImage from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import type { GamePresentationMode } from "../domain/schedule";
import type { BaseScheduleGame, ScheduleSectionState } from "./scheduleTypes";
import { formatWeekday } from "./scheduleTypes";

type GamePresentation = {
  mode: GamePresentationMode;
  footerBadge?: ReactNode;
};

type ScheduleSectionTheme = {
  activeTabClassName: string;
  inactiveTabClassName: string;
  paginationClassName: string;
  paginationActiveClassName: string;
  filterLabelClassName: string;
  filterSelectClassName: string;
  homeBadgeClassName?: string;
};

type ScheduleSectionProps<T extends BaseScheduleGame> = {
  id?: string;
  sectionRef?: RefObject<HTMLElement | null>;
  outerClassName?: string;
  containerClassName?: string;
  cardClassName?: string;
  articleClassName?: string;
  useCard?: boolean;
  eyebrow: string;
  title: string;
  description: string;
  headerMetaClassName: string;
  schedule: ScheduleSectionState<T>;
  theme: ScheduleSectionTheme;
  renderTopMeta?: (game: T) => ReactNode;
  renderActions?: (game: T) => ReactNode;
  getPresentation: (game: T) => GamePresentation;
};

function formatDisplayDate(date: string) {
  return date.slice(5).replace("-", "/");
}

function formatMonthLabel(month: string) {
  return month === "all" ? "全部月份" : month.replace("-", " / ");
}

function TeamSide<T extends BaseScheduleGame>({
  game,
  side,
  homeBadgeClassName,
}: {
  game: T;
  side: "away" | "home";
  homeBadgeClassName?: string;
}) {
  const team = side === "away" ? game.away_team : game.home_team;

  return (
    <div
      className={`flex min-w-0 flex-col items-center gap-2 text-center ${
        side === "away" ? "justify-end sm:flex-row sm:gap-4 sm:text-right" : "sm:flex-row sm:gap-4 sm:text-left"
      }`}
    >
      <NextImage
        src={team.logo}
        alt={team.name}
        width={96}
        height={96}
        sizes="(min-width: 1280px) 96px, (min-width: 1024px) 68px, (min-width: 640px) 56px, 48px"
        className="h-12 w-12 object-contain sm:h-14 sm:w-14 lg:h-[4.25rem] lg:w-[4.25rem] xl:h-24 xl:w-24"
      />
      <div className="min-w-0">
        <p className="whitespace-nowrap text-xs font-semibold leading-tight text-[#13233d] sm:text-sm lg:text-base xl:text-2xl">
          {team.name}
        </p>
        <Badge
          variant={side === "away" ? "away" : "home"}
          className={
            side === "home"
              ? `mt-2 border-transparent sm:mt-3 ${homeBadgeClassName ?? ""}`.trim()
              : "mt-2 sm:mt-3"
          }
        >
          {side === "away" ? "客隊" : "主隊"}
        </Badge>
      </div>
    </div>
  );
}

export default function ScheduleSection<T extends BaseScheduleGame>({
  id,
  sectionRef,
  outerClassName,
  containerClassName,
  cardClassName,
  articleClassName = "overflow-hidden rounded-[1.5rem] border border-[#d7dce5] bg-white px-4 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:px-6 sm:py-6 lg:px-7",
  useCard = true,
  eyebrow,
  title,
  description,
  headerMetaClassName,
  schedule,
  theme,
  renderTopMeta,
  renderActions,
  getPresentation,
}: ScheduleSectionProps<T>) {
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

  const body = (
    <>
      <div className="flex flex-col gap-4 border-b border-white/20 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">{eyebrow}</p>
          <h2 className="mt-3 font-serif text-2xl text-white sm:text-4xl">{title}</h2>
          <p className="mt-2 text-xs text-white/60">{description}</p>
        </div>
        <p className={headerMetaClassName}>共 {activeGames.length} 場</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          type="button"
          size="pill"
          variant={scheduleView === "upcoming" ? "accent" : "pill"}
          className={scheduleView === "upcoming" ? theme.activeTabClassName : theme.inactiveTabClassName}
          onClick={() => setScheduleView("upcoming")}
        >
          即將開賽
        </Button>
        <Button
          type="button"
          size="pill"
          variant={scheduleView === "completed" ? "accent" : "pill"}
          className={scheduleView === "completed" ? theme.activeTabClassName : theme.inactiveTabClassName}
          onClick={() => setScheduleView("completed")}
        >
          已完成
        </Button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className={theme.filterLabelClassName}>依月份選擇</span>
          <Select
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            className={theme.filterSelectClassName}
          >
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {formatMonthLabel(month)}
              </option>
            ))}
          </Select>
        </label>

        <label className="flex flex-col gap-2">
          <span className={theme.filterLabelClassName}>依隊伍選擇</span>
          <Select
            value={selectedTeam}
            onChange={(event) => setSelectedTeam(event.target.value)}
            className={theme.filterSelectClassName}
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
        {pagedGames.map((game) => {
          const presentation = getPresentation(game);
          const actions = renderActions?.(game);
          const hasActions = Boolean(actions);

          return (
            <article key={game.game_id} className={articleClassName}>
              {renderTopMeta ? (
                <div className="mb-5 flex items-center justify-between gap-3">{renderTopMeta(game)}</div>
              ) : null}

              <div
                className={`grid gap-5 xl:items-center ${
                  hasActions ? "xl:grid-cols-[150px_minmax(0,1fr)_200px]" : "xl:grid-cols-[150px_minmax(0,1fr)]"
                }`}
              >
                <div className="flex items-end justify-between gap-4 border-b border-[#d7dce5] pb-4 xl:block xl:border-r xl:border-b-0 xl:pb-0 xl:pr-6">
                  <div className="flex items-start gap-2">
                    <p className="text-[1.75rem] font-semibold leading-none text-[#13233d] sm:text-[2rem]">
                      {formatDisplayDate(game.date)}
                    </p>
                    <p className="pt-1 text-sm font-semibold text-[#13233d]">{formatWeekday(game.date)}</p>
                  </div>
                  <p className="mt-2 text-[1.75rem] font-medium leading-none text-[#13233d] md:mt-0 sm:text-[2rem]">
                    {game.time}
                  </p>
                </div>

                <div
                  className={`grid grid-cols-[minmax(0,1fr)_108px_minmax(0,1fr)] items-center gap-3 border-[#d7dce5] sm:gap-4 lg:grid-cols-[minmax(0,1fr)_132px_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_168px_minmax(0,1fr)] ${
                    hasActions ? "xl:border-r xl:px-8" : "xl:px-4"
                  }`}
                >
                  <TeamSide game={game} side="away" homeBadgeClassName={theme.homeBadgeClassName} />

                  <div className="flex flex-col items-center justify-center text-center">
                    <span
                      className={
                        presentation.mode === "live"
                          ? "mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#ef4444] sm:mb-3 sm:text-sm"
                          : "text-xs font-semibold uppercase tracking-[0.18em] text-[#7e8797] sm:text-sm"
                      }
                    >
                      {presentation.mode === "live" ? "LIVE" : "VS"}
                    </span>

                    {presentation.mode !== "scheduled" ? (
                      <div className="flex items-end justify-center gap-4 sm:gap-6">
                        <span className="text-3xl font-semibold leading-none text-[#13233d] sm:text-[2.25rem] lg:text-[2.5rem] xl:text-5xl">
                          {game.away_score ?? "-"}
                        </span>
                        <span className="text-3xl font-semibold leading-none text-[#13233d] sm:text-[2.25rem] lg:text-[2.5rem] xl:text-5xl">
                          {game.home_score ?? "-"}
                        </span>
                      </div>
                    ) : null}

                    <span className="mt-2 max-w-[11rem] text-xs font-medium leading-snug text-[#5d6675] sm:mt-3 sm:text-sm">
                      {game.venue}
                    </span>
                    {presentation.footerBadge}
                  </div>

                  <TeamSide game={game} side="home" homeBadgeClassName={theme.homeBadgeClassName} />
                </div>

                {hasActions ? (
                  <div className="border-t border-[#d7dce5] pt-4 sm:flex sm:justify-end xl:block xl:border-t-0 xl:pt-0 xl:pl-4">
                    <div className="flex min-h-[88px] flex-col justify-center gap-3">{actions}</div>
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button
          type="button"
          size="pill"
          variant="ivory"
          className={theme.paginationClassName}
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
              currentPage === page ? theme.paginationActiveClassName : theme.paginationClassName
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
          className={theme.paginationClassName}
          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          disabled={currentPage === totalPages}
        >
          下一頁
        </Button>
      </div>
    </>
  );

  return (
    <section ref={sectionRef} id={id} className={outerClassName}>
      <div className={containerClassName}>
        {useCard ? <Card className={cardClassName}>{body}</Card> : <div className={cardClassName}>{body}</div>}
      </div>
    </section>
  );
}
