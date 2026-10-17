import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { isLocale, locales, messages } from "@/lib/i18n";
import { siteOrigin } from "@/lib/cms/urls";
import { themeScript } from "@/lib/theme";
import { getGlobal } from "@/lib/cms/portfolio";
import "../globals.css";
export function generateStaticParams() { return locales.map(locale => ({ locale })); }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
 const { locale } = await params; if (!isLocale(locale)) return {};
 const result = await getGlobal(locale), profile = result.ok ? result.value : null;
 const name = profile?.name || (locale === "ar" ? "الملف المهني" : "Portfolio");
 return { title: { default: profile ? `${name} | ${profile.title}` : name, template: `%s | ${name}` }, description: profile?.description, metadataBase: new URL(siteOrigin()), alternates: { canonical: `${siteOrigin()}/${locale}`, languages: { en: "/en", ar: "/ar" } } };
}
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
 const { locale } = await params; if (!isLocale(locale)) notFound();
 const result = await getGlobal(locale), profile = result.ok ? result.value : null;
 return <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} data-theme="dark" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }}/></head><body><a href="#main" className="skip-link">{messages[locale].skip}</a><Header locale={locale} name={profile?.name}/>{children}<footer className="site-footer"><span>{profile?.name}</span><span>{profile?.title}</span></footer></body></html>;
}
