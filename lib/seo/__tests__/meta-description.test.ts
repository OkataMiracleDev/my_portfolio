import { describe, it, expect } from "vitest";
import { metaDescription } from "../meta-description";

describe("metaDescription", () => {
  it("leaves short copy alone", () => {
    expect(metaDescription("A 24 second spec ad.")).toBe("A 24 second spec ad.");
  });

  it("returns undefined for blank input so no empty tag is emitted", () => {
    expect(metaDescription("")).toBeUndefined();
    expect(metaDescription("   ")).toBeUndefined();
    expect(metaDescription(null)).toBeUndefined();
  });

  it("trims long copy at a word boundary, under the limit, with an ellipsis", () => {
    const long = "I designed and animated a 24 second spec ad for Kuda ".repeat(10);
    const out = metaDescription(long)!;
    expect(out.length).toBeLessThanOrEqual(155);
    expect(out.endsWith("…")).toBe(true);
    expect(out.slice(0, -1)).not.toMatch(/\s$/);
    expect(long.startsWith(out.slice(0, -1))).toBe(true);
  });

  it("collapses newlines and runs of whitespace", () => {
    expect(metaDescription("Line one.\n\n  Line   two.")).toBe("Line one. Line two.");
  });

  it("doesn't leave dangling punctuation before the ellipsis", () => {
    const out = metaDescription(`${"word ".repeat(28)}— trailing clause that runs on and on`, 150)!;
    expect(out).not.toMatch(/[—,;:.-]…$/);
  });
});
