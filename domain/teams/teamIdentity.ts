import { normalizePlgTeamName } from "./plgTeams";

type TeamIdentity = {
  id: string;
  names: string[];
};

const TEAM_IDENTITIES: TeamIdentity[] = [
  {
    id: "101",
    names: ["台北富邦勇士", "勇士"],
  },
  {
    id: "102",
    names: ["桃園璞園領航猿", "桃園璞園領航猿", "領航猿"],
  },
  {
    id: "103",
    names: ["台南台鋼獵鷹", "獵鷹"],
  },
  {
    id: "104",
    names: ["新竹洋基工程", "洋基工程"],
  },
  {
    id: "201",
    names: ["高雄全家海神"],
  },
  {
    id: "202",
    names: ["新北中信特攻"],
  },
  {
    id: "203",
    names: ["福爾摩沙夢想家"],
  },
  {
    id: "204",
    names: ["新北國王"],
  },
  {
    id: "205",
    names: ["桃園台啤永豐雲豹"],
  },
  {
    id: "206",
    names: ["新竹御嵿攻城獅"],
  },
  {
    id: "207",
    names: ["臺北台新戰神", "台北台新戰神"],
  },
  {
    id: "301",
    names: ["香港 南華籃球隊"],
  },
  {
    id: "302",
    names: ["蒙古 烏蘭巴托野馬"],
  },
];

function normalizeTeamName(teamName: string) {
  return normalizePlgTeamName(teamName).trim();
}

const TEAM_ID_BY_NAME = new Map(
  TEAM_IDENTITIES.flatMap((team) =>
    team.names.map((name) => [normalizeTeamName(name), team.id] as const),
  ),
);

export function createFallbackTeamId(teamName: string) {
  return normalizeTeamName(teamName)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]/gu, "");
}

export function resolveTeamId(teamName: string) {
  const normalizedName = normalizeTeamName(teamName);

  return TEAM_ID_BY_NAME.get(normalizedName) ?? createFallbackTeamId(normalizedName);
}

export function getCanonicalFavoriteTeamId(team: {
  teamId?: string | null;
  teamName: string;
}) {
  return TEAM_ID_BY_NAME.get(normalizeTeamName(team.teamName)) ?? team.teamId ?? "";
}
