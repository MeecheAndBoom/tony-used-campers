import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
  getCloudinaryCredentials,
  signUpload,
  UPLOAD_FOLDER,
} from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Only the shapes we hand out — keep public_id paths predictable and safe. */
const FOLDER_PATTERN = /^[a-z0-9][a-z0-9/_-]{0,120}$/i;

/**
 * Returns a short-lived signature so the admin dashboard can upload a file
 * straight to Cloudinary. Files never pass through the app, which keeps large
 * photos clear of serverless request-body limits.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Sign in again to upload images." },
      { status: 401 },
    );
  }

  const credentials = await getCloudinaryCredentials();
  if (!credentials) {
    return NextResponse.json(
      {
        error:
          "Image uploads are not configured. Add your Cloudinary cloud name, API key and secret in Settings.",
      },
      { status: 503 },
    );
  }

  let folder = UPLOAD_FOLDER;
  try {
    const body = (await request.json()) as { folder?: unknown };
    if (typeof body?.folder === "string") {
      const cleaned = body.folder.replace(/^\/+|\/+$/g, "");
      if (FOLDER_PATTERN.test(cleaned)) folder = cleaned;
    }
  } catch {
    /* no body — use the default folder */
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = signUpload({ folder, timestamp }, credentials.apiSecret);

  return NextResponse.json({
    cloudName: credentials.cloudName,
    apiKey: credentials.apiKey,
    folder,
    timestamp,
    signature,
  });
}
