import { fetchPromotions } from '@/features/home/api/promotions';
import { fetchLatest } from '@/features/home/api/latest';

import { HomeFeatured as Featured, HomeLatest as Latest } from '@/features/home';

const Page = async () => {
  const [promotions, latestAnime] = await Promise.all([fetchPromotions(), fetchLatest()]);

  return (
    <main>
      <Featured promotions={promotions} />
      {latestAnime.length > 0 && <Latest animeList={latestAnime} />}
    </main>
  );
};

export default Page;
