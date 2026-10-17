import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { CaseStudy, ProjectMedia } from "@/lib/cms/project-types";
import { getProjectMessages } from "@/lib/content/projects";
import { getFeaturedProjects } from "@/lib/cms/projects";
import { Icon } from "./icon";

export function ProjectImage({ image, title, priority = false }: { image: ProjectMedia; title: string; priority?: boolean }) {
  const localMedia = ["localhost", "127.0.0.1"].includes(new URL(image.url).hostname);
  return <Image src={image.url} alt={image.alternativeText || title} width={image.width} height={image.height} sizes="(max-width: 700px) 100vw, (max-width: 1300px) 60vw, 800px" priority={priority} unoptimized={localMedia || new URL(image.url).pathname.endsWith(".svg")} className="project-image"/>;
}
export function TechnologyLabels({ project }: { project: CaseStudy }) {
  return project.technologies.length ? <ul className="project-technologies">{project.technologies.map(technology => <li key={technology.documentId}><bdi dir="ltr">{technology.name}</bdi></li>)}</ul> : null;
}
export function ProjectPlaceholder({ project, locale }: { project: CaseStudy; locale: Locale }) {
  const t = getProjectMessages(locale);
  return <div className="project-type-preview" aria-hidden="true"><span className="eyebrow">{t.types[project.projectType]}</span><span>{project.title}</span><span className="preview-caption"><Icon name="layers"/>{t.noPreview}</span></div>;
}
export function ProjectShowcase({ projects, locale }: { projects: CaseStudy[]; locale: Locale }) {
  const t = getProjectMessages(locale);
  return <div className="project-showcase">{projects.map((project, index) => <article className={`project-preview${index === 0 ? " featured-lead" : ""}`} key={project.documentId}>
    <Link href={`/${locale}/projects/${project.slug}`} className="project-art" aria-label={`${t.caseStudy}: ${project.title}`}>
      {project.coverImage ? <ProjectImage image={project.coverImage} title={project.title}/> : <ProjectPlaceholder project={project} locale={locale}/>}
    </Link>
    <div className="project-summary"><p className="eyebrow">{new Intl.NumberFormat(locale, { minimumIntegerDigits: 2 }).format(index + 1)} / {t.types[project.projectType]}</p><h3><Link href={`/${locale}/projects/${project.slug}`}>{project.title}</Link></h3>{project.shortDescription && <p>{project.shortDescription}</p>}<TechnologyLabels project={project}/><Link className="text-link" href={`/${locale}/projects/${project.slug}`}>{t.caseStudy} <span className="arrow" aria-hidden="true">↗</span></Link></div>
  </article>)}</div>;
}
export async function FeaturedProjects({ locale }: { locale: Locale }) {
  const t = getProjectMessages(locale), result = await getFeaturedProjects(locale);
  return <section id="projects" className="projects-section" aria-labelledby="projects-heading"><div className="projects-section-heading"><p className="eyebrow">{t.identifier}</p><h2 id="projects-heading">{t.selected}</h2><p className="section-introduction">{t.introduction}</p></div>{result.ok && result.value.projects.length ? <ProjectShowcase projects={result.value.projects} locale={locale}/> : <p className="project-state" role="status">{result.ok ? t.empty : t.unavailable}</p>}<Link className="text-link" href={`/${locale}/projects`}>{t.all} <span className="arrow" aria-hidden="true">↗</span></Link></section>;
}
