import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PlaygroundTiltCard from "../PlaygroundTiltCard";

describe("PlaygroundTiltCard", () => {
  it("renders a labeled tilt card", () => {
    render(<PlaygroundTiltCard />);
    expect(screen.getByLabelText(/demo tilt card/i)).toBeInTheDocument();
  });
});
