import { mapFallbackTpblGame, mapTpblApiGame } from "@/domain/mappers/tpblMapper";
import { FALLBACK_LOGO } from "@/domain/teams/teamLogos";
import type {
  TpblApiGame,
  TpblFallbackGame,
} from "@/features/schedule/components/types/scheduleTypes";

describe("tpblMapper", () => {
  it("maps API games into schedule games", () => {
    const game: TpblApiGame = {
      code: "tpbl-1",
      game_date: "2026-04-29",
      game_time: "19:30:00",
      venue: "Main Arena",
      status: "FINAL",
      is_live: false,
      meta: {
        live_stream_url: "https://example.com/live",
        recap: "https://example.com/recap",
      },
      away_team: {
        name: "Away Team",
        won_score: 88,
      },
      home_team: {
        name: "Home Team",
        lost_score: 82,
      },
    };

    expect(mapTpblApiGame(game)).toEqual({
      gameId: "tpbl-1",
      date: "2026-04-29",
      time: "19:30",
      venue: "Main Arena",
      matchup: "Away Team vs Home Team",
      status: "FINAL",
      isLive: false,
      awayScore: 88,
      homeScore: 82,
      replayUrl: "https://example.com/live",
      recapUrl: "https://example.com/recap",
      awayTeam: {
        name: "Away Team",
        logo: FALLBACK_LOGO,
      },
      homeTeam: {
        name: "Home Team",
        logo: FALLBACK_LOGO,
      },
    });
  });

  it("maps fallback games with default status", () => {
    const game: TpblFallbackGame = {
      game_id: "fallback-1",
      date: "2026-05-01",
      time: "14:00",
      venue: "Practice Court",
      matchup: "Away Team vs Home Team",
      away_team: "Away Team",
      home_team: "Home Team",
    };

    expect(mapFallbackTpblGame(game)).toMatchObject({
      gameId: "fallback-1",
      status: "NOT_STARTED",
      replayUrl: undefined,
      recapUrl: undefined,
      awayTeam: {
        name: "Away Team",
        logo: FALLBACK_LOGO,
      },
      homeTeam: {
        name: "Home Team",
        logo: FALLBACK_LOGO,
      },
    });
  });
});
