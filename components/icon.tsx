const paths = {
  mail: "M3 5h18v14H3Zm0 0 9 8 9-8",
  phone: "M8 3H4c-3 10 7 20 17 17v-4l-5-2-2 2a13 13 0 0 1-6-6l2-2Z",
  pin: "M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  github: "M9 19c-4 1-4-2-6-2m12 5v-4c0-1-1-2-1-2 4 0 7-2 7-6 0-2-1-3-1-3 0-1 0-3-1-4-2 0-3 1-3 1a14 14 0 0 0-8 0S6 3 5 3c-1 1-1 3-1 4 0 0-1 1-1 3 0 4 3 6 7 6 0 0-1 1-1 2v4",
  linkedin: "M4 9v12M4 3v1m5 17V9h5v2c4-4 7-1 7 3v7m-7 0v-7",
  whatsapp: "M21 11a9 9 0 0 1-14 8l-5 2 2-5A9 9 0 1 1 21 11ZM8 7c0 4 2 6 6 7l2-2-3-1-1 1-2-2 1-1-1-2Z",
  code: "m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16",
  layers: "m12 3 10 5-10 5L2 8Zm-10 9 10 5 10-5M2 16l10 5 10-5",
  database: "M21 6c0 2-4 3-9 3S3 8 3 6s4-3 9-3 9 1 9 3ZM3 6v12c0 2 4 3 9 3s9-1 9-3V6M3 12c0 2 4 3 9 3s9-1 9-3",
  link: "M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2m3 6a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2",
  globe: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z",
  shield: "m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Zm-4 9 3 3 5-6",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  terminal: "m5 7 5 5-5 5m8 0h6",
  briefcase: "M8 7V4h8v3M3 7h18v14H3ZM3 12l9 3 9-3M12 12v5",
} as const;
export function Icon({ name, className = "" }: { name: keyof typeof paths; className?: string }) {
  return <svg className={`icon ${className}`} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]}/></svg>;
}
