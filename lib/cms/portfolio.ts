import "server-only";
import { cache } from "react";
import type { Locale } from "@/lib/i18n";
import type { HeroContent, AboutContent } from "@/lib/content/home";
import { getServicesContent, getExperienceContent, type ServiceRecord, type ExperienceRecord } from "@/lib/content/career";
import { getContent, type ContentResult } from "./client";
import { publicUrl, mediaUrl } from "./urls";

type Row = Record<string, unknown>;
function object(value: unknown): Row { if (!value || typeof value !== "object" || Array.isArray(value)) throw Error("Invalid CMS object"); return value as Row; }
function list(value: unknown): unknown[] { if (!Array.isArray(value)) throw Error("Invalid CMS list"); return value; }
function text(value: unknown): string { if (typeof value !== "string" || !value.trim()) throw Error("Missing CMS text"); return value; }
function optional(value: unknown): string | undefined { return typeof value === "string" && value.trim() ? value : undefined; }
function published(value: unknown, locale: Locale): Row { const row = object(value); text(row.documentId); if (row.locale !== locale || !row.publishedAt || row.enabled !== true) throw Error("Unpublished or mismatched content"); return row; }
function strings(value: unknown, fields: string[]): Record<string, string> { const row = object(value); return Object.fromEntries(fields.map(key => [key, text(row[key])])); }
function order(a: Row, b: Row): number { return Number(a.displayOrder || 0) - Number(b.displayOrder || 0) || String(a.documentId).localeCompare(String(b.documentId)); }
export interface GlobalContent { documentId: string; name: string; title: string; description: string; careerStart: string; hero: HeroContent; contact: { identifier: string; heading: string; introduction: string; action: string; caption: string; email?: string; location?: string }; socialLinks: { key: string; label: string; url: string }[]; servicesIntroduction?: string; experienceIntroduction?: string }
export function parseGlobal(value: unknown, locale: Locale): GlobalContent {
  const row = published(value, locale), hero = object(row.hero), architecture = object(hero.architecture);
  const careerStart = text(row.careerStart); if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(careerStart)) throw Error("Invalid career month");
  const socialLinks = list(row.socialLinks).map(object).filter(r => r.enabled === true).sort(order).flatMap(r => { const url = publicUrl(r.url); return url ? [{ key: text(r.key), label: text(r.label), url }] : []; });
  const resume = row.resume ? mediaUrl(object(row.resume).url) : undefined;
  const contact = strings(row.contact, ["identifier", "heading", "introduction", "action", "caption"]) as GlobalContent["contact"];
  const rawContact = object(row.contact); contact.email = optional(rawContact.email); contact.location = optional(rawContact.location);
  return { documentId: text(row.documentId), name: text(row.siteName), title: text(row.professionalTitle), description: text(row.siteDescription), careerStart, socialLinks, contact, servicesIntroduction: optional(row.servicesIntroduction), experienceIntroduction: optional(row.experienceIntroduction), hero: { identity: text(hero.identity), headline: list(hero.headline).map(r => text(object(r).value)), introduction: text(hero.introduction), actions: strings(hero.actions, ["projects", "contact", "resume", "unavailable"]) as HeroContent["actions"], metrics: strings(hero.metrics, ["since", "start", "based", "location", "experience"]) as HeroContent["metrics"], architecture: { label: text(architecture.label), heading: text(architecture.heading), caption: text(architecture.caption), layers: list(architecture.layers).map(r => ({ name: text(object(r).name), detail: text(object(r).detail) })) }, links: { linkedin: socialLinks.find(l => l.key === "linkedin")?.url, github: socialLinks.find(l => l.key === "github")?.url, resume } } };
}
export function parseAbout(value: unknown, locale: Locale): AboutContent {
  const row = published(value, locale);
  return { identifier: text(row.identifier), heading: text(row.title), paragraphs: list(row.paragraphs).map(r => text(object(r).value)), details: list(row.details).map(r => ({ label: text(object(r).label), value: text(object(r).value) })), stackHeading: text(row.stackHeading), primaryLabel: text(row.primaryLabel), supportingLabel: text(row.supportingLabel), stack: list(row.stack).map(r => {
    const group = object(r), items = list(group.items).map(object);
    return { category: text(group.category), primary: items.filter(i => i.primary === true).map(i => text(object(i.technology).name)), supporting: items.filter(i => i.primary !== true).map(i => text(object(i.technology).name)) };
  }) };
}
export function parseServices(value: unknown, locale: Locale): ServiceRecord[] {
  return list(value).map(r => published(r, locale)).sort(order).map(row => ({ id: text(row.documentId), slug: text(row.slug), title: text(row.title), titleArabic: text(row.title), description: text(row.description), descriptionArabic: text(row.description), number: Number(row.number), displayOrder: Number(row.displayOrder) }));
}
export function parseExperiences(value: unknown, locale: Locale): ExperienceRecord[] {
  return list(value).map(r => published(r, locale)).sort(order).map(row => {
    const month = (value: unknown) => { const result = text(value); if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(result)) throw Error("Invalid experience month"); return result; };
    if (!["full-time", "part-time"].includes(String(row.employmentType)) || typeof row.isCurrent !== "boolean") throw Error("Invalid employment type");
    return { id: text(row.documentId), company: text(row.company), role: text(row.role), employmentType: row.employmentType as ExperienceRecord["employmentType"], startDate: month(row.startDate), endDate: row.endDate ? month(row.endDate) : undefined, isCurrent: row.isCurrent, location: optional(row.location), workMode: ["on-site", "remote", "hybrid"].includes(String(row.workMode)) ? row.workMode as ExperienceRecord["workMode"] : undefined, associatedOrganization: optional(row.associatedOrganization), displayOrder: Number(row.displayOrder) };
  });
}
type Result<T> = { ok: true; value: T } | { ok: false };
function parse<T>(response: ContentResult, locale: Locale, parser: (value: unknown, locale: Locale) => T): Result<T> { if (!response.ok) return { ok: false }; try { return { ok: true, value: parser(response.value, locale) }; } catch { return { ok: false }; } }
export const getGlobal = cache(async (locale: Locale) => parse(await getContent("global", locale, { "populate[hero][populate][headline]": "true", "populate[hero][populate][actions]": "true", "populate[hero][populate][metrics]": "true", "populate[hero][populate][architecture][populate][layers]": "true", "populate[contact]": "true", "populate[socialLinks]": "true", "populate[resume]": "true" }), locale, parseGlobal));
export const getAbout = cache(async (locale: Locale) => parse(await getContent("about", locale, { "populate[paragraphs]": "true", "populate[details]": "true", "populate[stack][populate][items][populate][technology]": "true" }), locale, parseAbout));
const collectionQuery = { "pagination[pageSize]": "100", "sort[0]": "displayOrder:asc", "sort[1]": "documentId:asc" };
export const getServices = cache(async (locale: Locale) => { const result = parse(await getContent("services", locale, collectionQuery), locale, parseServices); return result.ok ? { ok: true as const, value: getServicesContent(locale, result.value) } : result; });
export const getExperiences = cache(async (locale: Locale) => { const result = parse(await getContent("experiences", locale, collectionQuery), locale, parseExperiences); return result.ok ? { ok: true as const, value: getExperienceContent(locale, result.value) } : result; });
