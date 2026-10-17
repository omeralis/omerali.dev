import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { isLocale, locales, messages } from "@/lib/i18n";
import { siteOrigin } from "@/lib/cms/urls";
import { themeScript } from "@/lib/theme";
import "../globals.css";
export function generateStaticParams() { return locales.map(locale => ({ locale })); }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
 const { locale } = await params; if (!isLocale(locale)) return {};
 return { title: { default: `${messages[locale].name} | ${messages[locale].title}`, template: `%s | ${messages[locale].name}` }, description: messages[locale].intro, metadataBase: new URL(siteOrigin()), alternates: { canonical: `${siteOrigin()}/${locale}`, languages: { en: "/en", ar: "/ar" } } };
}
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
 const { locale } = await params; if (!isLocale(locale)) notFound();
 return <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} data-theme="dark" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }}/></head><body><a href="#main" className="skip-link">{messages[locale].skip}</a><Header locale={locale}/>{children}<footer className="site-footer"><span>{messages[locale].name}</span><span>{messages[locale].title}</span></footer></body></html>;
}
