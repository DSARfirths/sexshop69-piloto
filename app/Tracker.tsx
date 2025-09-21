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

    // Google Ads (opcional)
    if (process.env.NEXT_PUBLIC_GADS_ID) {
      // @ts-ignore
      window.gtag?.('config', process.env.NEXT_PUBLIC_GADS_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);

  return null;
}
