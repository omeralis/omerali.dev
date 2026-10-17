
import { notFound } from "next/navigation";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Services } from "@/components/services";
import { CareerLog } from "@/components/career-log";
import { FeaturedProjects } from "@/components/project-showcase";
import { getServicesContent, getExperienceContent } from "@/lib/content/career";
import { getHomeContent } from "@/lib/content/home";
import { isLocale } from "@/lib/i18n";
import { Contact } from "@/components/contact";

export const revalidate = 300;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getHomeContent(locale);

  return <main id="main">
    <Hero content={content.hero} locale={locale}/>
    <About content={content.about}/>
    <Services content={getServicesContent(locale)} locale={locale}/>
    <CareerLog content={getExperienceContent(locale)} locale={locale}/>
    <FeaturedProjects locale={locale}/>
    <Contact locale={locale}/>
  </main>;
}
