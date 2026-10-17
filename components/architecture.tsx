import type { ArchitectureContent } from "@/lib/content/home";
import { Icon } from "./icon";

export function Architecture({ content }: { content: ArchitectureContent }) {
  return <figure className="architecture">
    <div className="terminal-bar" aria-hidden="true"><span className="terminal-dots"><i/><i/><i/></span><span>architecture.ts</span><Icon name="code"/></div>
    <figcaption><span className="eyebrow">{content.label}</span><h2>{content.heading}</h2></figcaption>
    <ol className="system-layers">{content.layers.map((layer, index) => <li key={layer.name}>
      <span className="layer-index" aria-hidden="true">0{index + 1}</span>
      <span className="layer-content"><span className="layer-name">{layer.name}</span><span className="layer-detail">{layer.detail}</span></span>
      <Icon className="layer-symbol" name={(["code", "link", "layers", "database", "globe"] as const)[index % 5]}/>
    </li>)}</ol>
    <p className="system-caption"><span aria-hidden="true" className="status-dot"/>{content.caption}</p>
  </figure>;
}
