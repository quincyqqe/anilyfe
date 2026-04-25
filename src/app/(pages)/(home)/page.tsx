import { fetchLatest } from '@/features/home/api/latest';
import { fetchPromotions } from '@/features/home/api/promotions';
import { fetchRandomFranchises } from '@/shared/api/franchises';

import {
  HomeFeatured as Featured,
  HomeLatest as Latest,
  RandomFranchises,
  HomeVideos as Videos,
  HomeWatching as Watching,
} from '@/features/home';

const Page = async () => {
  const [promotions, latestAnime, randomFranchises] = await Promise.all([
    fetchPromotions(),
    fetchLatest(),
    fetchRandomFranchises(),
  ]);

  return (
    <main>
      <Featured promotions={promotions} />
      <Watching />
      {latestAnime.length > 0 && <Latest animeList={latestAnime} />}
      {randomFranchises.length > 0 && <RandomFranchises animeList={randomFranchises} />}
      <Videos />
    </main>
  );
};

export default Page;
