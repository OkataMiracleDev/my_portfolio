import { put } from "@vercel/blob";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const ALLOWED_DOWNLOAD_TYPES = ["application/pdf", "application/zip"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export type UploadKind = "image" | "download";

type SignatureCheck = (bytes: Uint8Array) => boolean;

const SIGNATURES: Record<string, SignatureCheck> = {
  "image/jpeg": (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  "image/png": (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  "image/webp": (b) =>
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
  "image/avif": (b) => {
    const marker = String.fromCharCode(...b.slice(4, 12));
    return marker.includes("ftyp");
  },
  "application/pdf": (b) => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46,
  "application/zip": (b) => b[0] === 0x50 && b[1] === 0x4b && (b[2] === 0x03 || b[2] === 0x05 || b[2] === 0x07),
};

async function matchesDeclaredType(file: File): Promise<boolean> {
  const check = SIGNATURES[file.type];
  if (!check) return false;
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  return check(head);
}

export async function uploadToBlob(file: File, kind: UploadKind) {
  const allowed = kind === "image" ? ALLOWED_IMAGE_TYPES : ALLOWED_DOWNLOAD_TYPES;

  if (!allowed.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("File is too large (max 10MB).");
  }
  if (!(await matchesDeclaredType(file))) {
    throw new Error("File content does not match its declared type.");
  }

  const blob = await put(`${kind}s/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  return blob.url;
}
