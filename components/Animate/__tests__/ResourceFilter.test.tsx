import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResourceFilter from "../ResourceFilter";
import { resourcesData } from "@/data/resources";

describe("ResourceFilter", () => {
  it("shows every resource when 'All' is selected (the default)", () => {
    render(<ResourceFilter resources={resourcesData} />);
    resourcesData.forEach((r) => {
      expect(screen.getByText(r.title)).toBeInTheDocument();
    });
  });

  it("filters down to only downloads when Downloads is selected", async () => {
    const user = userEvent.setup();
    render(<ResourceFilter resources={resourcesData} />);
    await user.click(screen.getByRole("button", { name: /downloads/i }));

    const downloads = resourcesData.filter((r) => r.type === "download");
    const others = resourcesData.filter((r) => r.type !== "download");

    downloads.forEach((r) => expect(screen.getByText(r.title)).toBeInTheDocument());
    others.forEach((r) => expect(screen.queryByText(r.title)).not.toBeInTheDocument());
  });
});
