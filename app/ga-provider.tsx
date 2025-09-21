"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function GAProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  // Enviar page_view en cada cambio de ruta
  useEffect(() => {
    if (!GA_ID || !window.gtag) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : "");
    window.gtag("event", "page_view", { page_path: url });
  }, [pathname, searchParams, GA_ID]);

  // Listener global para clics a WhatsApp
  useEffect(() => {
    const onClick = (ev: MouseEvent) => {
      const el = (ev.target as HTMLElement)?.closest("a");
      if (!el) return;
      const href = el.getAttribute("href") || "";
      if (
        href.startsWith("https://wa.me") ||
        href.startsWith("https://api.whatsapp.com")
      ) {
        window.gtag?.("event", "click_whatsapp", {
          event_category: "engagement",
          event_label: "link",
          value: 1,
        });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
