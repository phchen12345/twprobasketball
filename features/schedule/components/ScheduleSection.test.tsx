import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ScheduleSection from "@/features/schedule/components/ScheduleSection";
import type {
  ScheduleGame,
  ScheduleSectionState,
} from "@/features/schedule/components/types/scheduleTypes";

const games: ScheduleGame[] = [
  {
    gameId: "G1",
    date: "2026-05-01",
    time: "19:30",
    venue: "Main Arena",
    matchup: "Away Team vs Home Team",
    awayTeam: {
      name: "Away Team",
      logo: "/away.webp",
    },
    homeTeam: {
      name: "Home Team",
      logo: "/home.webp",
    },
  },
];

const theme = {
  activeTabClassName: "",
  inactiveTabClassName: "",
  paginationClassName: "",
  paginationActiveClassName: "",
  filterLabelClassName: "",
  filterSelectClassName: "",
};

function createScheduleState(
  overrides: Partial<ScheduleSectionState<ScheduleGame>> = {},
): ScheduleSectionState<ScheduleGame> {
  return {
    scheduleView: "upcoming",
    setScheduleView: jest.fn(),
    currentPage: 1,
    setCurrentPage: jest.fn(),
    totalPages: 1,
    activeGames: games,
    pagedGames: games,
    selectedMonth: "all",
    setSelectedMonth: jest.fn(),
    selectedTeam: "all",
    setSelectedTeam: jest.fn(),
    monthOptions: ["all", "2026-05"],
    teamOptions: ["all", "Away Team", "Home Team"],
    ...overrides,
  };
}

function renderScheduleSection(
  schedule: ScheduleSectionState<ScheduleGame> = createScheduleState(),
) {
  return render(
    <ScheduleSection
      eyebrow="Test Season"
      title="Test League Schedule"
      description="Schedule test data"
      headerMetaClassName=""
      schedule={schedule}
      theme={theme}
      getPresentation={() => ({ mode: "scheduled" })}
    />,
  );
}

describe("ScheduleSection", () => {
  it("renders schedule details for a scheduled game", () => {
    renderScheduleSection();

    expect(
      screen.getByRole("heading", { name: "Test League Schedule" }),
    ).toBeInTheDocument();
    expect(screen.getByText("05/01")).toBeInTheDocument();
    expect(screen.getByText("19:30")).toBeInTheDocument();
    expect(screen.getAllByText("Away Team").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Home Team").length).toBeGreaterThan(0);
    expect(screen.getByText("Main Arena")).toBeInTheDocument();
    expect(screen.getByText("VS")).toBeInTheDocument();
  });

  it("calls tab and filter handlers from user input", async () => {
    const user = userEvent.setup();
    const schedule = createScheduleState();

    renderScheduleSection(schedule);

    await user.click(screen.getAllByRole("button")[1]);
    expect(schedule.setScheduleView).toHaveBeenCalledWith("completed");

    const [monthSelect, teamSelect] = screen.getAllByRole("combobox");
    await user.selectOptions(monthSelect, "2026-05");
    expect(schedule.setSelectedMonth).toHaveBeenCalledWith("2026-05");

    await user.selectOptions(teamSelect, "Away Team");
    expect(schedule.setSelectedTeam).toHaveBeenCalledWith("Away Team");
  });

  it("calls pagination handlers", async () => {
    const user = userEvent.setup();
    const setCurrentPage = jest.fn();
    const schedule = createScheduleState({
      currentPage: 1,
      setCurrentPage,
      totalPages: 2,
    });

    renderScheduleSection(schedule);

    await user.click(screen.getByRole("button", { name: "2" }));
    expect(setCurrentPage).toHaveBeenCalledWith(2);

    await user.click(screen.getAllByRole("button").at(-1)!);
    expect(setCurrentPage).toHaveBeenCalledWith(expect.any(Function));
  });
});
