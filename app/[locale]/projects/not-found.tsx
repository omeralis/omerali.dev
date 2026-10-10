"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getProjectMessages } from "@/lib/content/projects";
export default function ProjectNotFound() {
  const locale = usePathname().startsWith("/ar/") ? "ar" : "en";
  const t = getProjectMessages(locale);
  return <main id="main" className="projects-page"><h1>{t.missing}</h1><p>{t.missingText}</p><Link className="text-link" href={`/${locale}/projects`}>{t.back}</Link></main>;
}
