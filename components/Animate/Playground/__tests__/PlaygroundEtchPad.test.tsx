import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PlaygroundEtchPad from "../PlaygroundEtchPad";

describe("PlaygroundEtchPad", () => {
  it("renders a labeled doodle pad", () => {
    render(<PlaygroundEtchPad />);
    expect(screen.getByLabelText(/doodle pad/i)).toBeInTheDocument();
  });
});
