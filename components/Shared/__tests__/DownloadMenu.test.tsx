import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DownloadMenu from "../ClipPro/DownloadMenu";
import { CLIPPRO, type ClipProRelease } from "@/lib/clippro";

const rel = (version: string, date: string): ClipProRelease => ({
  version,
  date,
  notes: "",
  url: `https://github.com/${CLIPPRO.repo}/releases/tag/v${version}`,
  installer: { url: `https://example.test/ClipPro_${version}_x64-setup.exe`, size: 80_000_000 },
  portable: null,
  downloads: 0,
});

describe("DownloadMenu", () => {
  it("downloads the newest release and lists every version", () => {
    render(<DownloadMenu releases={[rel("1.1.0", "2026-11-20T00:00:00Z"), rel("1.0.0", "2026-10-31T00:00:00Z")]} accent="build" surface="build" />);
    const main = screen.getByRole("link", { name: "Download ClipPro 1.1.0 for Windows" });
    // Through the counting redirect, which sends the browser on to the newest installer.
    expect(main.getAttribute("href")).toBe("/api/clippro/download?v=latest&from=build");

    fireEvent.click(screen.getByRole("button", { name: "Choose a version to download" }));
    const items = screen.getAllByRole("menuitem");
    expect(items.map((i) => i.getAttribute("href"))).toEqual([
      "/api/clippro/download?v=1.1.0&from=build",
      "/api/clippro/download?v=1.0.0&from=build",
      CLIPPRO.releasesUrl,
    ]);
    expect(screen.getByText("Latest")).toBeTruthy();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("still offers the latest download before any release is known", () => {
    render(<DownloadMenu releases={[]} accent="animate" surface="animate" />);
    expect(screen.getByRole("link", { name: "Download ClipPro for Windows" }).getAttribute("href")).toBe("/api/clippro/download?v=latest&from=animate");
    expect(screen.queryByRole("button", { name: "Choose a version to download" })).toBeNull();
  });
});
