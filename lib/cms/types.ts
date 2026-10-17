import type { CaseStudy as Project } from "./project-types";
import type { Locale } from "@/lib/i18n";
import type { ServiceRecord, ExperienceRecord } from "@/lib/content/career";
import type { GlobalContent } from "./portfolio";
import type { AboutContent } from "@/lib/content/home";
export interface Entry { documentId: string; locale: Locale }
export interface Media { url: string; alternativeText?: string; width?: number; height?: number }
export interface Technology { documentId: string; name: string; slug: string; category: string; displayOrder: number }
export type { CaseStudy as Project } from "./project-types";
export type Profile = GlobalContent;
export type About = AboutContent;
export interface Service extends Entry, ServiceRecord {}
export interface Experience extends Entry, ExperienceRecord {}
export interface SocialLink extends Entry { label: string; url: string; displayOrder: number }
export interface ContactInformation extends Entry { email?: string; location?: string }
export interface Resume extends Entry { file: Media }
export interface ContentTypes { global: Profile; about: About; services: Service[]; experiences: Experience[]; projects: Project[]; technologies: Technology[] }
