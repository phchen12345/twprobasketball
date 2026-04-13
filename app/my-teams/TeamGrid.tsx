"use client";

import { SelectableTeam } from "../lib/teams";
import { TeamCard } from "./TeamCard";

type TeamGridProps = {
  teams: SelectableTeam[];
  isTeamFavorite: (team: SelectableTeam) => boolean;
  isTeamPending: (team: SelectableTeam) => boolean;
  onToggleFavorite: (team: SelectableTeam) => Promise<void>;
};

export function TeamGrid({
  teams,
  isTeamFavorite,
  isTeamPending,
  onToggleFavorite,
}: TeamGridProps) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {teams.map((team) => (
        <TeamCard
          key={`${team.league}:${team.teamId}`}
          team={team}
          isFavorite={isTeamFavorite(team)}
          isPending={isTeamPending(team)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
