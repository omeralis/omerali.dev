import "server-only";
import type { Locale } from "@/lib/i18n";
import type { ContentTypes } from "./types";
export async function getContent<K extends keyof ContentTypes>(type: K, locale: Locale, query: Record<string, string> = {}): Promise<ContentTypes[K] | null> {
 const base = process.env.STRAPI_URL;
 if (!base) return null;
 const url = new URL(`api/${type}`, `${base.replace(/\/$/, "")}/`);
 url.search = new URLSearchParams({ locale, ...query }).toString();
 const response = await fetch(url, { headers: process.env.STRAPI_API_TOKEN ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` } : {}, next: { revalidate: 300, tags: [`cms:${type}:${locale}`] }, signal: AbortSignal.timeout(5000) });
 if (!response.ok) throw new Error(`CMS ${type}: HTTP ${response.status}`);
 const result = await response.json() as { data: ContentTypes[K] | null };
 return result.data;
}
