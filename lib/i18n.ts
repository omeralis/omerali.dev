export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export function isLocale(value: string): value is Locale { return locales.some(locale => locale === value); }
export const messages = {
  "en": {
    "nav": [
      "Home",
      "About",
      "Services",
      "Experience",
      "Projects",
      "Contact"
    ],
    "skip": "Skip to content",
    "theme": "Change color theme",
    "menu": "Navigation"
  },
  "ar": {
    "nav": [
      "الرئيسية",
      "نبذة",
      "الخدمات",
      "الخبرات",
      "مشاريعي",
      "تواصل"
    ],
    "skip": "انتقل إلى المحتوى",
    "theme": "تغيير المظهر",
    "menu": "التنقل"
  }
} as const;
export const sectionIds = ["home", "about", "services", "experience", "projects", "contact"] as const;
