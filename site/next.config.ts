import type { NextConfig } from "next";

const basePath = process.env.SITE_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(process.env.SITE_EXPORT === "1"
    ? {
        output: "export" as const,
        images: { unoptimized: true },
        trailingSlash: true,
        ...(basePath ? { basePath, assetPrefix: basePath } : {}),
      }
    : {}),
};

export default nextConfig;
