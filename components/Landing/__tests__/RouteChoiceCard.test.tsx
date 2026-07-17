import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import RouteChoiceCard from "../RouteChoiceCard";
import type { RouteChoice } from "@/data/landing";

const buildChoice: RouteChoice = {
  id: "build",
  title: "Build",
  description: "Frontend development.",
  href: "/build",
  accent: "build",
};

describe("RouteChoiceCard", () => {
  it("renders the title and description", () => {
    render(<RouteChoiceCard choice={buildChoice} />);
    expect(screen.getByText("Build")).toBeInTheDocument();
    expect(screen.getByText("Frontend development.")).toBeInTheDocument();
  });

  it("links to the route's href", () => {
    render(<RouteChoiceCard choice={buildChoice} />);
    expect(screen.getByRole("link", { name: /Build/i })).toHaveAttribute(
      "href",
      "/build"
    );
  });

  it("marks the card with a build data-accent attribute", () => {
    render(<RouteChoiceCard choice={buildChoice} />);
    expect(screen.getByTestId("route-choice-card")).toHaveAttribute(
      "data-accent",
      "build"
    );
  });

  it("marks the card with an animate data-accent attribute for the animate variant", () => {
    const animateChoice: RouteChoice = {
      id: "animate",
      title: "Animate",
      description: "Motion design.",
      href: "/animate",
      accent: "animate",
    };
    render(<RouteChoiceCard choice={animateChoice} />);
    expect(screen.getByTestId("route-choice-card")).toHaveAttribute(
      "data-accent",
      "animate"
    );
  });
});
