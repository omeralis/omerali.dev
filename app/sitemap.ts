import type { MetadataRoute } from "next";
import { queryProjects } from "@/lib/cms/projects";
import { siteOrigin } from "@/lib/cms/urls";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = siteOrigin();
  const entries: MetadataRoute.Sitemap = ["en", "ar"].flatMap(locale => [{ url: `${origin}/${locale}` }, { url: `${origin}/${locale}/projects` }]);
  for (const locale of ["en", "ar"] as const) {
    let page = 1, pageCount = 1;
    do {
      const result = await queryProjects(locale, { "pagination[page]": String(page), "pagination[pageSize]": "100" });
      if (!result.ok) break;
      for (const project of result.value.projects) {
        const languages = { [locale]: `${origin}/${locale}/projects/${project.slug}`, ...Object.fromEntries(project.localizations.map(translation => [translation.locale, `${origin}/${translation.locale}/projects/${translation.slug}`])) };
        entries.push({ url: `${origin}/${locale}/projects/${project.slug}`, ...(project.updatedAt && Number.isFinite(Date.parse(project.updatedAt)) ? { lastModified: new Date(project.updatedAt) } : {}), alternates: { languages } });
      }
      pageCount = result.value.pagination.pageCount;
    } while (++page <= pageCount);
  }
  return entries;
}
