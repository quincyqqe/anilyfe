'use client';

import { ArrowUpRight, Heart, Star } from 'lucide-react';
import Link from 'next/link';
import Image from '@/components/ui/image';
import { cn } from '@/lib/utils/cn';
import type { UserAnimeEntry } from '@/features/profile/types/profile';
import { STATUS_METADATA } from '../../model/anime-list/constants';
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
  const meta = STATUS_METADATA[anime.status] ?? STATUS_METADATA.planned;

  return (
    <div className="animate-fade-in group">
      <Link
        href={getAnimeHref(anime)}
        className={cn(
          'flex items-center gap-4 rounded-xl px-3 py-2.5 transition-colors duration-200',
          'hover:bg-white/[0.03]',
        )}
      >
        <div className="relative h-[4.25rem] w-11 shrink-0 overflow-hidden rounded-md border border-white/10 bg-zinc-900 sm:h-[4.75rem] sm:w-12">
          <Image
            src={getAnimePosterSrc(anime, MEDIA_URL)}
            alt={anime.anime_name || 'Anime poster'}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="48px"
            loading="lazy"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <span className="line-clamp-1 text-sm font-semibold text-foreground/95 transition-colors group-hover:text-primary sm:text-[15px]">
            {anime.anime_name}
          </span>

          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span className={cn('size-1.5 shrink-0 rounded-full', meta.dot)} />

            <span>{meta.label}</span>

            <span className="text-white/20">·</span>

            <span className="font-mono tabular-nums">{formatUpdated(anime.updated_at)}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          {isOwner && progress.totalEpisodes > 0 && (
            <div className="hidden flex-col items-end gap-1.5 sm:flex">
              <span className="font-mono text-xs tabular-nums">
                <span className="font-bold text-primary">
                  {String(progress.currentEpisode).padStart(2, '0')}
                </span>
                <span className="text-zinc-500">
                  / {String(progress.totalEpisodes).padStart(2, '0')}
                </span>
              </span>

              <div className="h-0.5 w-16 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${progress.seriesPercent}%` }}
                />
              </div>
            </div>
          )}

          {hasScore && (
            <span className="hidden items-center gap-1 font-mono text-xs font-bold text-amber-400 sm:flex">
              <Star className="size-3.5 fill-amber-400" />
              {anime.score}
            </span>
          )}

          {anime.is_favourite && <Heart className="size-3.5 fill-rose-400 text-rose-400" />}

          <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100 max-sm:hidden" />
        </div>
      </Link>
    </div>
  );
}
