import "server-only";
import type { Locale } from "@/lib/i18n";
import { cache } from "react";
export const contentModels = ["global", "about", "services", "experiences"] as const;
export type ContentModel = typeof contentModels[number];
export type ContentResult = { ok: true; value: unknown } | { ok: false; reason: "unavailable" };
export const getContent = cache(async (type: ContentModel, locale: Locale, query: Record<string, string> = {}): Promise<ContentResult> => {
  try {
    const base = process.env.STRAPI_API_URL || process.env.STRAPI_URL || "https://api.omerali.dev";
    const url = new URL(`/api/${type}`, base);
    if (!/^https?:$/.test(url.protocol) || url.username || url.password) throw Error("Invalid CMS origin");
    url.search = new URLSearchParams({ ...query, locale, status: "published", "filters[enabled][$eq]": "true" }).toString();
    const response = await fetch(url, { redirect: "error", headers: process.env.STRAPI_API_TOKEN ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` } : {}, next: { revalidate: 300, tags: ["portfolio", `cms:${type}:${locale}`] }, signal: AbortSignal.timeout(5000) });
    if (!response.ok) return { ok: false, reason: "unavailable" };
    const json: unknown = await response.json();
    if (!json || typeof json !== "object" || !("data" in json)) return { ok: false, reason: "unavailable" };
    return { ok: true, value: json.data };
  } catch { return { ok: false, reason: "unavailable" }; }
});
