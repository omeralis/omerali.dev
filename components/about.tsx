import type { AboutContent } from "@/lib/content/home";

export function About({ content }: { content: AboutContent }) {
  return <section id="about" className="about-section" aria-labelledby="about-heading">
    <div className="about-heading"><p className="eyebrow">{content.identifier}</p><h2 id="about-heading">{content.heading}</h2></div>
    <div className="about-body">
      <div className="about-overview">
        <div className="about-biography">{content.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
        <dl className="about-details">{content.details.map(detail => <div key={detail.label}><dt>{detail.label}</dt><dd>{detail.value}</dd></div>)}</dl>
      </div>
      <div className="stack-section">
        <h3>{content.stackHeading}</h3>
        <div className="stack-legend"><span><i className="core-key" aria-hidden="true"/>{content.primaryLabel}</span><span>{content.supportingLabel}</span></div>
        <dl className="stack-rows">{content.stack.map(group => <div className="stack-row" key={group.category}>
          <dt>{group.category}</dt>
          <dd><ul>{group.primary.map(name => <li className="technology-tag core" key={name}><bdi dir="ltr">{name}</bdi></li>)}{group.supporting.map(name => <li className="technology-tag" key={name}><bdi dir="ltr">{name}</bdi></li>)}</ul></dd>
        </div>)}</dl>
      </div>
    </div>
  </section>;
}
