import type { Locale } from "@/lib/i18n";
import { Icon } from "./icon";
import type { GlobalContent } from "@/lib/cms/portfolio";
import { emailDestination, phoneDestination, publicIdentity } from "@/lib/public-identity";

export function Contact({ locale, content }: { locale: Locale; content: GlobalContent }) {
  const { contact } = content;
  const ar = locale === "ar", missing = ar ? "غير متاح حالياً" : "Not configured";
  const linkedin = content.socialLinks.find(link => link.key === "linkedin");
  const methods = [
    { key: "email", label: ar ? "البريد الإلكتروني" : "Email", icon: "mail", href: emailDestination(contact.email), detail: contact.email },
    { key: "phone", label: ar ? "الهاتف" : "Phone", icon: "phone", href: phoneDestination(contact.phone), detail: contact.phone },
    { key: "linkedin", label: "LinkedIn", icon: "linkedin", href: linkedin?.url, detail: linkedin?.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") },
    { key: "github", label: "GitHub", icon: "github", href: publicIdentity.github, detail: "github.com/omeralis" },
    { key: "whatsapp", label: ar ? "واتساب" : "WhatsApp", icon: "whatsapp", href: phoneDestination(contact.whatsapp, true), detail: contact.whatsapp },
  ] as const;
  return <section id="contact" className="contact-section" aria-labelledby="contact-heading">
    <div className="contact-invitation"><p className="eyebrow">{contact.identifier}</p><h2 id="contact-heading">{contact.heading}</h2><p>{contact.introduction}</p><div className="contact-location"><Icon name="pin"/><span>{publicIdentity.location[locale]}</span></div><span className="contact-flourish" aria-hidden="true">&lt;/&gt;</span></div>
    <ul className="contact-methods" aria-label={ar ? "طرق التواصل" : "Contact methods"}>{methods.map(method => <li key={method.key}>{method.href ? <a className="contact-method" data-method={method.key} href={method.href} {...(method.href.startsWith("https:") ? { target: "_blank", rel: "noopener noreferrer" } : {})}><Icon name={method.icon}/><span><strong>{method.label}</strong><bdi dir="ltr">{method.detail}</bdi></span><span className="method-arrow" aria-hidden="true">↗</span></a> : <div className="contact-method is-unconfigured" data-method={method.key} aria-disabled="true"><Icon name={method.icon}/><span><strong>{method.label}</strong><span>{missing}</span></span><span className="method-dash" aria-hidden="true">—</span></div>}</li>)}</ul>
  </section>;
}
