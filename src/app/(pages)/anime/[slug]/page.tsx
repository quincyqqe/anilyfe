import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { fetchAnime } from '@/features/anime/api/anime';
import { fetchFranchise } from '@/features/anime/api/franchise';
import { AnimeInfo } from '@/features/anime';
import { AnimePlayer } from '@/features/player/anime-player';
import { getUserAnimeEntry } from '@/lib/db/queries';
import { generateMetadata as buildMetadata } from '@/lib/utils/metadata';
import { Anime } from '@/shared/types/anime';

type Params = {
  slug: string
}

interface Props {
  params: Params
}

const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_URL!;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const anime = await fetchAnime(slug);

  if (!anime) {
    return buildMetadata({
      title: 'Аниме не найдено',
      robots: {
        index: false,
        follow: false,
      },
    });
  }

  const title = anime.name.main;
  const description = getAnimeDescription(anime);
  const posterUrl = `${MEDIA_BASE_URL}${anime.poster.src}`;

  return buildMetadata({
    title,
    description,
    images: [
      {
        url: posterUrl,
        alt: anime.name.main,
      },
    ],
    alternates: {
      canonical: `/anime/${slug}`,
    },
    openGraph: {
      url: `/anime/${slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
    },
    keywords: [
      anime.name.main,
      anime.name.english,
      anime.name.alternative,
      anime.type.description,
      anime.year.toString(),
      ...anime.genres.map((genre) => genre.name),
    ].filter(isNonEmptyString),
  });
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

function getAnimeDescription(anime: Anime) {
  const summary = anime.description.replace(/\s+/g, ' ').trim();
  const extra = [anime.type.description, anime.year.toString()].filter(Boolean).join(' | ');
  const description = [summary, extra].filter(Boolean).join(' ');

  if (description.length <= 200) {
    return description;
  }

  return `${description.slice(0, 197).trimEnd()}...`;
}

function isNonEmptyString(value: string | null | undefined): value is string {
  return Boolean(value);
}
