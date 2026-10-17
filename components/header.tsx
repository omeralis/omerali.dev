import Link from "next/link";
import { LanguageSwitch, Navigation, ThemeToggle } from "./controls";
import type { Locale } from "@/lib/i18n";
export function Header({ locale, name }: { locale: Locale; name?: string }) { return <header className="site-header"><Link href={`/${locale}`} className="brand" aria-label={`${name || (locale === "ar" ? "الملف المهني" : "Portfolio")} — ${locale === "ar" ? "الرئيسية" : "Home"}`}><span className="brand-mark" aria-hidden="true">oa<span>.</span></span>{name && <span className="brand-name">{name}</span>}</Link><Navigation locale={locale}/><div className="header-controls"><LanguageSwitch locale={locale}/><ThemeToggle locale={locale}/></div></header>; }
