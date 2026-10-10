import type { NextConfig } from "next";
const mediaOrigin = new URL(process.env.STRAPI_MEDIA_ORIGIN || process.env.STRAPI_API_URL || process.env.STRAPI_URL || "https://api.omerali.dev");
const nextConfig: NextConfig = {
  output: "standalone",
  images: { remotePatterns: [{ protocol: mediaOrigin.protocol === "http:" ? "http" : "https", hostname: mediaOrigin.hostname, port: mediaOrigin.port, pathname: "/**" }] },
};
export default nextConfig;
