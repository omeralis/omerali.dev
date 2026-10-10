export function publicUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : undefined; } catch { return undefined; }
}
export function mediaUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const base = process.env.STRAPI_API_URL || process.env.STRAPI_URL || "https://api.omerali.dev";
  try {
    const url = new URL(value, base);
    const allowed = new URL(process.env.STRAPI_MEDIA_ORIGIN || base).origin;
    return url.origin === allowed && publicUrl(url.href) ? url.href : undefined;
  } catch { return undefined; }
}
export const siteOrigin = () => process.env.SITE_URL || "https://omerali.dev";
