import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { UPLOAD_KINDS, kindForPathname } from "@/lib/blob-kinds";

/**
 * Issues the short-lived client tokens for every admin upload.
 *
 * The browser uploads straight to Blob storage; this route only decides
 * whether it may, and under what limits. That keeps file bytes off the
 * serverless function entirely, which is the whole point -- see
 * lib/blob-kinds.ts.
 */
export async function POST(request: Request): Promise<NextResponse> {
  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // The blob.upload-completed callback is a server-to-server request from
  // Vercel's Blob backend (authenticated via its own signature inside
  // handleUpload), not a browser request -- it carries no admin session
  // cookie, so only the initial client token request is gated here.
  if (body.type !== "blob.upload-completed") {
    try {
      await requireSession();
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // The pathname prefix is what picks the ruleset, so it is the only
        // part of the client's request that is trusted -- and only to select
        // a row in a fixed table, never to build a path.
        const kind = kindForPathname(pathname);
        if (!kind) {
          throw new Error("Unrecognised upload destination.");
        }
        const rules = UPLOAD_KINDS[kind];
        if (!new RegExp(`^${rules.prefix}/[\w.-]+$`).test(pathname)) {
          throw new Error("Invalid file name.");
        }
        return {
          allowedContentTypes: [...rules.contentTypes],
          maximumSizeInBytes: rules.maxBytes,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // No DB write here -- the admin forms receive the Blob URL directly
        // from the client-side upload() call and store it when the form is
        // submitted.
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
