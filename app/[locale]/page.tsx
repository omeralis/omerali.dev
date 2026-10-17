
import { notFound } from "next/navigation";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Services } from "@/components/services";
import { CareerLog } from "@/components/career-log";
import { FeaturedProjects } from "@/components/project-showcase";
import { getGlobal, getAbout, getServices, getExperiences } from "@/lib/cms/portfolio";
import { isLocale } from "@/lib/i18n";
import { Contact } from "@/components/contact";

export const revalidate = 300;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const [profile, about, services, experience] = await Promise.all([getGlobal(locale), getAbout(locale), getServices(locale), getExperiences(locale)]);
  const unavailable = locale === "ar" ? "المحتوى غير متاح حاليًا. يرجى المحاولة لاحقًا." : "Content is currently unavailable. Please try again later.";
  const empty = locale === "ar" ? "لا يوجد محتوى منشور حاليًا." : "No content is currently published.";
  const state = (id: string, message = unavailable) => <section id={id} className="projects-section"><p className="project-state" role="status">{message}</p></section>;

  return <main id="main">
    {profile.ok ? <Hero content={profile.value.hero} careerStart={profile.value.careerStart} locale={locale}/> : state("home")}
    {about.ok ? <About content={about.value}/> : state("about")}
    {services.ok ? services.value.services.length ? <Services content={{ ...services.value, introduction: profile.ok ? profile.value.servicesIntroduction || "" : "" }} locale={locale}/> : state("services", empty) : state("services")}
    {experience.ok ? experience.value.entries.length ? <CareerLog content={{ ...experience.value, introduction: profile.ok ? profile.value.experienceIntroduction || "" : "" }} locale={locale}/> : state("experience", empty) : state("experience")}
    <FeaturedProjects locale={locale}/>
    {profile.ok ? <Contact locale={locale} content={profile.value}/> : state("contact")}
  </main>;
}
