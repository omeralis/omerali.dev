import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Services } from "@/components/services";
import { CareerLog } from "@/components/career-log";
import { getServicesContent, getExperienceContent } from "@/lib/content/career";
import { getHomeContent } from "@/lib/content/home";
import { isLocale, messages, sectionIds } from "@/lib/i18n";

export const revalidate = 86400;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = messages[locale];
  const content = getHomeContent(locale);

  return <main id="main">
    <Hero content={content.hero} locale={locale}/>
    <About content={content.about}/>
    <Services content={getServicesContent(locale)} locale={locale}/>
    <CareerLog content={getExperienceContent(locale)} locale={locale}/>
    {sectionIds.slice(4).map((id, index) => <section key={id} id={id} className="section-shell">
      <p className="eyebrow">0{index + 4} / {t.nav[index + 4]}</p>
      <div>
        <h2>{t.nav[index + 4]}</h2><p>{t.pending}</p>
        {id === "projects" && <Link className="text-link" href={`/${locale}/projects`}>{t.projects} <span className="arrow" aria-hidden="true">↗</span></Link>}
        {id === "contact" && <a className="text-link" href="https://www.linkedin.com/in/omeraliabdallh">LinkedIn <span className="arrow" aria-hidden="true">↗</span></a>}
      </div>
    </section>)}
  </main>;
}
