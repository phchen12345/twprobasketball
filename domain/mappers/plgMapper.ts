import type {
  PlgRawGame,
  ScheduleGame,
} from "@/features/schedule/components/types/scheduleTypes";
import { normalizePlgTeamName } from "../teams/plgTeams";

export function mapPlgRawGame(game: PlgRawGame): ScheduleGame {
  return {
    gameId: game.game_id,
    date: game.date,
    time: game.time,
    venue: game.venue,
    matchup: game.matchup,
    awayScore: game.away_score,
    homeScore: game.home_score,
    awayTeam: {
      name: normalizePlgTeamName(game.away_team.name),
      logo: game.away_team.logo,
    },
    homeTeam: {
      name: normalizePlgTeamName(game.home_team.name),
      logo: game.home_team.logo,
    },
  };
}
