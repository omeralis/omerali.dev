"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Fades in [data-reveal] blocks as they scroll into view. Elements already on screen are never hidden,
// so there is no flash on load, and without JavaScript or with reduced motion everything stays visible.
export function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const root = document.documentElement;
    root.classList.add("reveal-ready");
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.remove("reveal-pending"); observer.unobserve(entry.target); }
    }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    for (const element of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
      if (element.getBoundingClientRect().top < innerHeight * .92) continue;
      element.classList.add("reveal-pending");
      observer.observe(element);
    }
    return () => { observer.disconnect(); for (const element of document.querySelectorAll(".reveal-pending")) element.classList.remove("reveal-pending"); };
  }, [pathname]);
  return null;
}
