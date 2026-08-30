import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import { AnimeInfo } from '@/features/anime';
import { fetchAnime, fetchFranchise, fetchAniListAnime } from '@/features/anime/api';
import { AnimePlayer } from '@/features/player/anime-player';
import { getUserAnimeEntry } from '@/lib/db/queries';
import { generateMetadata as buildMetadata } from '@/lib/utils/metadata';
import type { Anime } from '@/shared/types/anime';

const getAnime = cache(async (slug: string) => fetchAnime(slug));

type PageParams = { slug: string };
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
      robots: { index: false, follow: false },
    });
  }

  return buildMetadata({
    title: anime.name.main,
    description: buildDescription(anime),
    images: [{ url: `${MEDIA_BASE}${anime.poster.src}`, alt: anime.name.main }],
    alternates: { canonical: `/anime/${slug}` },
    openGraph: { url: `/anime/${slug}`, type: 'website' },
    twitter: { card: 'summary_large_image' },
    keywords: [
      anime.name.main,
      anime.name.english,
      anime.name.alternative,
      anime.type.description,
      String(anime.year),
      ...anime.genres.map((g) => g.name),
    ].filter(isNonEmpty),
  });
}

export default async function AnimePage({ params }: PageProps) {
  const { slug } = await params;

  const anime = await getAnime(slug);

  if (!anime) return notFound();

  const [franchise, rawDbEntry, aniList] = await Promise.all([
    fetchFranchise(anime.id.toString()),
    getUserAnimeEntry(slug),
    fetchAniListAnime(anime.id, anime.name.english, anime.name.main),
  ]);

  return (
    <>
      <AnimeInfo anime={anime} franchise={franchise} animeEntry={rawDbEntry} aniList={aniList} />
      <AnimePlayer anime={anime} dbEntry={rawDbEntry} />
    </>
  );
}

function buildDescription(anime: Anime): string {
  const summary = anime.description?.replace(/\s+/g, ' ').trim() ?? '';
  const extra = [anime.type.description, String(anime.year)].filter(Boolean).join(' | ');
  const full = [summary, extra].filter(Boolean).join(' ');
  return full.length <= 200 ? full : `${full.slice(0, 197).trimEnd()}...`;
}

function isNonEmpty(v: string | null | undefined): v is string {
  return Boolean(v);
}
