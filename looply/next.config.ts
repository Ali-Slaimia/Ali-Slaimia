import type { NextConfig } from "next";

const basePath = process.env.LOOPLY_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  agentRules: false,
  ...(process.env.LOOPLY_EXPORT === "1"
    ? {
        output: "export" as const,
        images: { unoptimized: true },
        trailingSlash: true,
        ...(basePath ? { basePath, assetPrefix: basePath } : {}),
      }
    : {}),
};

export default nextConfig;
