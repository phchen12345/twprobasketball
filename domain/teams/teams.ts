import plgScheduleData from "@/data/plg_schedule_2025_26.json";
import tpblScheduleData from "@/data/tpbl_schedule_2025_26_openers.json";
import { FALLBACK_LOGO, TPBL_TEAM_LOGOS } from "@/constants/tpbl";
import { normalizePlgTeamName } from "./plgTeams";
import { createFallbackTeamId, resolveTeamId } from "./teamIdentity";

type RawTeam = {
  name: string;
  logo?: string;
};

export type SelectableTeam = {
  league: string;
  teamId: string;
  teamName: string;
  teamLogo: string | null;
};

export function createTeamId(teamName: string) {
  return createFallbackTeamId(teamName);
}

function normalizeTeamName(league: string, teamName: string) {
  return league === "PLG" ? normalizePlgTeamName(teamName) : teamName;
}

function addTeam(
  teams: Map<string, SelectableTeam>,
  league: string,
  team: RawTeam,
) {
  const teamName = normalizeTeamName(league, team.name.trim());
  const teamId = resolveTeamId(teamName);
  const key = `${league}:${teamId}`;

  if (!teams.has(key)) {
    teams.set(key, {
      league,
      teamId,
      teamName,
      teamLogo: team.logo || null,
    });
  }
}

export function getSelectableTeams() {
  const teams = new Map<string, SelectableTeam>();

  for (const game of plgScheduleData.games) {
    addTeam(teams, "PLG", game.away_team);
    addTeam(teams, "PLG", game.home_team);
  }

  for (const game of tpblScheduleData.games) {
    const awayLogo = TPBL_TEAM_LOGOS[game.away_team] ?? FALLBACK_LOGO;
    const homeLogo = TPBL_TEAM_LOGOS[game.home_team] ?? FALLBACK_LOGO;

    addTeam(teams, "TPBL", {
      name: game.away_team,
      logo: awayLogo,
    });
    addTeam(teams, "TPBL", {
      name: game.home_team,
      logo: homeLogo,
    });
  }

  return Array.from(teams.values()).sort((a, b) => {
    if (a.league !== b.league) {
      return a.league.localeCompare(b.league);
    }

    return a.teamName.localeCompare(b.teamName, "zh-Hant");
  });
}
