"use client";

import NextImage from "next/image";
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
        </div>
        <p className="text-sm text-white/60">
          {scheduleView === "completed" ? "已完成" : "即將開賽"} · 第 {currentPage} / {totalPages} 頁 · 共{" "}
          {activeGames.length} 場
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setScheduleView("upcoming")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            scheduleView === "upcoming"
              ? "bg-[#BB986C] text-white"
              : "border border-[#5e513f] bg-[#181818] text-[#d9c4a6]"
          }`}
        >
          即將開賽
        </button>
        <button
          type="button"
          onClick={() => setScheduleView("completed")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            scheduleView === "completed"
              ? "bg-[#BB986C] text-white"
              : "border border-[#5e513f] bg-[#181818] text-[#d9c4a6]"
          }`}
        >
          已完成
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            依月份選擇
          </span>
          <select
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            className="rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition focus:border-[#BB986C]"
          >
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {formatMonthLabel(month)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            依隊伍選擇
          </span>
          <select
            value={selectedTeam}
            onChange={(event) => setSelectedTeam(event.target.value)}
            className="rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-sm text-white outline-none transition focus:border-[#BB986C]"
          >
            <option value="all">全部隊伍</option>
            {teamOptions
              .filter((team) => team !== "all")
              .map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
          </select>
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
              <span className="inline-flex rounded-full bg-[#0f172a] px-3 py-1 text-xs font-semibold text-white sm:px-4 sm:text-sm">
                GAME {game.game_id.replace(/^G/i, "")}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a93a3]">
                {scheduleView === "completed" ? "已完成" : "即將開賽"}
              </span>
            </div>

            {/* 每張卡片分成日期時間欄，以及較寬的對戰資訊欄。 */}
            <div className="grid gap-5 md:gap-6 lg:grid-cols-[150px_minmax(0,1fr)] lg:items-center">
              <div className="border-b border-[#d7dce5] pb-4 md:flex md:items-end md:justify-between md:gap-4 md:border-b lg:block lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
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
              <div className="grid grid-cols-[minmax(0,1fr)_124px_minmax(0,1fr)] items-center gap-4 sm:gap-6 md:grid-cols-[minmax(0,1fr)_168px_minmax(0,1fr)] lg:px-4">
                <div className="flex min-w-0 flex-col items-center justify-end gap-2 text-center sm:flex-row sm:gap-4 sm:text-right">
                  <NextImage
                    src={game.away_team.logo}
                    alt={game.away_team.name}
                    width={96}
                    height={96}
                    className="h-12 w-12 object-contain sm:h-20 sm:w-20 lg:h-24 lg:w-24"
                    unoptimized
                  />
                  <div className="min-w-0">
                    <p className="whitespace-nowrap text-sm font-semibold leading-tight text-[#13233d] sm:text-lg lg:text-2xl">
                      {game.away_team.name}
                    </p>
                    <span className="mt-2 inline-flex whitespace-nowrap rounded-full bg-[#f6efe5] px-2 py-1 text-[10px] font-semibold tracking-[0.08em] text-[#8a6d46] sm:mt-3 sm:px-3 sm:text-[11px] sm:tracking-[0.14em]">
                      客隊
                    </span>
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
                        <span className="text-4xl font-semibold leading-none text-[#13233d] sm:text-5xl">
                          {game.away_score}
                        </span>
                        <span className="text-4xl font-semibold leading-none text-[#13233d] sm:text-5xl">
                          {game.home_score}
                        </span>
                      </div>
                      <span className="mt-2 max-w-[11rem] text-xs font-medium leading-snug text-[#5d6675] sm:mt-3 sm:text-sm">
                        {game.venue}
                      </span>
                      <span className="mt-3 inline-flex rounded-full bg-[#BB986C] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                        Final
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7e8797] sm:text-sm">
                        VS
                      </span>
                      <span className="mt-2 text-xs font-medium text-[#5d6675] sm:mt-3 sm:text-sm">
                        {game.venue}
                      </span>
                      <span className="mt-3 inline-flex rounded-full bg-[#eef1f5] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
                        {game.date < todayKey ? "Played" : "Upcoming"}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex min-w-0 flex-col items-center gap-2 text-center sm:flex-row sm:gap-4 sm:text-left">
                  <NextImage
                    src={game.home_team.logo}
                    alt={game.home_team.name}
                    width={96}
                    height={96}
                    className="h-12 w-12 object-contain sm:h-20 sm:w-20 lg:h-24 lg:w-24"
                    unoptimized
                  />
                  <div className="min-w-0">
                    <p className="whitespace-nowrap text-sm font-semibold leading-tight text-[#13233d] sm:text-lg lg:text-2xl">
                      {game.home_team.name}
                    </p>
                    <span className="mt-2 inline-flex whitespace-nowrap rounded-full bg-black px-2 py-1 text-[10px] font-semibold tracking-[0.08em] text-white sm:mt-3 sm:px-3 sm:text-[11px] sm:tracking-[0.14em]">
                      主隊
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 分頁控制放在固定高度列表下方，讓整體滾動結構維持穩定。 */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={currentPage === 1}
          className="rounded-full border border-white/10 bg-[#111111] px-4 py-2 text-sm text-white/70 transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          上一頁
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => setCurrentPage(page)}
            className={`h-10 min-w-10 rounded-full px-3 text-sm font-semibold transition ${
              currentPage === page
                ? "bg-[#BB986C] text-white"
                : "border border-white/10 bg-[#111111] text-white/70"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          disabled={currentPage === totalPages}
          className="rounded-full border border-white/10 bg-[#111111] px-4 py-2 text-sm text-white/70 transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          下一頁
        </button>
      </div>
    </section>
  );
}
