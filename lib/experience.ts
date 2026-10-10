import type { Locale } from "./i18n";

export const careerStart = "2018-11-01";

/** Completed years at the month boundary; career start is known to month precision. */
export function experienceYears(start: string = careerStart, now: Date = new Date()): number {
  const date = new Date(`${start}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || !Number.isFinite(now.getTime())) {
    throw new RangeError("Experience dates must be valid");
  }
  const months = (now.getUTCFullYear() - date.getUTCFullYear()) * 12
    + now.getUTCMonth() - date.getUTCMonth();
  return Math.max(0, Math.floor(months / 12));
}

export function formatExperience(locale: Locale, start = careerStart, now = new Date()): string {
  const years = new Intl.NumberFormat(locale).format(experienceYears(start, now));
  return locale === "ar" ? `${years}+ سنوات` : `${years}+ Years`;
}
