import { describe, it, expect } from "vitest";
import {
  UPLOAD_KINDS,
  resolveUploadPathname,
  safeFileName,
  resolveContentType,
  type UploadKind,
} from "@/lib/blob-kinds";

/**
 * The pathname check shipped once as a regex built inside a template
 * literal, where `\w` collapsed to the letter `w` and the class became
 * [w.-] -- which rejected every filename that wasn't spelled out of "w",
 * "." and "-". Uploads died with the Blob SDK's generic "Failed to retrieve
 * the client token", which named neither the route nor the reason. These
 * cases pin the round trip a real upload actually makes.
 */
describe("resolveUploadPathname", () => {
  const realUploads: [string, UploadKind][] = [
    ["rigkit thumbnail.jpg", "image"],
    ["rigkit-by-mimi.zip", "plugin-file"],
    ["RigKit-Manual.pdf", "download"],
    ["screenshot (1).png", "image"],
    ["résumé final.pdf", "download"],
  ];

  for (const [filename, kind] of realUploads) {
    it(`accepts ${filename} uploaded as a ${kind}`, () => {
      const pathname = `${UPLOAD_KINDS[kind].prefix}/${safeFileName(filename)}`;
      expect(resolveUploadPathname(pathname)?.kind).toBe(kind);
    });
  }

  it("rejects an unknown prefix", () => {
    expect(resolveUploadPathname("secrets/key.pem")).toBeNull();
  });

  it("rejects a nested path", () => {
    expect(resolveUploadPathname("images/nested/file.jpg")).toBeNull();
  });

  it("rejects traversal and separators in the name", () => {
    expect(resolveUploadPathname("images/../../etc/passwd")).toBeNull();
    expect(resolveUploadPathname("images/a b.jpg")).toBeNull();
  });

  it("accepts every kind's own prefix", () => {
    for (const [kind, rules] of Object.entries(UPLOAD_KINDS)) {
      expect(resolveUploadPathname(`${rules.prefix}/file.bin`)?.kind).toBe(kind);
    }
  });
});

describe("safeFileName", () => {
  it("keeps the extension and collapses unsafe runs", () => {
    expect(safeFileName("rigkit thumbnail.jpg")).toBe("rigkit-thumbnail.jpg");
  });

  it("never returns an empty name", () => {
    expect(safeFileName("@@@")).toBe("file");
  });
});

describe("resolveContentType", () => {
  it("trusts the browser when it supplies a type", () => {
    expect(resolveContentType({ name: "a.zip", type: "application/x-zip-compressed" }))
      .toBe("application/x-zip-compressed");
  });

  it("falls back to the extension when the browser supplies nothing", () => {
    expect(resolveContentType({ name: "a.zip", type: "" })).toBe("application/zip");
    expect(resolveContentType({ name: "a.jpeg", type: "" })).toBe("image/jpeg");
  });

  it("returns empty for an unknown extension so the caller rejects it", () => {
    expect(resolveContentType({ name: "a.exe", type: "" })).toBe("");
  });
});
