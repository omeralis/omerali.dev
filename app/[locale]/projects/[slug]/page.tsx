import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent } from "@/lib/cms/client";
import { isLocale, messages } from "@/lib/i18n";
export default async function ProjectDetail({ params }: { params: Promise<{ locale: string; slug: string }> }) {
 const { locale, slug } = await params; if (!isLocale(locale)) notFound();
 const projects = await getContent("projects", locale, { "filters[slug][$eq]": slug, "populate[technologies]": "true" }); const project = projects?.[0]; if (!project) notFound();
 return <main id="main" className="route-content"><p className="eyebrow">04 / {messages[locale].nav[4]}</p><h1>{project.name}</h1><p>{project.shortDescription}</p><p className="preserve-lines">{project.description}</p><ul className="technology-list">{project.technologies?.map(technology => <li key={technology.documentId}>{technology.name}</li>)}</ul><Link className="text-link" href={`/${locale}/projects`}>{messages[locale].projects}</Link></main>;
}
