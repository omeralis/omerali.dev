import type { ReactNode } from "react";
import type { Block } from "@/lib/cms/project-types";
import { ProjectImage } from "./project-showcase";

export const hasBlocks = (blocks: Block[]): boolean => blocks.some(block => !!block.text || !!block.image || !!block.children && hasBlocks(block.children));
function node(block: Block, index: number): ReactNode {
  const children = block.children?.map(node);
  if (block.type === "text") {
    let value: ReactNode = block.text ?? "";
    if (block.code) value = <code>{value}</code>;
    if (block.bold) value = <strong>{value}</strong>;
    if (block.italic) value = <em>{value}</em>;
    if (block.underline) value = <u>{value}</u>;
    if (block.strikethrough) value = <s>{value}</s>;
    return <span key={index}>{value}</span>;
  }
  switch (block.type) {
    case "heading": {
      const Heading = `h${Math.min(6, Math.max(2, block.level ?? 2))}` as "h2" | "h3" | "h4" | "h5" | "h6";
      return <Heading key={index}>{children}</Heading>;
    }
    case "list": return block.format === "ordered" ? <ol key={index}>{children}</ol> : <ul key={index}>{children}</ul>;
    case "list-item": return <li key={index}>{children}</li>;
    case "quote": return <blockquote key={index}>{children}</blockquote>;
    case "code": return <pre key={index}><code>{children}</code></pre>;
    case "link": return block.url ? <a key={index} href={block.url} rel="noopener noreferrer">{children}</a> : <span key={index}>{children}</span>;
    case "image": return block.image ? <figure key={index}><ProjectImage image={block.image} title={block.image.alternativeText || ""}/></figure> : null;
    default: return <p key={index}>{children}</p>;
  }
}
export function ProjectRichText({ blocks }: { blocks: Block[] }) { return <div className="project-rich-text">{blocks.map(node)}</div>; }
