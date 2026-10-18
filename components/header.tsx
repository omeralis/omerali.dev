import Link from "next/link";
import { LanguageSwitch, Navigation, ThemeToggle } from "./controls";
import type { Locale } from "@/lib/i18n";
import { Monogram } from "./monogram";
export function Header({ locale, name }: { locale: Locale; name?: string }) { return <header className="site-header"><div className="header-inner"><Link href={`/${locale}`} className="brand" aria-label={`${name || (locale === "ar" ? "الملف المهني" : "Portfolio")} — ${locale === "ar" ? "الرئيسية" : "Home"}`}><Monogram/></Link><Navigation locale={locale}/><div className="header-controls"><ThemeToggle locale={locale}/><LanguageSwitch locale={locale}/></div></div></header>; }
