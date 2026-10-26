import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { JsonLd } from '@/components/json-ld';
import { AnimeInfo } from '@/features/anime';
import { fetchAniListAnime, fetchAnime, fetchFranchise } from '@/features/anime/api';
import { AnimeWatchSection } from '@/features/player';
import { getUserAnimeEntry } from '@/lib/db/queries';
import { buildMetadata } from '@/lib/utils/metadata';
import type { Anime } from '@/shared/types/anime';

const getAnime = cache((slug: string) => fetchAnime(slug));

type PageParams = {
  slug: string;
};

interface PageProps {
  params: Promise<PageParams>;
}

const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_URL ?? '';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const anime = await getAnime(slug);

  if (!anime) {
    return buildMetadata({
      title: 'Аниме не найдено',
      path: `/anime/${slug}`,
      robots: {
        index: false,
        follow: false,
      },
    });
  }

  return buildMetadata({
    title: anime.name.main,
    description: buildDescription(anime),
    path: `/anime/${slug}`,
    images: [
      {
        url: `${MEDIA_BASE}${anime.poster.src}`,
        alt: anime.name.main,
      },
    ],
    openGraph: {
      type: getOpenGraphType(anime.type.value),
    },
  });
}

export default async function AnimePage({ params }: PageProps) {
  const { slug } = await params;
  const anime = await getAnime(slug);

  if (!anime) {
    notFound();
  }

  const [franchise, dbEntry, aniList] = await Promise.all([
    fetchFranchise(anime.id.toString()),
    getUserAnimeEntry(slug),
    fetchAniListAnime(anime.id, anime.name.english, anime.name.main),
  ]);

  return (
    <>
      <JsonLd data={buildAnimeSchema(anime)} />
      <AnimeInfo anime={anime} franchise={franchise} animeEntry={dbEntry} aniList={aniList} />
      <AnimeWatchSection anime={anime} dbEntry={dbEntry} />
    </>
  );
}

function buildDescription(anime: Anime): string {
  const summary = stripMarkup(anime.description);
  const extra = [anime.type.description, String(anime.year)].filter(Boolean).join(' | ');
  const description = [summary, extra].filter(Boolean).join(' ');

  return description.length <= 200 ? description : `${description.slice(0, 197).trimEnd()}...`;
}

function getOpenGraphType(typeValue: string): 'video.movie' | 'video.tv_show' | 'website' {
  if (typeValue === 'MOVIE') return 'video.movie';
  if (typeValue === 'TV') return 'video.tv_show';
  return 'website';
}

function buildAnimeSchema(anime: Anime): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': anime.type.value === 'MOVIE' ? 'Movie' : 'TVSeries',
    name: anime.name.main,
    image: `${MEDIA_BASE}${anime.poster.src}`,
  };

  if (anime.name.english) schema.alternateName = anime.name.english;

  const description = stripMarkup(anime.description);
  if (description) schema.description = description;
  if (anime.genres.length > 0) schema.genre = anime.genres.map((genre) => genre.name);

  return schema;
}

function stripMarkup(value: string | null | undefined): string {
  return (
    value
      ?.replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim() ?? ''
  );
}
