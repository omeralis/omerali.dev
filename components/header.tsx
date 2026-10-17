import Link from "next/link";
import { LanguageSwitch, Navigation, ThemeToggle } from "./controls";
import type { Locale } from "@/lib/i18n";
export function Header({ locale }: { locale: Locale }) { return <header className="site-header"><Link href={`/${locale}`} className="brand" aria-label={locale === "ar" ? "عمر علي — الرئيسية" : "Omer Ali — Home"}><span className="brand-mark" aria-hidden="true">oa<span>.</span></span><span className="brand-name">{locale === "ar" ? "عمر علي" : "Omer Ali"}</span></Link><Navigation locale={locale}/><div className="header-controls"><LanguageSwitch locale={locale}/><ThemeToggle locale={locale}/></div></header>; }
