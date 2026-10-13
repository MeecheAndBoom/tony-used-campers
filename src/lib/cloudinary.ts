import { createHash } from "node:crypto";
import { getSettings } from "./settings";

export type CloudinaryCredentials = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

/** Default public_id folder for images uploaded from the dashboard. */
export const UPLOAD_FOLDER = "tuc/uploads";

/**
 * Credentials for dashboard uploads. Environment variables take priority (Vercel
 * / CI); when they are absent we fall back to the values saved in
 * /admin/settings so uploads work without a redeploy.
 */
export async function getCloudinaryCredentials(): Promise<CloudinaryCredentials | null> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (cloudName && apiKey && apiSecret) return { cloudName, apiKey, apiSecret };

  try {
    const { cloudinary } = await getSettings();
    const stored: CloudinaryCredentials = {
      cloudName: cloudinary.cloudName.trim(),
      apiKey: cloudinary.apiKey.trim(),
      apiSecret: cloudinary.apiSecret.trim(),
    };
    if (stored.cloudName && stored.apiKey && stored.apiSecret) return stored;
  } catch {
    /* fall through to "not configured" */
  }
  return null;
}

/**
 * Signature for a browser-side (direct-to-Cloudinary) upload. Cloudinary signs
 * the alphabetically sorted request params joined by "&", with the API secret
 * appended — `file`, `api_key`, `cloud_name` and `resource_type` are excluded.
 */
export function signUpload(
  params: { folder: string; timestamp: number },
  apiSecret: string,
): string {
  const toSign = `folder=${params.folder}&timestamp=${params.timestamp}`;
  return createHash("sha1").update(`${toSign}${apiSecret}`).digest("hex");
}
