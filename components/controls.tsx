"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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
 const [section, setSection] = useState("home");
 const pathname = usePathname(), toggle = useRef<HTMLButtonElement>(null);
 const isProject = pathname.includes("/projects");
 useEffect(() => {
   let frame = 0;
   const update = () => {
     const sections = sectionIds.map(id => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
     const active = [...sections].reverse().find(el => el.getBoundingClientRect().top <= 160);
     const atEnd = window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
     setSection(atEnd ? sections.at(-1)?.id || "home" : active?.id || "home");
   };
   const scroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
   scroll(); window.addEventListener("scroll", scroll, { passive: true }); window.addEventListener("resize", scroll);
   return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", scroll); window.removeEventListener("resize", scroll); };
 }, [pathname]);
 useEffect(() => {
   if (!open) return;
   const close = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); } };
   const outside = (event: PointerEvent) => { if (event.target instanceof Element && !event.target.closest(".navigation,.menu-toggle")) setOpen(false); };
   document.addEventListener("keydown", close); document.addEventListener("pointerdown", outside);
   return () => { document.removeEventListener("keydown", close); document.removeEventListener("pointerdown", outside); };
 }, [open]);
 return <><button ref={toggle} className="control menu-toggle" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(value => !value)}><span aria-hidden="true">{open ? "×" : "☰"}</span><span className="sr-only">{messages[locale].menu}</span></button><nav id="main-nav" aria-label={messages[locale].menu} className={open ? "navigation is-open" : "navigation"}>{sectionIds.map((id, index) => <Link key={id} href={`/${locale}#${id}`} aria-current={(isProject ? id === "projects" : section === id) ? "location" : undefined} onClick={() => setOpen(false)}>{messages[locale].nav[index]}</Link>)}</nav></>;
}
