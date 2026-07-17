import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlaygroundMagneticButton from "../PlaygroundMagneticButton";

describe("PlaygroundMagneticButton", () => {
  it("renders as a real, labeled button", () => {
    render(<PlaygroundMagneticButton />);
    expect(
      screen.getByRole("button", { name: /demo magnetic button/i })
    ).toBeInTheDocument();
  });

  it("is clickable without throwing", async () => {
    const user = userEvent.setup();
    render(<PlaygroundMagneticButton />);
    await user.click(screen.getByRole("button", { name: /demo magnetic button/i }));
  });
});
