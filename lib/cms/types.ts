import type { Locale } from "@/lib/i18n";
import type { ServiceRecord, ExperienceRecord } from "@/lib/content/career";
export interface Entry { documentId: string; locale: Locale }
export interface Media { url: string; alternativeText?: string; width?: number; height?: number }
export interface Technology extends Entry { name: string; category: string; primary: boolean; displayOrder: number }
export interface Project extends Entry { name: string; slug: string; shortDescription?: string; description?: string; businessProblem?: string; solution?: string; role?: string; features?: string[]; technologies?: Technology[]; coverImage?: Media; gallery?: Media[]; year?: number; status?: string; demoUrl?: string; repositoryUrl?: string; featured: boolean; displayOrder: number }
export interface Profile extends Entry { name: string; title: string; careerStart: string; introduction?: string }
export interface About extends Entry { biography: string; location?: string; specialization?: string; currentFocus?: string }
export interface Service extends Entry, ServiceRecord {}
export interface Experience extends Entry, ExperienceRecord {}
export interface SocialLink extends Entry { label: string; url: string; displayOrder: number }
export interface ContactInformation extends Entry { email?: string; location?: string }
export interface Resume extends Entry { file: Media }
export interface ContentTypes { profile: Profile; about: About; services: Service[]; experiences: Experience[]; projects: Project[]; technologies: Technology[]; "social-links": SocialLink[]; "contact-information": ContactInformation; resume: Resume }
