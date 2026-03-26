import type { Dispatch, SetStateAction } from "react";

export type ActiveNav = "plg" | "tpbl" | null;
export type ScheduleView = "completed" | "upcoming";

export type TeamWithLogo = {
  name: string;
  logo: string;
};

export type ScheduleGame = {
  game_id: string;
  date: string;
  time: string;
  venue: string;
  matchup: string;
  away_score?: number;
  home_score?: number;
  away_team: TeamWithLogo;
  home_team: TeamWithLogo;
};

export type TpblGame = {
  game_id: string;
  date: string;
  time: string;
  venue: string;
  matchup: string;
  status: string;
  away_score?: number;
  home_score?: number;
  away_team: TeamWithLogo;
  home_team: TeamWithLogo;
};

export type TpblFallbackGame = {
  game_id: string;
  date: string;
  time: string;
  venue: string;
  matchup: string;
  away_team: string;
  home_team: string;
};

export type TpblApiGame = {
  code: string;
  venue: string;
  status: string;
  game_date: string;
  game_time: string;
  home_team: {
    name: string;
    won_score?: number;
    lost_score?: number;
    meta?: {
      logo?: string;
    } | null;
  };
  away_team: {
    name: string;
    won_score?: number;
    lost_score?: number;
    meta?: {
      logo?: string;
    } | null;
  };
};

export type ScheduleSectionState<T> = {
  scheduleView: ScheduleView;
  setScheduleView: (value: ScheduleView) => void;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
  activeGames: T[];
  pagedGames: T[];
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
  selectedTeam: string;
  setSelectedTeam: (value: string) => void;
  monthOptions: string[];
  teamOptions: string[];
};

export function formatWeekday(dateString: string) {
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const date = new Date(`${dateString}T00:00:00`);
  return `(${weekdays[date.getDay()]})`;
}
