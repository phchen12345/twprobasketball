import { mapPlgRawGame } from "@/domain/mappers/plgMapper";
import type { PlgRawGame } from "@/features/schedule/components/types/scheduleTypes";

describe("plgMapper", () => {
  it("maps raw PLG games into schedule games", () => {
    const game: PlgRawGame = {
      game_id: "G12",
      date: "2026-05-01",
      time: "19:30",
      venue: "Main Arena",
      matchup: "Away Team vs Home Team",
      away_score: 88,
      home_score: 82,
      away_team: {
        name: "Away Team",
        logo: "/away.webp",
      },
      home_team: {
        name: "Home Team",
        logo: "/home.webp",
      },
    };

    expect(mapPlgRawGame(game)).toEqual({
      gameId: "G12",
      date: "2026-05-01",
      time: "19:30",
      venue: "Main Arena",
      matchup: "Away Team vs Home Team",
      awayScore: 88,
      homeScore: 82,
      awayTeam: {
        name: "Away Team",
        logo: "/away.webp",
      },
      homeTeam: {
        name: "Home Team",
        logo: "/home.webp",
      },
    });
  });

  it("preserves missing scores for scheduled games", () => {
    const game: PlgRawGame = {
      game_id: "G13",
      date: "2026-05-02",
      time: "14:00",
      venue: "Practice Court",
      matchup: "Away Team vs Home Team",
      away_team: {
        name: "Away Team",
        logo: "/away.webp",
      },
      home_team: {
        name: "Home Team",
        logo: "/home.webp",
      },
    };

    expect(mapPlgRawGame(game)).toMatchObject({
      gameId: "G13",
      awayScore: undefined,
      homeScore: undefined,
      awayTeam: {
        name: "Away Team",
        logo: "/away.webp",
      },
      homeTeam: {
        name: "Home Team",
        logo: "/home.webp",
      },
    });
  });
});
