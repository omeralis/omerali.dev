import type { Locale } from "@/lib/i18n";
import { Icon } from "./icon";
import type { GlobalContent } from "@/lib/cms/portfolio";

export function Contact({ locale, content }: { locale: Locale; content: GlobalContent }) {
  const contact = content.contact, primary = content.socialLinks.find(link => link.key === "linkedin");
  return <section id="contact" className="contact-section" aria-labelledby="contact-heading">
    <div><p className="eyebrow">{contact.identifier}</p><h2 id="contact-heading">{contact.heading}</h2><p>{contact.introduction}</p>{primary && <a className="button primary" href={primary.url} target="_blank" rel="noopener noreferrer">{contact.action}<Icon name="arrow" className="arrow"/></a>}{content.socialLinks.filter(link => link.key !== "linkedin").map(link => <a key={link.url} className="text-link" href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>)}{contact.email && <a className="text-link" href={`mailto:${contact.email}`}>{contact.email}</a>}{contact.location && <p>{contact.location}</p>}</div>
    <div className="contact-visual" aria-hidden="true"><Icon name="terminal"/><span>hello, world<span className="code-cursor">_</span></span><span lang={locale}>{contact.caption}</span></div>
  </section>;
}
