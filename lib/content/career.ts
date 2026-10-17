import type { Locale } from "@/lib/i18n";
import type { Media } from "@/lib/cms/types";

export interface ServiceRecord {
  id: string;
  title: string;
  titleArabic: string;
  description: string;
  descriptionArabic: string;
  number: number;
  slug: string;
  displayOrder: number;
}

export interface ExperienceRecord {
  id: string;
  company: string;
  companyArabic?: string;
  role: string;
  roleArabic?: string;
  employmentType: "full-time" | "part-time";
  /** Month precision: YYYY-MM, without invented start/end days. */
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  location?: string;
  locationArabic?: string;
  workMode?: "on-site" | "remote" | "hybrid";
  associatedOrganization?: string;
  description?: string;
  technologies?: string[];
  logo?: Media;
  companyUrl?: string;
  displayOrder: number;
}

export interface ServicesContent {
  identifier: string;
  heading: string;
  introduction: string;
  services: ServiceRecord[];
}
export interface ExperienceContent {
  identifier: string;
  heading: string;
  introduction: string;
  fullTime: string;
  partTime: string;
  current: string;
  present: string;
  onSite: string;
  remote: string;
  hybrid: string;
  associated: string;
  mainCareer: string;
  parallelCareer: string;
  overlapNote: string;
  entries: ExperienceRecord[];
}

export function getServicesContent(locale: Locale, services: ServiceRecord[]): ServicesContent {
  return { identifier: locale === "ar" ? "٠٢ / الخدمات" : "02 / Services", heading: locale === "ar" ? "الخدمات" : "Services",
    introduction: "", services };
}

export function getExperienceContent(locale: Locale, entries: ExperienceRecord[]): ExperienceContent {
  const labels = locale === "ar" ? {
    identifier: "٠٣ / الخبرات", heading: "الخبرات", introduction: "",
    fullTime: "دوام كامل", partTime: "دوام جزئي", current: "المنصب الحالي", present: "حتى الآن", onSite: "حضوري", remote: "عن بُعد", hybrid: "هجين", associated: "بالارتباط مع",
    mainCareer: "المسيرة بدوام كامل", parallelCareer: "خبرة موازية بدوام جزئي", overlapNote: "دور قيادي بدوام جزئي يتزامن مع المسيرة المهنية بدوام كامل.",
  } : {
    identifier: "03 / Experience", heading: "Experience", introduction: "",
    fullTime: "Full-time", partTime: "Part-time", current: "Current", present: "Present", onSite: "On-site", remote: "Remote", hybrid: "Hybrid", associated: "Associated with",
    mainCareer: "Full-time career", parallelCareer: "Parallel part-time experience", overlapNote: "A part-time leadership role alongside the full-time career.",
  };
  return { ...labels, entries };
}

export function formatCareerMonth(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en", { month: "long", year: "numeric", calendar: "gregory", timeZone: "UTC" }).format(new Date(`${value}-01T00:00:00Z`));
}
