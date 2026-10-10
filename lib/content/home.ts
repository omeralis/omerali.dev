import type { Locale } from "@/lib/i18n";

export interface ArchitectureContent {
  label: string;
  heading: string;
  caption: string;
  layers: { name: string; detail: string }[];
}
export interface HeroContent {
  identity: string;
  headline: string[];
  introduction: string;
  actions: { projects: string; contact: string; resume: string; unavailable: string };
  links: { linkedin: string; github?: string; resume?: string };
  metrics: { since: string; start: string; based: string; location: string; experience: string };
  architecture: ArchitectureContent;
}
export interface AboutContent {
  identifier: string;
  heading: string;
  paragraphs: string[];
  details: { label: string; value: string }[];
  stackHeading: string;
  primaryLabel: string;
  supportingLabel: string;
  stack: { category: string; primary: string[]; supporting: string[] }[];
}
export interface HomeContent { hero: HeroContent; about: AboutContent }

// Temporary verified editorial content. Components accept these contracts so a
// future server-side CMS adapter can replace this source without changing views.
const content: Record<Locale, HomeContent> = {
  en: {
    hero: {
      identity: "Omer Ali / Software Engineer / Full Stack Developer",
      headline: ["Engineering software that", "moves business forward."],
      introduction: "Software Engineer specializing in scalable web applications, enterprise platforms and business systems, with professional development experience since 2018.",
      actions: { projects: "View My Projects", contact: "Contact Me", resume: "Download CV", unavailable: "Available when published" },
      links: { linkedin: "https://www.linkedin.com/in/omeraliabdallh" },
      metrics: { since: "Professional Since", start: "November 2018", based: "Based In", location: "Saudi Arabia", experience: "Professional Experience" },
      architecture: {
        label: "System / 01", heading: "A complete system. Every layer considered.", caption: "From interface to infrastructure",
        layers: [{ name: "Frontend", detail: "Interfaces & interactions" }, { name: "API", detail: "Connections & contracts" }, { name: "Backend", detail: "Business logic & workflows" }, { name: "Database", detail: "Structured application data" }, { name: "Deployment", detail: "Delivering the application" }],
      },
    },
    about: {
      identifier: "01 / About", heading: "About",
      paragraphs: [
        "I’m Omer Ali, a Software Engineer and Full Stack Developer. Since November 2018, my work has spanned frontend engineering, full-stack development, enterprise applications, government systems and business platforms.",
        "I translate complex business requirements into practical, maintainable software. My experience includes frontend architecture, API integrations, authentication, authorization and role-based access control — the foundations that help complete systems work together.",
        "That work extends to dashboards, reporting, workflows, interactive maps and document management. Localization and Arabic / English applications are part of how I approach software that serves its users.",
      ],
      details: [{ label: "Role", value: "Software Engineer / Full Stack Developer" }, { label: "Focus", value: "Enterprise & Business Applications" }, { label: "Application Languages", value: "Arabic / English" }],
      stackHeading: "The stack behind the systems", primaryLabel: "Core development stack", supportingLabel: "Supporting technologies",
      stack: [
        { category: "Frontend", primary: ["Angular", "React", "Next.js", "TypeScript", "JavaScript"], supporting: ["HTML5", "CSS3", "SCSS", "Bootstrap"] },
        { category: "Backend", primary: ["Laravel"], supporting: ["REST APIs"] },
        { category: "Database", primary: [], supporting: ["SQL Server", "MySQL"] },
        { category: "Tools", primary: [], supporting: ["Git"] },
      ],
    },
  },
  ar: {
    hero: {
      identity: "عمر علي / مهندس برمجيات / مطور Full Stack",
      headline: ["أطوّر برمجيات", "تدفع الأعمال إلى الأمام."],
      introduction: "مهندس برمجيات متخصص في تطبيقات الويب القابلة للتوسع والمنصات المؤسسية وأنظمة الأعمال، بخبرة مهنية في تطوير البرمجيات بدأت عام ٢٠١٨.",
      actions: { projects: "استعرض مشاريعي", contact: "تواصل معي", resume: "تحميل السيرة الذاتية", unavailable: "متاح عند النشر" },
      links: { linkedin: "https://www.linkedin.com/in/omeraliabdallh" },
      metrics: { since: "بداية المسيرة المهنية", start: "نوفمبر ٢٠١٨", based: "الموقع", location: "المملكة العربية السعودية", experience: "الخبرة المهنية" },
      architecture: {
        label: "النظام / ٠١", heading: "نظام متكامل. عناية بكل طبقة.", caption: "من واجهة المستخدم إلى البنية التحتية",
        layers: [{ name: "الواجهة", detail: "واجهات المستخدم والتفاعل" }, { name: "واجهة برمجة التطبيقات", detail: "الربط وعقود الاتصال" }, { name: "الخلفية", detail: "منطق الأعمال وسير العمل" }, { name: "قاعدة البيانات", detail: "تنظيم بيانات التطبيق" }, { name: "النشر", detail: "إتاحة التطبيق للاستخدام" }],
      },
    },
    about: {
      identifier: "٠١ / نبذة", heading: "نبذة",
      paragraphs: [
        "أنا عمر علي، مهندس برمجيات ومطور Full Stack. بدأت مسيرتي المهنية في نوفمبر ٢٠١٨، وعملت في تطوير الواجهات والتطبيقات المتكاملة، بما يشمل التطبيقات المؤسسية والأنظمة الحكومية ومنصات الأعمال.",
        "أركز على تحويل متطلبات الأعمال المعقدة إلى حلول عملية يسهل صيانتها وتطويرها. وتشمل خبرتي تصميم بنية الواجهات، وتكامل واجهات برمجة التطبيقات، والمصادقة والتفويض، وإدارة صلاحيات الوصول وفق الأدوار، لربط أجزاء النظام بصورة متكاملة.",
        "يمتد عملي إلى لوحات المعلومات والتقارير وسير العمل والخرائط التفاعلية وإدارة المستندات. وأولي اهتمامًا للتوطين وبناء التطبيقات باللغتين العربية والإنجليزية، بما يلائم احتياجات مستخدميها.",
      ],
      details: [{ label: "التخصص", value: "مهندس برمجيات / مطور Full Stack" }, { label: "مجال التركيز", value: "التطبيقات المؤسسية وأنظمة الأعمال" }, { label: "لغات التطبيقات", value: "العربية / الإنجليزية" }],
      stackHeading: "التقنيات التي أبني بها الأنظمة", primaryLabel: "تقنيات التطوير الأساسية", supportingLabel: "التقنيات المساندة",
      stack: [
        { category: "الواجهات", primary: ["Angular", "React", "Next.js", "TypeScript", "JavaScript"], supporting: ["HTML5", "CSS3", "SCSS", "Bootstrap"] },
        { category: "الخلفية", primary: ["Laravel"], supporting: ["REST APIs"] },
        { category: "قواعد البيانات", primary: [], supporting: ["SQL Server", "MySQL"] },
        { category: "الأدوات", primary: [], supporting: ["Git"] },
      ],
    },
  },
};

export function getHomeContent(locale: Locale): HomeContent { return content[locale]; }
