import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders button content", () => {
    render(<Button>Open menu</Button>);

    expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
  });

  it("forwards click handlers", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<Button onClick={handleClick}>Save</Button>);
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
