import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlaygroundToggle from "../PlaygroundToggle";

describe("PlaygroundToggle", () => {
  it("starts unchecked", () => {
    render(<PlaygroundToggle />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("toggles on click", async () => {
    const user = userEvent.setup();
    render(<PlaygroundToggle />);
    const toggle = screen.getByRole("switch");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("toggles on keyboard activation", async () => {
    const user = userEvent.setup();
    render(<PlaygroundToggle />);
    const toggle = screen.getByRole("switch");
    toggle.focus();
    await user.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });
});
