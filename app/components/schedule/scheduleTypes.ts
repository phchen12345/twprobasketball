import type { Dispatch, RefObject, SetStateAction } from "react";

export type ActiveNav = "plg" | "tpbl" | "bcl" | null;
export type ScheduleView = "completed" | "upcoming";

export type TeamWithLogo = {
  name: string;
  logo: string;
};

export type BaseScheduleGame = {
  gameId: string;
  date: string;
  time: string;
  venue: string;
  matchup: string;
  awayTeam: TeamWithLogo;
  homeTeam: TeamWithLogo;
  awayScore?: number;
  homeScore?: number;
};

export type ScheduleGame = BaseScheduleGame;

export type PlgRawGame = {
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

export type TpblGame = BaseScheduleGame & {
  status: string;
  isLive?: boolean;
  replayUrl?: string;
  recapUrl?: string;
};

export type BclGame = BaseScheduleGame & {
  liveUrl?: string;
};

export type BclSectionProps = {
  isBclSectionActive: boolean;
  bclSectionRef: RefObject<HTMLDivElement | null>;
  schedule: ScheduleSectionState<BclGame>;
  todayKey: string;
};

export type BclRawGame = {
  game_id: string;
  date: string;
  time: string;
  venue: string;
  matchup: string;
  live_url?: string;
  away_score?: number;
  home_score?: number;
  away_team: string;
  home_team: string;
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
  is_live?: boolean;
  game_date: string;
  game_time: string;
  meta?: {
    recap?: string;
    live_stream_url?: string;
  } | null;
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

export type TpblSectionProps = {
  isTpblSectionActive: boolean;
  isBclSectionActive: boolean;
  tpblSectionRef: RefObject<HTMLElement | null>;
  schedule: ScheduleSectionState<TpblGame>;
  todayKey: string;
};

export function formatWeekday(dateString: string) {
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const date = new Date(`${dateString}T00:00:00`);
  return `(${weekdays[date.getDay()]})`;
}
