"use client";

import NextImage from "next/image";
import { ScheduleGame, ScheduleSectionState, formatWeekday } from "./scheduleTypes";

type Props = {
  schedule: ScheduleSectionState<ScheduleGame>;
  todayKey: string;
};

function formatDisplayDate(date: string) {
  return date.slice(5).replace("-", "/");
}

function formatMonthLabel(month: string) {
  return month === "all" ? "All Months" : month.replace("-", " / ");
}

export default function PlgScheduleSection({ schedule, todayKey }: Props) {
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
    <section className="w-full shrink-0 rounded-[2rem] border border-[#d7dce5] bg-[#f7f8fb] p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] sm:p-6 lg:p-10">
      <div className="flex flex-col gap-4 border-b border-[#d7dce5] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7e8797]">
            2025-26 Regular Season
          </p>
          <h2 className="mt-3 font-serif text-2xl text-[#13233d] sm:text-4xl">
            P. LEAGUE+ Schedule
          </h2>
        </div>
        <p className="text-sm text-[#5d6675]">
          {scheduleView === "completed" ? "Completed" : "Upcoming"} · Page {currentPage} /{" "}
          {totalPages} · {activeGames.length} games
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setScheduleView("upcoming")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            scheduleView === "upcoming"
              ? "bg-[#BB986C] text-white"
              : "border border-[#dcc4a1] bg-[#f7f1e8] text-[#8a6d46]"
          }`}
        >
          Upcoming
        </button>
        <button
          type="button"
          onClick={() => setScheduleView("completed")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            scheduleView === "completed"
              ? "bg-[#BB986C] text-white"
              : "border border-[#dcc4a1] bg-[#f7f1e8] text-[#8a6d46]"
          }`}
        >
          Completed
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a93a3]">
            By Month
          </span>
          <select
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            className="rounded-2xl border border-[#d7dce5] bg-white px-4 py-3 text-sm text-[#13233d] outline-none transition focus:border-[#BB986C]"
          >
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {formatMonthLabel(month)}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a93a3]">
            By Team
          </span>
          <select
            value={selectedTeam}
            onChange={(event) => setSelectedTeam(event.target.value)}
            className="rounded-2xl border border-[#d7dce5] bg-white px-4 py-3 text-sm text-[#13233d] outline-none transition focus:border-[#BB986C]"
          >
            <option value="all">All Teams</option>
            {teamOptions.filter((team) => team !== "all").map((team) => (
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
                GAME {game.game_id.replace(/^G/i, "")}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a93a3]">
                {scheduleView === "completed" ? "Completed" : "Upcoming"}
              </span>
            </div>

            <div className="grid gap-5 md:gap-6 lg:grid-cols-[150px_minmax(0,1fr)_160px] lg:items-center">
              <div className="border-b border-[#d7dce5] pb-4 md:flex md:items-end md:justify-between md:gap-4 md:border-b lg:block lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
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

              <div className="grid grid-cols-[minmax(0,1fr)_92px_minmax(0,1fr)] items-center gap-3 border-[#d7dce5] sm:gap-5 md:grid-cols-[minmax(0,1fr)_120px_minmax(0,1fr)] lg:border-r lg:px-6">
                <div className="flex min-w-0 items-center justify-end gap-2 text-right sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-base font-semibold leading-tight text-[#13233d] sm:text-xl lg:text-2xl">
                      {game.away_team.name}
                    </p>
                    <span className="mt-3 inline-flex rounded-full bg-[#f6efe5] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a6d46]">
                      Away
                    </span>
                  </div>
                  <NextImage
                    src={game.away_team.logo}
                    alt={game.away_team.name}
                    width={96}
                    height={96}
                    className="h-12 w-12 object-contain sm:h-20 sm:w-20 lg:h-24 lg:w-24"
                    unoptimized
                  />
                </div>

                <div className="flex flex-col items-center justify-center text-center">
                  {typeof game.away_score === "number" && typeof game.home_score === "number" ? (
                    <>
                      <span className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#7e8797] sm:mb-3 sm:text-sm">
                        VS
                      </span>
                      <div className="flex items-end justify-center gap-3 sm:gap-5">
                        <span className="text-4xl font-light leading-none text-[#9ca3af] sm:text-5xl">
                          {game.away_score}
                        </span>
                        <span className="text-4xl font-semibold leading-none text-[#13233d] sm:text-5xl">
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

                <div className="flex min-w-0 items-center gap-2 sm:gap-4">
                  <NextImage
                    src={game.home_team.logo}
                    alt={game.home_team.name}
                    width={96}
                    height={96}
                    className="h-12 w-12 object-contain sm:h-20 sm:w-20 lg:h-24 lg:w-24"
                    unoptimized
                  />
                  <div className="min-w-0">
                    <p className="text-base font-semibold leading-tight text-[#13233d] sm:text-xl lg:text-2xl">
                      {game.home_team.name}
                    </p>
                    <span className="mt-3 inline-flex rounded-full bg-[#0f4c81] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                      Home
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#d7dce5] pt-4 lg:border-t-0 lg:pt-0 lg:pl-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a93a3]">
                    Venue
                  </p>
                  <p className="mt-2 text-base font-semibold leading-tight text-[#13233d] sm:text-lg">
                    {game.venue}
                  </p>
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
          Prev
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
          Next
        </button>
      </div>
    </section>
  );
}
