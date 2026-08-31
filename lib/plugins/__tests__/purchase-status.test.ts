import { describe, expect, it } from "vitest";
import { canTransitionToPaid } from "../purchase-status";

describe("canTransitionToPaid", () => {
  it("allows a pending purchase to become paid", () => {
    expect(canTransitionToPaid("pending")).toBe(true);
  });

  it("blocks an already-paid purchase from being processed again", () => {
    expect(canTransitionToPaid("paid")).toBe(false);
  });

  it("blocks a cancelled purchase from becoming paid", () => {
    expect(canTransitionToPaid("cancelled")).toBe(false);
  });
});
