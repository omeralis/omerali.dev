import type { Locale } from "@/lib/i18n";
import { Icon } from "./icon";

export function Contact({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  return <section id="contact" className="contact-section" aria-labelledby="contact-heading">
    <div><p className="eyebrow">{ar ? "٠٥ / تواصل" : "05 / Contact"}</p><h2 id="contact-heading">{ar ? "لنتحدث عن مشروعك القادم." : "Let’s build what’s next."}</h2><p>{ar ? "للتواصل حول تطوير تطبيقات الويب والمنصات المؤسسية وأنظمة الأعمال، تواصل معي عبر LinkedIn." : "Have a web application, enterprise platform or business system in mind? Connect with me on LinkedIn."}</p><a className="button primary" href="https://www.linkedin.com/in/omeraliabdallh" target="_blank" rel="noopener noreferrer">{ar ? "تواصل عبر LinkedIn" : "Connect on LinkedIn"}<Icon name="arrow" className="arrow"/></a></div>
    <div className="contact-visual" aria-hidden="true"><Icon name="terminal"/><span>hello, world<span className="code-cursor">_</span></span><span>{ar ? "من الفكرة إلى التطبيق" : "From idea to implementation"}</span></div>
  </section>;
}
