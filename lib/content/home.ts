export interface ArchitectureContent {
  label: string;
  heading: string;
  caption: string;
  layers: { name: string; detail: string }[];
}
export interface HeroContent {
  identity: string;
  headline: string[];
  introduction: string;
  actions: { projects: string; contact: string; resume: string; unavailable: string };
  links: { linkedin?: string; github?: string; resume?: string };
  metrics: { since: string; start: string; based: string; location: string; experience: string };
  architecture: ArchitectureContent;
}
export interface AboutContent {
  identifier: string;
  heading: string;
  paragraphs: string[];
  details: { label: string; value: string }[];
  stackHeading: string;
  primaryLabel: string;
  supportingLabel: string;
  stack: { category: string; primary: string[]; supporting: string[] }[];
}
export interface HomeContent { hero: HeroContent; about: AboutContent }
