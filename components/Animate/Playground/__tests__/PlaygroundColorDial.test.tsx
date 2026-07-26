import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PlaygroundColorDial from "../PlaygroundColorDial";

describe("PlaygroundColorDial", () => {
  it("renders a labeled color dial", () => {
    render(<PlaygroundColorDial />);
    expect(screen.getByLabelText(/demo color dial/i)).toBeInTheDocument();
  });
});
