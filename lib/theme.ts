export type ThemePreference = "system" | "dark" | "light";

// Runs in <head> before paint; keep storage optional for private browsing.
export const themeScript = `(function(){var p='system';try{var s=localStorage.getItem('theme');if(s==='light'||s==='dark')p=s;}catch(e){}document.documentElement.dataset.theme=p==='system'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):p;})();`;

let memoryPreference: ThemePreference | undefined;
export function getThemePreference(): ThemePreference {
  if (memoryPreference) return memoryPreference;
  try { const stored = localStorage.getItem("theme"); return stored === "dark" || stored === "light" ? stored : "system"; }
  catch { return "system"; }
}
export function applyTheme() {
  const preference = getThemePreference();
  document.documentElement.dataset.theme = preference === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : preference;
}
export function setThemePreference(preference: ThemePreference) {
  memoryPreference = preference;
  try { if (preference === "system") localStorage.removeItem("theme"); else localStorage.setItem("theme", preference); } catch { /* Keep this session's selection when storage is unavailable. */ }
  applyTheme();
  window.dispatchEvent(new Event("portfolio-theme"));
}
export function subscribeTheme(listener: () => void) {
  const media = matchMedia("(prefers-color-scheme: dark)");
  const update = () => { applyTheme(); listener(); };
  const storage = () => { memoryPreference = undefined; update(); };
  window.addEventListener("portfolio-theme", update);
  window.addEventListener("storage", storage);
  media.addEventListener("change", update);
  return () => { window.removeEventListener("portfolio-theme", update); window.removeEventListener("storage", storage); media.removeEventListener("change", update); };
}
export function getServerTheme(): ThemePreference { return "system"; }
