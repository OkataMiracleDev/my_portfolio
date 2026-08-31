import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";

export async function POST(request: Request): Promise<NextResponse> {
  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // The blob.upload-completed callback is a server-to-server request from
  // Vercel's Blob backend (authenticated via its own signature inside
  // handleUpload), not a browser request — it carries no admin session
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
        if (!/^plugin-files\/[\w.-]+\.zip$/i.test(pathname)) {
          throw new Error("Only .zip files can be uploaded here.");
        }
        return {
          allowedContentTypes: ["application/zip", "application/x-zip-compressed"],
          maximumSizeInBytes: 200 * 1024 * 1024, // 200MB
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // No DB write here — the admin form receives the Blob URL directly
        // from the client-side upload() call and stores it when the
        // plugin form is submitted (see PluginFileWidget.tsx / PluginForm.tsx).
      },
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
