'use client';

import { Heart, Play, Star } from 'lucide-react';
import Link from 'next/link';
import Image from '@/components/ui/image';
import { cn } from '@/lib/utils/cn';
import type { UserAnimeEntry } from '@/features/profile/types/profile';
import { STATUS_LABEL, STATUS_PILL } from '../../model/anime-list/constants';
import {
  formatUpdated,
  getAnimeHref,
  getAnimePosterSrc,
  getAnimeProgress,
} from '../../model/anime-list/helpers';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL ?? '';

export function AnimeListRow({ anime }: { anime: UserAnimeEntry }) {
  const progress = getAnimeProgress(anime);
  const hasScore = typeof anime.score === 'number' && anime.score > 0;

  return (
    <Link
      href={getAnimeHref(anime)}
      className="group flex min-w-0 items-center gap-3 px-3 py-3 outline-none transition-colors hover:bg-muted/45 focus-visible:bg-muted/45 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:gap-5 sm:px-5"
    >
      <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted sm:h-16 sm:w-11">
        <Image
          src={getAnimePosterSrc(anime, MEDIA_URL)}
          alt={anime.anime_name || 'Постер аниме'}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="44px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
          {anime.anime_name}
        </h3>
        <div className="mt-1.5 flex items-center gap-2">
          <span
            className={cn(
              'rounded-md border px-2 py-0.5 text-[10px] font-medium',
              STATUS_PILL[anime.status],
            )}
          >
            {STATUS_LABEL[anime.status]}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {formatUpdated(anime.updated_at)}
          </span>
        </div>
      </div>
      <div className="hidden w-32 shrink-0 items-center gap-2 sm:flex">
        <Play className="size-3 text-muted-foreground" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <div className="flex justify-between text-[11px] text-muted-foreground">
            <span>Прогресс</span>
            <span>
              {progress.totalEpisodes > 0
                ? `${progress.currentEpisode}/${progress.totalEpisodes}`
                : progress.currentEpisode}
            </span>
          </div>
          {progress.totalEpisodes > 0 && (
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${progress.seriesPercent}%` }}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {anime.is_favourite && (
          <Heart className="size-4 fill-rose-400 text-rose-400" aria-label="В избранном" />
        )}
        {hasScore && (
          <span className="flex items-center gap-1 text-xs text-amber-300">
            <Star className="size-3 fill-current" aria-hidden="true" />
            {anime.score}
          </span>
        )}
      </div>
    </Link>
  );
}
