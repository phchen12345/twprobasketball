import type {
  BclGame,
  BclRawGame,
} from "@/features/schedule/components/types/scheduleTypes";

const BCL_TEAM_LOGOS: Record<string, string> = {
  "香港 南華籃球隊": "/bcl-logos/sca.webp",
  "蒙古 烏蘭巴托野馬": "/bcl-logos/bro.webp",
  新北國王: "/tpbl-logos/kings.webp",
  桃園璞園領航猿:
    "https://d36fypkbmmogz6.cloudfront.net/upload/p_team/logo_2_1730454167.png",
};

const DEFAULT_BCL_LOGO =
  "https://d36fypkbmmogz6.cloudfront.net/upload/p_team/logo_2_1730454167.png";

function getBclTeamLogo(teamName: string) {
  return BCL_TEAM_LOGOS[teamName] ?? DEFAULT_BCL_LOGO;
}

export function mapBclRawGame(game: BclRawGame): BclGame {
  return {
    gameId: game.game_id,
    date: game.date,
    time: game.time,
    venue: game.venue,
    matchup: game.matchup,
    liveUrl: game.live_url,
    awayScore: game.away_score,
    homeScore: game.home_score,
    awayTeam: {
      name: game.away_team,
      logo: getBclTeamLogo(game.away_team),
    },
    homeTeam: {
      name: game.home_team,
      logo: getBclTeamLogo(game.home_team),
    },
  };
}
