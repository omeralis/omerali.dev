import type { ArchitectureContent } from "@/lib/content/home";

export function Architecture({ content }: { content: ArchitectureContent }) {
  return <figure className="architecture">
    <figcaption><span className="eyebrow">{content.label}</span><h2>{content.heading}</h2></figcaption>
    <ol className="system-layers">{content.layers.map((layer, index) => <li key={layer.name}>
      <span className="layer-index" aria-hidden="true">0{index + 1}</span>
      <span className="layer-content"><span className="layer-name">{layer.name}</span><span className="layer-detail">{layer.detail}</span></span>
      <span className="layer-symbol" aria-hidden="true">{["◇", "↔", "{ }", "▤", "↗"][index]}</span>
    </li>)}</ol>
    <p className="system-caption"><span aria-hidden="true" className="status-dot"/>{content.caption}</p>
  </figure>;
}
