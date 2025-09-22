'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Tracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // URL completa para pageview
    const url =
      pathname + (searchParams?.size ? `?${searchParams.toString()}` : '');

    // GA4
    // @ts-ignore
    window.gtag?.('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });

    
  }, [pathname, searchParams]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(
        'a[href*="wa.me"], a[href*="api.whatsapp.com"]'
      ) as HTMLAnchorElement | null;

      if (el && (window as any).gtag) {
        (window as any).gtag('event', 'whatsapp_click', {
          link_url: el.href,
        });
      }
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
