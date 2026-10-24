import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Images live on Cloudinary, which already resizes and delivers them from
    // its own CDN. The custom loader keeps <Image> responsive while keeping
    // Vercel's Image Optimization API (billed per transformation) out of the
    // path. See image-loader.js.
    loader: "custom",
    loaderFile: "./image-loader.js",
    // Fewer candidate widths = fewer CDN variants generated per image.
    deviceSizes: [640, 1080, 1920],
    imageSizes: [96, 256, 384],
    // Content images are hosted on Cloudinary (scripts/cloudinary-migrate.mjs).
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
