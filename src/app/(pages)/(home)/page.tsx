import { fetchRandomFranchises } from '@/features/franchise/api/franchises';
import { fetchLatest } from '@/features/home/api/latest';
import { fetchPromotions } from '@/features/home/api/promotions';

import {
  HomeFeatured as Featured,
  HomeLatest as Latest,
  HomeWatching as Watching,
  RandomFranchises,
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
    </main>
  );
};

export default Page;
