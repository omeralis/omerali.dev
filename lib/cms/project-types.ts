import type { Locale } from "@/lib/i18n";
export const projectTypes = ["Enterprise", "Government", "Business", "Personal", "Other"] as const;
export type ProjectType = typeof projectTypes[number];
export interface ProjectMedia { url: string; alternativeText?: string; width: number; height: number; formats: { url: string; width: number; height: number }[] }
export interface Block { type: string; text?: string; bold?: boolean; italic?: boolean; underline?: boolean; strikethrough?: boolean; code?: boolean; level?: number; format?: string; url?: string; children?: Block[]; image?: ProjectMedia }
export interface ProjectTechnology { documentId: string; name: string; slug: string; category?: string; displayOrder: number }
export interface CaseStudy {
  documentId: string; title: string; slug: string; locale: Locale; publishedAt: string; updatedAt?: string;
  shortDescription?: string; description: Block[]; businessProblem: Block[]; solution: Block[]; myRole?: string;
  features: { title: string; description?: string; displayOrder: number }[];
  responsibilities: { description: string; displayOrder: number }[];
  technologies: ProjectTechnology[]; coverImage?: ProjectMedia; gallery: ProjectMedia[];
  projectYear?: number; status?: string; featured: boolean; displayOrder: number; projectType: ProjectType;
  demoUrl?: string; repositoryUrl?: string; clientName?: string;
  seo?: { metaTitle?: string; metaDescription?: string; ogImage?: ProjectMedia };
  localizations: { locale: Locale; slug: string; publishedAt: string }[];
}
export interface ProjectPage { projects: CaseStudy[]; pagination: { page: number; pageSize: number; pageCount: number; total: number } }
export type CmsResult<T> = { ok: true; value: T } | { ok: false; reason: "unavailable" };
