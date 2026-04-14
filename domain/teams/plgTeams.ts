const PLG_TEAM_DISPLAY_NAMES: Record<string, string> = {
  勇士: "台北富邦勇士",
  洋基工程: "新竹洋基工程",
  領航猿: "桃園璞園領航猿",
  獵鷹: "台南台鋼獵鷹",
};

export function normalizePlgTeamName(teamName: string) {
  return PLG_TEAM_DISPLAY_NAMES[teamName] ?? teamName;
}
