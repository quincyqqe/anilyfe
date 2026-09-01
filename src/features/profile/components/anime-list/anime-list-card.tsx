'use client';

import { motion } from 'framer-motion';
import { Heart, Play, Star } from 'lucide-react';
import Link from 'next/link';
import Image from '@/components/ui/image';
import { cn } from '@/lib/utils/cn';
import type { UserAnimeEntry, WatchStatus } from '@/features/profile/types/profile';
import { STATUS_LABEL } from '../../model/anime-list/constants';
import { getAnimeHref, getAnimePosterSrc, getAnimeProgress } from '../../model/anime-list/helpers';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL ?? '';

const STATUS_CONFIG: Record<WatchStatus, { textColor: string; barColor: string; wash: string }> = {
  watching: {
    textColor: 'text-blue-300',
    barColor: 'from-blue-400 to-cyan-300',
    wash: 'bg-blue-400/10',
  },
  completed: {
    textColor: 'text-emerald-300',
    barColor: 'from-emerald-400 to-teal-300',
    wash: 'bg-emerald-400/10',
  },
  on_hold: {
    textColor: 'text-amber-300',
    barColor: 'from-amber-400 to-orange-300',
    wash: 'bg-amber-400/10',
  },
  dropped: {
    textColor: 'text-red-300',
    barColor: 'from-red-400 to-rose-300',
    wash: 'bg-red-400/10',
  },
  planned: {
    textColor: 'text-violet-300',
    barColor: 'from-violet-400 to-indigo-300',
    wash: 'bg-violet-400/10',
  },
};

interface Props {
  anime: UserAnimeEntry;
}

export function ProfileAnimeCard({ anime }: Props) {
  const cfg = STATUS_CONFIG[anime.status] ?? STATUS_CONFIG.planned;
  const progress = getAnimeProgress(anime);
  const hasScore = typeof anime.score === 'number' && anime.score > 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      layout
      className="group"
    >
      <Link
        href={getAnimeHref(anime)}
        className="relative flex min-h-44 gap-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.035] p-3.5 outline-none transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-primary/70"
      >
        <div className="relative aspect-[2/3] w-28 shrink-0 overflow-hidden rounded-xl bg-black/30 shadow-xl sm:w-32">
          <Image
            src={getAnimePosterSrc(anime, MEDIA_URL)}
            alt={anime.anime_name || 'Постер аниме'}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(min-width: 640px) 128px, 112px"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
          <span className="absolute bottom-2 left-2 rounded-md border border-white/10 bg-black/45 px-1.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white/80 backdrop-blur-sm">
            {STATUS_LABEL[anime.status]}
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 py-0.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight text-white/90 transition-colors group-hover:text-primary">
              {anime.anime_name}
            </h3>
            {anime.is_favourite && (
              <Heart
                aria-label="В избранном"
                className="size-4 shrink-0 fill-rose-400 text-rose-400"
              />
            )}
          </div>

          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white/30">
                Прогресс
              </p>
              <p className={cn('font-mono text-2xl font-black leading-none', cfg.textColor)}>
                {String(progress.currentEpisode).padStart(2, '0')}
                <span className="ml-1 text-[11px] font-bold text-white/25">
                  {progress.totalEpisodes > 0
                    ? `/ ${String(progress.totalEpisodes).padStart(2, '0')}`
                    : 'сер.'}
                </span>
              </p>
            </div>
            {hasScore && (
              <div className="flex items-center gap-1 rounded-lg bg-amber-400/10 px-2 py-1.5 text-amber-300">
                <Star className="size-3 fill-current" />
                <span className="font-mono text-xs font-bold">{anime.score}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            {progress.totalEpisodes > 0 && (
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                <div
                  className={cn(
                    'h-full rounded-full bg-gradient-to-r transition-[width] duration-700',
                    cfg.barColor,
                  )}
                  style={{ width: `${progress.seriesPercent}%` }}
                />
              </div>
            )}
            {progress.hasEpisodeProgress && (
              <div className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-wider text-white/35">
                <Play className="size-2.5 fill-current" />
                <span>Серия {Math.round(progress.episodePercent)}%</span>
                <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
                  <div
                    className="h-full rounded-full bg-primary/70"
                    style={{ width: `${progress.episodePercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export { STATUS_CONFIG };
