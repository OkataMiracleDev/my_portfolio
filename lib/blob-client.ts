"use client";

import { upload } from "@vercel/blob/client";
import {
  UPLOAD_KINDS,
  formatBytes,
  matchesSignature,
  resolveContentType,
  safeFileName,
  type UploadKind,
} from "./blob-kinds";

/**
 * The one way the admin puts a file into Blob storage.
 *
 * Every admin upload widget routes through here so that the checks, the error
 * wording and the pathname shape are identical no matter which form you're on.
 * See lib/blob-kinds.ts for why this is a direct-to-Blob upload rather than a
 * POST to a route handler.
 */
export async function uploadFile(
  file: File,
  kind: UploadKind,
  onProgress?: (percentage: number) => void
): Promise<string> {
  const rules = UPLOAD_KINDS[kind];
  const contentType = resolveContentType(file);

  if (!contentType || !rules.contentTypes.includes(contentType)) {
    throw new Error(`Unsupported file type${file.type ? `: ${file.type}` : ""}.`);
  }
  if (file.size > rules.maxBytes) {
    throw new Error(
      `${formatBytes(file.size)} is too large — the limit is ${formatBytes(rules.maxBytes)}.`
    );
  }
  if (!(await matchesSignature(file, contentType))) {
    throw new Error("File contents don't match its extension.");
  }

  // addRandomSuffix on the server keeps two uploads of the same filename from
  // colliding, so the name here only has to be readable and pathname-safe.
  const blob = await upload(`${rules.prefix}/${safeFileName(file.name)}`, file, {
    access: "public",
    contentType,
    handleUploadUrl: "/api/admin/blob-upload",
    onUploadProgress: onProgress ? (event) => onProgress(Math.round(event.percentage)) : undefined,
  });

  return blob.url;
}
