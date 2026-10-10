"use client";
import { useParams } from "next/navigation";
import { getProjectMessages } from "@/lib/content/projects";

export default function Loading() {
  const { locale } = useParams<{ locale: string }>();
  return <main id="main" className="projects-page" aria-busy="true"><p className="project-state" role="status">{getProjectMessages(locale === "ar" ? "ar" : "en").loading}</p></main>;
}
