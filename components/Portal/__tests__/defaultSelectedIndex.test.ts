import { describe, it, expect } from "vitest";
import { defaultSelectedIndex } from "../defaultSelectedIndex";

describe("defaultSelectedIndex", () => {
  it("picks the middle of three packages", () => {
    expect(defaultSelectedIndex(3)).toBe(1);
  });

  it("picks the middle of five", () => {
    expect(defaultSelectedIndex(5)).toBe(2);
  });

  it("never auto-selects the most expensive when there is no true middle", () => {
    // Even counts have no middle; the lower of the two is chosen so the
    // default is never the top tier.
    expect(defaultSelectedIndex(2)).toBe(0);
    expect(defaultSelectedIndex(4)).toBe(1);
  });

  it("handles a single package and an empty card without going negative", () => {
    expect(defaultSelectedIndex(1)).toBe(0);
    expect(defaultSelectedIndex(0)).toBe(0);
  });
});
