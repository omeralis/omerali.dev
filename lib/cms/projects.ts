import "server-only";
import { cache } from "react";
import type { Locale } from "@/lib/i18n";
import { parseProjectPage, validSlug } from "./project-parser";
import type { CaseStudy, CmsResult, ProjectPage, ProjectType } from "./project-types";

const populate = { "populate[technologies]": "true", "populate[coverImage]": "true", "populate[gallery]": "true", "populate[features]": "true", "populate[responsibilities]": "true", "populate[seo][populate][ogImage]": "true", "populate[localizations][fields][0]": "locale", "populate[localizations][fields][1]": "slug", "populate[localizations][fields][2]": "publishedAt" };
const summaryPopulate = { "populate[technologies]": "true", "populate[coverImage]": "true", "populate[localizations][fields][0]": "locale", "populate[localizations][fields][1]": "slug", "populate[localizations][fields][2]": "publishedAt" };
const summaryFields = Object.fromEntries(["title", "slug", "shortDescription", "projectType", "featured", "displayOrder", "projectYear", "publishedAt", "updatedAt", "locale"].map((field, index) => [`fields[${index}]`, field]));
export async function queryProjects(locale: Locale, query: Record<string, string> = {}, detail = false): Promise<CmsResult<ProjectPage>> {
  try {
    const base = process.env.STRAPI_API_URL || process.env.STRAPI_URL || "https://api.omerali.dev";
    const url = new URL("api/projects", `${base.replace(/\/$/, "")}/`);
    url.search = new URLSearchParams({ ...(detail ? populate : { ...summaryPopulate, ...summaryFields }), "sort[0]": "displayOrder:asc", "sort[1]": "documentId:asc", "pagination[pageSize]": "12", ...query, locale, status: "published" }).toString();
    const response = await fetch(url, { headers: process.env.STRAPI_API_TOKEN ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` } : {}, next: { revalidate: 300, tags: ["projects", `projects:${locale}`] }, signal: AbortSignal.timeout(5000), redirect: "error" });
    if (!response.ok) return { ok: false, reason: "unavailable" };
    return { ok: true, value: parseProjectPage(await response.json(), locale) };
  } catch { return { ok: false, reason: "unavailable" }; }
}
export const getProject = cache(async (locale: Locale, slug: string): Promise<CmsResult<CaseStudy | null>> => {
  if (!validSlug(slug)) return { ok: true, value: null };
  const result = await queryProjects(locale, { "filters[slug][$eq]": slug, "pagination[pageSize]": "1" }, true);
  return result.ok ? { ok: true, value: result.value.projects[0] ?? null } : result;
});
export const getFeaturedProjects = (locale: Locale) => queryProjects(locale, { "filters[featured][$eq]": "true", "pagination[pageSize]": "3" });
export const getProjectList = (locale: Locale, page = 1, type?: ProjectType) => queryProjects(locale, { "pagination[page]": String(page), ...(type ? { "filters[projectType][$eq]": type } : {}) });
export const getCategories = cache(async (locale: Locale): Promise<CmsResult<ProjectType[]>> => {
  const categories = new Set<ProjectType>();
  let page = 1, pageCount = 1;
  do {
    const result = await queryProjects(locale, { "pagination[page]": String(page), "pagination[pageSize]": "100" });
    if (!result.ok) return result;
    result.value.projects.forEach(project => categories.add(project.projectType));
    pageCount = result.value.pagination.pageCount;
  } while (++page <= pageCount);
  return { ok: true, value: [...categories] };
});
export async function getRelatedProjects(project: CaseStudy): Promise<CaseStudy[]> {
  const query = { "filters[documentId][$ne]": project.documentId, "pagination[pageSize]": "3" };
  const result = await queryProjects(project.locale, { ...query, "filters[projectType][$eq]": project.projectType });
  return result.ok ? result.value.projects : [];
}
