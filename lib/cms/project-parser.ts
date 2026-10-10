import { mediaUrl, publicUrl } from "./urls";
import { isLocale, type Locale } from "@/lib/i18n";
import { projectTypes, type Block, type CaseStudy, type ProjectMedia, type ProjectPage } from "./project-types";
type ObjectValue = Record<string, unknown>;
const object = (value: unknown): ObjectValue => { if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid CMS response"); return value as ObjectValue; };
const text = (value: unknown) => typeof value === "string" && value.trim() ? value : undefined;
const array = (value: unknown): unknown[] => value == null ? [] : Array.isArray(value) ? value : (() => { throw new Error("Invalid CMS array"); })();
const number = (value: unknown, fallback = 0) => typeof value === "number" && Number.isFinite(value) ? value : fallback;
export const validSlug = (slug: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 160;

export function parseMedia(value: unknown): ProjectMedia | undefined {
  if (!value) return undefined;
  const item = object(value), url = mediaUrl(item.url);
  if (!url) return undefined;
  const formats = item.formats ? Object.values(object(item.formats)).flatMap(format => { const f = object(format), src = mediaUrl(f.url); return src ? [{ url: src, width: number(f.width, 1200), height: number(f.height, 800) }] : []; }) : [];
  return { url, alternativeText: text(item.alternativeText), width: Math.max(1, number(item.width, 1200)), height: Math.max(1, number(item.height, 800)), formats };
}
export function parseBlocks(value: unknown, depth = 0): Block[] {
  if (depth > 12) return [];
  return array(value).slice(0, 500).map(value => {
    const b = object(value);
    return { type: text(b.type) ?? "paragraph", text: text(b.text), bold: b.bold === true, italic: b.italic === true, underline: b.underline === true, strikethrough: b.strikethrough === true, code: b.code === true, level: number(b.level, 2), format: text(b.format), url: publicUrl(b.url), children: b.children ? parseBlocks(b.children, depth + 1) : undefined, image: b.image ? parseMedia(b.image) : undefined };
  });
}
export function parseProject(value: unknown, locale: Locale): CaseStudy {
  const p = object(value);
  if (!text(p.documentId) || !text(p.title) || typeof p.slug !== "string" || !validSlug(p.slug) || p.locale !== locale || !text(p.publishedAt)) throw new Error("Invalid published project");
  const ordered = <T extends { displayOrder: number }>(items: T[]) => items.sort((a,b) => a.displayOrder-b.displayOrder);
  return {
    documentId: p.documentId as string, title: p.title as string, slug: p.slug, locale, publishedAt: p.publishedAt as string, updatedAt: text(p.updatedAt), shortDescription: text(p.shortDescription),
    description: parseBlocks(p.description), businessProblem: parseBlocks(p.businessProblem), solution: parseBlocks(p.solution), myRole: text(p.myRole),
    features: ordered(array(p.features).map(value => { const f = object(value); if (!text(f.title)) throw new Error("Invalid feature"); return { title: f.title as string, description: text(f.description), displayOrder: number(f.displayOrder) }; })),
    responsibilities: ordered(array(p.responsibilities).map(value => { const r = object(value); if (!text(r.description)) throw new Error("Invalid responsibility"); return { description: r.description as string, displayOrder: number(r.displayOrder) }; })),
    technologies: ordered(array(p.technologies).map(value => { const t = object(value); if (!text(t.documentId) || !text(t.name) || !text(t.slug) || /\.net|dotnet|asp\.net/i.test(String(t.name))) throw new Error("Invalid technology"); return { documentId: t.documentId as string, name: t.name as string, slug: t.slug as string, category: text(t.category), displayOrder: number(t.displayOrder) }; })),
    coverImage: parseMedia(p.coverImage), gallery: array(p.gallery).flatMap(value => { const image = parseMedia(value); return image ? [image] : []; }),
    projectYear: typeof p.projectYear === "number" ? p.projectYear : undefined, status: text(p.status), featured: p.featured === true, displayOrder: number(p.displayOrder), projectType: projectTypes.includes(p.projectType as never) ? p.projectType as CaseStudy["projectType"] : "Other",
    demoUrl: publicUrl(p.demoUrl), repositoryUrl: publicUrl(p.repositoryUrl), clientName: text(p.clientName),
    seo: p.seo ? (() => { const s = object(p.seo); return { metaTitle: text(s.metaTitle), metaDescription: text(s.metaDescription), ogImage: parseMedia(s.ogImage) }; })() : undefined,
    localizations: array(p.localizations).flatMap(value => { const l = object(value); return isLocale(String(l.locale)) && typeof l.slug === "string" && validSlug(l.slug) && text(l.publishedAt) ? [{ locale: l.locale as Locale, slug: l.slug, publishedAt: l.publishedAt as string }] : []; }),
  };
}
export function parseProjectPage(value: unknown, locale: Locale): ProjectPage {
  const body = object(value), pagination = object(object(body.meta).pagination);
  if (!Array.isArray(body.data)) throw new Error("Invalid collection response");
  for (const key of ["page", "pageSize", "pageCount", "total"]) if (typeof pagination[key] !== "number" || !Number.isInteger(pagination[key]) || Number(pagination[key]) < 0) throw new Error("Invalid pagination");
  return { projects: array(body.data).map(project => parseProject(project, locale)), pagination: { page: number(pagination.page), pageSize: number(pagination.pageSize), pageCount: number(pagination.pageCount), total: number(pagination.total) } };
}
