import type { PlgRawGame, ScheduleGame } from "../components/scheduleTypes";

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
      name: game.away_team.name,
      logo: game.away_team.logo,
    },
    homeTeam: {
      name: game.home_team.name,
      logo: game.home_team.logo,
    },
  };
}
