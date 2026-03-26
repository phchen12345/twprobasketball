import { FALLBACK_LOGO, TPBL_TEAM_LOGOS } from "../constants/tpbl";
import type { TpblApiGame, TpblFallbackGame, TpblGame } from "../components/scheduleTypes";

function getLocalTpblLogoPath(teamName: string) {
  return TPBL_TEAM_LOGOS[teamName] ?? FALLBACK_LOGO;
}

export function mapTpblApiGame(game: TpblApiGame): TpblGame {
  const isCompleted = game.status === "COMPLETED";

  return {
    game_id: game.code,
    date: game.game_date,
    time: game.game_time.slice(0, 5),
    venue: game.venue,
    matchup: `${game.away_team.name} vs ${game.home_team.name}`,
    status: game.status,
    away_score: isCompleted ? game.away_team.won_score ?? game.away_team.lost_score : undefined,
    home_score: isCompleted ? game.home_team.won_score ?? game.home_team.lost_score : undefined,
    replay_url: game.meta?.live_stream_url,
    recap_url: game.meta?.recap,
    away_team: {
      name: game.away_team.name,
      logo: getLocalTpblLogoPath(game.away_team.name),
    },
    home_team: {
      name: game.home_team.name,
      logo: getLocalTpblLogoPath(game.home_team.name),
    },
  };
}

export function mapFallbackTpblGame(game: TpblFallbackGame): TpblGame {
  return {
    ...game,
    status: "NOT_STARTED",
    replay_url: undefined,
    recap_url: undefined,
    away_team: { name: game.away_team, logo: getLocalTpblLogoPath(game.away_team) },
    home_team: { name: game.home_team, logo: getLocalTpblLogoPath(game.home_team) },
  };
}
