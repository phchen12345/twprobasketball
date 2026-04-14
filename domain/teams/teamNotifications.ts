import bclScheduleData from "@/data/bcl_schedule_2026.json";
import plgScheduleData from "@/data/plg_schedule_2025_26.json";
import tpblScheduleData from "@/data/tpbl_schedule_2025_26_openers.json";
import type {
  BaseScheduleGame,
  BclRawGame,
  PlgRawGame,
  TpblGame,
  TpblFallbackGame,
} from "@/features/schedule/components/types/scheduleTypes";
import type { FavoriteTeam } from "@/lib/types/favorite";
import { mapBclRawGame } from "../mappers/bclMapper";
import { mapPlgRawGame } from "../mappers/plgMapper";
import { getCanonicalFavoriteTeamId, resolveTeamId } from "./teamIdentity";
import { mapFallbackTpblGame } from "../mappers/tpblMapper";

export type TeamNotificationGame = {
  gameId: string;
  league: string;
  date: string;
  time: string;
  visibleFrom: string;
  venue: string;
  awayTeamName: string;
  awayTeamLogo: string;
  homeTeamName: string;
  homeTeamLogo: string;
};

type LeagueGame = BaseScheduleGame & {
  league: string;
};

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getScheduledAt(game: Pick<LeagueGame, "date" | "time">) {
  return new Date(`${game.date}T${game.time}:00`);
}

function isWithinNotificationWindow(game: LeagueGame, now: Date) {
  const scheduledAt = getScheduledAt(game);
  const windowEnd = new Date(now);
  windowEnd.setDate(windowEnd.getDate() + 7);

  const expiresAt = new Date(scheduledAt);
  expiresAt.setHours(expiresAt.getHours() + 2);

  return scheduledAt <= windowEnd && expiresAt > now;
}

function getVisibleFrom(game: LeagueGame) {
  const visibleFrom = getScheduledAt(game);
  visibleFrom.setDate(visibleFrom.getDate() - 7);

  return visibleFrom.toISOString();
}

function getFavoriteKeys(favoriteTeams: FavoriteTeam[]) {
  return new Set(favoriteTeams.map(getCanonicalFavoriteTeamId));
}

function getGameTeamKeys(game: LeagueGame) {
  return [resolveTeamId(game.awayTeam.name), resolveTeamId(game.homeTeam.name)];
}

function mapNotificationGame(game: LeagueGame): TeamNotificationGame {
  return {
    gameId: game.gameId,
    league: game.league,
    date: game.date,
    time: game.time,
    visibleFrom: getVisibleFrom(game),
    venue: game.venue,
    awayTeamName: game.awayTeam.name,
    awayTeamLogo: game.awayTeam.logo,
    homeTeamName: game.homeTeam.name,
    homeTeamLogo: game.homeTeam.logo,
  };
}

export function getFavoriteTeamGamesInNotificationWindow(
  favoriteTeams: FavoriteTeam[],
  now = new Date(),
  options: {
    tpblGames?: TpblGame[];
  } = {},
) {
  const favoriteKeys = getFavoriteKeys(favoriteTeams);

  if (favoriteKeys.size === 0) {
    return [];
  }

  const plgGames: LeagueGame[] = (plgScheduleData.games as PlgRawGame[]).map(
    (game) => ({
      ...mapPlgRawGame(game),
      league: "PLG",
    }),
  );

  const tpblGames: LeagueGame[] = options.tpblGames
    ? options.tpblGames.map((game) => ({
        ...game,
        league: "TPBL",
      }))
    : (tpblScheduleData.games as TpblFallbackGame[]).map((game) => ({
        ...mapFallbackTpblGame(game),
        league: "TPBL",
      }));

  const bclGames: LeagueGame[] = (bclScheduleData.games as BclRawGame[]).map(
    (game) => ({
      ...mapBclRawGame(game),
      league: "BCL",
    }),
  );

  return [...plgGames, ...tpblGames, ...bclGames]
    .filter((game) => isWithinNotificationWindow(game, now))
    .filter((game) =>
      getGameTeamKeys(game).some((teamKey) => favoriteKeys.has(teamKey)),
    )
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);

      return dateCompare === 0 ? a.time.localeCompare(b.time) : dateCompare;
    })
    .map(mapNotificationGame);
}
