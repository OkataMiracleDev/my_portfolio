import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PlaygroundDraggableSticker from "../PlaygroundDraggableSticker";

describe("PlaygroundDraggableSticker", () => {
  it("renders as a labeled, focusable element", () => {
    render(<PlaygroundDraggableSticker />);
    const sticker = screen.getByRole("button", { name: /draggable sticker/i });
    expect(sticker).toBeInTheDocument();
    expect(sticker).toHaveAttribute("tabIndex", "0");
  });
});
