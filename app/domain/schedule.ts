import type { BaseScheduleGame, BclGame, ScheduleGame, TpblGame } from "../components/scheduleTypes";

const COMPLETION_GRACE_MS = 5 * 60 * 60 * 1000;

type SchedulableGame = {
  date: string;
  time?: string;
  away_score?: number;
  home_score?: number;
  status?: string;
};

export type GamePresentationMode = "final" | "live" | "scheduled";

export function getMonthKey(date: string) {
  return date.slice(0, 7);
}

export function getScheduledAt(date: string, time?: string) {
  if (!time) {
    return new Date(`${date}T00:00:00`);
  }

  return new Date(`${date}T${time}:00`);
}

export function isCompletedGame<T extends SchedulableGame>(game: T, todayKey: string) {
  if (game.status === "COMPLETED") {
    return true;
  }

  if (typeof game.status === "string" && game.status.length > 0) {
    return false;
  }

  if (typeof game.away_score === "number" && typeof game.home_score === "number") {
    return true;
  }

  if (game.time) {
    const scheduledAt = getScheduledAt(game.date, game.time);
    return Date.now() - scheduledAt.getTime() >= COMPLETION_GRACE_MS;
  }

  return game.date < todayKey;
}

export function getTeamNames<T extends BaseScheduleGame>(game: T) {
  return [game.away_team.name, game.home_team.name];
}

export function getPlgGamePresentation(game: ScheduleGame): GamePresentationMode {
  return typeof game.away_score === "number" && typeof game.home_score === "number"
    ? "final"
    : "scheduled";
}

export function getTpblGamePresentation(game: TpblGame): GamePresentationMode {
  if (game.is_live === true || game.status === "ACTIVE" || game.status === "IN_PROGRESS") {
    return "live";
  }

  if (typeof game.away_score === "number" && typeof game.home_score === "number") {
    return "final";
  }

  return "scheduled";
}

export function getBclGamePresentation(game: BclGame): GamePresentationMode {
  return typeof game.away_score === "number" && typeof game.home_score === "number"
    ? "final"
    : "scheduled";
}

export function getScheduledFooterLabel(date: string, todayKey: string) {
  return date < todayKey ? "Played" : "Upcoming";
}
