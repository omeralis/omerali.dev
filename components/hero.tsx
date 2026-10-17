import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { HeroContent } from "@/lib/content/home";
import { formatExperience } from "@/lib/experience";
import { Architecture } from "./architecture";

export function Hero({ content, locale, careerStart }: { content: HeroContent; locale: Locale; careerStart: string }) {
  return <>
    <section id="home" className="hero" aria-labelledby="hero-heading">
      <div className="hero-copy">
        <p className="eyebrow hero-identity">{content.identity}</p>
        <h1 id="hero-heading">{content.headline.map((line, index) => <span key={line} className={index === 1 ? "headline-accent" : undefined}>{line}{index === 0 && " "}</span>)}</h1>
        <p className="hero-intro">{content.introduction}</p>
        <div className="hero-actions">
          <Link className="button primary" href={`/${locale}/projects`}>{content.actions.projects}<span className="arrow" aria-hidden="true">↗</span></Link>
          <a className="button secondary" href="#contact">{content.actions.contact}</a>
        </div>
        <div className="secondary-links">
          {content.links.resume ? <a href={content.links.resume} download>{content.actions.resume} <span aria-hidden="true">↓</span></a> : <span className="unavailable" aria-disabled="true" title={content.actions.unavailable}>{content.actions.resume} <span aria-hidden="true">↓</span></span>}
          {content.links.linkedin && <a href={content.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <span className="arrow" aria-hidden="true">↗</span></a>}
          {content.links.github ? <a href={content.links.github} target="_blank" rel="noopener noreferrer">GitHub <span className="arrow" aria-hidden="true">↗</span></a> : <span className="unavailable" aria-disabled="true" title={content.actions.unavailable}>GitHub</span>}
        </div>
      </div>
      <Architecture content={content.architecture}/>
    </section>
    <dl className="facts">
      <div><dt>{content.metrics.since}</dt><dd><time dateTime={careerStart}>{content.metrics.start}</time></dd></div>
      <div><dt>{content.metrics.based}</dt><dd>{content.metrics.location}</dd></div>
      <div><dt>{content.metrics.experience}</dt><dd><bdi>{formatExperience(locale, `${careerStart}-01`)}</bdi></dd></div>
    </dl>
  </>;
}
