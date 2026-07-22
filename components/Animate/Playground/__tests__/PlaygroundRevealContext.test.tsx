import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  PlaygroundRevealProvider,
  usePlaygroundReveal,
} from "../PlaygroundRevealContext";

function Probe() {
  const { revealed, toggle } = usePlaygroundReveal();

  return (
    <button type="button" onClick={toggle}>
      {revealed ? "revealed" : "hidden"}
    </button>
  );
}

describe("PlaygroundRevealContext", () => {
  it("starts hidden and toggles revealed state on demand", async () => {
    const user = userEvent.setup();

    render(
      <PlaygroundRevealProvider>
        <Probe />
      </PlaygroundRevealProvider>
    );

    const button = screen.getByRole("button", { name: "hidden" });
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(screen.getByRole("button", { name: "revealed" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "revealed" }));
    expect(screen.getByRole("button", { name: "hidden" })).toBeInTheDocument();
  });
});
