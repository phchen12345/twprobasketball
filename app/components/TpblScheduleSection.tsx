"use client";

import NextImage from "next/image";
import type { TpblSectionProps } from "./scheduleTypes";
import { formatWeekday } from "./scheduleTypes";

function formatDisplayDate(date: string) {
  return date.slice(5).replace("-", "/");
}

function formatMonthLabel(month: string) {
  return month === "all" ? "全部月份" : month.replace("-", " / ");
}

export default function TpblScheduleSection({
  isThirdSectionActive,
  thirdSectionRef,
  schedule,
  todayKey,
}: TpblSectionProps) {
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

  const activeButtonClass = isThirdSectionActive
    ? "bg-[#0f4c81] text-white"
    : "bg-[#8F724E] text-white";
  const inactiveButtonClass = isThirdSectionActive
    ? "border border-[#8fb3d1] bg-[#eaf2f9] text-[#0f4c81]"
    : "border border-[#c5a57d] bg-[#f5ede3] text-[#8F724E]";

  return (
    <section
      ref={thirdSectionRef}
      id="tpbl-schedule"
      className={`transition-colors duration-200 ${
        isThirdSectionActive ? "bg-[#003C64]" : "bg-[#8F724E]"
      }`}
    >
      <div className="mx-auto max-w-[92rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="rounded-[2rem] border border-white/15 bg-white/10 p-4 backdrop-blur-sm sm:p-6 lg:p-10">
          <div className="flex flex-col gap-4 border-b border-white/20 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
                2025-26 Official Games
              </p>
              <h2 className="mt-3 font-serif text-2xl text-white sm:text-4xl">TPBL 賽程</h2>
              <p className="mt-2 text-xs text-white/60">
                資料來源：TPBL 官方 API 與官方賽程資訊
              </p>
            </div>
            <p className="text-sm text-white/70">共 {activeGames.length} 場</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setScheduleView("upcoming")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                scheduleView === "upcoming" ? activeButtonClass : inactiveButtonClass
              }`}
            >
              即將開賽
            </button>
            <button
              type="button"
              onClick={() => setScheduleView("completed")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                scheduleView === "completed" ? activeButtonClass : inactiveButtonClass
              }`}
            >
              已完成
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                依月份選擇
              </span>
              <select
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
                className="rounded-2xl border border-white/20 bg-white px-4 py-3 text-sm text-[#13233d] outline-none transition focus:border-[#BB986C]"
              >
                {monthOptions.map((month) => (
                  <option key={month} value={month}>
                    {formatMonthLabel(month)}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                依隊伍選擇
              </span>
              <select
                value={selectedTeam}
                onChange={(event) => setSelectedTeam(event.target.value)}
                className="rounded-2xl border border-white/20 bg-white px-4 py-3 text-sm text-[#13233d] outline-none transition focus:border-[#BB986C]"
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

          <div className="mt-6 min-h-[640px] space-y-4">
            {pagedGames.map((game) => (
              <article
                key={game.game_id}
                className="overflow-hidden rounded-[1.5rem] border border-[#d7dce5] bg-white px-4 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:px-6 sm:py-6 lg:px-7"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="inline-flex rounded-full bg-[#0f172a] px-3 py-1 text-xs font-semibold text-white sm:px-4 sm:text-sm">
                    GAME {game.game_id}
                  </span>
                </div>

                <div className="grid gap-5 xl:grid-cols-[150px_minmax(0,1fr)_200px] xl:items-center">
                  <div className="flex items-end justify-between gap-4 border-b border-[#d7dce5] pb-4 xl:block xl:border-b-0 xl:border-r xl:pb-0 xl:pr-6">
                    <div className="flex items-start gap-2">
                      <p className="text-[1.75rem] font-semibold leading-none text-[#13233d] sm:text-[2rem]">
                        {formatDisplayDate(game.date)}
                      </p>
                      <p className="pt-1 text-sm font-semibold text-[#13233d]">
                        {formatWeekday(game.date)}
                      </p>
                    </div>
                    <p className="mt-2 text-[1.75rem] font-medium leading-none text-[#24466d] md:mt-0 sm:text-[2rem]">
                      {game.time}
                    </p>
                  </div>

                  <div className="grid grid-cols-[minmax(0,1fr)_108px_minmax(0,1fr)] items-center gap-3 border-[#d7dce5] sm:gap-4 lg:grid-cols-[minmax(0,1fr)_132px_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_168px_minmax(0,1fr)] xl:border-r xl:px-8">
                    <div className="flex min-w-0 flex-col items-center justify-end gap-2 text-center sm:flex-row sm:gap-4 sm:text-right">
                      <NextImage
                        src={game.away_team.logo}
                        alt={game.away_team.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 object-contain sm:h-14 sm:w-14 lg:h-[4.25rem] lg:w-[4.25rem] xl:h-24 xl:w-24"
                        unoptimized
                      />
                      <div className="min-w-0">
                        <p className="whitespace-nowrap text-xs font-semibold leading-tight text-[#13233d] sm:text-sm lg:text-base xl:text-2xl">
                          {game.away_team.name}
                        </p>
                        <span className="mt-2 inline-flex whitespace-nowrap rounded-full bg-[#F2F2F3] px-2 py-1 text-[10px] font-semibold tracking-[0.08em] text-black sm:mt-3 sm:px-3 sm:text-[11px] sm:tracking-[0.14em]">
                          客隊
                        </span>
                      </div>
                    </div>

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
                          <span className="mt-3 inline-flex rounded-full bg-[#0f4c81] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
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
                        width={48}
                        height={48}
                        className="h-12 w-12 object-contain sm:h-14 sm:w-14 lg:h-[4.25rem] lg:w-[4.25rem] xl:h-24 xl:w-24"
                        unoptimized
                      />
                      <div className="min-w-0">
                        <p className="whitespace-nowrap text-xs font-semibold leading-tight text-[#13233d] sm:text-sm lg:text-base xl:text-2xl">
                          {game.home_team.name}
                        </p>
                        <span className="mt-2 inline-flex whitespace-nowrap rounded-full bg-[#0f4c81] px-2 py-1 text-[10px] font-semibold tracking-[0.08em] text-white sm:mt-3 sm:px-3 sm:text-[11px] sm:tracking-[0.14em]">
                          主隊
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#d7dce5] pt-4 sm:flex sm:justify-end xl:block xl:border-t-0 xl:pt-0 xl:pl-4">
                    <div className="flex min-h-[88px] flex-col justify-center gap-3">
                      {game.replay_url ? (
                        <a
                          href={game.replay_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex w-fit text-sm font-semibold no-underline decoration-black underline-offset-4 transition hover:underline"
                          style={{ color: "black" }}
                        >
                          觀看重播
                        </a>
                      ) : (
                        <span className="h-5" />
                      )}
                      {game.recap_url ? (
                        <a
                          href={game.recap_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex w-fit text-sm font-semibold no-underline decoration-black underline-offset-4 transition hover:underline"
                          style={{ color: "black" }}
                        >
                          賽事回顧
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
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="rounded-full border border-[#d7dce5] bg-white px-4 py-2 text-sm text-[#5d6675] transition disabled:cursor-not-allowed disabled:opacity-40"
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
                    ? "bg-[#13233d] text-white"
                    : "border border-[#d7dce5] bg-white text-[#5d6675]"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full border border-[#d7dce5] bg-white px-4 py-2 text-sm text-[#5d6675] transition disabled:cursor-not-allowed disabled:opacity-40"
            >
              下一頁
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
