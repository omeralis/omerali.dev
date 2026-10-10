import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { isLocale, locales, messages } from "@/lib/i18n";
import "../globals.css";
export function generateStaticParams() { return locales.map(locale => ({ locale })); }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
 const { locale } = await params; if (!isLocale(locale)) return {};
 return { title: { default: `${messages[locale].name} | ${messages[locale].title}`, template: `%s | ${messages[locale].name}` }, description: messages[locale].intro, ...(process.env.SITE_URL ? { metadataBase: new URL(process.env.SITE_URL), alternates: { languages: { en: "/en", ar: "/ar" } } } : {}) };
}
const themeScript = `(function(){var t='dark';try{var s=localStorage.getItem('theme');if(s==='light'||s==='dark')t=s;}catch(e){}document.documentElement.dataset.theme=t;})();`;
export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
 const { locale } = await params; if (!isLocale(locale)) notFound();
 return <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} data-theme="dark" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }}/></head><body><a href="#main" className="skip-link">{messages[locale].skip}</a><Header locale={locale}/>{children}<footer className="site-footer"><span>{messages[locale].name}</span><span>{messages[locale].title}</span></footer></body></html>;
}
