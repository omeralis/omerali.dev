import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getProject, getRelatedProjects } from "@/lib/cms/projects";
import { siteOrigin } from "@/lib/cms/urls";
import { getProjectMessages } from "@/lib/content/projects";
import { ProjectImage, ProjectShowcase, TechnologyLabels } from "@/components/project-showcase";
import { ProjectRichText, hasBlocks } from "@/components/project-rich-text";

type Props = { params: Promise<{ locale: string; slug: string }> };
export const revalidate = 300;
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const result = await getProject(locale, slug);
  if (!result.ok || !result.value) return { title: getProjectMessages(locale).missing, robots: { index: false }, alternates: { languages: {} } };
  const p = result.value, title = p.seo?.metaTitle || p.title, description = p.seo?.metaDescription || p.shortDescription;
  const image = p.seo?.ogImage || p.coverImage;
  const canonical = `${siteOrigin()}/${locale}/projects/${p.slug}`;
  return { title, description, alternates: { canonical, languages: { [locale]: canonical, ...Object.fromEntries(p.localizations.map(l => [l.locale, `${siteOrigin()}/${l.locale}/projects/${l.slug}`])) } }, openGraph: { title, description, url: canonical, locale: locale === "ar" ? "ar_SA" : "en_US", ...(image ? { images: [{ url: image.url, width: image.width, height: image.height, alt: image.alternativeText || p.title }] } : {}) }, twitter: { card: image ? "summary_large_image" : "summary", title, description, ...(image ? { images: [image.url] } : {}) } };
}
export default async function ProjectDetail({ params }: Props) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const result = await getProject(locale, slug), t = getProjectMessages(locale);
  if (!result.ok) return <main id="main" className="projects-page"><h1>{t.heading}</h1><p className="project-state" role="status">{t.unavailable}</p><Link className="text-link" href={`/${locale}/projects`}>{t.back}</Link></main>;
  if (!result.value) notFound();
  const project = result.value, related = await getRelatedProjects(project);
  const sections = [{ title: t.overview, blocks: project.description }, { title: t.challenge, blocks: project.businessProblem }, { title: t.solution, blocks: project.solution }];
  return <main id="main" className="projects-page case-study">
    <nav className="project-breadcrumbs" aria-label={locale === "ar" ? "مسار التنقل" : "Breadcrumb"}><Link href={`/${locale}`}>{t.home}</Link><span aria-hidden="true">/</span><Link href={`/${locale}/projects`}>{t.heading}</Link><span aria-hidden="true">/</span><span>{project.title}</span></nav>
    <header className="case-heading"><p className="eyebrow">{t.types[project.projectType]}</p><h1>{project.title}</h1>{project.shortDescription && <p className="case-introduction">{project.shortDescription}</p>}<TechnologyLabels project={project}/><dl className="case-facts">{project.myRole && <div><dt>{t.role}</dt><dd>{project.myRole}</dd></div>}{project.projectYear && <div><dt>{t.year}</dt><dd>{new Intl.NumberFormat(locale, { useGrouping: false }).format(project.projectYear)}</dd></div>}{project.clientName && <div><dt>{t.client}</dt><dd>{project.clientName}</dd></div>}</dl></header>
    {project.coverImage && <figure className="case-cover"><ProjectImage image={project.coverImage} title={project.title} priority/></figure>}
    {sections.filter(section => hasBlocks(section.blocks)).map(section => <section key={section.title} className="case-section"><h2>{section.title}</h2><ProjectRichText blocks={section.blocks}/></section>)}
    {project.features.length > 0 && <section className="case-section"><h2>{t.features}</h2><ol className="case-features">{project.features.map((feature,index) => <li key={index}><h3>{feature.title}</h3>{feature.description && <p>{feature.description}</p>}</li>)}</ol></section>}
    {(project.myRole || project.responsibilities.length > 0) && <section className="case-section"><h2>{t.contribution}</h2><div>{project.myRole && <p>{project.myRole}</p>}{project.responsibilities.length > 0 && <ul className="case-responsibilities">{project.responsibilities.map((responsibility,index) => <li key={index}>{responsibility.description}</li>)}</ul>}</div></section>}
    {project.technologies.length > 0 && <section className="case-section"><h2>{t.technologies}</h2><TechnologyLabels project={project}/></section>}
    {project.gallery.length > 0 && <section className="case-gallery"><h2>{t.gallery}</h2>{project.gallery.map((image,index) => <figure key={image.url}><ProjectImage image={image} title={`${project.title} — ${t.gallery} ${index + 1}`}/>{image.alternativeText && <figcaption>{image.alternativeText}</figcaption>}</figure>)}</section>}
    {(project.demoUrl || project.repositoryUrl) && <div className="case-links">{project.demoUrl && <a className="button primary" href={project.demoUrl} target="_blank" rel="noopener noreferrer">{t.demo}<span className="arrow" aria-hidden="true">↗</span></a>}{project.repositoryUrl && <a className="button secondary" href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">{t.repository}<span className="arrow" aria-hidden="true">↗</span></a>}</div>}
    {related.length > 0 && <section className="related-projects"><h2>{t.related}</h2><ProjectShowcase projects={related} locale={locale}/></section>}
    <Link className="text-link" href={`/${locale}/projects`}>{t.back}</Link>
  </main>;
}
