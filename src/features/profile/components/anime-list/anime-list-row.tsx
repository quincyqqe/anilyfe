'use client';

import { motion } from 'framer-motion';
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
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link
        href={getAnimeHref(anime)}
        className="flex min-h-20 items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 outline-none transition-all hover:border-white/[0.08] hover:bg-white/[0.045] focus-visible:ring-2 focus-visible:ring-primary/70 sm:gap-4"
      >
        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-white/5 sm:size-16">
          <Image
            src={getAnimePosterSrc(anime, MEDIA_URL)}
            alt={anime.anime_name || 'Постер аниме'}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="64px"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-sm font-semibold text-white/90 transition-colors group-hover:text-primary">
              {anime.anime_name}
            </span>
            {anime.is_favourite && (
              <Heart
                aria-label="В избранном"
                className="size-3.5 shrink-0 fill-rose-400 text-rose-400"
              />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'rounded-md border px-2 py-0.5 text-[10px] font-medium',
                STATUS_PILL[anime.status],
              )}
            >
              {STATUS_LABEL[anime.status]}
            </span>
            <span className="text-[11px] text-white/40">{formatUpdated(anime.updated_at)}</span>
          </div>
        </div>
        <div className="hidden w-40 flex-col gap-1.5 sm:flex">
          <div className="flex items-center justify-between text-[10px] text-white/40">
            <span className="flex items-center gap-1">
              <Play className="size-2.5 fill-current" /> Прогресс
            </span>
            <span className="font-mono">
              {progress.currentEpisode}
              {progress.totalEpisodes > 0 ? ` / ${progress.totalEpisodes}` : ''}
            </span>
          </div>
          {progress.totalEpisodes > 0 && (
            <div className="h-1 overflow-hidden rounded-full bg-white/[0.08]">
              <div
                className="h-full rounded-full bg-primary transition-[width]"
                style={{ width: `${progress.seriesPercent}%` }}
              />
            </div>
          )}
        </div>
        {hasScore && (
          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-400/10 px-2 py-1.5 text-amber-300">
            <Star className="size-3 fill-current" />
            <span className="font-mono text-xs font-bold">{anime.score}</span>
          </div>
        )}
      </Link>
    </motion.article>
  );
}
