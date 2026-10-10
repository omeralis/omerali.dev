import type { Locale } from "@/lib/i18n";
import { formatCareerMonth, type ExperienceContent, type ExperienceRecord } from "@/lib/content/career";

function CareerEntry({ entry, labels, locale }: { entry: ExperienceRecord; labels: ExperienceContent; locale: Locale }) {
  return <li className={`career-entry${entry.isCurrent ? " current-entry" : ""}`}>
    <div className="career-period"><time dateTime={entry.startDate}>{formatCareerMonth(entry.startDate, locale)}</time><span aria-hidden="true"> — </span>{entry.isCurrent ? <span>{labels.present}</span> : entry.endDate && <time dateTime={entry.endDate}>{formatCareerMonth(entry.endDate, locale)}</time>}</div>
    <div className="career-position">
      <h4>{locale === "ar" ? entry.roleArabic ?? entry.role : entry.role}</h4>
      <p className="career-company">{locale === "ar" ? entry.companyArabic ?? entry.company : entry.company}</p>
      {entry.associatedOrganization && <p className="career-association">{labels.associated} <bdi>{entry.associatedOrganization}</bdi></p>}
    </div>
    <div className="career-meta">
      <div className="career-badges"><span className="employment-badge">{entry.employmentType === "part-time" ? labels.partTime : labels.fullTime}</span>{entry.isCurrent && <span className="current-badge"><i aria-hidden="true"/>{labels.current}</span>}</div>
      {entry.location && <p>{locale === "ar" ? entry.locationArabic ?? entry.location : entry.location}</p>}
      {entry.workMode && <p>{entry.workMode === "on-site" ? labels.onSite : entry.workMode === "remote" ? labels.remote : labels.hybrid}</p>}
    </div>
  </li>;
}

export function CareerLog({ content, locale }: { content: ExperienceContent; locale: Locale }) {
  const ordered = [...content.entries].sort((a, b) => a.displayOrder - b.displayOrder);
  return <section id="experience" className="career-section" aria-labelledby="experience-heading">
    <div className="career-heading"><p className="eyebrow">{content.identifier}</p><h2 id="experience-heading">{content.heading}</h2></div>
    <div className="career-body">
      <p className="section-introduction">{content.introduction}</p>
      <div className="career-track"><h3>{content.mainCareer}</h3><ol className="career-list">{ordered.filter(entry => entry.employmentType === "full-time").map(entry => <CareerEntry key={entry.id} entry={entry} labels={content} locale={locale}/>)}</ol></div>
      <div className="career-track parallel-track"><h3>{content.parallelCareer}</h3><p className="overlap-note">{content.overlapNote}</p><ol className="career-list">{ordered.filter(entry => entry.employmentType === "part-time").map(entry => <CareerEntry key={entry.id} entry={entry} labels={content} locale={locale}/>)}</ol></div>
    </div>
  </section>;
}
