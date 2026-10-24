"use client";

/**
 * Image loader that keeps <Image> responsive without Vercel's optimizer.
 *
 * Cloudinary already resizes and delivers images from its own CDN, so asking
 * Vercel to fetch, re-encode and cache a copy of every variant only burns the
 * monthly image-transformation quota. This loader returns the Cloudinary URL
 * directly with the width/quality the browser asked for.
 *
 * Existing transformation segments baked into stored URLs (for example
 * "c_limit,w_360,q_auto:good,f_png" on the logo) are stripped first, so
 * Cloudinary hands back one correctly sized WebP/AVIF instead of a PNG.
 *
 * Anything else (logos and other files in /public) is returned untouched,
 * which is what `unoptimized` would do for those sources.
 */

const CLOUDINARY = /^https:\/\/res\.cloudinary\.com\/([^/]+)\/image\/upload\//;

// A Cloudinary transformation segment looks like "f_auto,q_auto,c_limit".
// Version paths ("v1792571264") and plain folders ("tuc", "products") do not
// match, so they are left alone.
const TRANSFORM_SEGMENT = /^[a-z]{1,3}_[^/,]+(,[a-z]{1,3}_[^/,]+)*$/;

function stripTransform(path) {
  const slash = path.indexOf("/");
  if (slash <= 0) return path;
  const first = path.slice(0, slash);
  return TRANSFORM_SEGMENT.test(first) ? path.slice(slash + 1) : path;
}

export default function imageLoader({ src, width, quality }) {
  const q = quality || "auto";

  const cloudinary = src.match(CLOUDINARY);
  if (cloudinary) {
    const cloud = cloudinary[1];
    const rest = stripTransform(src.slice(cloudinary[0].length));
    return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_${q},c_limit,w_${width}/${rest}`;
  }

  return src;
}
