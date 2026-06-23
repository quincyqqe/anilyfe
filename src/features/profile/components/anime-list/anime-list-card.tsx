'use client';

import { motion } from 'framer-motion';
import { Heart, Play } from 'lucide-react';
import Image from '@/components/ui/image';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import type { UserAnimeEntry, WatchStatus } from '@/features/profile/types/profile';
import { getAnimeHref, getAnimePosterSrc, getAnimeProgress } from '../../model/anime-list/helpers';

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL ?? '';

const STATUS_CONFIG: Record<
  WatchStatus,
  { textColor: string; barColor: string; glowColor: string }
> = {
  watching: {
    textColor: 'text-blue-400',
    barColor: 'from-blue-500 to-cyan-400',
    glowColor:
      'group-hover:border-blue-500/30 group-hover:shadow-[0_0_28px_-6px_rgba(59,130,246,0.18)]',
  },

  completed: {
    textColor: 'text-emerald-400',
    barColor: 'from-emerald-500 to-teal-400',
    glowColor:
      'group-hover:border-emerald-500/30 group-hover:shadow-[0_0_28px_-6px_rgba(16,185,129,0.18)]',
  },

  on_hold: {
    textColor: 'text-amber-400',
    barColor: 'from-amber-400 to-orange-400',
    glowColor:
      'group-hover:border-amber-400/30 group-hover:shadow-[0_0_28px_-6px_rgba(245,158,11,0.18)]',
  },

  dropped: {
    textColor: 'text-red-400',
    barColor: 'from-red-500 to-rose-400',
    glowColor:
      'group-hover:border-red-500/30 group-hover:shadow-[0_0_28px_-6px_rgba(239,68,68,0.18)]',
  },

  planned: {
    textColor: 'text-violet-400',
    barColor: 'from-violet-500 to-indigo-400',
    glowColor:
      'group-hover:border-violet-500/30 group-hover:shadow-[0_0_28px_-6px_rgba(139,92,246,0.18)]',
  },
};
interface Props {
  anime: UserAnimeEntry;
}

export function ProfileAnimeCard({ anime }: Props) {
  const cfg = STATUS_CONFIG[anime.status] ?? STATUS_CONFIG.planned;
  const hasScore = typeof anime.score === 'number' && anime.score > 0;
  const progress = getAnimeProgress(anime);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      layout
      layoutId={`anime-card-${anime.id}`}
    >
      <Link
        href={getAnimeHref(anime)}
        className={cn(
          'group relative flex gap-4.5 overflow-hidden rounded-2xl border border-white/[0.04] bg-[#0c0c10]/40 p-4 outline-none transition-all duration-300 hover:bg-[#0f0f15]/80',
        )}
      >
        <div className="relative aspect-[2/3] w-32 shrink-0 overflow-hidden rounded-md border border-white/[0.06] bg-zinc-950 shadow-md">
          <Image
            src={getAnimePosterSrc(anime, MEDIA_URL)}
            alt={anime.anime_name || 'Постер'}
            fill
            className="object-cover"
            sizes="128px"
            loading="eager"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-[14px] font-medium  leading-snug tracking-tight text-white/90 transition-colors duration-200 group-hover:text-primary">
              {anime.anime_name}
            </h3>
            {anime.is_favourite && (
              <Heart className="h-4 w-4 fill-rose-400 text-rose-400 shrink-0 mt-0.5" />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-b border-white/[0.03] py-2.5 my-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] uppercase tracking-wider text-white/30 font-bold">
                Прогресс
              </span>
              <div className="flex items-baseline font-mono leading-none">
                <span className={cn('text-2xl font-black tracking-tight', cfg.textColor)}>
                  {String(progress.currentEpisode).padStart(2, '0')}
                </span>
                {progress.totalEpisodes > 0 ? (
                  <span className="text-[11px] font-bold text-white/20 ml-0.5">
                    /{String(progress.totalEpisodes).padStart(2, '0')}
                  </span>
                ) : (
                  <span className="text-[8px] uppercase tracking-wider text-white/20 ml-1 font-sans font-semibold">
                    серия
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] uppercase tracking-wider text-white/30 font-bold">
                {hasScore ? 'Оценка' : 'Обновлено'}
              </span>
              <div className="flex items-baseline font-mono leading-none">
                {hasScore ? (
                  <>
                    <span className="text-2xl font-black tracking-tight text-amber-400">
                      {String(anime.score).padStart(2, '0')}
                    </span>
                    <span className="text-[11px] font-bold text-white/20 ml-0.5">/10</span>
                  </>
                ) : (
                  <span className="text-[13px] font-bold text-white/40 tracking-tight leading-none pt-1">
                    {new Date(anime.updated_at).toLocaleDateString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {progress.totalEpisodes > 0 && (
              <div className="flex flex-col gap-1">
                <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full bg-gradient-to-r transition-all duration-750 ease-out',
                      cfg.barColor,
                    )}
                    style={{ width: `${progress.seriesPercent}%` }}
                  />
                </div>
              </div>
            )}

            {progress.hasEpisodeProgress && (
              <div className="flex items-center gap-2 border-t border-white/[0.02] pt-1.5">
                <span className="flex items-center gap-1 text-[9px] font-medium text-white/25 shrink-0 uppercase tracking-wider font-mono">
                  <Play className="h-2.5 w-2.5 fill-white/25 text-transparent" />
                  Серия {Math.round(progress.episodePercent)}%
                </span>
                <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-primary/60 transition-all duration-500"
                    style={{ width: `${progress.episodePercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
