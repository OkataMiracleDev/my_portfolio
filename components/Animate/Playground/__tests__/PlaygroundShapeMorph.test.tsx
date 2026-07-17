import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PlaygroundShapeMorph from "../PlaygroundShapeMorph";

describe("PlaygroundShapeMorph", () => {
  it("renders the trigger button and a shape", () => {
    render(<PlaygroundShapeMorph />);
    expect(screen.getByRole("button", { name: /morph shape/i })).toBeInTheDocument();
    expect(screen.getByTestId("morph-shape")).toBeInTheDocument();
  });

  it("changes the shape's data-morphed state when clicked", async () => {
    const user = userEvent.setup();
    render(<PlaygroundShapeMorph />);
    const shape = screen.getByTestId("morph-shape");
    expect(shape).toHaveAttribute("data-morphed", "false");
    await user.click(screen.getByRole("button", { name: /morph shape/i }));
    expect(shape).toHaveAttribute("data-morphed", "true");
  });
});
