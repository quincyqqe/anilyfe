'use client';

import { Heart, Play } from 'lucide-react';
import Link from 'next/link';

import Image from '@/components/ui/image';
import { STATUS_METADATA } from '@/features/profile/model/anime-list/constants';
import {
  formatUpdated,
  getAnimeHref,
  getAnimePosterSrc,
  getAnimeProgress,
} from '@/features/profile/model/anime-list/helpers';
import type { UserAnimeEntry } from '@/features/profile/types/profile';
import { cn } from '@/lib/utils/cn';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL ?? '';

interface CardProps {
  anime: UserAnimeEntry;
  isOwner?: boolean;
}

export function NetflixAnimeCard({ anime, isOwner = false }: CardProps) {
  const meta = STATUS_METADATA[anime.status] ?? STATUS_METADATA.planned;
  const progress = getAnimeProgress(anime);
  const href = getAnimeHref(anime);
  const posterSrc = getAnimePosterSrc(anime, MEDIA_URL);
  const title = anime.anime_name || 'Без названия';

  const progressPercent = Math.min(100, Math.max(0, progress.episodePercent));

  return (
    <article className="group relative min-w-0">
      <Link
        href={href}
        aria-label={title}
        className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {/* Poster */}
        <div
          className={cn(
            'relative isolate aspect-[455/650] w-full overflow-hidden rounded-md',
            'border border-white/[0.08] bg-zinc-900',
            'transition-[border-color] duration-200 ease-out',
            'group-hover:border-white/25',
            'group-focus-visible:border-primary/60',
          )}
        >
          <Image
            src={posterSrc}
            alt={title}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
            loading="lazy"
            decoding="async"
            className="object-cover"
          />

          {/* Favorite */}
          {anime.is_favourite && (
            <div
              aria-label="В избранном"
              className="pointer-events-none absolute right-2 top-2 z-20 flex size-7 items-center justify-center rounded-full border border-white/10 bg-black/75"
            >
              <Heart className="size-3.5 fill-primary text-primary" aria-hidden="true" />
            </div>
          )}

          {/* Center play button */}
          <div
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute inset-0 z-20 flex items-center justify-center',
              'opacity-0 transition-opacity duration-200 ease-out',
              'group-hover:opacity-100 group-focus-visible:opacity-100',
              'motion-reduce:transition-none',
            )}
          >
            <span className="flex size-11 items-center justify-center rounded-full border border-white/30 bg-white/95 text-zinc-950 shadow-lg">
              <Play className="ml-0.5 size-5 fill-current" />
            </span>
          </div>

          {/* Hover information */}
          <div
            className={cn(
              'pointer-events-none absolute inset-x-0 bottom-0 z-10',
              'flex flex-col gap-2.5 p-3 pt-16',
              'bg-gradient-to-t from-black/95 via-black/75 to-transparent',
              'opacity-100 transition-opacity duration-200 ease-out',
              '[@media(hover:hover)]:opacity-0',
              'group-hover:opacity-100 group-focus-visible:opacity-100',
              'motion-reduce:transition-none',
            )}
          >
            {/* Status */}
            <div className="flex items-center justify-between gap-2">
              <span
                className={cn(
                  'rounded px-2 py-1 text-[9px] font-bold uppercase tracking-wider',
                  meta.pill,
                )}
              >
                {meta.label}
              </span>

              {anime.is_favourite && (
                <span className="text-[9px] font-medium text-white/60">Избранное</span>
              )}
            </div>

            {/* Owner progress */}
            {isOwner && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2 font-mono text-[10px]">
                  <span className="text-white/90">
                    Серия {progress.currentEpisode}
                    {progress.totalEpisodes > 0 && (
                      <span className="text-white/50"> / {progress.totalEpisodes}</span>
                    )}
                  </span>

                  {progress.hasEpisodeProgress && (
                    <span className="text-white/60">{Math.round(progressPercent)}%</span>
                  )}
                </div>

                {progress.hasEpisodeProgress && (
                  <div className="h-1 overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                )}
              </div>
            )}

            {!isOwner && (
              <span className="text-[10px] text-white/60">{formatUpdated(anime.updated_at)}</span>
            )}
          </div>
        </div>

        {/* Title and metadata */}
        <div className="mt-2.5 flex min-w-0 flex-col px-0.5">
          <h3
            className={cn(
              'line-clamp-2 text-xs font-bold leading-snug text-zinc-200',
              'transition-colors duration-200 group-hover:text-white',
              'sm:text-[13px]',
            )}
          >
            {title}
          </h3>

          {isOwner ? (
            <div className="mt-1 flex items-center justify-between gap-2 font-mono text-xs">
              <span className="min-w-0 truncate font-bold text-zinc-300">
                Серия <span className="text-primary">{progress.currentEpisode}</span>
                {progress.totalEpisodes > 0 && (
                  <span className="font-normal text-zinc-500"> / {progress.totalEpisodes}</span>
                )}
              </span>

              {progress.hasEpisodeProgress && (
                <span className="shrink-0 text-[10px] text-zinc-500">
                  {Math.round(progressPercent)}%
                </span>
              )}
            </div>
          ) : (
            <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-zinc-400">
              <span className="truncate">{formatUpdated(anime.updated_at)}</span>

              <span
                className={cn(
                  'shrink-0 rounded px-1.5 py-0.5',
                  'text-[8px] font-bold uppercase leading-none',
                  meta.pill,
                )}
              >
                {meta.label}
              </span>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
