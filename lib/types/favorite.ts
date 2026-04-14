export type FavoriteTeam = {
  id: string;
  league: string;
  teamId: string;
  teamName: string;
  teamLogo: string | null;
  createdAt: string;
};

export type FavoriteTeamInput = {
  league: string;
  teamId: string;
  teamName: string;
  teamLogo?: string | null;
};
