/**
 * What the admin is allowed to upload, and where it lands in Blob storage.
 *
 * Isomorphic on purpose: the client helper (lib/blob-client.ts) reads this to
 * reject a file before a byte leaves the browser, and the token route
 * (app/api/admin/blob-upload/route.ts) reads the same table to decide what it
 * will actually hand out a token for. One table, so the two can't drift.
 *
 * Uploads go browser -> Blob directly rather than through a route handler.
 * Vercel caps a serverless function's *request body* at 4.5MB, and that cap is
 * enforced by the platform edge before our code runs: a 12MB thumbnail posted
 * to a route handler came back as the plaintext string "Request Entity Too
 * Large", which the widget then tried to JSON.parse. Client uploads only send
 * a small JSON handshake through the function, so the file size stops
 * mattering to us.
 */

export type UploadKind = "image" | "download" | "plugin-file";

export interface UploadRules {
  /** Blob pathname prefix; also how the server infers the kind. */
  prefix: string;
  contentTypes: readonly string[];
  maxBytes: number;
  /** For the <input accept=""> attribute. */
  accept: string;
}

export const UPLOAD_KINDS: Record<UploadKind, UploadRules> = {
  image: {
    prefix: "images",
    contentTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
    maxBytes: 25 * 1024 * 1024,
    accept: "image/jpeg,image/png,image/webp,image/avif",
  },
  download: {
    prefix: "downloads",
    contentTypes: ["application/pdf", "application/zip", "application/x-zip-compressed"],
    maxBytes: 100 * 1024 * 1024,
    accept: "application/pdf,application/zip,.pdf,.zip",
  },
  "plugin-file": {
    prefix: "plugin-files",
    contentTypes: ["application/zip", "application/x-zip-compressed"],
    maxBytes: 200 * 1024 * 1024,
    accept: ".zip,application/zip,application/x-zip-compressed",
  },
};

/** Reverse lookup used by the token route to turn a pathname into its rules. */
export function kindForPathname(pathname: string): UploadKind | null {
  const prefix = pathname.split("/")[0];
  const entry = (Object.entries(UPLOAD_KINDS) as [UploadKind, UploadRules][]).find(
    ([, rules]) => rules.prefix === prefix
  );
  return entry ? entry[0] : null;
}

/** Strips anything that would make a Blob pathname awkward or ambiguous. */
export function safeFileName(name: string): string {
  return name.replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "") || "file";
}

/**
 * Browsers leave `file.type` empty often enough (a .zip dragged from some
 * archivers, most notably) that refusing those outright would reject good
 * files. Fall back to the extension when there's nothing to go on.
 */
const EXTENSION_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  pdf: "application/pdf",
  zip: "application/zip",
};

export function resolveContentType(file: { name: string; type: string }): string {
  if (file.type) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXTENSION_TYPES[ext] ?? "";
}

export function formatBytes(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(mb >= 10 ? 0 : 1)}MB` : `${Math.round(bytes / 1024)}KB`;
}

type SignatureCheck = (b: Uint8Array) => boolean;

/**
 * Magic-byte checks, kept from the old server-side upload path.
 *
 * These are now a *usability* check rather than a security boundary -- with a
 * direct-to-Blob upload the file's bytes never touch our server, so the real
 * guard is the session gate plus the content-type and size limits the token
 * route enforces. What this still catches is the honest mistake: a .mov
 * renamed to .jpg, which would otherwise upload happily and render as a
 * broken image on the live site.
 */
const SIGNATURES: Record<string, SignatureCheck> = {
  "image/jpeg": (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  "image/png": (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  "image/webp": (b) =>
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
  "image/avif": (b) => String.fromCharCode(...b.slice(4, 12)).includes("ftyp"),
  "application/pdf": (b) => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46,
  "application/zip": (b) => b[0] === 0x50 && b[1] === 0x4b && (b[2] === 0x03 || b[2] === 0x05 || b[2] === 0x07),
  "application/x-zip-compressed": (b) =>
    b[0] === 0x50 && b[1] === 0x4b && (b[2] === 0x03 || b[2] === 0x05 || b[2] === 0x07),
};

export async function matchesSignature(file: File, contentType: string): Promise<boolean> {
  const check = SIGNATURES[contentType];
  if (!check) return false;
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  return check(head);
}
