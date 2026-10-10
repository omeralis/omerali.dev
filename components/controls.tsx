"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { messages, sectionIds, type Locale } from "@/lib/i18n";
export function LanguageSwitch({ locale }: { locale: Locale }) {
 const pathname = usePathname(); const next = locale === "en" ? "ar" : "en";
 const target = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${next}`);
 return <a className="control" href={target} lang={next} hrefLang={next} onClick={event => {
   const alternate = pathname.includes("/projects/") ? document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${next}"]`) : null;
   const localizedTarget = alternate ? new URL(alternate.href).pathname : target;
   event.currentTarget.href = `${localizedTarget}${window.location.search}${window.location.hash}`;
 }}>{next === "ar" ? "العربية" : "English"}</a>;
}
export function ThemeToggle({ locale }: { locale: Locale }) {
 return <button className="control theme-toggle" aria-label={messages[locale].theme} onClick={() => { const next = document.documentElement.dataset.theme === "light" ? "dark" : "light"; document.documentElement.dataset.theme = next; try { localStorage.setItem("theme", next); } catch { /* Storage is optional. */ } }}><span aria-hidden="true">◐</span></button>;
}
export function Navigation({ locale }: { locale: Locale }) {
 const [open, setOpen] = useState(false);
 return <><button className="control menu-toggle" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>{messages[locale].menu}</button><nav id="main-nav" aria-label={messages[locale].menu} className={open ? "navigation is-open" : "navigation"}>{sectionIds.map((id, index) => <Link key={id} href={`/${locale}#${id}`} onClick={() => setOpen(false)}>{messages[locale].nav[index]}</Link>)}</nav></>;
}
