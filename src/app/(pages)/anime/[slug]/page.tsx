import { fetchAnime } from '@/features/anime/api/anime';
import { fetchFranchise } from '@/features/anime/api/franchise';
import { AnimeInfo } from '@/features/anime';
import { notFound } from 'next/navigation';
import { AnimePlayer } from '@/features/player/anime-player';
import { getUserAnimeEntry } from '@/lib/db/queries';

type Params = Promise<{ slug: string }>;

interface Props {
  params: Params;
}

export default async function AnimePage({ params }: Props) {
  const { slug } = await params;

  const anime = await fetchAnime(slug);

  if (!anime) return notFound();

  const franchise = await fetchFranchise(anime.id.toString());

  const dbEntryAnime = await getUserAnimeEntry(slug);

  return (
    <>
      <AnimeInfo anime={anime} franchise={franchise} animeList={dbEntryAnime} />
      <AnimePlayer anime={anime} dbEntry={dbEntryAnime} />
    </>
  );
}
