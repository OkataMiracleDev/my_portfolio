import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { computeClipProStats, type Row } from "@/lib/analytics/clippro-stats";

const TODAY = new Date();
const day = TODAY.toISOString().slice(0, 10);
const row = (sessionId: string, type: Row["type"], surface: Row["surface"], extra: Partial<Row> = {}): Row => ({
  id: `${sessionId}-${type}-${Math.random()}`,
  day,
  type,
  surface,
  label: null,
  value: null,
  sessionId,
  visitorHash: `v-${sessionId}`,
  path: null,
  referrer: null,
  utmSource: null,
  utmMedium: null,
  utmCampaign: null,
  country: "NG",
  device: "desktop",
  browser: "Chrome",
  os: "Windows",
  createdAt: TODAY,
  ...extra,
});

vi.mock("@/lib/actions/clippro-analytics", () => ({
  getClipProStats: async (days: number) =>
    computeClipProStats(
      [
        row("A", "impression", "build"),
        row("A", "download", "build", { label: "1.0.0" }),
        row("B", "view", "page"),
        row("B", "scroll", "page", { label: "50" }),
      ],
      [{ version: "1.0.0", date: "2026-11-01T00:00:00Z", notes: "", url: "", installer: null, portable: null, downloads: 42 }],
      days
    ),
}));

describe("Admin → ClipPro", () => {
  it("renders the headline numbers, funnel and tables", async () => {
    const { default: Page } = await import("../page");
    render(await Page({ searchParams: Promise.resolve({ days: "7" }) }));
    expect(screen.getByRole("heading", { name: "ClipPro" })).toBeTruthy();
    expect(screen.getByText("Downloads (site)").previousSibling?.textContent).toBe("1");
    expect(screen.getByText("Downloads (GitHub, all time)").previousSibling?.textContent).toBe("42");
    expect(screen.getByText("Conversion").previousSibling?.textContent).toBe("50%");
    expect(screen.getByText("/build spotlight")).toBeTruthy();
    expect(screen.getAllByText("v1.0.0").length).toBe(2); // versions table and the recent download
    expect(screen.getByText("Reached 50%")).toBeTruthy();
    expect(screen.queryByText(/analytics table isn/)).toBeNull();
  });
});
