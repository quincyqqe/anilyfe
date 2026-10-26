
import type { MetadataRoute } from 'next';

const BASE_URL = 'https://anilyfe.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: BASE_URL,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${BASE_URL}/catalog`,
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/schedule`,
            changeFrequency: 'daily',
            priority: 0.8,
        },
    ];
}
