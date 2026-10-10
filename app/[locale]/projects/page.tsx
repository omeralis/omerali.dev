import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getCategories, getProjectList } from "@/lib/cms/projects";
import { projectTypes, type ProjectType } from "@/lib/cms/project-types";
import { siteOrigin } from "@/lib/cms/urls";
import { getProjectMessages } from "@/lib/content/projects";
import { ProjectShowcase } from "@/components/project-showcase";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ type?: string; page?: string }> };
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getProjectMessages(locale), query = await searchParams;
  return { title: t.heading, description: t.listingIntro, alternates: { canonical: `${siteOrigin()}/${locale}/projects`, languages: { en: `${siteOrigin()}/en/projects`, ar: `${siteOrigin()}/ar/projects` } }, openGraph: { title: t.heading, description: t.listingIntro, url: `${siteOrigin()}/${locale}/projects` }, ...(query.type || query.page ? { robots: { index: false, follow: true } } : {}) };
}
export default async function Projects({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  if (query.type && !projectTypes.includes(query.type as ProjectType) || query.page && !/^[1-9]\d{0,4}$/.test(query.page)) notFound();
  const type = query.type as ProjectType | undefined, page = Number(query.page || 1);
  const [result, categories] = await Promise.all([getProjectList(locale, page, type), getCategories(locale)]);
  const t = getProjectMessages(locale);
  if (result.ok && page > Math.max(1, result.value.pagination.pageCount)) notFound();
  const href = (category?: ProjectType, p = 1) => `/${locale}/projects${category || p > 1 ? `?${new URLSearchParams({ ...(category ? { type: category } : {}), ...(p > 1 ? { page: String(p) } : {}) })}` : ""}`;
  return <main id="main" className="projects-page">
    <nav className="project-breadcrumbs" aria-label={locale === "ar" ? "مسار التنقل" : "Breadcrumb"}><Link href={`/${locale}`}>{t.home}</Link><span aria-hidden="true">/</span><span>{t.heading}</span></nav>
    <header className="projects-page-heading"><p className="eyebrow">{t.identifier}</p><h1>{t.heading}</h1><p className="section-introduction">{t.listingIntro}</p></header>
    {categories.ok && categories.value.length > 0 && <nav className="project-filters" aria-label={t.filterLabel}><Link href={href()} aria-current={!type ? "page" : undefined}>{t.allFilter}</Link>{projectTypes.filter(category => categories.value.includes(category)).map(category => <Link key={category} href={href(category)} aria-current={type === category ? "page" : undefined}>{t.types[category]}</Link>)}</nav>}
    {result.ok && result.value.projects.length ? <ProjectShowcase projects={result.value.projects} locale={locale}/> : <p className="project-state" role="status">{result.ok ? t.empty : t.unavailable}</p>}
    {result.ok && result.value.pagination.pageCount > 1 && <nav className="project-pagination" aria-label={t.page}>{page > 1 && <Link className="button secondary" href={href(type, page - 1)}>{t.previous}</Link>}<span>{t.page} <bdi>{new Intl.NumberFormat(locale).format(page)} / {new Intl.NumberFormat(locale).format(result.value.pagination.pageCount)}</bdi></span>{page < result.value.pagination.pageCount && <Link className="button secondary" href={href(type, page + 1)}>{t.next}</Link>}</nav>}
  </main>;
}
