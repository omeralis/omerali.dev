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

const services: ServiceRecord[] = [
  { id: "full-stack", number: 1, slug: "full-stack-development", displayOrder: 1,
    title: "Full Stack Development", titleArabic: "تطوير Full Stack",
    description: "Build complete web applications covering frontend interfaces, backend services, APIs, authentication, databases and integrations.",
    descriptionArabic: "تطوير تطبيقات ويب متكاملة تشمل واجهات المستخدم وخدمات Backend وواجهات API والمصادقة وقواعد البيانات والتكامل بين الأنظمة." },
  { id: "frontend", number: 2, slug: "frontend-engineering", displayOrder: 2,
    title: "Frontend Engineering", titleArabic: "هندسة الواجهات الأمامية",
    description: "Build scalable, maintainable frontend applications with Angular, React, Next.js and TypeScript, focusing on architecture, reusable components and application performance.",
    descriptionArabic: "بناء تطبيقات Frontend قابلة للتوسع وسهلة الصيانة باستخدام Angular وReact وNext.js وTypeScript، مع التركيز على البنية والمكونات القابلة لإعادة الاستخدام وأداء التطبيق." },
  { id: "backend", number: 3, slug: "backend-api-development", displayOrder: 3,
    title: "Backend & API Development", titleArabic: "تطوير Backend وواجهات API",
    description: "Develop backend services and REST APIs with Laravel, including authentication, authorization, business logic and database integrations.",
    descriptionArabic: "تطوير خدمات Backend وواجهات REST API باستخدام Laravel، بما يشمل المصادقة والتفويض ومنطق الأعمال والتكامل مع قواعد البيانات." },
  { id: "enterprise", number: 4, slug: "enterprise-business-systems", displayOrder: 4,
    title: "Enterprise & Business Systems", titleArabic: "أنظمة المؤسسات والأعمال",
    description: "Build internal platforms, government systems, management applications, portals and workflow-based business solutions.",
    descriptionArabic: "بناء المنصات الداخلية والأنظمة الحكومية وتطبيقات الإدارة والبوابات وحلول الأعمال القائمة على سير العمل." },
  { id: "reporting", number: 5, slug: "dashboards-reporting", displayOrder: 5,
    title: "Dashboards & Reporting", titleArabic: "لوحات المعلومات والتقارير",
    description: "Develop dashboards, analytics interfaces, charts, business reports and data-driven monitoring experiences.",
    descriptionArabic: "تطوير لوحات المعلومات وواجهات التحليل والرسوم البيانية وتقارير الأعمال وأدوات المتابعة المبنية على البيانات." },
  { id: "modernization", number: 6, slug: "system-development-modernization", displayOrder: 6,
    title: "System Development & Modernization", titleArabic: "تطوير وتحديث الأنظمة",
    description: "Extend and improve existing applications through new features, refactoring, integrations, architecture improvements and performance optimization.",
    descriptionArabic: "تطوير التطبيقات القائمة بإضافة مزايا جديدة وإعادة تنظيم الكود والتكامل مع الأنظمة الأخرى وتحسين البنية والأداء." },
];

// Only user-supplied employment facts. Optional fields are deliberately absent
// when unknown. Dates are independent: overlaps never change the main chronology.
const entries: ExperienceRecord[] = [
  { id: "riyadh", company: "Riyadh Municipality", companyArabic: "أمانة منطقة الرياض", role: "Frontend Developer", roleArabic: "مطور Frontend", employmentType: "full-time", startDate: "2025-09", isCurrent: true, location: "Riyadh, Saudi Arabia", locationArabic: "الرياض، المملكة العربية السعودية", workMode: "on-site", displayOrder: 1 },
  { id: "jeddah", company: "Jeddah Municipality", companyArabic: "أمانة محافظة جدة", role: "Front End Developer", roleArabic: "مطور الواجهات الأمامية", employmentType: "full-time", startDate: "2024-08", endDate: "2025-09", isCurrent: false, location: "Jeddah, Saudi Arabia", locationArabic: "جدة، المملكة العربية السعودية", workMode: "on-site", associatedOrganization: "Modon Engineering Consulting Office", displayOrder: 2 },
  { id: "haktrak", company: "HakTrak", role: "Full Stack Developer", roleArabic: "مطور Full Stack", employmentType: "full-time", startDate: "2023-09", endDate: "2024-10", isCurrent: false, workMode: "on-site", displayOrder: 3 },
  { id: "manasaty", company: "Manasaty / منصتي", companyArabic: "منصتي / Manasaty", role: "Full Stack Developer", roleArabic: "مطور Full Stack", employmentType: "full-time", startDate: "2022-04", endDate: "2023-12", isCurrent: false, location: "Abu Dhabi, United Arab Emirates", locationArabic: "أبوظبي، الإمارات العربية المتحدة", workMode: "on-site", displayOrder: 4 },
  { id: "oasis", company: "Oasis Computer Systems Co. Ltd.", role: "Full Stack Developer", roleArabic: "مطور Full Stack", employmentType: "full-time", startDate: "2020-08", endDate: "2022-01", isCurrent: false, displayOrder: 5 },
  { id: "afromoney", company: "Afromoney", role: "Full Stack Developer", roleArabic: "مطور Full Stack", employmentType: "full-time", startDate: "2018-11", endDate: "2020-07", isCurrent: false, displayOrder: 6 },
  { id: "clean-basket", company: "Clean Basket", role: "Team Leader", roleArabic: "قائد فريق", employmentType: "part-time", startDate: "2025-01", endDate: "2026-11", isCurrent: false, displayOrder: 1 },
];

export function getServicesContent(locale: Locale): ServicesContent {
  return { identifier: locale === "ar" ? "٠٢ / الخدمات" : "02 / Services", heading: locale === "ar" ? "الخدمات" : "Services",
    introduction: locale === "ar" ? "قدرات هندسية لبناء التطبيقات وربط الأنظمة وتحويل احتياجات الأعمال إلى حلول عملية." : "Engineering capabilities for building applications, connecting systems and turning business requirements into practical software.", services };
}

export function getExperienceContent(locale: Locale): ExperienceContent {
  const labels = locale === "ar" ? {
    identifier: "٠٣ / الخبرات", heading: "الخبرات", introduction: "مسيرة مهنية في تطوير البرمجيات منذ ٢٠١٨.",
    fullTime: "دوام كامل", partTime: "دوام جزئي", current: "المنصب الحالي", present: "حتى الآن", onSite: "حضوري", remote: "عن بُعد", hybrid: "هجين", associated: "بالارتباط مع",
    mainCareer: "المسيرة بدوام كامل", parallelCareer: "خبرة موازية بدوام جزئي", overlapNote: "دور قيادي بدوام جزئي يتزامن مع المسيرة المهنية بدوام كامل.",
  } : {
    identifier: "03 / Experience", heading: "Experience", introduction: "Professional journey since 2018.",
    fullTime: "Full-time", partTime: "Part-time", current: "Current", present: "Present", onSite: "On-site", remote: "Remote", hybrid: "Hybrid", associated: "Associated with",
    mainCareer: "Full-time career", parallelCareer: "Parallel part-time experience", overlapNote: "A part-time leadership role alongside the full-time career.",
  };
  return { ...labels, entries };
}

export function formatCareerMonth(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en", { month: "long", year: "numeric", calendar: "gregory", timeZone: "UTC" }).format(new Date(`${value}-01T00:00:00Z`));
}
