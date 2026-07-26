import { put } from "@vercel/blob";

// Basic validation now; Task 14 tightens this (magic-byte sniffing, a
// stricter size ceiling per content type) as part of the security pass.
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const ALLOWED_DOWNLOAD_TYPES = ["application/pdf", "application/zip"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export type UploadKind = "image" | "download";

export async function uploadToBlob(file: File, kind: UploadKind) {
  const allowed = kind === "image" ? ALLOWED_IMAGE_TYPES : ALLOWED_DOWNLOAD_TYPES;

  if (!allowed.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("File is too large (max 10MB).");
  }

  const blob = await put(`${kind}s/${Date.now()}-${file.name}`, file, {
    access: "public",
  });

  return blob.url;
}
