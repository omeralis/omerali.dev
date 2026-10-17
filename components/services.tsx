import type { Locale } from "@/lib/i18n";
import type { ServicesContent } from "@/lib/content/career";
import { Icon } from "./icon";

export function Services({ content, locale }: { content: ServicesContent; locale: Locale }) {
  return <section id="services" className="career-section" aria-labelledby="services-heading">
    <div className="career-heading"><p className="eyebrow">{content.identifier}</p><h2 id="services-heading">{content.heading}</h2></div>
    <div className="career-body">
      <p className="section-introduction">{content.introduction}</p>
      <ol className="capability-list">{[...content.services].sort((a, b) => a.displayOrder - b.displayOrder).map(service => <li key={service.id} className="capability-row">
        <span className="capability-number" aria-hidden="true"><Icon name={(["code", "layers", "link", "shield", "database", "globe"] as const)[(service.number - 1) % 6]}/><span>{new Intl.NumberFormat(locale, { minimumIntegerDigits: 2 }).format(service.number)}</span></span>
        <h3>{locale === "ar" ? service.titleArabic : service.title}</h3>
        <p>{locale === "ar" ? service.descriptionArabic : service.description}</p>
      </li>)}</ol>
    </div>
  </section>;
}
