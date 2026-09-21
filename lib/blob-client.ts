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
  const pathname = `${rules.prefix}/${safeFileName(file.name)}`;

  try {
    const blob = await upload(pathname, file, {
      access: "public",
      contentType,
      handleUploadUrl: HANDLE_UPLOAD_URL,
      onUploadProgress: onProgress ? (event) => onProgress(Math.round(event.percentage)) : undefined,
    });
    return blob.url;
  } catch (error) {
    throw new Error(await explain(error, pathname));
  }
}

const HANDLE_UPLOAD_URL = "/api/admin/blob-upload";

/**
 * Recovers the reason a token request failed.
 *
 * When the token route answers with anything but 2xx, @vercel/blob throws
 * away the response body and reports only "Failed to retrieve the client
 * token" -- the same string whether the session expired, the file name was
 * rejected, or the Blob store is misconfigured. That cost a full debugging
 * round trip once already, so on this path we ask the route again and report
 * what it actually said.
 */
async function explain(error: unknown, pathname: string): Promise<string> {
  const message = error instanceof Error ? error.message : "Upload failed";
  if (!/retrieve the client token/i.test(message)) return message;

  try {
    const response = await fetch(HANDLE_UPLOAD_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "blob.generate-client-token",
        payload: { pathname, callbackUrl: "", clientPayload: null, multipart: false },
      }),
    });
    if (response.status === 401) return "Your admin session expired — reload and sign in again.";
    const data = (await response.json()) as { error?: string };
    if (data.error) return data.error;
  } catch {
    // Fall through to the SDK's message; the diagnostic is best-effort.
  }
  return message;
}
