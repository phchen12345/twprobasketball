"use client";

import { memo } from "react";
import NextImage from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SelectableTeam } from "@/domain/teams/teams";
import { leagueBadgeClassName, selectedTeamClassName } from "../styles/teamStyles";

type TeamCardProps = {
  team: SelectableTeam;
  isFavorite: boolean;
  isPending: boolean;
  onToggleFavorite: (team: SelectableTeam) => Promise<void>;
};

export const TeamCard = memo(function TeamCard({
  team,
  isFavorite,
  isPending,
  onToggleFavorite,
}: TeamCardProps) {
  const buttonLabel = isFavorite ? "已選擇" : "選擇";

  return (
    <Card
      className={cn(
        "flex items-center gap-3 rounded-xl border border-white/10 bg-[#10131a] p-3 text-white transition-colors",
        isFavorite && selectedTeamClassName[team.league],
      )}
    >
      {team.teamLogo ? (
        <NextImage
          src={team.teamLogo}
          alt={team.teamName}
          width={44}
          height={44}
          className="size-11 object-contain"
        />
      ) : null}

      <div className="min-w-0 flex-1">
        <Badge variant="muted" className={leagueBadgeClassName[team.league]}>
          {team.league}
        </Badge>
        <p className="mt-2 truncate text-sm font-semibold">{team.teamName}</p>
      </div>

      <Button
        type="button"
        variant={isFavorite ? "default" : "pill"}
        size="sm"
        className={
          isFavorite
            ? "bg-white text-black hover:bg-white/90"
            : "border-white/15 bg-white/8 text-white hover:bg-white/14"
        }
        disabled={isPending}
        aria-busy={isPending}
        aria-pressed={isFavorite}
        aria-label={`${isFavorite ? "取消選擇" : "選擇"}${team.teamName}`}
        onClick={() => void onToggleFavorite(team)}
      >
        {buttonLabel}
      </Button>
    </Card>
  );
});
