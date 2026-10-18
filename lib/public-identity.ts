// Public identity explicitly confirmed in the approved redesign brief.
// CMS professional copy and all other contact destinations remain authoritative.
export const publicIdentity = {
  github: "https://github.com/omeralis",
  location: { en: "Riyadh, Saudi Arabia", ar: "الرياض، المملكة العربية السعودية" },
} as const;

export function emailDestination(value?: string): string | undefined {
  const email = value?.trim();
  return email && /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(email) && !/[?&#%]/.test(email) ? `mailto:${email}` : undefined;
}

export function phoneDestination(value?: string, whatsapp = false): string | undefined {
  const phone = value?.trim();
  // Require an international number; never guess a country code or allow URI parameters.
  if (!phone || !/^\+[1-9][\d ()-]{6,20}$/.test(phone)) return undefined;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return undefined;
  return whatsapp ? `https://wa.me/${digits}` : `tel:+${digits}`;
}
