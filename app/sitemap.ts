import type { MetadataRoute } from "next";
import { queryProjects } from "@/lib/cms/projects";
import { siteOrigin } from "@/lib/cms/urls";
import type { CaseStudy } from "@/lib/cms/project-types";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteOrigin();
  const entries: MetadataRoute.Sitemap = ["en", "ar"].flatMap(locale => [{ url: `${origin}/${locale}` }, { url: `${origin}/${locale}/projects` }]);
  const published: CaseStudy[] = [];
  for (const locale of ["en", "ar"] as const) {
    let page = 1, pageCount = 1;
    do {
      const result = await queryProjects(locale, { "pagination[page]": String(page), "pagination[pageSize]": "100" });
      if (!result.ok) break;
      published.push(...result.value.projects);
      pageCount = result.value.pagination.pageCount;
    } while (++page <= pageCount);
  }
  for (const project of published) {
    const languages = Object.fromEntries(published.filter(p => p.documentId === project.documentId).map(p => [p.locale, `${origin}/${p.locale}/projects/${p.slug}`]));
    entries.push({ url: `${origin}/${project.locale}/projects/${project.slug}`, ...(project.updatedAt && Number.isFinite(Date.parse(project.updatedAt)) ? { lastModified: new Date(project.updatedAt) } : {}), alternates: { languages } });
  }
  return entries;
}
