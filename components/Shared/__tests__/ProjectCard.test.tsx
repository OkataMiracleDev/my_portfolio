import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ProjectCard from "../ProjectCard";
import type { ProjectContent } from "@/types/content";

const project: ProjectContent = {
  id: "1",
  slug: "unihub",
  title: "UniHub",
  description: "Discover and create university events.",
  thumbnail: "/images/try-unihub.jpg",
  tags: ["Next.js", "Tailwind"],
  href: "/build/projects/unihub",
};

describe("ProjectCard", () => {
  it("renders the project title and description", () => {
    render(<ProjectCard project={project} accent="build" />);
    expect(screen.getByText("UniHub")).toBeInTheDocument();
    expect(
      screen.getByText("Discover and create university events.")
    ).toBeInTheDocument();
  });

  it("renders a link to the project href", () => {
    render(<ProjectCard project={project} accent="build" />);
    const link = screen.getByRole("link", { name: /UniHub/i });
    expect(link).toHaveAttribute("href", "/build/projects/unihub");
  });

  it("renders the thumbnail with the project title as alt text", () => {
    render(<ProjectCard project={project} accent="build" />);
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("alt", "UniHub");
  });

  it("marks the card with a build data-accent attribute when accent is build", () => {
    render(<ProjectCard project={project} accent="build" />);
    expect(screen.getByTestId("project-card")).toHaveAttribute(
      "data-accent",
      "build"
    );
  });

  it("marks the card with an animate data-accent attribute when accent is animate", () => {
    render(<ProjectCard project={project} accent="animate" />);
    expect(screen.getByTestId("project-card")).toHaveAttribute(
      "data-accent",
      "animate"
    );
  });

  it("renders every tag", () => {
    render(<ProjectCard project={project} accent="build" />);
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("Tailwind")).toBeInTheDocument();
  });
});
