import type { NextConfig } from "next";

const repo = "Ali-Slaimia";
const isPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: isPages ? `/${repo}` : "",
  agentRules: false,
};

export default nextConfig;
