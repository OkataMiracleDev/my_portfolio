import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { uploadToBlob, type UploadKind } from "@/lib/blob";

export async function POST(request: NextRequest) {
  try {
    await requireSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const kind = (formData.get("kind") as UploadKind | null) ?? "image";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  try {
    const url = await uploadToBlob(file, kind);
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
