import { FALLBACK_LOGO, TPBL_TEAM_LOGOS } from "../constants/tpbl";
import type { TpblApiGame, TpblFallbackGame, TpblGame } from "../components/scheduleTypes";

function getLocalTpblLogoPath(teamName: string) {
  return TPBL_TEAM_LOGOS[teamName] ?? FALLBACK_LOGO;
}

export function mapTpblApiGame(game: TpblApiGame): TpblGame {
  return {
    gameId: game.code,
    date: game.game_date,
    time: game.game_time.slice(0, 5),
    venue: game.venue,
    matchup: `${game.away_team.name} vs ${game.home_team.name}`,
    status: game.status,
    isLive: game.is_live,
    awayScore: game.away_team.won_score ?? game.away_team.lost_score,
    homeScore: game.home_team.won_score ?? game.home_team.lost_score,
    replayUrl: game.meta?.live_stream_url,
    recapUrl: game.meta?.recap,
    awayTeam: {
      name: game.away_team.name,
      logo: getLocalTpblLogoPath(game.away_team.name),
    },
    homeTeam: {
      name: game.home_team.name,
      logo: getLocalTpblLogoPath(game.home_team.name),
    },
  };
}

export function mapFallbackTpblGame(game: TpblFallbackGame): TpblGame {
  return {
    gameId: game.game_id,
    date: game.date,
    time: game.time,
    venue: game.venue,
    matchup: game.matchup,
    status: "NOT_STARTED",
    replayUrl: undefined,
    recapUrl: undefined,
    awayTeam: { name: game.away_team, logo: getLocalTpblLogoPath(game.away_team) },
    homeTeam: { name: game.home_team, logo: getLocalTpblLogoPath(game.home_team) },
  };
}
