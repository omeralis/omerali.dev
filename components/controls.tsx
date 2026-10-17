"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { getServerTheme, getThemePreference, setThemePreference, subscribeTheme } from "@/lib/theme";
import { messages, sectionIds, type Locale } from "@/lib/i18n";
export function LanguageSwitch({ locale }: { locale: Locale }) {
 const pathname = usePathname(); const next = locale === "en" ? "ar" : "en";
 const target = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${next}`);
 return <a className="control" href={target} lang={next} hrefLang={next} onClick={event => {
   const alternate = pathname.includes("/projects/") ? document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${next}"]`) : null;
   const localizedTarget = alternate ? new URL(alternate.href).pathname : pathname.includes("/projects/") ? `/${next}/projects` : target;
   event.currentTarget.href = `${localizedTarget}${window.location.search}${window.location.hash}`;
 }}>{next === "ar" ? "العربية" : "English"}</a>;
}
export function ThemeToggle({ locale }: { locale: Locale }) {
 const preference = useSyncExternalStore(subscribeTheme, getThemePreference, getServerTheme);
 return <select className="control theme-toggle" aria-label={messages[locale].theme} value={preference} onChange={event => { const value = event.target.value; if (value === "dark" || value === "light" || value === "system") setThemePreference(value); }}><option value="system">{locale === "ar" ? "النظام" : "System"}</option><option value="dark">{locale === "ar" ? "داكن" : "Dark"}</option><option value="light">{locale === "ar" ? "فاتح" : "Light"}</option></select>;
}
export function Navigation({ locale }: { locale: Locale }) {
 const [open, setOpen] = useState(false);
 return <><button className="control menu-toggle" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>{messages[locale].menu}</button><nav id="main-nav" aria-label={messages[locale].menu} className={open ? "navigation is-open" : "navigation"}>{sectionIds.map((id, index) => <Link key={id} href={`/${locale}#${id}`} onClick={() => setOpen(false)}>{messages[locale].nav[index]}</Link>)}</nav></>;
}
