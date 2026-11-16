import { JsonLd } from '@/components/json-ld';
import { siteConfig } from '@/config/site.config';
import { fetchLatest } from '@/features/home/api/latest';
import { fetchPromotions } from '@/features/home/api/promotions';
import { fetchRandomFranchises } from '@/shared/api/franchises';

import {
  HomeFeatured as Featured,
  HomeLatest as Latest,
  RandomFranchises,
  HomeVideos as Videos,
} from '@/features/home';

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'AniLyfe',
  alternateName: 'AniLyfe Anime',
  url: siteConfig.url,
  inLanguage: 'ru',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteConfig.url}/catalog?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const Page = async () => {
  const [promotions, latestAnime, randomFranchises] = await Promise.all([
    fetchPromotions(),
    fetchLatest(),
    fetchRandomFranchises(),
  ]);

  return (
    <main>
      <JsonLd data={websiteSchema} />

      <h1 className="sr-only">AniLyfe — смотреть аниме онлайн с озвучкой</h1>

      <Featured promotions={promotions} />
      {latestAnime.length > 0 && <Latest animeList={latestAnime} />}
      {randomFranchises.length > 0 && <RandomFranchises animeList={randomFranchises} />}
      <Videos />
    </main>
  );
};

export default Page;
