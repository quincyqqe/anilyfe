import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site.config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Browser-facing endpoints with no indexable content: OAuth callback
        // and the progress-saving POST handler.
        disallow: ['/auth/', '/anime-progress'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
