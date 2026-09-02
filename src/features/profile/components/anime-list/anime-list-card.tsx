'use client';

import { Heart, Play, Star } from 'lucide-react';
import Link from 'next/link';
import Image from '@/components/ui/image';
import { cn } from '@/lib/utils/cn';
import type { UserAnimeEntry, WatchStatus } from '@/features/profile/types/profile';
import { STATUS_LABEL, STATUS_PILL } from '../../model/anime-list/constants';
import { getAnimeHref, getAnimePosterSrc, getAnimeProgress } from '../../model/anime-list/helpers';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL ?? '';

const STATUS_ACCENT: Record<WatchStatus, string> = {
  watching: 'bg-blue-400',
  completed: 'bg-emerald-400',
  on_hold: 'bg-amber-400',
  dropped: 'bg-red-400',
  planned: 'bg-violet-400',
};

interface Props {
  anime: UserAnimeEntry;
  priority?: boolean;
}

export function ProfileAnimeCard({ anime, priority = false }: Props) {
  const progress = getAnimeProgress(anime);
  const hasScore = typeof anime.score === 'number' && anime.score > 0;

  return (
    <article className="group min-w-0">
      <Link
        href={getAnimeHref(anime)}
        className="block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted">
          <Image
            src={getAnimePosterSrc(anime, MEDIA_URL)}
            alt={anime.anime_name || 'Постер аниме'}
            fill
            priority={priority}
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.035]"
            sizes="(min-width: 1280px) 180px, (min-width: 1024px) 20vw, (min-width: 640px) 28vw, 44vw"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent px-2.5 pb-2.5 pt-10">
            <div className="flex items-center justify-between gap-2">
              <span
                className={cn('size-1.5 shrink-0 rounded-full', STATUS_ACCENT[anime.status])}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-white">
                {STATUS_LABEL[anime.status]}
              </span>
              {anime.is_favourite && (
                <Heart
                  className="size-3.5 shrink-0 fill-rose-400 text-rose-400"
                  aria-label="В избранном"
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-3">
          <h3 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
            {anime.anime_name}
          </h3>
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Play className="size-3 fill-current" aria-hidden="true" />
              {progress.totalEpisodes > 0
                ? `${progress.currentEpisode} / ${progress.totalEpisodes}`
                : `Серия ${progress.currentEpisode}`}
            </span>
            {hasScore && (
              <span className="flex items-center gap-1 text-amber-300">
                <Star className="size-3 fill-current" aria-hidden="true" />
                {anime.score}
              </span>
            )}
          </div>
          {progress.totalEpisodes > 0 && (
            <div
              className="h-1 overflow-hidden rounded-full bg-muted"
              aria-label={`Прогресс ${Math.round(progress.seriesPercent)}%`}
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{ width: `${progress.seriesPercent}%` }}
              />
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
