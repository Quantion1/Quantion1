import type { NextConfig } from "next";

/**
 * `npm run build`  → normal Node build (npm start)
 * `npm run export` → fully static HTML export into ./out (open with any web server)
 */
const nextConfig: NextConfig = {
  ...(process.env.NEXT_OUTPUT === "export" ? { output: "export" as const, images: { unoptimized: true } } : {}),
};

export default nextConfig;
