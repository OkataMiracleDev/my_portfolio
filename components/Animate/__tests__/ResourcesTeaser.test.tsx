import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResourcesTeaser from "../ResourcesTeaser";

describe("ResourcesTeaser", () => {
  it("renders up to 3 latest resources", () => {
    render(<ResourcesTeaser />);
    expect(screen.getByText("Starter LUT Pack")).toBeInTheDocument();
    expect(screen.getByText("Breaking Down a Brand Reel")).toBeInTheDocument();
    expect(screen.getByText("Tools I Use")).toBeInTheDocument();
  });

  it("rejects an invalid email on submit", async () => {
    const user = userEvent.setup();
    render(<ResourcesTeaser />);
    const input = screen.getByLabelText(/email/i);
    await user.type(input, "not-an-email");
    await user.click(screen.getByRole("button", { name: /notify me/i }));
    expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
  });

  it("confirms signup for a valid email without claiming a backend exists", async () => {
    const user = userEvent.setup();
    render(<ResourcesTeaser />);
    const input = screen.getByLabelText(/email/i);
    await user.type(input, "reader@example.com");
    await user.click(screen.getByRole("button", { name: /notify me/i }));
    expect(screen.getByText(/thanks/i)).toBeInTheDocument();
  });
});
