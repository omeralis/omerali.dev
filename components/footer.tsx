import Link from "next/link";
import { messages, sectionIds, type Locale } from "@/lib/i18n";
import { Monogram } from "./monogram";
import { publicIdentity } from "@/lib/public-identity";
import type { GlobalContent } from "@/lib/cms/portfolio";

export function Footer({ locale, profile }: { locale: Locale; profile: GlobalContent | null }) {
  return <footer className="site-footer"><div className="footer-top"><Link href={`/${locale}`} className="brand" aria-label={profile?.name || "Portfolio"}><Monogram/></Link><nav aria-label={locale === "ar" ? "روابط التذييل" : "Footer navigation"}>{sectionIds.map((id, i) => <Link key={id} href={`/${locale}#${id}`}>{messages[locale].nav[i]}</Link>)}</nav><a className="footer-github" href={publicIdentity.github} target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a></div><div className="footer-bottom"><span>{profile?.name}</span><span>{profile?.title}</span><span>{publicIdentity.location[locale]}</span></div></footer>;
}
