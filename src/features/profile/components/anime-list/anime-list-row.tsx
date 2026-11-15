'use client';

import { Heart, Star, ArrowUpRight } from 'lucide-react';
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

interface AnimeListRowProps {
  anime: UserAnimeEntry;
  isOwner?: boolean;
}

export function AnimeListRow({ anime, isOwner = false }: AnimeListRowProps) {
  const hasScore = typeof anime.score === 'number' && anime.score > 0;
  const progress = getAnimeProgress(anime);

  return (
    <div className="animate-fade-in group py-0.5">
      <Link
        href={getAnimeHref(anime)}
        className={cn(
          'flex items-center gap-3.5 rounded-2xl border border-white/[0.06] bg-zinc-950/60 p-2.5 sm:px-4 sm:py-3',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl',
          'transition-all duration-200',
          'hover:border-white/15 hover:bg-zinc-900/60 hover:shadow-md',
          'active:scale-[0.99]',
        )}
      >
        <div className="relative h-16 w-11 sm:h-18 sm:w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
          <Image
            src={getAnimePosterSrc(anime, MEDIA_URL)}
            alt={anime.anime_name || 'Anime poster'}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 44px, 48px"
            loading="lazy"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="line-clamp-1 text-sm sm:text-base font-semibold text-white/95 transition-colors group-hover:text-primary">
            {anime.anime_name}
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[10px] font-semibold',
                STATUS_PILL[anime.status],
              )}
            >
              {STATUS_LABEL[anime.status]}
            </span>

            <span className="text-[11px] text-zinc-400 font-mono">
              {formatUpdated(anime.updated_at)}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {isOwner && (
            <div className="hidden sm:flex flex-col items-end gap-1 font-mono text-xs font-bold text-white/90">
              <span>
                {String(progress.currentEpisode).padStart(2, '0')}
                {progress.totalEpisodes > 0 && (
                  <span className="text-zinc-500 font-normal">
                    /{String(progress.totalEpisodes).padStart(2, '0')}
                  </span>
                )}{' '}
                <span className="font-sans text-[10px] text-zinc-500">эп.</span>
              </span>

              {progress.totalEpisodes > 0 && (
                <div className="h-1 w-20 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${progress.seriesPercent}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {hasScore && (
            <div className="flex items-center gap-1 rounded-lg border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-amber-400">
              <Star className="size-3.5 fill-amber-400" />
              <span className="font-mono text-xs font-bold">{anime.score}</span>
            </div>
          )}

          {anime.is_favourite && (
            <div className="flex size-7 items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10">
              <Heart className="size-3.5 fill-rose-400 text-rose-400" />
            </div>
          )}

          <div className="hidden sm:flex size-7 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-zinc-400 transition-colors group-hover:border-white/15 group-hover:bg-white/10 group-hover:text-white">
            <ArrowUpRight className="size-3.5" />
          </div>
        </div>
      </Link>
    </div>
  );
}
