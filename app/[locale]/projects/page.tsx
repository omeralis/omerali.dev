import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/cms/client";
import { isLocale, messages } from "@/lib/i18n";
export default async function Projects({ params }: { params: Promise<{ locale: string }> }) {
 const { locale } = await params; if (!isLocale(locale)) notFound(); const projects = await getProjects(locale);
 return <main id="main" className="route-content"><p className="eyebrow">04 / {messages[locale].nav[4]}</p><h1>{messages[locale].nav[4]}</h1>{projects.length ? <ul className="project-list">{projects.map(project => <li key={project.documentId}><Link href={`/${locale}/projects/${encodeURIComponent(project.slug)}`}><h2>{project.name}</h2><p>{project.shortDescription}</p></Link></li>)}</ul> : <p>{messages[locale].projectEmpty}</p>}<Link className="text-link" href={`/${locale}`}>{messages[locale].back}</Link></main>;
}
