import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlaygroundConfettiButton from "../PlaygroundConfettiButton";

describe("PlaygroundConfettiButton", () => {
  it("renders as a real, labeled button", () => {
    render(<PlaygroundConfettiButton />);
    expect(
      screen.getByRole("button", { name: /demo celebration button/i })
    ).toBeInTheDocument();
  });

  it("is clickable without throwing", async () => {
    const user = userEvent.setup();
    render(<PlaygroundConfettiButton />);
    await user.click(screen.getByRole("button", { name: /demo celebration button/i }));
  });
});
