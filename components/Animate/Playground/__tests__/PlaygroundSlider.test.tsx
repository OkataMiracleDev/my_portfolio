import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PlaygroundSlider from "../PlaygroundSlider";

describe("PlaygroundSlider", () => {
  it("starts at the default value and shows it", () => {
    render(<PlaygroundSlider />);
    expect(screen.getByRole("slider")).toHaveValue("50");
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("shows the label attached to a real accessible name", () => {
    render(<PlaygroundSlider />);
    expect(screen.getByRole("slider")).toHaveAccessibleName(/demo slider/i);
  });
});
