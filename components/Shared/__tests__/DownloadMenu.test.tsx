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
});

describe("DownloadMenu", () => {
  it("downloads the newest release and lists every version", () => {
    render(<DownloadMenu releases={[rel("1.1.0", "2026-11-20T00:00:00Z"), rel("1.0.0", "2026-10-31T00:00:00Z")]} accent="build" />);
    const main = screen.getByRole("link", { name: "Download ClipPro 1.1.0 for Windows" });
    expect(main.getAttribute("href")).toBe("https://example.test/ClipPro_1.1.0_x64-setup.exe");

    fireEvent.click(screen.getByRole("button", { name: "Choose a version to download" }));
    const items = screen.getAllByRole("menuitem");
    expect(items.map((i) => i.getAttribute("href"))).toEqual([
      "https://example.test/ClipPro_1.1.0_x64-setup.exe",
      "https://example.test/ClipPro_1.0.0_x64-setup.exe",
      CLIPPRO.releasesUrl,
    ]);
    expect(screen.getByText("Latest")).toBeTruthy();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("still downloads the latest installer before any release is known", () => {
    render(<DownloadMenu releases={[]} accent="animate" />);
    expect(screen.getByRole("link", { name: "Download ClipPro for Windows" }).getAttribute("href")).toBe(CLIPPRO.latestInstallerUrl);
    expect(screen.queryByRole("button", { name: "Choose a version to download" })).toBeNull();
  });
});
