"use client";

import NextImage from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { ScheduleGame, ScheduleSectionState } from "./scheduleTypes";
import { formatWeekday } from "./scheduleTypes";

type Props = {
  schedule: ScheduleSectionState<ScheduleGame>;
  todayKey: string;
};

function formatDisplayDate(date: string) {
  return date.slice(5).replace("-", "/");
}

function formatMonthLabel(month: string) {
  return month === "all" ? "全部月份" : month.replace("-", " / ");
}

export default function PlgScheduleSection({ schedule, todayKey }: Props) {
  // 這個 section 需要的列表、分頁與篩選狀態，都由 schedule hook 提供。
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

  return (
    <section className="w-full shrink-0 rounded-[2rem] border border-white/10 bg-[#050505] p-4 text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)] sm:p-6 lg:p-10">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/50">
            2025-26 Regular Season
          </p>
          <h2 className="mt-3 font-serif text-2xl text-white sm:text-4xl">P. LEAGUE+ 賽程</h2>
          <p className="mt-2 text-xs text-white/50">
            資料來源：P. LEAGUE+ 官方賽程頁
          </p>
        </div>
        <p className="text-sm text-white/60">共 {activeGames.length} 場</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          type="button"
          size="pill"
          variant={scheduleView === "upcoming" ? "accent" : "pill"}
          className={
            scheduleView === "upcoming"
              ? "bg-[#BB986C] shadow-[0_12px_32px_rgba(187,152,108,0.34)] hover:bg-[#a9885d]"
              : "border-[#5e513f] bg-[#181818] text-[#d9c4a6] hover:bg-[#211d18]"
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
              ? "bg-[#BB986C] shadow-[0_12px_32px_rgba(187,152,108,0.34)] hover:bg-[#a9885d]"
              : "border-[#5e513f] bg-[#181818] text-[#d9c4a6] hover:bg-[#211d18]"
          }
          onClick={() => setScheduleView("completed")}
        >
          已完成
        </Button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            依月份選擇
          </span>
          <Select
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            className="border-white/10 bg-[#16181f] text-white focus:border-[#BB986C]"
          >
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {formatMonthLabel(month)}
              </option>
            ))}
          </Select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            依隊伍選擇
          </span>
          <Select
            value={selectedTeam}
            onChange={(event) => setSelectedTeam(event.target.value)}
            className="border-white/10 bg-[#16181f] text-white focus:border-[#BB986C]"
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

      {/* 固定列表高度，避免切頁時整個區塊高度忽大忽小。 */}
      <div className="mt-6 min-h-[640px] space-y-4">
        {pagedGames.map((game) => (
          <article
            key={game.game_id}
            className="overflow-hidden rounded-[1.5rem] border border-[#d7dce5] bg-white px-4 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:px-6 sm:py-6 lg:px-7"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <Badge variant="dark" className="sm:text-sm">
                GAME {game.game_id.replace(/^G/i, "")}
              </Badge>
            </div>

            {/* 每張卡片分成日期時間欄，以及較寬的對戰資訊欄。 */}
            <div className="grid gap-5 xl:grid-cols-[150px_minmax(0,1fr)] xl:items-center">
              <div className="border-b border-[#d7dce5] pb-4 flex items-end justify-between gap-4 xl:block xl:border-b-0 xl:border-r xl:pb-0 xl:pr-6">
                <div className="flex items-start gap-2">
                  <p className="text-[1.75rem] font-semibold leading-none text-[#13233d] sm:text-[2rem]">
                    {formatDisplayDate(game.date)}
                  </p>
                  <p className="pt-1 text-sm font-semibold text-[#13233d]">{formatWeekday(game.date)}</p>
                </div>
                <p className="mt-2 text-[1.75rem] font-medium leading-none text-[#24466d] md:mt-0 sm:text-[2rem]">
                  {game.time}
                </p>
              </div>

              {/* 把中間比分欄加寬，避免分數、Logo、隊名擠在一起。 */}
              <div className="grid grid-cols-[minmax(0,1fr)_108px_minmax(0,1fr)] items-center gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_132px_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_168px_minmax(0,1fr)] xl:px-4">
                <div className="flex min-w-0 flex-col items-center justify-end gap-2 text-center sm:flex-row sm:gap-4 sm:text-right">
                  <NextImage
                    src={game.away_team.logo}
                    alt={game.away_team.name}
                    width={96}
                    height={96}
                    className="h-12 w-12 object-contain sm:h-14 sm:w-14 lg:h-[4.25rem] lg:w-[4.25rem] xl:h-24 xl:w-24"
                  />
                  <div className="min-w-0">
                    <p className="whitespace-nowrap text-xs font-semibold leading-tight text-[#13233d] sm:text-sm lg:text-base xl:text-2xl">
                      {game.away_team.name}
                    </p>
                    <Badge variant="away" className="mt-2 sm:mt-3">客隊</Badge>
                  </div>
                </div>

                {/* 中間區塊負責顯示最終比分，或尚未開打時的狀態標籤。 */}
                <div className="flex flex-col items-center justify-center text-center">
                  {typeof game.away_score === "number" && typeof game.home_score === "number" ? (
                    <>
                      <span className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#7e8797] sm:mb-3 sm:text-sm">
                        VS
                      </span>
                      <div className="flex items-end justify-center gap-4 sm:gap-6">
                        <span className="text-3xl font-semibold leading-none text-[#13233d] sm:text-[2.25rem] lg:text-[2.5rem] xl:text-5xl">
                          {game.away_score}
                        </span>
                        <span className="text-3xl font-semibold leading-none text-[#13233d] sm:text-[2.25rem] lg:text-[2.5rem] xl:text-5xl">
                          {game.home_score}
                        </span>
                      </div>
                      <span className="mt-2 max-w-[11rem] text-xs font-medium leading-snug text-[#5d6675] sm:mt-3 sm:text-sm">
                        {game.venue}
                      </span>
                      <Badge
                        variant="accent"
                        className="mt-3 border-transparent bg-[#BB986C] text-white shadow-[0_8px_20px_rgba(187,152,108,0.28)]"
                      >
                        Final
                      </Badge>
                    </>
                  ) : (
                    <>
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7e8797] sm:text-sm">
                        VS
                      </span>
                      <span className="mt-2 text-xs font-medium text-[#5d6675] sm:mt-3 sm:text-sm">
                        {game.venue}
                      </span>
                      <Badge variant="muted" className="mt-3">{game.date < todayKey ? "Played" : "Upcoming"}</Badge>
                    </>
                  )}
                </div>

                <div className="flex min-w-0 flex-col items-center gap-2 text-center sm:flex-row sm:gap-4 sm:text-left">
                  <NextImage
                    src={game.home_team.logo}
                    alt={game.home_team.name}
                    width={96}
                    height={96}
                    className="h-12 w-12 object-contain sm:h-14 sm:w-14 lg:h-[4.25rem] lg:w-[4.25rem] xl:h-24 xl:w-24"
                  />
                  <div className="min-w-0">
                    <p className="whitespace-nowrap text-xs font-semibold leading-tight text-[#13233d] sm:text-sm lg:text-base xl:text-2xl">
                      {game.home_team.name}
                    </p>
                    <Badge
                      variant="home"
                      className="mt-2 border-transparent bg-[#BB986C] text-white sm:mt-3"
                    >
                      主隊
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 分頁控制放在固定高度列表下方，讓整體滾動結構維持穩定。 */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <Button
          type="button"
          size="pill"
          variant="pill"
          className="border-[#5e513f] bg-[#181818] text-[#d9c4a6] hover:bg-[#211d18]"
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
            variant={currentPage === page ? "accent" : "pill"}
            className={`min-w-10 ${
              currentPage === page
                ? "bg-[#BB986C] shadow-[0_12px_32px_rgba(187,152,108,0.34)] hover:bg-[#a9885d]"
                : "border-[#5e513f] bg-[#181818] text-[#d9c4a6] hover:bg-[#211d18]"
            }`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}
        <Button
          type="button"
          size="pill"
          variant="pill"
          className="border-[#5e513f] bg-[#181818] text-[#d9c4a6] hover:bg-[#211d18]"
          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          disabled={currentPage === totalPages}
        >
          下一頁
        </Button>
      </div>
    </section>
  );
}
